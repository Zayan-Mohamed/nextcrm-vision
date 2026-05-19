import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Card, Badge, Avatar } from "@/components/Layout";
import { TASKS } from "@/lib/data";
import { Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/tasks")({ component: TaskBoard });

type TaskCol = keyof typeof TASKS;
type Task = (typeof TASKS)[TaskCol][number];

const COLS: TaskCol[] = ["To Do", "In Progress", "Awaiting Response", "Done"];

const prioStyle = (p: string) =>
  p === "High"   ? { bg: "#FEE2E2", color: "#B91C1C" } :
  p === "Medium" ? { bg: "#FEF3C7", color: "#92400E" } :
                   { bg: "#DCFCE7", color: "#15803D" };

function TaskBoard() {
  const { t } = useI18n();
  const [board, setBoard] = useState<Record<TaskCol, Task[]>>(() => {
    const c = {} as Record<TaskCol, Task[]>;
    COLS.forEach((k) => (c[k] = [...TASKS[k]] as Task[]));
    return c;
  });
  const [dragging, setDragging] = useState<{ from: TaskCol; title: string } | null>(null);

  const onDrop = (to: TaskCol) => {
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
    setDragging(null);
  };

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
        {COLS.map((col) => (
          <div
            key={col}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(col)}
            style={{ background: "#F0F1F6", borderRadius: 12, padding: 12, minHeight: 400 }}
          >
            <div className="flex items-center justify-between mb-3 px-1">
              <span className="font-semibold text-[14px]">{t(col)}</span>
              <span className="text-[12px]" style={{ color: "#6B7280" }}>{board[col].length}</span>
            </div>
            <div className="space-y-2">
              {board[col].map((task) => {
                const ps = prioStyle(task.prio);
                return (
                  <div
                    key={task.title}
                    draggable
                    onDragStart={() => setDragging({ from: col, title: task.title })}
                    onDragEnd={() => setDragging(null)}
                    className="bg-white rounded-lg p-3 cursor-grab active:cursor-grabbing"
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
        ))}
      </div>
    </Layout>
  );
}
