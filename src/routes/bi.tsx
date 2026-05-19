import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, Label } from "@/components/Layout";
import { BI_SAMPLE } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, Sparkles } from "lucide-react";

export const Route = createFileRoute("/bi")({ component: BI });

const SUGGESTIONS = [
  "Which leads are hottest this week?",
  "Where do deals stall most?",
  "Top objections last 30 days?",
  "Which rep closes fastest?",
];

function BI() {
  return (
    <Layout title="Business Intelligence">
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles size={20} style={{ color: "#6C47FF" }} />
          <div>
            <h2 className="text-[16px] font-semibold">Ask your CRM anything</h2>
            <div className="text-[13px]" style={{ color: "#6B7280" }}>
              AI-powered analytics over your leads, calls, and deals
            </div>
          </div>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
          <input
            defaultValue={BI_SAMPLE.question}
            className="w-full h-12 pl-11 pr-4 text-[15px] rounded-lg"
            style={{ border: "1px solid #E5E7EB", background: "#F7F8FC" }}
          />
        </div>
        <div className="flex flex-wrap gap-2 mt-4">
          {SUGGESTIONS.map((s) => (
            <button key={s} className="text-[12px] px-3 py-1.5 rounded-full"
              style={{ background: "#EEE9FF", color: "#6C47FF" }}>
              {s}
            </button>
          ))}
        </div>
      </Card>

      <Card>
        <div className="flex items-start justify-between mb-4">
          <div>
            <Label>Answer</Label>
            <h2 className="text-[16px] font-semibold mt-1">{BI_SAMPLE.question}</h2>
          </div>
          <Badge bg="#DCFCE7" color="#15803D">Confidence: High</Badge>
        </div>

        <p className="text-[14px] leading-[1.6] mb-6">{BI_SAMPLE.answer}</p>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label><div className="mb-3">Lead Scores</div></Label>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={BI_SAMPLE.chart} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6B7280" }} width={70} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6C47FF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <Label><div className="mb-3">Supporting Data</div></Label>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th className="text-left py-2">Lead</th>
                  <th className="text-right py-2">Score</th>
                  <th className="text-left py-2 pl-3">Signals</th>
                </tr>
              </thead>
              <tbody>
                {BI_SAMPLE.rows.map((r, i) => (
                  <tr key={r.lead} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 40 }}>
                    <td className="px-2 font-medium">{r.lead}</td>
                    <td className="px-2 text-right font-semibold" style={{ color: "#6C47FF" }}>{r.score}</td>
                    <td className="px-3" style={{ color: "#6B7280" }}>{r.signals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
