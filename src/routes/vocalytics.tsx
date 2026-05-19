import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, Label } from "@/components/Layout";
import { CALL_LOG, TRANSCRIPT } from "@/lib/data";
import { Play, FileText, Sparkles } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/vocalytics")({ component: Vocalytics });

const statusColor = (s: string) =>
  s === "Transcribed" ? { bg: "#E0F2FE", color: "#0369A1" } :
  s === "Analysed"    ? { bg: "#DCFCE7", color: "#15803D" } :
                        { bg: "#FEF9C3", color: "#854D0E" };

function Vocalytics() {
  const stats = [
    { label: "Total Calls", value: "47" },
    { label: "Avg Duration", value: "6m 12s" },
    { label: "Transcribed", value: "44" },
    { label: "AI Analysed", value: "44" },
  ];
  return (
    <Layout title="Vocalytics">
      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <Card key={s.label} style={{ padding: 20 }}>
            <Label>{s.label}</Label>
            <div className="text-[20px] font-semibold mt-2">{s.value}</div>
          </Card>
        ))}
      </div>

      <Card style={{ padding: 0 }} className="mb-6">
        <div className="px-6 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-[16px] font-semibold">Call Log</h2>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-6 py-3">Caller</th>
              <th className="text-left px-4">Phone</th>
              <th className="text-left px-4">Duration</th>
              <th className="text-left px-4">When</th>
              <th className="text-left px-4">Status</th>
              <th className="text-right px-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            {CALL_LOG.map((c, i) => {
              const sc = statusColor(c.status);
              return (
                <tr key={c.id} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-6 font-medium">{c.caller}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{c.phone}</td>
                  <td className="px-4">{c.duration}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{c.when}</td>
                  <td className="px-4"><Badge bg={sc.bg} color={sc.color}>{c.status}</Badge></td>
                  <td className="px-6">
                    <div className="flex items-center justify-end gap-3" style={{ color: "#6B7280" }}>
                      <Play size={16} className="cursor-pointer hover:text-[#6C47FF]" />
                      <FileText size={16} className="cursor-pointer hover:text-[#6C47FF]" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      {/* Expanded analysis */}
      <Card>
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} style={{ color: "#6C47FF" }} />
          <h2 className="text-[16px] font-semibold">Call Analysis — Pradeep Silva · 8m 12s</h2>
        </div>

        <p className="text-[14px] leading-[1.6] mb-4" style={{ color: "#1A1A2E" }}>
          Customer expressed strong interest in the growth tier covering 25–50 seats. Pricing was the
          primary discussion point. The customer asked for a formal proposal and confirmed annual billing
          preference. Sentiment trended positive throughout the call with one objection around
          implementation timeline.
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <Badge bg="#FEE2E2" color="#B91C1C">Pain Point: Manual tracking</Badge>
          <Badge bg="#FEF3C7" color="#92400E">Objection: Implementation time</Badge>
          <Badge bg="#DCFCE7" color="#15803D">Decision: Annual billing</Badge>
          <Badge bg="#EEE9FF" color="#6C47FF">Next Step: Send proposal</Badge>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label>Sentiment</Label>
            <div className="flex h-3 rounded-full overflow-hidden mt-3 mb-2">
              <div style={{ width: "68%", background: "#00C48C" }} />
              <div style={{ width: "22%", background: "#9CA3AF" }} />
              <div style={{ width: "10%", background: "#F05A5A" }} />
            </div>
            <div className="flex justify-between text-[12px]" style={{ color: "#6B7280" }}>
              <span>Positive 68%</span><span>Neutral 22%</span><span>Negative 10%</span>
            </div>

            <Label><div className="mt-6">Recommended Next Steps</div></Label>
            <ul className="mt-3 space-y-2 text-[14px]">
              <li className="flex gap-2"><span style={{ color: "#6C47FF" }}>→</span>Send proposal PDF within 1 hour</li>
              <li className="flex gap-2"><span style={{ color: "#6C47FF" }}>→</span>Schedule follow-up call for Thursday</li>
              <li className="flex gap-2"><span style={{ color: "#6C47FF" }}>→</span>Loop in Solutions Engineer for tech eval</li>
            </ul>
          </div>

          <div>
            <Label>Transcript Excerpt</Label>
            <div className="mt-3 space-y-2 max-h-[280px] overflow-y-auto pr-2">
              {TRANSCRIPT.map((t, i) => (
                <div key={i} className="text-[13px] leading-[1.5]">
                  <span className="font-semibold" style={{ color: t.who === "Agent" ? "#6C47FF" : "#00C48C" }}>
                    {t.who}:
                  </span>{" "}
                  <span>{t.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
