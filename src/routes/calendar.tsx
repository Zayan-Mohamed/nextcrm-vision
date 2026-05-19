import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Layout, Card, Badge, ButtonPrimary, ButtonSecondary, Label } from "@/components/Layout";
import { MEETINGS, TODAY_AGENDA } from "@/lib/data";
import {
  Plus, Phone, Video, FileText, RefreshCw, ChevronLeft, ChevronRight,
  CalendarDays, Sparkles, Check, X, Clock, Bell,
} from "lucide-react";

export const Route = createFileRoute("/calendar")({ component: SmartCalendar });

// Event type design tokens -------------------------------------------------
type EventType = "Demo" | "Follow-up" | "Call" | "Proposal";
const TYPE_META: Record<EventType, { bg: string; fg: string; dot: string; Icon: typeof Phone }> = {
  Demo:        { bg: "#EEE9FF", fg: "#6C47FF", dot: "#6C47FF", Icon: Video },
  "Follow-up": { bg: "#D1FAE5", fg: "#047857", dot: "#00C48C", Icon: RefreshCw },
  Call:        { bg: "#E0F2FE", fg: "#0369A1", dot: "#0EA5E9", Icon: Phone },
  Proposal:    { bg: "#FEF3C7", fg: "#92400E", dot: "#F5A623", Icon: FileText },
};
const typeOf = (t: string): EventType =>
  (["Demo", "Follow-up", "Call", "Proposal"].includes(t) ? t : "Call") as EventType;

interface CalEvent { time: string; type: EventType; lead: string }

// Build a realistic, dense event map for May 2026 from the shared mock data.
const MAY_EVENTS: Record<number, CalEvent[]> = (() => {
  const map: Record<number, CalEvent[]> = {};
  for (const [day, m] of Object.entries(MEETINGS)) {
    map[+day] = [{ time: m.time, type: typeOf(m.type), lead: m.lead }];
  }
  // Today (19th) is a full day, so surface the live agenda here.
  map[19] = TODAY_AGENDA.map((a) => ({ time: a.time, type: typeOf(a.type), lead: a.lead }));
  // A few stacked days so the month reads like a real calendar.
  map[7] = [...(map[7] ?? []), { time: "15:00", type: "Proposal", lead: "Hela Apparel" }];
  map[13] = [...(map[13] ?? []), { time: "13:30", type: "Demo", lead: "Brandix" }];
  map[22] = [...(map[22] ?? []), { time: "16:15", type: "Call", lead: "Hayleys Group" }];
  return map;
})();

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function SmartCalendar() {
  // Base month is May 2026 (where the mock data lives). Offset lets the
  // chevrons move months so navigation feels alive in the demo.
  const [offset, setOffset] = useState(0);
  const [view, setView] = useState<"Month" | "Week" | "Day">("Month");
  const [selected, setSelected] = useState<number | null>(19);
  const [approved, setApproved] = useState<Record<string, "approved" | "dismissed">>({});

  const base = new Date(2026, 4, 1); // May 2026
  const view0 = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const year = view0.getFullYear();
  const month = view0.getMonth();
  const isMay = offset === 0;
  const today = 19;

  const grid = useMemo(() => {
    const firstDow = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const cells: { day: number; muted: boolean }[] = [];
    for (let i = firstDow - 1; i >= 0; i--) cells.push({ day: prevMonthDays - i, muted: true });
    for (let d = 1; d <= daysInMonth; d++) cells.push({ day: d, muted: false });
    let n = 1;
    while (cells.length % 7 !== 0) cells.push({ day: n++, muted: true });
    return cells;
  }, [year, month]);

  const events = isMay ? MAY_EVENTS : {};
  const weekCount = Object.entries(events).filter(([d]) => +d >= 18 && +d <= 24)
    .reduce((s, [, evs]) => s + evs.length, 0);
  const todayCount = (events[today] ?? []).length;
  const totalCount = Object.values(events).reduce((s, evs) => s + evs.length, 0);

  const AI_SUGGESTIONS = [
    { id: "s1", type: "Follow-up" as EventType, text: "Follow-up call with Pradeep Silva", reason: "Proposal sent 4 days ago, no reply", when: "Tomorrow, 10:00" },
    { id: "s2", type: "Demo" as EventType, text: "Product demo for Hela Apparel", reason: "Lead score jumped to 87 this week", when: "May 21, 14:30" },
    { id: "s3", type: "Call" as EventType, text: "Check-in with Dialog Axiata", reason: "Stalled in Proposal stage for 7 days", when: "May 22, 11:00" },
  ];

  const stats = [
    { label: "This Week", value: weekCount, sub: "scheduled", color: "#6C47FF" },
    { label: "Today", value: todayCount, sub: "meetings", color: "#00C48C" },
    { label: "Pending Approval", value: AI_SUGGESTIONS.filter((s) => !approved[s.id]).length, sub: "from AI", color: "#F5A623" },
    { label: "This Month", value: totalCount, sub: "total events", color: "#0EA5E9" },
  ];

  return (
    <Layout title="Smart Calendar">
      {/* Toolbar ---------------------------------------------------------- */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <button
              onClick={() => setOffset((o) => o - 1)}
              className="nc-press w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white"
              style={{ border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280" }}
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={() => setOffset((o) => o + 1)}
              className="nc-press w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white"
              style={{ border: "1px solid #E5E7EB", background: "#fff", color: "#6B7280" }}
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>
          <div key={`${year}-${month}`} className="nc-slide-in text-[20px] font-semibold min-w-[180px]">
            {MONTHS[month]} {year}
          </div>
          {offset !== 0 && (
            <button
              onClick={() => setOffset(0)}
              className="nc-press text-[13px] font-medium px-3 py-1.5 rounded-lg"
              style={{ background: "#EEE9FF", color: "#6C47FF" }}
            >
              Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F0F1F6" }}>
            {(["Month", "Week", "Day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={"nc-seg nc-press px-3.5 py-1.5 rounded-md text-[13px] font-medium" + (view === v ? " is-on" : "")}
                style={{
                  background: view === v ? "#6C47FF" : "transparent",
                  color: view === v ? "#fff" : "#6B7280",
                }}
              >
                {v}
              </button>
            ))}
          </div>
          <ButtonPrimary><Plus size={14} />Schedule Meeting</ButtonPrimary>
        </div>
      </div>

      {/* Stat strip ------------------------------------------------------- */}
      <div className="grid grid-cols-4 gap-4 mb-6 nc-stagger">
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div className="flex items-center justify-between">
              <Label>{s.label}</Label>
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            </div>
            <div className="flex items-end gap-2 mt-2">
              <span className="text-[26px] font-semibold leading-none">{s.value}</span>
              <span className="text-[12px] mb-0.5" style={{ color: "#6B7280" }}>{s.sub}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-4 gap-6 items-start">
        {/* Calendar grid -------------------------------------------------- */}
        <Card className="col-span-3" style={{ padding: 20 }}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} style={{ color: "#6C47FF" }} />
              <h2 className="text-[16px] font-semibold">{MONTHS[month]} {year}</h2>
            </div>
            <div className="flex items-center gap-4">
              {(Object.keys(TYPE_META) as EventType[]).map((tp) => (
                <span key={tp} className="flex items-center gap-1.5 text-[12px]" style={{ color: "#6B7280" }}>
                  <span className="w-2.5 h-2.5 rounded-full" style={{ background: TYPE_META[tp].dot }} />
                  {tp}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 mb-2">
            {WEEKDAYS.map((d) => (
              <div key={d} className="text-[12px] font-medium uppercase text-center py-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}>{d}</div>
            ))}
          </div>

          <div key={`${year}-${month}`} className="grid grid-cols-7 gap-2 nc-section">
            {grid.map((cell, i) => {
              const isWeekend = i % 7 === 0 || i % 7 === 6;
              const isToday = !cell.muted && isMay && cell.day === today;
              const isSelected = !cell.muted && isMay && selected === cell.day;
              const dayEvents = cell.muted ? [] : (events[cell.day] ?? []);
              const shown = dayEvents.slice(0, 2);
              const extra = dayEvents.length - shown.length;
              return (
                <div
                  key={i}
                  onClick={() => !cell.muted && isMay && setSelected(cell.day)}
                  className={"rounded-lg p-2 min-h-[104px] flex flex-col gap-1 transition-all" + (!cell.muted && isMay ? " nc-lift cursor-pointer" : "")}
                  style={{
                    background: isToday ? "#EEE9FF" : cell.muted ? "#FCFCFD" : isWeekend ? "#FAFBFC" : "#F9FAFB",
                    border: isToday
                      ? "1.5px solid #6C47FF"
                      : isSelected
                        ? "1.5px solid #B9A6FF"
                        : "1px solid #EEF0F4",
                    opacity: cell.muted ? 0.45 : 1,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className="text-[13px] font-medium flex items-center justify-center"
                      style={{
                        color: isToday ? "#fff" : cell.muted ? "#9CA3AF" : "#1A1A2E",
                        background: isToday ? "#6C47FF" : "transparent",
                        width: 22, height: 22, borderRadius: 999,
                      }}
                    >
                      {cell.day}
                    </span>
                    {dayEvents.length > 0 && (
                      <span className="text-[10px] font-semibold px-1.5 rounded-full"
                        style={{ background: "#fff", color: "#6B7280", border: "1px solid #EEF0F4" }}>
                        {dayEvents.length}
                      </span>
                    )}
                  </div>
                  {shown.map((ev, j) => {
                    const m = TYPE_META[ev.type];
                    return (
                      <div key={j} className="text-[10.5px] rounded-md px-1.5 py-1 truncate flex items-center gap-1 nc-fade"
                        style={{ background: m.bg, color: m.fg, fontWeight: 600 }}>
                        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.dot }} />
                        <span className="shrink-0">{ev.time}</span>
                        <span className="truncate font-medium" style={{ opacity: 0.85 }}>{ev.lead}</span>
                      </div>
                    );
                  })}
                  {extra > 0 && (
                    <span className="text-[10.5px] font-medium" style={{ color: "#6C47FF" }}>
                      +{extra} more
                    </span>
                  )}
                </div>
              );
            })}
          </div>
          {!isMay && (
            <div className="text-center text-[13px] mt-4 nc-fade" style={{ color: "#9CA3AF" }}>
              No meetings scheduled for {MONTHS[month]}. Use “Schedule Meeting” to add one.
            </div>
          )}
        </Card>

        {/* Right rail ----------------------------------------------------- */}
        <div className="space-y-6">
          {/* Agenda */}
          <Card style={{ padding: 20 }}>
            <div className="flex items-center justify-between">
              <div>
                <Label>Today, May 19</Label>
                <h2 className="text-[16px] font-semibold mt-1">Agenda</h2>
              </div>
              <Badge>{TODAY_AGENDA.length} items</Badge>
            </div>
            <ul className="mt-4 relative nc-stagger">
              <span className="absolute left-[15px] top-2 bottom-2 w-px" style={{ background: "#EEF0F4" }} />
              {TODAY_AGENDA.map((a, i) => {
                const m = TYPE_META[typeOf(a.type)];
                const Icon = m.Icon;
                return (
                  <li key={i} className="relative pl-10 pb-4 last:pb-0">
                    <span className="absolute left-0 top-0 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ background: m.bg, color: m.fg, boxShadow: "0 0 0 4px #fff" }}>
                      <Icon size={14} />
                    </span>
                    <div className="rounded-lg p-3 nc-card-hover" style={{ background: "#F9FAFB", border: "1px solid #EEF0F4" }}>
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-semibold">{a.time}</span>
                        <Badge bg={m.bg} color={m.fg}>{a.type}</Badge>
                      </div>
                      <div className="text-[13px] mt-1">{a.lead}</div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* Assistance AI suggestions */}
          <Card style={{ padding: 20 }}>
            <div className="flex items-center gap-2 mb-1">
              <Sparkles size={16} style={{ color: "#6C47FF" }} />
              <h3 className="text-[15px] font-semibold">Assistance AI</h3>
            </div>
            <p className="text-[12px] mb-4" style={{ color: "#6B7280" }}>
              Suggested meetings, ready for one-click approval
            </p>
            <div className="space-y-2 nc-stagger">
              {AI_SUGGESTIONS.map((s) => {
                const m = TYPE_META[s.type];
                const state = approved[s.id];
                return (
                  <div
                    key={s.id}
                    className="rounded-lg p-3 transition-all"
                    style={{
                      background: state === "approved" ? "#F0FDF4" : state === "dismissed" ? "#FAFBFC" : "#FAFAFB",
                      border: "1px solid " + (state === "approved" ? "#BBF7D0" : "#EEF0F4"),
                      opacity: state === "dismissed" ? 0.55 : 1,
                    }}
                  >
                    <div className="flex items-start gap-2">
                      <span className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: m.bg, color: m.fg }}>
                        <m.Icon size={13} />
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium leading-snug"
                          style={{ textDecoration: state === "dismissed" ? "line-through" : "none" }}>
                          {s.text}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "#6B7280" }}>{s.reason}</div>
                        <div className="flex items-center gap-1 text-[11px] mt-1.5" style={{ color: m.fg }}>
                          <Clock size={11} />{s.when}
                        </div>
                      </div>
                    </div>
                    {!state && (
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setApproved((a) => ({ ...a, [s.id]: "approved" }))}
                          className="nc-press flex-1 inline-flex items-center justify-center gap-1 text-[12px] font-semibold py-1.5 rounded-md text-white"
                          style={{ background: "#6C47FF", boxShadow: "0 3px 10px rgba(108,71,255,0.30)" }}
                        >
                          <Check size={12} />Approve
                        </button>
                        <button
                          onClick={() => setApproved((a) => ({ ...a, [s.id]: "dismissed" }))}
                          className="nc-press inline-flex items-center justify-center w-8 rounded-md"
                          style={{ background: "#fff", border: "1px solid #E5E7EB", color: "#6B7280" }}
                          aria-label="Dismiss"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    )}
                    {state === "approved" && (
                      <div className="flex items-center gap-1.5 text-[12px] font-medium mt-2 nc-fade" style={{ color: "#15803D" }}>
                        <Check size={13} />Added to calendar &amp; reminder set
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Reminders */}
          <Card style={{ padding: 20 }}>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={15} style={{ color: "#F5A623" }} />
              <h3 className="text-[15px] font-semibold">Reminders</h3>
            </div>
            <div className="space-y-2 text-[13px]">
              {[
                { t: "in 15 min", txt: "Call · Kavindra Fernando" },
                { t: "in 1h 30m", txt: "Demo · Pradeep Silva" },
                { t: "Tomorrow", txt: "Send proposal · Thilak J." },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 nc-card-hover"
                  style={{ background: "#F9FAFB", border: "1px solid #EEF0F4" }}>
                  <span>{r.txt}</span>
                  <span className="text-[11px] font-medium" style={{ color: "#F5A623" }}>{r.t}</span>
                </div>
              ))}
            </div>
            <ButtonSecondary className="w-full mt-4 justify-center">Manage reminders</ButtonSecondary>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
