import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, Avatar } from "@/components/Layout";
import { PIPELINE_CARDS, STATUSES, statusStyle } from "@/lib/data";
import { Plus } from "lucide-react";

export const Route = createFileRoute("/pipeline")({ component: Pipeline });

function Pipeline() {
  return (
    <Layout title="Pipeline">
      <div className="grid grid-cols-5 gap-4">
        {STATUSES.map((stage) => {
          const cards = PIPELINE_CARDS[stage];
          const total = cards.reduce((s, c) => s + c.value, 0);
          const s = statusStyle[stage];
          return (
            <div key={stage} className="flex flex-col" style={{ background: "#F0F1F6", borderRadius: 12, padding: 12 }}>
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Badge bg={s.bg} color={s.color}>{stage}</Badge>
                  <span className="text-[12px]" style={{ color: "#6B7280" }}>{cards.length}</span>
                </div>
                <button className="w-6 h-6 rounded-md flex items-center justify-center hover:bg-white"><Plus size={14} /></button>
              </div>
              <div className="text-[12px] mb-3 px-1" style={{ color: "#6B7280" }}>
                LKR {(total / 1000).toFixed(0)}K total
              </div>
              <div className="space-y-2 flex-1">
                {cards.map((c) => (
                  <div key={c.id} className="bg-white rounded-lg p-3" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.05)" }}>
                    <div className="font-medium text-[13px]">{c.name}</div>
                    <div className="text-[12px] mb-2" style={{ color: "#6B7280" }}>{c.company}</div>
                    <div className="text-[14px] font-semibold" style={{ color: "#6C47FF" }}>
                      LKR {c.value.toLocaleString()}
                    </div>
                    <div className="flex items-center justify-between mt-3 pt-2 border-t" style={{ borderColor: "#F3F4F6" }}>
                      <div className="flex items-center gap-1.5">
                        <Avatar name={c.rep} size={20} />
                        <span className="text-[11px]" style={{ color: "#6B7280" }}>{c.rep.split(" ")[0]}</span>
                      </div>
                      <span className="text-[11px]" style={{ color: "#6B7280" }}>{c.days}d</span>
                    </div>
                  </div>
                ))}
                <button className="w-full text-[12px] py-2 rounded-md flex items-center justify-center gap-1"
                  style={{ color: "#6B7280", background: "transparent" }}>
                  <Plus size={12} /> Add Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
