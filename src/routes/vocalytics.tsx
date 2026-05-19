import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout, Card, Badge, Label, Avatar } from "@/components/Layout";
import {
  Play, Pause, Sparkles, BarChart3, Bot, Search, ChevronDown,
  CheckCircle2, AlertTriangle, Eye, SkipBack, SkipForward,
} from "lucide-react";

export const Route = createFileRoute("/vocalytics")({ component: Vocalytics });

// -------------- Dummy data -------------------------------------------------
type SentimentT = "Positive" | "Neutral" | "Negative";
type CallStatus = "Analysed" | "Transcribed" | "Pending";

interface CallRow {
  id: string;
  lead: string;
  role: string;
  company: string;
  duration: string;
  when: string;
  sentiment: SentimentT;
  status: CallStatus;
}

const CALLS: CallRow[] = [
  { id: "c1", lead: "Sarah Jenkins",      role: "VP of Engineering",  company: "Acme Corp",         duration: "14m 32s", when: "Today, 10:24 AM",      sentiment: "Positive", status: "Analysed"   },
  { id: "c2", lead: "Pradeep Silva",      role: "CTO",                company: "Ceylon Tech",       duration: "08m 12s", when: "Today, 09:05 AM",      sentiment: "Positive", status: "Analysed"   },
  { id: "c3", lead: "Nishani Wickramasinghe", role: "Procurement Lead", company: "Lanka Logistics", duration: "11m 48s", when: "Yesterday, 16:40 PM",  sentiment: "Neutral",  status: "Analysed"   },
  { id: "c4", lead: "Thilak Jayawardena", role: "Head of Operations", company: "Hela Apparel",      duration: "06m 22s", when: "Yesterday, 14:10 PM",  sentiment: "Negative", status: "Transcribed"},
  { id: "c5", lead: "Kavindra Fernando",  role: "Founder",            company: "Galle Marine",      duration: "19m 04s", when: "May 17, 11:30 AM",     sentiment: "Positive", status: "Analysed"   },
  { id: "c6", lead: "Sachini Rathnayake", role: "IT Manager",         company: "Dialog Axiata",     duration: "04m 55s", when: "May 17, 09:15 AM",     sentiment: "Neutral",  status: "Pending"    },
];

const sentimentStyle = (s: SentimentT) =>
  s === "Positive" ? { bg: "#D1FAE5", color: "#047857" } :
  s === "Negative" ? { bg: "#FEE2E2", color: "#B91C1C" } :
                     { bg: "#F3F4F6", color: "#374151" };

const statusStyle = (s: CallStatus) =>
  s === "Analysed"    ? { bg: "#EEE9FF", color: "#6C47FF" } :
  s === "Transcribed" ? { bg: "#E0F2FE", color: "#0369A1" } :
                        { bg: "#FEF9C3", color: "#854D0E" };

interface TLine {
  who: "AR" | "SJ";
  speaker: string;
  ts: string;
  text: string;
  painPoint?: boolean;
}

const TRANSCRIPT: TLine[] = [
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "00:08", text: "Hi Sarah, thanks for jumping on. How's the engineering org structured these days at Acme?" },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "00:22", text: "We're about 80 engineers across 6 platform squads. We've been growing fast." },
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "00:46", text: "Got it. What's the biggest pain on the integration side right now?" },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "01:05", text: "Honestly, the rate limits on our legacy API are killing us — we're hitting throttle 50+ times a day.", painPoint: true },
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "01:34", text: "Yikes. Are you doing any kind of edge caching today, or all direct calls?" },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "01:52", text: "Direct, mostly. We tried caching but the deployment pipeline takes 40 minutes — iteration is painful.", painPoint: true },
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "02:30", text: "Our deploy story is built around blue/green with zero-downtime swaps, typically under 4 minutes for a service of your size." },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "03:01", text: "That would be transformative. What's the rough pricing for ~80 seats on the platform tier?" },
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "03:24", text: "Enterprise tier lands around $42 per seat per month annually, plus included Vocalytics and Coaching AI." },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "03:58", text: "Reasonable. But I'd need budget approval — our Q3 cycle just closed and Q4 sign-off is in August.", painPoint: true },
  { who: "AR", speaker: "Alex (Sales Rep)", ts: "04:40", text: "Totally fair. I can send a technical brief and we can do a CTO intro call to align on the deployment story before then." },
  { who: "SJ", speaker: "Sarah (Lead)",     ts: "05:12", text: "Perfect. Send the docs and let's get my CTO Mark on a call by end of month." },
];

const COACH_METRICS = [
  { label: "Discovery Score",     pct: 85, color: "#00C48C" },
  { label: "Objection Handling",  pct: 74, color: "#F5A623" },
  { label: "Empathy",             pct: 90, color: "#00C48C" },
  { label: "Closing Technique",   pct: 68, color: "#F05A5A" },
];

const TASKS_NEXT = [
  { id: "t1", text: "Send technical documentation re: API rate limits", assignee: "Alex Reyes", due: "Tomorrow",   prio: "High",   prioStyle: { bg: "#FEE2E2", color: "#B91C1C" }, status: "Assigned" },
  { id: "t2", text: "Schedule technical follow-up with their CTO",       assignee: "Alex Reyes", due: "This week",  prio: "High",   prioStyle: { bg: "#FEE2E2", color: "#B91C1C" }, status: "Pending Approval" },
  { id: "t3", text: "Share pricing deck for Enterprise tier",            assignee: "Alex Reyes", due: "In 3 days",  prio: "Medium", prioStyle: { bg: "#FEF3C7", color: "#92400E" }, status: "Assigned" },
];

// Deterministic waveform heights
const BAR_HEIGHTS = Array.from({ length: 60 }, (_, i) => {
  const a = Math.sin(i * 0.55) * 0.5 + 0.5;
  const b = Math.sin(i * 0.21 + 1.1) * 0.35;
  const v = Math.max(0.12, Math.min(1, a * 0.7 + b + 0.25));
  return Math.round(v * 100);
});

// ---------------------------------------------------------------------------
function Vocalytics() {
  const [selected, setSelected] = useState<CallRow>(CALLS[0]);

  return (
    <Layout title="Vocalytics">
      <SubHeader selected={selected} />
      <StatsRow />
      <CallTable selected={selected} onSelect={setSelected} />
      <div className="grid grid-cols-5 gap-6">
        <div className="col-span-3 space-y-6">
          <CallOverview selected={selected} />
          <AudioPlayer />
          <TranscriptCard />
        </div>
        <div className="col-span-2 space-y-6">
          <AISummary />
          <ExtractedEntities />
          <CoachingFeedback />
          <NextSteps />
        </div>
      </div>
    </Layout>
  );
}

// -------------- Sub-header -------------------------------------------------
function SubHeader({ selected }: { selected: CallRow }) {
  return (
    <div className="flex items-center gap-4 mb-6 -mt-2">
      <nav className="text-[13px] flex items-center gap-2" style={{ color: "#6B7280" }}>
        <span>Vocalytics</span>
        <span style={{ color: "#D1D5DB" }}>/</span>
        <span className="font-medium" style={{ color: "#1A1A2E" }}>
          Call with {selected.company}
        </span>
      </nav>
      <div className="flex-1 max-w-md mx-auto relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#9CA3AF" }} />
        <input
          placeholder="Search calls, leads, keywords..."
          className="w-full h-9 pl-9 pr-3 rounded-lg text-[13px]"
          style={{ border: "1px solid #E5E7EB", background: "#fff" }}
        />
      </div>
      <button className="flex items-center gap-2 h-9 px-2 pr-3 rounded-lg hover:bg-white" style={{ border: "1px solid #E5E7EB", background: "#fff" }}>
        <Avatar name="Alex Reyes" size={24} />
        <span className="text-[13px] font-medium">Alex</span>
        <ChevronDown size={14} style={{ color: "#6B7280" }} />
      </button>
    </div>
  );
}

// -------------- Stats ------------------------------------------------------
function StatsRow() {
  const stats = [
    { label: "Total Calls",  value: "47",      delta: "+12%" },
    { label: "Avg Duration", value: "6m 12s",  delta: "+0:18" },
    { label: "Transcribed",  value: "44",      delta: "94%" },
    { label: "AI Analysed",  value: "44",      delta: "94%" },
  ];
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      {stats.map((s) => (
        <Card key={s.label} style={{ padding: 20 }}>
          <Label>{s.label}</Label>
          <div className="flex items-end justify-between mt-2">
            <div className="text-[22px] font-semibold">{s.value}</div>
            <span className="text-[12px] font-medium" style={{ color: "#00C48C" }}>{s.delta}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// -------------- Call Log Table --------------------------------------------
function CallTable({ selected, onSelect }: { selected: CallRow; onSelect: (c: CallRow) => void }) {
  return (
    <Card style={{ padding: 0 }} className="mb-6">
      <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
        <h2 className="text-[16px] font-semibold">Recent Calls</h2>
        <span className="text-[12px]" style={{ color: "#6B7280" }}>Click any row to load analysis</span>
      </div>
      <table className="w-full text-[14px]">
        <thead>
          <tr style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th className="text-left px-6 py-3">Lead Name</th>
            <th className="text-left px-4">Company</th>
            <th className="text-left px-4">Duration</th>
            <th className="text-left px-4">Date / Time</th>
            <th className="text-left px-4">Sentiment</th>
            <th className="text-left px-4">Status</th>
            <th className="text-right px-6">Action</th>
          </tr>
        </thead>
        <tbody>
          {CALLS.map((c) => {
            const active = c.id === selected.id;
            const sm = sentimentStyle(c.sentiment);
            const st = statusStyle(c.status);
            return (
              <tr
                key={c.id}
                onClick={() => onSelect(c)}
                className="cursor-pointer transition-colors"
                style={{
                  background: active ? "#F4F0FF" : "#fff",
                  borderLeft: active ? "3px solid #6C47FF" : "3px solid transparent",
                  height: 44,
                }}
              >
                <td className="px-6">
                  <div className="flex items-center gap-2">
                    <Avatar name={c.lead} size={26} />
                    <div>
                      <div className="font-medium leading-tight">{c.lead}</div>
                      <div className="text-[11px] leading-tight" style={{ color: "#6B7280" }}>{c.role}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4">{c.company}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{c.duration}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{c.when}</td>
                <td className="px-4"><Badge bg={sm.bg} color={sm.color}>{c.sentiment}</Badge></td>
                <td className="px-4"><Badge bg={st.bg} color={st.color}>{c.status}</Badge></td>
                <td className="px-6 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); onSelect(c); }}
                    className="inline-flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-md hover:opacity-90"
                    style={{ background: active ? "#6C47FF" : "#F4F0FF", color: active ? "#fff" : "#6C47FF" }}
                  >
                    <Eye size={12} />View
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

// -------------- LEFT: Call Overview ---------------------------------------
function CallOverview({ selected }: { selected: CallRow }) {
  const sm = sentimentStyle(selected.sentiment);
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={selected.lead} size={48} />
          <div>
            <div className="text-[18px] font-semibold leading-tight">{selected.lead}</div>
            <div className="text-[13px]" style={{ color: "#6B7280" }}>
              {selected.role} · {selected.company}
            </div>
          </div>
        </div>
        <Badge bg={sm.bg} color={sm.color}>● {selected.sentiment}</Badge>
      </div>
      <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t" style={{ borderColor: "#F3F4F6" }}>
        <div><Label>Duration</Label><div className="text-[15px] font-semibold mt-1">{selected.duration}</div></div>
        <div><Label>Date</Label><div className="text-[15px] font-semibold mt-1">{selected.when}</div></div>
        <div><Label>Recording</Label><div className="text-[15px] font-semibold mt-1" style={{ color: "#6C47FF" }}>Available</div></div>
      </div>
    </Card>
  );
}

// -------------- LEFT: Audio Player ----------------------------------------
function AudioPlayer() {
  const totalSec = 14 * 60 + 32;
  const [playing, setPlaying] = useState(false);
  const [pos, setPos] = useState(0); // 0..1
  const [speed, setSpeed] = useState<1 | 1.5 | 2>(1);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);

  useEffect(() => {
    if (!playing) return;
    last.current = performance.now();
    const tick = (t: number) => {
      const dt = (t - last.current) / 1000;
      last.current = t;
      setPos((p) => {
        const next = p + (dt * speed) / totalSec;
        if (next >= 1) { setPlaying(false); return 0; }
        return next;
      });
      raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => { if (raf.current) cancelAnimationFrame(raf.current); };
  }, [playing, speed, totalSec]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const ss = Math.floor(s % 60);
    return `${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };
  const currentSec = pos * totalSec;
  const playheadIdx = Math.floor(pos * BAR_HEIGHTS.length);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setPlaying((p) => !p)}
            className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0"
            style={{ background: "linear-gradient(135deg, #6C47FF 0%, #00C48C 100%)" }}
          >
            {playing ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
          </button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F7F8FC", color: "#6B7280" }}><SkipBack size={14} /></button>
          <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: "#F7F8FC", color: "#6B7280" }}><SkipForward size={14} /></button>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F7F8FC" }}>
          {([1, 1.5, 2] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className="px-2.5 py-1 rounded-md text-[12px] font-medium transition-colors"
              style={{
                background: speed === s ? "#6C47FF" : "transparent",
                color:      speed === s ? "#fff"    : "#6B7280",
              }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

      {/* Waveform */}
      <div
        className="relative h-20 flex items-end gap-[3px] cursor-pointer select-none"
        onClick={(e) => {
          const r = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
          setPos(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)));
        }}
      >
        {BAR_HEIGHTS.map((h, i) => {
          const played = i <= playheadIdx;
          return (
            <div
              key={i}
              className="flex-1 rounded-full transition-all"
              style={{
                height: `${h}%`,
                background: played
                  ? "linear-gradient(180deg, #6C47FF 0%, #00C48C 100%)"
                  : "#E5E7EB",
                opacity: playing && played ? 0.85 + Math.sin((i + Date.now() / 120) * 0.3) * 0.15 : 1,
                animation: playing && played ? "wfPulse 1.2s ease-in-out infinite" : undefined,
                animationDelay: `${(i % 10) * 0.05}s`,
              }}
            />
          );
        })}
        {/* Playhead */}
        <div
          className="absolute top-0 bottom-0 w-[2px] rounded-full pointer-events-none"
          style={{ left: `calc(${pos * 100}% - 1px)`, background: "#6C47FF", boxShadow: "0 0 0 2px rgba(108,71,255,0.2)" }}
        />
        <style>{`@keyframes wfPulse { 0%,100%{opacity:.85} 50%{opacity:1} }`}</style>
      </div>

      {/* Scrubber */}
      <div className="mt-4 h-1.5 rounded-full relative" style={{ background: "#F0F1F6" }}>
        <div className="h-1.5 rounded-full" style={{ width: `${pos * 100}%`, background: "#6C47FF" }} />
        <div
          className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white"
          style={{ left: `calc(${pos * 100}% - 7px)`, boxShadow: "0 0 0 3px #6C47FF" }}
        />
      </div>

      <div className="flex justify-between text-[12px] mt-2 font-medium" style={{ color: "#6B7280" }}>
        <span>{fmt(currentSec)}</span>
        <span>{fmt(totalSec)}</span>
      </div>
    </Card>
  );
}

// -------------- LEFT: Transcript ------------------------------------------
function TranscriptCard() {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-semibold">Interactive Transcript</h2>
        <div className="flex items-center gap-3 text-[11px]" style={{ color: "#6B7280" }}>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#3B82F6" }} />Sales Rep</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full" style={{ background: "#9CA3AF" }} />Lead</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: "#FEF9C3" }} />Pain Point</span>
        </div>
      </div>

      <div className="overflow-y-auto pr-2 space-y-2" style={{ maxHeight: 420 }}>
        {TRANSCRIPT.map((l, i) => {
          const isRep = l.who === "AR";
          const borderC = isRep ? "#3B82F6" : "#9CA3AF";
          const avBg = isRep ? "#DBEAFE" : "#F3F4F6";
          const avFg = isRep ? "#1D4ED8" : "#374151";
          return (
            <div
              key={i}
              className="flex gap-3 p-3 rounded-lg"
              style={{
                background: l.painPoint ? "#FEF9C3" : "#FAFAFB",
                borderLeft: `3px solid ${l.painPoint ? "#854D0E" : borderC}`,
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0"
                style={{ background: avBg, color: avFg }}
              >
                {l.who}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[12px] font-semibold">{l.speaker}</span>
                  <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{l.ts}</span>
                  {l.painPoint && (
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ background: "#854D0E", color: "#FEF9C3", letterSpacing: "0.04em" }}>
                      PAIN POINT
                    </span>
                  )}
                </div>
                <p className="text-[13px] leading-[1.55]" style={{ color: l.painPoint ? "#854D0E" : "#1A1A2E" }}>
                  {l.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// -------------- RIGHT: AI Summary -----------------------------------------
function AISummary() {
  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} style={{ color: "#6C47FF" }} />
        <h3 className="text-[15px] font-semibold">AI Summary</h3>
      </div>
      <p className="text-[13px] leading-[1.6]" style={{ color: "#374151" }}>
        Sarah raised significant frustration with legacy API rate limits at Acme Corp, where her team
        is hitting throttle 50+ times daily, and a 40-minute deployment cycle that blocks iteration.
        Pricing was discussed positively at the Enterprise tier (~$42 per seat), but budget approval
        for Q3 has closed and any contract will need Q4 sign-off in August. Sarah committed to looping
        in her CTO and reviewing a technical brief by end of month.
      </p>
    </Card>
  );
}

// -------------- RIGHT: Extracted Entities ---------------------------------
function ExtractedEntities() {
  const Section = ({ title, items, bg, color }: { title: string; items: string[]; bg: string; color: string }) => (
    <div>
      <Label><div className="mb-2">{title}</div></Label>
      <div className="flex flex-wrap gap-1.5">
        {items.map((i) => (
          <span key={i} className="text-[12px] font-medium px-2.5 py-1 rounded-full" style={{ background: bg, color }}>{i}</span>
        ))}
      </div>
    </div>
  );
  return (
    <Card className="space-y-4">
      <div className="flex items-center gap-2">
        <Sparkles size={16} style={{ color: "#6C47FF" }} />
        <h3 className="text-[15px] font-semibold">Extracted Entities</h3>
      </div>
      <Section title="Pain Points"  items={["Legacy API limits", "Slow deployment times"]} bg="#FEE2E2" color="#B91C1C" />
      <Section title="Objections"   items={["Budget approval needed for Q3"]}              bg="#FEF3C7" color="#92400E" />
      <Section title="Decisions"    items={["Will evaluate by end of month"]}              bg="#CCFBF1" color="#0F766E" />
      <Section title="Next Steps"   items={["Send technical docs", "CTO intro call"]}      bg="#EEE9FF" color="#6C47FF" />
    </Card>
  );
}

// -------------- RIGHT: Coaching AI ----------------------------------------
function CoachingFeedback() {
  const score = 82;
  const radius = 28;
  const circ = 2 * Math.PI * radius;
  const offset = circ * (1 - score / 100);

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} style={{ color: "#6C47FF" }} />
        <h3 className="text-[15px] font-semibold">Coaching AI</h3>
      </div>

      <div className="flex items-center gap-4 mb-5">
        <div className="relative" style={{ width: 72, height: 72 }}>
          <svg width="72" height="72" className="-rotate-90">
            <circle cx="36" cy="36" r={radius} fill="none" stroke="#F0F1F6" strokeWidth="7" />
            <circle
              cx="36" cy="36" r={radius} fill="none"
              stroke="#6C47FF" strokeWidth="7" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={offset}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-[16px] font-bold">{score}</div>
        </div>
        <div>
          <div className="text-[22px] font-bold leading-none">82<span className="text-[14px] font-medium" style={{ color: "#6B7280" }}>/100</span></div>
          <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>Overall call quality</div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {COACH_METRICS.map((m) => (
          <div key={m.label}>
            <div className="flex justify-between text-[12px] mb-1">
              <span style={{ color: "#374151" }}>{m.label}</span>
              <span className="font-semibold">{m.pct}%</span>
            </div>
            <div className="h-1.5 rounded-full" style={{ background: "#F0F1F6" }}>
              <div className="h-1.5 rounded-full" style={{ width: `${m.pct}%`, background: m.color }} />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-2 pt-4 border-t" style={{ borderColor: "#F3F4F6" }}>
        {[
          "Strong rapport built early",
          "Good use of open questions",
        ].map((p) => (
          <div key={p} className="flex gap-2 items-start text-[12.5px]">
            <CheckCircle2 size={14} style={{ color: "#00C48C", marginTop: 2 }} />
            <span>{p}</span>
          </div>
        ))}
        {[
          "Missed opportunity: Did not ask about timeline",
          "Price mentioned too early before value established",
        ].map((p) => (
          <div key={p} className="flex gap-2 items-start text-[12.5px]">
            <AlertTriangle size={14} style={{ color: "#F5A623", marginTop: 2 }} />
            <span>{p}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -------------- RIGHT: Next Steps -----------------------------------------
function NextSteps() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  return (
    <Card>
      <div className="flex items-center gap-2 mb-1">
        <Bot size={16} style={{ color: "#6C47FF" }} />
        <h3 className="text-[15px] font-semibold">Assistance AI — Next Steps</h3>
      </div>
      <p className="text-[12px] mb-4" style={{ color: "#6B7280" }}>
        3 tasks auto-generated from this call
      </p>

      <div className="space-y-2 mb-4">
        {TASKS_NEXT.map((task) => (
          <div key={task.id} className="rounded-lg p-3 flex items-start gap-3" style={{ background: "#FAFAFB", border: "1px solid #F0F1F6" }}>
            <input
              type="checkbox"
              checked={!!checked[task.id]}
              onChange={() => setChecked((c) => ({ ...c, [task.id]: !c[task.id] }))}
              className="mt-1 cursor-pointer accent-[#6C47FF] w-4 h-4"
            />
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-snug" style={{ textDecoration: checked[task.id] ? "line-through" : "none", color: checked[task.id] ? "#9CA3AF" : "#1A1A2E" }}>
                {task.text}
              </div>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Avatar name={task.assignee} size={18} />
                  <span className="text-[11px]" style={{ color: "#6B7280" }}>{task.assignee.split(" ")[0]}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full" style={{ background: "#F3F4F6", color: "#374151" }}>{task.due}</span>
                <Badge bg={task.prioStyle.bg} color={task.prioStyle.color}>{task.prio}</Badge>
                {task.status === "Pending Approval" && (
                  <Badge bg="#FEF9C3" color="#854D0E">Pending Approval</Badge>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        className="w-full h-11 rounded-lg text-[14px] font-semibold text-white transition-all hover:opacity-90"
        style={{ background: "#6C47FF", boxShadow: "0 4px 12px rgba(108,71,255,0.25)" }}
      >
        Approve &amp; Create Tasks
      </button>
    </Card>
  );
}
