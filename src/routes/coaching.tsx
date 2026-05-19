import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Label, Avatar } from "@/components/Layout";
import { COACH_TEAM, COACH_RADAR } from "@/lib/data";
import {
  Radar, RadarChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, ResponsiveContainer,
} from "recharts";
import { CheckCircle2, AlertTriangle, Lightbulb } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/coaching")({ component: Coaching });

function Coaching() {
  const { t } = useI18n();
  return (
    <Layout title="Coaching AI">
      <Card style={{ padding: 0 }} className="mb-6">
        <div className="px-6 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-[16px] font-semibold">{t("Team Performance")}</h2>
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
            {COACH_TEAM.map((r, i) => (
              <tr key={r.name} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                <td className="px-6"><div className="flex items-center gap-2"><Avatar name={r.name} size={28} />{r.name}</div></td>
                <td className="px-4 font-semibold" style={{ color: "#6C47FF" }}>{r.callScore}</td>
                <td className="px-4">{r.objection}</td>
                <td className="px-4">{r.empathy}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{r.ratio}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{r.improve}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="flex items-center gap-3 mb-6">
          <Avatar name="Pradeep Silva" />
          <div>
            <div className="font-semibold text-[16px]">Pradeep Silva</div>
            <Label>Coaching Snapshot · May 2026</Label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div style={{ height: 320 }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={COACH_RADAR}>
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
              {["Strong rapport-building intro", "Clear pricing articulation", "Empathetic to budget concerns"].map((p) => (
                <div key={p} className="flex gap-2 items-start text-[14px] mb-2">
                  <CheckCircle2 size={16} style={{ color: "#00C48C", marginTop: 2 }} />{p}
                </div>
              ))}
            </div>
            <div>
              <Label><div className="mb-3">What to Improve</div></Label>
              {["Talk/listen ratio leaned too high", "Missed objection on timeline", "Closing question wasn't direct"].map((p) => (
                <div key={p} className="flex gap-2 items-start text-[14px] mb-2">
                  <AlertTriangle size={16} style={{ color: "#F5A623", marginTop: 2 }} />{p}
                </div>
              ))}
            </div>
            <div>
              <Label><div className="mb-3">Suggested Questions Next Call</div></Label>
              {[
                "What's blocking you from deciding by month-end?",
                "Who else needs to sign off on this?",
                "If we resolve the timeline concern, are we good to move forward?",
              ].map((p) => (
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
