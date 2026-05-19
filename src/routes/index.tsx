import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Label, Avatar } from "@/components/Layout";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { KPIS, LEADS_30D, PIPELINE_BARS, ACTIVITY, TOP_REPS } from "@/lib/data";
import { Phone, Mail, CheckSquare } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  return (
    <Layout title="Dashboard">
      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        {KPIS.map((k) => (
          <Card key={k.label} style={{ padding: 20 }}>
            <Label>{k.label}</Label>
            <div className="text-[20px] font-semibold mt-2">{k.value}</div>
            <div className="text-[12px] mt-1" style={{ color: "#00C48C" }}>{k.delta}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold">Leads — Last 30 days</h2>
            <Label>Daily</Label>
          </div>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LEADS_30D}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip />
                <Line type="monotone" dataKey="leads" stroke="#6C47FF" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h2 className="text-[16px] font-semibold mb-4">Deals by Stage</h2>
          <div style={{ height: 260 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PIPELINE_BARS}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="stage" tick={{ fontSize: 10, fill: "#6B7280" }} />
                <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
                <Tooltip />
                <Bar dataKey="deals" fill="#6C47FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card className="col-span-2">
          <h2 className="text-[16px] font-semibold mb-4">Top Performing Reps</h2>
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th className="text-left py-2">Rep</th>
                <th className="text-right py-2">Calls</th>
                <th className="text-right py-2">Closed</th>
                <th className="text-right py-2">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {TOP_REPS.map((r, i) => (
                <tr key={r.name} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-2"><div className="flex items-center gap-3"><Avatar name={r.name} size={28} />{r.name}</div></td>
                  <td className="text-right px-2">{r.calls}</td>
                  <td className="text-right px-2">{r.closed}</td>
                  <td className="text-right px-2 font-medium">{r.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card>
          <h2 className="text-[16px] font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-3">
            {ACTIVITY.map((a, i) => {
              const Icon = a.type === "call" ? Phone : a.type === "email" ? Mail : CheckSquare;
              const color = a.type === "call" ? "#6C47FF" : a.type === "email" ? "#00C48C" : "#F5A623";
              return (
                <li key={i} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "#F7F8FC", color }}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium truncate">{a.who}</div>
                    <div className="text-[12px]" style={{ color: "#6B7280" }}>{a.text}</div>
                  </div>
                  <div className="text-[12px]" style={{ color: "#6B7280" }}>{a.time}</div>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
