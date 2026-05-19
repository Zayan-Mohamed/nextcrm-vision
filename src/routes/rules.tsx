import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Layout, Card, ButtonPrimary, ButtonSecondary, Label } from "@/components/Layout";
import { RULES } from "@/lib/data";
import { Plus, Workflow } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/rules")({ component: Rules });

function Toggle({ on }: { on: boolean }) {
  return (
    <div className="w-9 h-5 rounded-full p-0.5 flex items-center cursor-pointer"
      style={{ background: on ? "#6C47FF" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }}>
      <div className="w-4 h-4 rounded-full bg-white" />
    </div>
  );
}

function Rules() {
  return (
    <Layout title="Rules">
      <div className="flex justify-between items-center mb-4">
        <p className="text-[14px]" style={{ color: "#6B7280" }}>
          Automate actions when conditions are met
        </p>
        <ButtonPrimary><Plus size={14} />Create Rule</ButtonPrimary>
      </div>

      <Card style={{ padding: 0 }} className="mb-6">
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-6 py-3">Trigger</th>
              <th className="text-left px-4">Condition</th>
              <th className="text-left px-4">Action</th>
              <th className="text-left px-4">Last Triggered</th>
              <th className="text-right px-6">Status</th>
            </tr>
          </thead>
          <tbody>
            {RULES.map((r, i) => (
              <tr key={i} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                <td className="px-6 font-medium">{r.trigger}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{r.condition}</td>
                <td className="px-4">{r.action}</td>
                <td className="px-4" style={{ color: "#6B7280" }}>{r.last}</td>
                <td className="px-6 flex justify-end items-center h-12"><Toggle on={r.on} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      <Card>
        <div className="flex items-center gap-2 mb-6">
          <Workflow size={18} style={{ color: "#6C47FF" }} />
          <h2 className="text-[16px] font-semibold">Edit Rule</h2>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <Label><div className="mb-2">Trigger</div></Label>
            <select className="w-full h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
              <option>Lead created</option><option>Call ended</option><option>Email opened</option>
            </select>
          </div>
          <div>
            <Label><div className="mb-2">Condition</div></Label>
            <div className="flex gap-2">
              <select className="flex-1 h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
                <option>Source =</option><option>Source ≠</option>
              </select>
              <input defaultValue="Facebook"
                className="flex-1 h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }} />
            </div>
          </div>
          <div>
            <Label><div className="mb-2">Action</div></Label>
            <select className="w-full h-10 px-3 rounded-lg text-[14px]" style={{ border: "1px solid #E5E7EB" }}>
              <option>Assign to Amara</option><option>Send email</option><option>Notify manager</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <ButtonSecondary>Cancel</ButtonSecondary>
          <ButtonPrimary>Save</ButtonPrimary>
        </div>
      </Card>
    </Layout>
  );
}
