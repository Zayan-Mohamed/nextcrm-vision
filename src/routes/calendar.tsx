import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, ButtonPrimary, Label } from "@/components/Layout";
import { MEETINGS, TODAY_AGENDA } from "@/lib/data";
import { Plus, Phone, Video, FileText } from "lucide-react";

export const Route = createFileRoute("/calendar")({ component: SmartCalendar });

function SmartCalendar() {
  // May 2026: 31 days, May 1 2026 = Friday (day index 5)
  const firstDay = 5;
  const days = 31;
  const today = 19;
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  return (
    <Layout title="Smart Calendar">
      <div className="flex justify-between items-center mb-4">
        <div className="text-[18px] font-semibold">May 2026</div>
        <ButtonPrimary><Plus size={14} />Schedule Meeting</ButtonPrimary>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="col-span-3" style={{ padding: 20 }}>
          <div className="grid grid-cols-7 gap-2 mb-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-[12px] font-medium uppercase text-center py-2"
                style={{ color: "#6B7280", letterSpacing: "0.05em" }}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {cells.map((d, i) => {
              if (d == null) return <div key={i} />;
              const meeting = MEETINGS[d];
              const isToday = d === today;
              return (
                <div key={i} className="rounded-lg p-2 min-h-[88px]"
                  style={{
                    background: isToday ? "#EEE9FF" : "#F9FAFB",
                    border: isToday ? "1px solid #6C47FF" : "1px solid transparent",
                  }}>
                  <div className="text-[13px] font-medium mb-1" style={{ color: isToday ? "#6C47FF" : "#1A1A2E" }}>
                    {d}
                  </div>
                  {meeting && (
                    <div className="text-[10px] rounded px-1.5 py-0.5 truncate"
                      style={{ background: "#6C47FF", color: "#fff" }}>
                      {meeting.time} · {meeting.lead}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        <Card>
          <Label>Today, May 19</Label>
          <h2 className="text-[16px] font-semibold mt-1 mb-4">Agenda</h2>
          <ul className="space-y-3">
            {TODAY_AGENDA.map((a, i) => {
              const Icon = a.type === "Call" ? Phone : a.type === "Demo" ? Video : FileText;
              return (
                <li key={i} className="rounded-lg p-3" style={{ background: "#F7F8FC" }}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[13px] font-semibold">{a.time}</span>
                    <Badge>{a.type}</Badge>
                  </div>
                  <div className="text-[14px]">{a.lead}</div>
                  <div className="flex gap-2 mt-2">
                    <button className="w-7 h-7 rounded-md flex items-center justify-center"
                      style={{ background: "#fff", border: "1px solid #E5E7EB" }}>
                      <Icon size={12} />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
