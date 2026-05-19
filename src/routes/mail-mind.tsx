import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Card, Badge, ButtonPrimary, ButtonSecondary, Label } from "@/components/Layout";
import { MAIL_MIND_CAMPAIGNS, UNSUBSCRIBED } from "@/lib/data";
import { Sparkles, Upload, Globe, Archive } from "lucide-react";

export const Route = createFileRoute("/mail-mind")({ component: MailMind });

function MailMind() {
  const [tab, setTab] = useState<"campaigns" | "unsub">("campaigns");
  return (
    <Layout title="Mail Mind">
      <div className="flex items-center gap-3 mb-6">
        <Card style={{ padding: "12px 16px" }} className="flex items-center gap-3">
          <Globe size={16} style={{ color: "#6C47FF" }} />
          <span className="text-[14px]">Connected domain:</span>
          <Badge bg="#DCFCE7" color="#15803D">nextcrm.lk ✓</Badge>
        </Card>
      </div>

      <Card className="mb-6">
        <h2 className="text-[16px] font-semibold mb-4">Create New Campaign</h2>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label><div className="mb-2">Campaign Name</div></Label>
              <input className="w-full h-10 px-3 rounded-lg text-[14px]"
                style={{ border: "1px solid #E5E7EB" }} placeholder="e.g., Q3 Apparel Outreach" />
            </div>
            <div>
              <Label><div className="mb-2">Leads</div></Label>
              <div className="rounded-lg p-6 text-center"
                style={{ border: "2px dashed #E5E7EB", background: "#F7F8FC" }}>
                <Upload size={20} style={{ color: "#6B7280" }} className="mx-auto mb-2" />
                <div className="text-[13px]" style={{ color: "#6B7280" }}>
                  Drop CSV here or click to upload
                </div>
              </div>
            </div>
            <div>
              <Label><div className="mb-2">Send From</div></Label>
              <select className="w-full h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
                <option>amara@nextcrm.lk</option>
                <option>pradeep@nextcrm.lk</option>
              </select>
            </div>
            <div>
              <Label><div className="mb-2">Schedule</div></Label>
              <input type="datetime-local" defaultValue="2026-05-20T09:00"
                className="w-full h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }} />
            </div>
          </div>

          <div>
            <Label><div className="mb-2">Email Body</div></Label>
            <div className="rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
              <textarea
                rows={12}
                defaultValue={"Hi {{first_name}},\n\nNoticed " + "{{company}}" + " is growing fast in apparel exports — congrats. We help teams like yours close 30% more deals using AI-powered call analytics.\n\nWorth a quick 15-min chat next week?\n\n— Amara"}
                className="w-full p-3 text-[14px] rounded-lg resize-none focus:outline-none"
              />
              <div className="flex items-center justify-between p-2 border-t" style={{ borderColor: "#E5E7EB" }}>
                <span className="text-[12px]" style={{ color: "#6B7280" }}>Tone: Professional</span>
                <button className="inline-flex items-center gap-1 text-[12px] font-medium px-3 py-1.5 rounded-md"
                  style={{ background: "#EEE9FF", color: "#6C47FF" }}>
                  <Sparkles size={12} /> Generate with AI
                </button>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <ButtonSecondary>Save Draft</ButtonSecondary>
              <ButtonPrimary>Launch Campaign</ButtonPrimary>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setTab("campaigns")}
          className="px-4 py-2 text-[14px] font-medium rounded-lg"
          style={{ background: tab === "campaigns" ? "#6C47FF" : "#fff", color: tab === "campaigns" ? "#fff" : "#1A1A2E", border: "1px solid #E5E7EB" }}>
          Campaign Results
        </button>
        <button onClick={() => setTab("unsub")}
          className="px-4 py-2 text-[14px] font-medium rounded-lg"
          style={{ background: tab === "unsub" ? "#6C47FF" : "#fff", color: tab === "unsub" ? "#fff" : "#1A1A2E", border: "1px solid #E5E7EB" }}>
          Unsubscriptions
        </button>
      </div>

      <Card style={{ padding: 0 }}>
        {tab === "campaigns" ? (
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th className="text-left px-6 py-3">Campaign</th>
                <th className="text-right px-4">Replies</th>
                <th className="text-right px-4">Open Rate</th>
                <th className="text-left px-4">Status</th>
                <th className="text-right px-6">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MAIL_MIND_CAMPAIGNS.map((c, i) => (
                <tr key={c.name} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-6 font-medium">{c.name}</td>
                  <td className="px-4 text-right">{c.replies}</td>
                  <td className="px-4 text-right">{c.open}</td>
                  <td className="px-4"><Badge>{c.status}</Badge></td>
                  <td className="px-6 text-right">
                    <button className="text-[12px] inline-flex items-center gap-1" style={{ color: "#6B7280" }}>
                      <Archive size={14} /> Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-[14px]">
            <thead>
              <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <th className="text-left px-6 py-3">Name</th>
                <th className="text-left px-4">Email</th>
                <th className="text-right px-6">Unsubscribed</th>
              </tr>
            </thead>
            <tbody>
              {UNSUBSCRIBED.map((u, i) => (
                <tr key={u.email} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-6 font-medium">{u.name}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{u.email}</td>
                  <td className="px-6 text-right" style={{ color: "#6B7280" }}>{u.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </Layout>
  );
}
