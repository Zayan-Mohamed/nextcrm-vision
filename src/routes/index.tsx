import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Label, Avatar } from "@/components/Layout";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import { KPIS, LEADS_30D, PIPELINE_BARS, ACTIVITY, TOP_REPS } from "@/lib/data";
import { Phone, Mail, CheckSquare, ArrowUpRight, Download, Sparkles } from "lucide-react";

export const Route = createFileRoute("/")({ component: Dashboard });

const RANGES = ["Today", "7 days", "30 days", "QTD"] as const;
const GRAINS = ["Daily", "Weekly", "Monthly"] as const;

function Dashboard() {
  const [range, setRange] = useState<(typeof RANGES)[number]>("30 days");
  const [grain, setGrain] = useState<(typeof GRAINS)[number]>("Daily");

  return (
    <Layout title="Dashboard">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 -mt-2">
        <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F0F1F6" }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={"nc-seg nc-press px-3.5 py-1.5 rounded-md text-[13px] font-medium" + (range === r ? " is-on" : "")}
              style={{ background: range === r ? "#6C47FF" : "transparent", color: range === r ? "#fff" : "#6B7280" }}
            >
              {r}
            </button>
          ))}
        </div>
        <button
          onClick={() => toast.success("Report exported", { description: `Dashboard · ${range} · PDF ready in downloads` })}
          className="nc-press inline-flex items-center gap-2 text-[14px] font-medium px-4 py-2 rounded-lg"
          style={{ background: "#fff", border: "1px solid #E5E7EB" }}
        >
          <Download size={14} /> Export
        </button>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-6 gap-4 mb-6 nc-stagger">
        {KPIS.map((k) => (
          <Card key={k.label} hover style={{ padding: 20 }}>
            <Label>{k.label}</Label>
            <div className="text-[20px] font-semibold mt-2">{k.value}</div>
            <div className="inline-flex items-center gap-1 text-[12px] mt-1 px-1.5 py-0.5 rounded-full"
              style={{ color: "#00875A", background: "#E6F7F0" }}>
              <ArrowUpRight size={12} />{k.delta}
            </div>
          </Card>
        ))}
      </div>

      {/* AI insight banner */}
      <Card className="mb-6 flex items-start gap-3" style={{ background: "linear-gradient(135deg, #F4F0FF 0%, #EAFBF4 100%)", padding: 18 }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "linear-gradient(135deg, #6C47FF 0%, #00C48C 100%)" }}>
          <Sparkles size={17} color="#fff" />
        </div>
        <div className="flex-1 text-[14px] leading-relaxed">
          <span className="font-semibold">AI insight ·</span> Conversion is up 1.2% but 19 deals are stalling in
          Proposal. Reps who follow up within 24h of a call close 31% more — 6 hot leads are waiting on a touch today.
        </div>
        <button
          onClick={() => toast("Opening Business Intelligence…")}
          className="nc-press text-[12px] font-semibold px-3 py-1.5 rounded-md shrink-0"
          style={{ background: "#fff", color: "#6C47FF" }}
        >
          Investigate →
        </button>
      </Card>

      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold">Leads · Last 30 days</h2>
            <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F0F1F6" }}>
              {GRAINS.map((g) => (
                <button
                  key={g}
                  onClick={() => setGrain(g)}
                  className={"nc-seg nc-press px-2.5 py-1 rounded-md text-[12px] font-medium" + (grain === g ? " is-on" : "")}
                  style={{ background: grain === g ? "#6C47FF" : "transparent", color: grain === g ? "#fff" : "#6B7280" }}
                >
                  {g}
                </button>
              ))}
            </div>
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
          <ul className="space-y-3 nc-stagger">
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
