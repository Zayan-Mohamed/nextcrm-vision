import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, Avatar } from "@/components/Layout";
import { TASKS } from "@/lib/data";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/tasks")({ component: TaskBoard });

const prioStyle = (p: string) =>
  p === "High"   ? { bg: "#FEE2E2", color: "#B91C1C" } :
  p === "Medium" ? { bg: "#FEF3C7", color: "#92400E" } :
                   { bg: "#DCFCE7", color: "#15803D" };

function TaskBoard() {
  return (
    <Layout title="Task Board">
      <Card className="mb-6 flex items-center gap-3" style={{ background: "#EEE9FF", padding: 16 }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#6C47FF" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div className="flex-1 text-[14px]">
          <span className="font-semibold">Assistance AI</span> created <strong>3 tasks</strong> from your last call with <strong>Pradeep Silva</strong>.
        </div>
        <button className="text-[12px] font-medium" style={{ color: "#6C47FF" }}>View tasks →</button>
      </Card>

      <div className="grid grid-cols-4 gap-4">
        {(Object.keys(TASKS) as Array<keyof typeof TASKS>).map((col) => (
          <div key={col} style={{ background: "#F0F1F6", borderRadius: 12, padding: 12 }}>
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-semibold text-[14px]">{col}</span>
              <span className="text-[12px]" style={{ color: "#6B7280" }}>{TASKS[col].length}</span>
            </div>
            <div className="space-y-2">
              {TASKS[col].map((t, i) => {
                const ps = prioStyle(t.prio);
                return (
                  <div key={i} className="bg-white rounded-lg p-3" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    <div className="font-medium text-[13px] mb-2">{t.title}</div>
                    <div className="text-[11px] mb-3" style={{ color: "#6B7280" }}>Lead: {t.lead}</div>
                    <div className="flex items-center justify-between">
                      <Badge bg={ps.bg} color={ps.color}>{t.prio}</Badge>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px]" style={{ color: "#6B7280" }}>{t.due}</span>
                        <Avatar name={t.who} size={20} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
