import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, Label } from "@/components/Layout";
import { CAMPAIGNS } from "@/lib/data";
import { Sparkles, Mail } from "lucide-react";

export const Route = createFileRoute("/mail-agent")({ component: MailAgent });

const statusBadge = (s: string) =>
  s === "Active" ? { bg: "#DCFCE7", color: "#15803D" } :
  s === "Paused" ? { bg: "#FEF3C7", color: "#92400E" } :
                   { bg: "#E0F2FE", color: "#0369A1" };

function MailAgent() {
  return (
    <Layout title="Mail Agent">
      <Card style={{ padding: 0 }} className="mb-6">
        <div className="px-6 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
          <h2 className="text-[16px] font-semibold">Campaigns</h2>
        </div>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-6 py-3">Campaign</th>
              <th className="text-left px-4">Status</th>
              <th className="text-right px-4">Leads</th>
              <th className="text-right px-4">Open Rate</th>
              <th className="text-right px-4">Click Rate</th>
              <th className="text-right px-6">Created</th>
            </tr>
          </thead>
          <tbody>
            {CAMPAIGNS.map((c, i) => {
              const s = statusBadge(c.status);
              return (
                <tr key={c.name} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-6 font-medium">{c.name}</td>
                  <td className="px-4"><Badge bg={s.bg} color={s.color}>{c.status}</Badge></td>
                  <td className="px-4 text-right">{c.leads}</td>
                  <td className="px-4 text-right">{c.open}</td>
                  <td className="px-4 text-right">{c.click}</td>
                  <td className="px-6 text-right" style={{ color: "#6B7280" }}>{c.created}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Mail size={18} style={{ color: "#6C47FF" }} />
          <h2 className="text-[16px] font-semibold">Q2 Outbound — SMB</h2>
          <Badge bg="#DCFCE7" color="#15803D">Active</Badge>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {[
            { l: "Sent", v: "240" },
            { l: "Opened", v: "108 (45%)" },
            { l: "Clicked", v: "34 (14%)" },
            { l: "Unsubscribed", v: "3" },
          ].map((s) => (
            <div key={s.l} className="rounded-lg p-4" style={{ background: "#F7F8FC" }}>
              <Label>{s.l}</Label>
              <div className="text-[18px] font-semibold mt-2">{s.v}</div>
            </div>
          ))}
        </div>

        <Label><div className="mb-4">Email Sequence</div></Label>
        <div className="space-y-3">
          {[
            { day: "Day 1", subject: "Quick question about your sales workflow", status: "Sent · 240" },
            { day: "Day 3", subject: "How {{company}} can save 8 hrs/week", status: "Sent · 198" },
            { day: "Day 7", subject: "Last thought — worth a 15-min chat?", status: "Sending · 92" },
          ].map((e, i) => (
            <div key={i} className="flex items-center gap-4 rounded-lg p-4" style={{ border: "1px solid #E5E7EB" }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center font-semibold text-[13px]"
                style={{ background: "#EEE9FF", color: "#6C47FF" }}>
                {e.day}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-medium">{e.subject}</span>
                  <Badge bg="#EEE9FF" color="#6C47FF">
                    <Sparkles size={10} className="inline mr-1" /> AI wrote this
                  </Badge>
                </div>
                <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>{e.status}</div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </Layout>
  );
}
