import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Badge, Label, ButtonPrimary } from "@/components/Layout";
import { CAMPAIGNS } from "@/lib/data";
import { Sparkles, Mail, Plus, Check, Clock, Send } from "lucide-react";

export const Route = createFileRoute("/mail-agent")({ component: MailAgent });

const statusBadge = (s: string) =>
  s === "Active" ? { bg: "#DCFCE7", color: "#15803D" } :
  s === "Paused" ? { bg: "#FEF3C7", color: "#92400E" } :
                   { bg: "#E0F2FE", color: "#0369A1" };

const pct = (v: string) => (v === "–" ? 0 : parseInt(v, 10) || 0);

function MailAgent() {
  const [sel, setSel] = useState(0);
  const c = CAMPAIGNS[sel];

  const sent = c.leads;
  const opened = Math.round(sent * (pct(c.open) / 100));
  const clicked = Math.round(sent * (pct(c.click) / 100));
  const replied = Math.round(clicked * 0.42);
  const funnel = [
    { label: "Sent", value: sent, color: "#6C47FF" },
    { label: "Opened", value: opened, color: "#7C5CFF" },
    { label: "Clicked", value: clicked, color: "#00C48C" },
    { label: "Replied", value: replied, color: "#0EA5E9" },
  ];
  const max = Math.max(sent, 1);

  const sequence = [
    { day: "Day 1", subject: "Quick question about your sales workflow", status: "Sent", count: sent, done: true },
    { day: "Day 3", subject: "How {{company}} can save 8 hrs/week", status: "Sent", count: Math.round(sent * 0.82), done: true },
    { day: "Day 7", subject: "Last thought: worth a 15-min chat?", status: "Sending", count: Math.round(sent * 0.38), done: false },
  ];

  return (
    <Layout title="Mail Agent">
      <div className="flex items-center justify-between mb-4 -mt-2">
        <p className="text-[14px]" style={{ color: "#6B7280" }}>Select a campaign to inspect its performance</p>
        <ButtonPrimary onClick={() => toast("New campaign", { description: "Build an automated mailing sequence" })}>
          <Plus size={14} /> New Campaign
        </ButtonPrimary>
      </div>

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
            {CAMPAIGNS.map((row, i) => {
              const s = statusBadge(row.status);
              const on = i === sel;
              return (
                <tr
                  key={row.name}
                  onClick={() => setSel(i)}
                  className="cursor-pointer transition-colors"
                  style={{
                    background: on ? "#F4F0FF" : i % 2 ? "#F9FAFB" : "#fff",
                    borderLeft: on ? "3px solid #6C47FF" : "3px solid transparent",
                    height: 48,
                  }}
                >
                  <td className="px-6 font-medium">{row.name}</td>
                  <td className="px-4"><Badge bg={s.bg} color={s.color}>{row.status}</Badge></td>
                  <td className="px-4 text-right">{row.leads}</td>
                  <td className="px-4 text-right">{row.open}</td>
                  <td className="px-4 text-right">{row.click}</td>
                  <td className="px-6 text-right" style={{ color: "#6B7280" }}>{row.created}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <Card key={c.name} className="nc-section">
        <div className="flex items-center gap-2 mb-6">
          <Mail size={18} style={{ color: "#6C47FF" }} />
          <h2 className="text-[16px] font-semibold">{c.name}</h2>
          <Badge {...statusBadge(c.status)}>{c.status}</Badge>
          <div className="flex-1" />
          {c.status !== "Draft" && (
            <button
              onClick={() => toast(c.status === "Active" ? "Campaign paused" : "Campaign resumed")}
              className="nc-press text-[13px] font-medium px-3 py-1.5 rounded-md"
              style={{ background: "#F0F1F6", color: "#1A1A2E" }}
            >
              {c.status === "Active" ? "Pause" : "Resume"}
            </button>
          )}
        </div>

        {sent === 0 ? (
          <div className="text-center py-14 nc-fade">
            <Send size={28} style={{ color: "#C7C9D1" }} className="mx-auto mb-3" />
            <div className="text-[15px] font-medium">This campaign hasn’t been sent yet</div>
            <div className="text-[13px] mt-1" style={{ color: "#6B7280" }}>
              Add leads and launch it to see open, click and reply analytics.
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {funnel.map((f) => (
                <div key={f.label} className="rounded-lg p-4" style={{ background: "#F7F8FC" }}>
                  <Label>{f.label}</Label>
                  <div className="text-[20px] font-semibold mt-1">{f.value.toLocaleString()}</div>
                  <div className="text-[12px]" style={{ color: "#6B7280" }}>
                    {Math.round((f.value / max) * 100)}% of sent
                  </div>
                </div>
              ))}
            </div>

            {/* Funnel bars */}
            <Label><div className="mb-3">Conversion Funnel</div></Label>
            <div className="space-y-2 mb-8">
              {funnel.map((f) => (
                <div key={f.label} className="flex items-center gap-3">
                  <span className="text-[12px] w-16 shrink-0" style={{ color: "#6B7280" }}>{f.label}</span>
                  <div className="flex-1 h-7 rounded-md overflow-hidden" style={{ background: "#F0F1F6" }}>
                    <div
                      className="h-7 rounded-md flex items-center justify-end pr-2 text-[11px] font-semibold text-white transition-all"
                      style={{ width: `${Math.max(6, (f.value / max) * 100)}%`, background: f.color, transitionDuration: "0.7s" }}
                    >
                      {f.value.toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sequence stepper */}
            <Label><div className="mb-4">Email Sequence</div></Label>
            <div className="relative pl-2">
              <span className="absolute left-4.5 top-3 bottom-3 w-px" style={{ background: "#E5E7EB" }} />
              <div className="space-y-3">
                {sequence.map((e) => (
                  <div key={e.day} className="relative pl-10">
                    <span
                      className="absolute left-0 top-2 w-8 h-8 rounded-full flex items-center justify-center"
                      style={{
                        background: e.done ? "#DCFCE7" : "#EEE9FF",
                        color: e.done ? "#15803D" : "#6C47FF",
                        boxShadow: "0 0 0 4px #fff",
                      }}
                    >
                      {e.done ? <Check size={14} /> : <Clock size={14} />}
                    </span>
                    <div className="flex items-center gap-4 rounded-lg p-4 nc-card-hover" style={{ border: "1px solid #E5E7EB" }}>
                      <div className="w-12 text-[12px] font-semibold" style={{ color: "#6C47FF" }}>{e.day}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[14px] font-medium">{e.subject}</span>
                          <Badge bg="#EEE9FF" color="#6C47FF">
                            <Sparkles size={10} className="inline mr-1" /> AI wrote this
                          </Badge>
                        </div>
                        <div className="text-[12px] mt-1" style={{ color: "#6B7280" }}>
                          {e.status} · {e.count.toLocaleString()} recipients
                        </div>
                      </div>
                      <Badge {...(e.done ? { bg: "#DCFCE7", color: "#15803D" } : { bg: "#FEF3C7", color: "#92400E" })}>
                        {e.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </Card>
    </Layout>
  );
}
