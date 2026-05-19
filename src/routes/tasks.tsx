import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Badge, Avatar } from "@/components/Layout";
import { TASKS } from "@/lib/data";
import { Sparkles, Plus, Check } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tasks")({ component: TaskBoard });

type TaskCol = keyof typeof TASKS;
interface Task { title: string; lead: string; prio: "High" | "Medium" | "Low"; due: string; who: string }

const COLS: TaskCol[] = ["To Do", "In Progress", "Awaiting Response", "Done"];
const COL_ACCENT: Record<TaskCol, string> = {
  "To Do": "#9CA3AF",
  "In Progress": "#0EA5E9",
  "Awaiting Response": "#F5A623",
  "Done": "#00C48C",
};

const prioStyle = (p: string) =>
  p === "High"   ? { bg: "#FEE2E2", color: "#B91C1C" } :
  p === "Medium" ? { bg: "#FEF3C7", color: "#92400E" } :
                   { bg: "#DCFCE7", color: "#15803D" };

const AI_TASKS: Task[] = [
  { title: "Send pricing proposal to Pradeep Silva", lead: "Pradeep Silva", prio: "High", due: "May 20", who: "AP" },
  { title: "Schedule technical follow-up call", lead: "Pradeep Silva", prio: "High", due: "May 22", who: "AP" },
  { title: "Share Enterprise tier deck", lead: "Pradeep Silva", prio: "Medium", due: "May 23", who: "AP" },
];

function TaskBoard() {
  const { t } = useI18n();
  const [board, setBoard] = useState<Record<TaskCol, Task[]>>(() => {
    const c = {} as Record<TaskCol, Task[]>;
    COLS.forEach((k) => (c[k] = [...TASKS[k]] as Task[]));
    return c;
  });
  const [dragging, setDragging] = useState<{ from: TaskCol; title: string } | null>(null);
  const [over, setOver] = useState<TaskCol | null>(null);
  const [aiAdded, setAiAdded] = useState(false);

  const onDrop = (to: TaskCol) => {
    setOver(null);
    if (!dragging) return;
    if (dragging.from === to) return setDragging(null);
    setBoard((b) => {
      const task = b[dragging.from].find((x) => x.title === dragging.title);
      if (!task) return b;
      return {
        ...b,
        [dragging.from]: b[dragging.from].filter((x) => x.title !== dragging.title),
        [to]: [...b[to], task],
      };
    });
    if (to === "Done") toast.success("Task completed", { description: dragging.title });
    setDragging(null);
  };

  const addAiTasks = () => {
    setBoard((b) => ({ ...b, "To Do": [...AI_TASKS, ...b["To Do"]] }));
    setAiAdded(true);
    toast.success("3 tasks added to board", { description: "Auto-generated from your call with Pradeep Silva" });
  };

  return (
    <Layout title="Task Board">
      <Card className="mb-6 flex items-center gap-3" style={{ background: "#EEE9FF", padding: 16 }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: "#6C47FF" }}>
          <Sparkles size={18} color="#fff" />
        </div>
        <div className="flex-1 text-[14px]">
          <span className="font-semibold">Assistance AI</span> generated <strong>3 tasks</strong> from your last call with <strong>Pradeep Silva</strong>.
        </div>
        {aiAdded ? (
          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold" style={{ color: "#15803D" }}>
            <Check size={15} /> Added to board
          </span>
        ) : (
          <button
            onClick={addAiTasks}
            className="nc-press inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 rounded-md text-white"
            style={{ background: "#6C47FF", boxShadow: "0 3px 10px rgba(108,71,255,0.30)" }}
          >
            <Plus size={14} /> Add to board
          </button>
        )}
      </Card>

      <div className="grid grid-cols-4 gap-4 items-start">
        {COLS.map((col) => {
          const isOver = over === col && dragging?.from !== col;
          return (
            <div
              key={col}
              onDragOver={(e) => { e.preventDefault(); setOver(col); }}
              onDragLeave={() => setOver((o) => (o === col ? null : o))}
              onDrop={() => onDrop(col)}
              className="transition-all"
              style={{
                background: isOver ? "#EEE9FF" : "#F0F1F6",
                borderRadius: 12,
                padding: 12,
                minHeight: 420,
                borderTop: `3px solid ${COL_ACCENT[col]}`,
                outline: isOver ? "2px dashed #6C47FF" : "2px dashed transparent",
                outlineOffset: -2,
              }}
            >
              <div className="flex items-center justify-between mb-3 px-1">
                <span className="font-semibold text-[14px]">{t(col)}</span>
                <span className="text-[12px] px-1.5 rounded-full" style={{ color: "#6B7280", background: "#fff" }}>
                  {board[col].length}
                </span>
              </div>
              <div className="space-y-2 nc-stagger">
                {board[col].map((task) => {
                  const ps = prioStyle(task.prio);
                  return (
                    <div
                      key={task.title}
                      draggable
                      onDragStart={() => setDragging({ from: col, title: task.title })}
                      onDragEnd={() => { setDragging(null); setOver(null); }}
                      className="nc-lift bg-white rounded-lg p-3 cursor-grab active:cursor-grabbing"
                      style={{
                        boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
                        opacity: dragging?.title === task.title ? 0.4 : 1,
                      }}
                    >
                      <div className="font-medium text-[13px] mb-2">{task.title}</div>
                      <div className="text-[11px] mb-3" style={{ color: "#6B7280" }}>Lead: {task.lead}</div>
                      <div className="flex items-center justify-between">
                        <Badge bg={ps.bg} color={ps.color}>{task.prio}</Badge>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px]" style={{ color: "#6B7280" }}>{task.due}</span>
                          <Avatar name={task.who} size={20} />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
