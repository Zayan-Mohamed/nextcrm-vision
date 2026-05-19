import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Card, Label, Avatar } from "@/components/Layout";
import { COACH_TEAM, COACH_RADAR } from "@/lib/data";
import {
  Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { CheckCircle2, AlertTriangle, Lightbulb, TrendingUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/coaching")({ component: Coaching });

type Rep = (typeof COACH_TEAM)[number];

const scoreColor = (n: number) =>
  n >= 85 ? "#00C48C" : n >= 75 ? "#F5A623" : "#F05A5A";

// Per-rep snapshot, derived deterministically so each rep reads differently.
const WELL = [
  ["Strong rapport-building intro", "Clear pricing articulation", "Empathetic to budget concerns"],
  ["Confident product framing", "Good silence after questions", "Tied features to ROI"],
  ["Excellent discovery depth", "Handled interruption gracefully", "Strong next-step commitment"],
  ["Warm, natural tone", "Recapped pain points well", "Asked for the meeting"],
  ["Persistent without pushy", "Good objection acknowledgement", "Clean agenda setting"],
];
const IMPROVE = [
  ["Talk/listen ratio leaned high", "Missed objection on timeline", "Closing question wasn't direct"],
  ["Jumped to price too early", "Few open-ended questions", "Didn't confirm decision-maker"],
  ["Long monologue mid-call", "Skipped budget qualification", "Vague on next steps"],
  ["Interrupted twice", "Under-explored competitor", "No clear timeline ask"],
  ["Rushed discovery", "Weak value framing", "Did not summarise actions"],
];
const QUESTIONS = [
  ["What's blocking a decision by month-end?", "Who else signs off on this?", "If we fix the timeline, are we good to go?"],
  ["What does success look like in 90 days?", "What happens if you do nothing?", "How are you solving this today?"],
  ["What's the cost of the current process?", "Who owns this internally?", "What would make this a priority now?"],
  ["What's your evaluation timeline?", "What concerns would your team raise?", "Can we pilot with one squad?"],
  ["What budget range are we working within?", "What's worked or failed before?", "Shall we book the technical call?"],
];

function repRadar(rep: Rep) {
  // Spread the rep's headline scores across the radar axes deterministically.
  const base = [rep.callScore, rep.empathy, rep.objection, rep.callScore - 4, rep.empathy - 9];
  return COACH_RADAR.map((d, i) => ({ axis: d.axis, score: Math.max(55, Math.min(98, base[i] ?? d.score)) }));
}

function Bar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 rounded-full w-20" style={{ background: "#F0F1F6" }}>
        <div className="h-1.5 rounded-full transition-all" style={{ width: `${value}%`, background: scoreColor(value), transitionDuration: "0.6s" }} />
      </div>
      <span className="text-[13px] font-semibold tabular-nums" style={{ color: scoreColor(value) }}>{value}</span>
    </div>
  );
}

function Coaching() {
  const { t } = useI18n();
  const [selected, setSelected] = useState(0);
  const rep = COACH_TEAM[selected];

  const avg = (k: keyof Rep) =>
    Math.round(COACH_TEAM.reduce((s, r) => s + (r[k] as number), 0) / COACH_TEAM.length);
  const stats = [
    { label: "Avg Call Score", value: avg("callScore"), color: "#6C47FF" },
    { label: "Avg Empathy", value: avg("empathy"), color: "#00C48C" },
    { label: "Avg Objection", value: avg("objection"), color: "#F5A623" },
    { label: "Calls Analysed", value: 142, color: "#0EA5E9", raw: true },
  ];

  return (
    <Layout title="Coaching AI">
      {/* Team average strip */}
      <div className="grid grid-cols-4 gap-4 mb-6 nc-stagger">
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div className="flex items-center justify-between">
              <Label>{s.label}</Label>
              <TrendingUp size={14} style={{ color: s.color }} />
            </div>
            <div className="text-[24px] font-semibold mt-2">
              {s.value}{s.raw ? "" : <span className="text-[14px] font-medium" style={{ color: "#9CA3AF" }}>/100</span>}
            </div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }} className="mb-6">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-[16px] font-semibold">{t("Team Performance")}</h2>
          <span className="text-[12px]" style={{ color: "#6B7280" }}>Select a rep to load their coaching snapshot</span>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-6 py-3">{t("Rep")}</th>
              <th className="text-left px-4">{t("Call Score")}</th>
              <th className="text-left px-4">{t("Objection Handling")}</th>
              <th className="text-left px-4">{t("Empathy")}</th>
              <th className="text-left px-4">{t("Talk/Listen")}</th>
              <th className="text-left px-4">{t("Improvement Area")}</th>
            </tr>
          </thead>
          <tbody>
            {COACH_TEAM.map((r, i) => {
              const on = i === selected;
              return (
                <tr
                  key={r.name}
                  onClick={() => setSelected(i)}
                  className="cursor-pointer transition-colors"
                  style={{
                    background: on ? "#F4F0FF" : i % 2 ? "#F9FAFB" : "#fff",
                    borderLeft: on ? "3px solid #6C47FF" : "3px solid transparent",
                    height: 52,
                  }}
                >
                  <td className="px-6"><div className="flex items-center gap-2"><Avatar name={r.name} size={28} />{r.name}</div></td>
                  <td className="px-4"><Bar value={r.callScore} /></td>
                  <td className="px-4"><Bar value={r.objection} /></td>
                  <td className="px-4"><Bar value={r.empathy} /></td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{r.ratio}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{r.improve}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card key={rep.name} className="nc-section">
        <div className="flex items-center gap-3 mb-6">
          <Avatar name={rep.name} />
          <div>
            <div className="font-semibold text-[16px]">{rep.name}</div>
            <Label>Coaching Snapshot · May 2026</Label>
          </div>
          <div className="ml-auto text-right">
            <Label>Overall</Label>
            <div className="text-[22px] font-bold" style={{ color: scoreColor(rep.callScore) }}>{rep.callScore}</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={repRadar(rep)}>
                <PolarGrid stroke="#E5E7EB" />
                <PolarAngleAxis dataKey="axis" tick={{ fontSize: 12, fill: "#6B7280" }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10, fill: "#9CA3AF" }} />
                <Radar dataKey="score" stroke="#6C47FF" fill="#6C47FF" fillOpacity={0.3} />
              </RadarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label><div className="mb-3">What Went Well</div></Label>
              {WELL[selected].map((p) => (
                <div key={p} className="flex gap-2 items-start text-[14px] mb-2">
                  <CheckCircle2 size={16} style={{ color: "#00C48C", marginTop: 2 }} />{p}
                </div>
              ))}
            </div>
            <div>
              <Label><div className="mb-3">What to Improve</div></Label>
              {IMPROVE[selected].map((p) => (
                <div key={p} className="flex gap-2 items-start text-[14px] mb-2">
                  <AlertTriangle size={16} style={{ color: "#F5A623", marginTop: 2 }} />{p}
                </div>
              ))}
            </div>
            <div>
              <Label><div className="mb-3">Suggested Questions Next Call</div></Label>
              {QUESTIONS[selected].map((p) => (
                <div key={p} className="flex gap-2 items-start text-[14px] mb-2">
                  <Lightbulb size={16} style={{ color: "#6C47FF", marginTop: 2 }} />{p}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
