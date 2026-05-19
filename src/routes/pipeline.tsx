import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Badge, Avatar, Label } from "@/components/Layout";
import { PIPELINE_CARDS, STATUSES, statusStyle, type Status } from "@/lib/data";
import { Plus } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/pipeline")({ component: Pipeline });

type Card = (typeof PIPELINE_CARDS)[Status][number];
const WEIGHT: Record<Status, number> = { New: 0.1, Contacted: 0.25, Qualified: 0.5, Proposal: 0.7, Closed: 1 };

function Pipeline() {
  const { t } = useI18n();
  const [board, setBoard] = useState<Record<Status, Card[]>>(() => {
    const copy = {} as Record<Status, Card[]>;
    STATUSES.forEach((s) => (copy[s] = [...PIPELINE_CARDS[s]]));
    return copy;
  });
  const [dragging, setDragging] = useState<{ from: Status; id: string } | null>(null);
  const [over, setOver] = useState<Status | null>(null);

  const onDrop = (to: Status) => {
    setOver(null);
    if (!dragging) return;
    if (dragging.from === to) return setDragging(null);
    const card = board[dragging.from].find((c) => c.id === dragging.id);
    setBoard((b) => {
      const found = b[dragging.from].find((c) => c.id === dragging.id);
      if (!found) return b;
      return {
        ...b,
        [dragging.from]: b[dragging.from].filter((c) => c.id !== dragging.id),
        [to]: [...b[to], found],
      };
    });
    if (card) toast.success(`${card.name} moved to ${to}`, { description: card.company });
    setDragging(null);
  };

  const all = STATUSES.flatMap((s) => board[s]);
  const totalValue = all.reduce((s, c) => s + c.value, 0);
  const forecast = STATUSES.reduce(
    (sum, s) => sum + board[s].reduce((a, c) => a + c.value, 0) * WEIGHT[s], 0,
  );
  const winRate = all.length ? Math.round((board.Closed.length / all.length) * 100) : 0;
  const summary = [
    { label: "Pipeline Value", value: `LKR ${(totalValue / 1_000_000).toFixed(1)}M`, color: "#6C47FF" },
    { label: "Weighted Forecast", value: `LKR ${(forecast / 1_000_000).toFixed(1)}M`, color: "#00C48C" },
    { label: "Open Deals", value: String(all.length - board.Closed.length), color: "#0EA5E9" },
    { label: "Win Rate", value: `${winRate}%`, color: "#F5A623" },
  ];

  return (
    <Layout title="Pipeline">
      <div className="grid grid-cols-4 gap-4 mb-6 nc-stagger">
        {summary.map((s) => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div className="flex items-center justify-between">
              <Label>{s.label}</Label>
              <span className="w-2 h-2 rounded-full" style={{ background: s.color }} />
            </div>
            <div className="text-[22px] font-semibold mt-2">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-5 gap-4 items-start">
        {STATUSES.map((stage) => {
          const cards = board[stage];
          const total = cards.reduce((s, c) => s + c.value, 0);
          const s = statusStyle[stage];
          const isOver = over === stage && dragging?.from !== stage;
          return (
            <div
              key={stage}
              onDragOver={(e) => { e.preventDefault(); setOver(stage); }}
              onDragLeave={() => setOver((o) => (o === stage ? null : o))}
              onDrop={() => onDrop(stage)}
              className="flex flex-col transition-all"
              style={{
                background: isOver ? "#EEE9FF" : "#F0F1F6",
                borderRadius: 12,
                padding: 12,
                minHeight: 420,
                borderTop: `3px solid ${s.color}`,
                outline: isOver ? "2px dashed #6C47FF" : "2px dashed transparent",
                outlineOffset: -2,
              }}
            >
              <div className="flex items-center justify-between mb-2 px-1">
                <div className="flex items-center gap-2">
                  <Badge bg={s.bg} color={s.color}>{t(stage)}</Badge>
                  <span className="text-[12px]" style={{ color: "#6B7280" }}>{cards.length}</span>
                </div>
                <button
                  onClick={() => toast(`Add a deal to ${stage}`)}
                  className="nc-press w-6 h-6 rounded-md flex items-center justify-center hover:bg-white"
                >
                  <Plus size={14} />
                </button>
              </div>
              <div className="text-[12px] mb-3 px-1" style={{ color: "#6B7280" }}>
                LKR {(total / 1000).toFixed(0)}K total
              </div>
              <div className="space-y-2 flex-1 nc-stagger">
                {cards.map((c) => (
                  <div
                    key={c.id}
                    draggable
                    onDragStart={() => setDragging({ from: stage, id: c.id })}
                    onDragEnd={() => { setDragging(null); setOver(null); }}
                    className="nc-lift bg-white rounded-lg p-3 cursor-grab active:cursor-grabbing"
                    style={{
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                      opacity: dragging?.id === c.id ? 0.4 : 1,
                    }}
                  >
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
                <button
                  onClick={() => toast(`Add a deal to ${stage}`)}
                  className="nc-press w-full text-[12px] py-2 rounded-md flex items-center justify-center gap-1 hover:bg-white"
                  style={{ color: "#6B7280", background: "transparent" }}
                >
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
