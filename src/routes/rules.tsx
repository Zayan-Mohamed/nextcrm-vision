import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Layout, Card, ButtonPrimary, ButtonSecondary, Label } from "@/components/Layout";
import { RULES } from "@/lib/data";
import { Plus, Workflow, Zap, ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/rules")({ component: Rules });

interface Rule { trigger: string; condition: string; action: string; on: boolean; last: string }

const TRIGGERS = ["Lead created", "Call ended", "Email opened", "Deal stalled 7 days", "Form submitted", "Unsubscribe"];
const ACTIONS = ["Assign to Amara", "Create follow-up", "Tag as Hot", "Notify manager", "Send pricing PDF", "Mark Do Not Email"];

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="nc-press w-9 h-5 rounded-full p-0.5 flex items-center cursor-pointer transition-all"
      style={{ background: on ? "#6C47FF" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }}>
      <div className="w-4 h-4 rounded-full bg-white" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function Chip({ children, bg, color }: { children: React.ReactNode; bg: string; color: string }) {
  return (
    <span className="inline-flex items-center text-[13px] font-medium px-3 py-1.5 rounded-lg" style={{ background: bg, color }}>
      {children}
    </span>
  );
}

function Rules() {
  const { t } = useI18n();
  const [rules, setRules] = useState<Rule[]>(RULES.map((r) => ({ ...r })));
  const [sel, setSel] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);
  const draft = rules[sel];

  const setDraft = (patch: Partial<Rule>) =>
    setRules((rs) => rs.map((r, i) => (i === sel ? { ...r, ...patch } : r)));

  const toggle = (i: number) =>
    setRules((rs) => rs.map((r, idx) => {
      if (idx !== i) return r;
      toast(`Rule ${!r.on ? "enabled" : "disabled"}`, { description: r.trigger });
      return { ...r, on: !r.on };
    }));

  const addRule = () => {
    const fresh: Rule = { trigger: "Lead created", condition: "Source = Facebook", action: "Assign to Amara", on: true, last: "Never" };
    setRules((rs) => [...rs, fresh]);
    setSel(rules.length);
    toast.success("New rule created", { description: "Edit and save it below." });
    setTimeout(() => editorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 60);
  };

  const activeCount = rules.filter((r) => r.on).length;
  const summary = [
    { label: "Total Rules", value: rules.length, color: "#6C47FF" },
    { label: "Active", value: activeCount, color: "#00C48C" },
    { label: "Paused", value: rules.length - activeCount, color: "#9CA3AF" },
    { label: "Actions Today", value: 38, color: "#F5A623" },
  ];

  return (
    <Layout title="Rules">
      <div className="grid grid-cols-4 gap-4 mb-6 nc-stagger">
        {summary.map((s) => (
          <Card key={s.label} style={{ padding: 18 }}>
            <div className="flex items-center justify-between">
              <Label>{s.label}</Label>
              <Zap size={14} style={{ color: s.color }} />
            </div>
            <div className="text-[22px] font-semibold mt-2">{s.value}</div>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center mb-4">
        <p className="text-[14px]" style={{ color: "#6B7280" }}>
          Automate actions when conditions are met · click a rule to edit
        </p>
        <ButtonPrimary onClick={addRule}><Plus size={14} />{t("Create Rule")}</ButtonPrimary>
      </div>

      <Card style={{ padding: 0 }} className="mb-6">
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              <th className="text-left px-6 py-3">{t("Trigger")}</th>
              <th className="text-left px-4">{t("Condition")}</th>
              <th className="text-left px-4">{t("Action")}</th>
              <th className="text-left px-4">{t("Last Triggered")}</th>
              <th className="text-right px-6">{t("Status")}</th>
            </tr>
          </thead>
          <tbody>
            {rules.map((r, i) => {
              const on = i === sel;
              return (
                <tr
                  key={i}
                  onClick={() => setSel(i)}
                  className="cursor-pointer transition-colors"
                  style={{
                    background: on ? "#F4F0FF" : i % 2 ? "#F9FAFB" : "#fff",
                    borderLeft: on ? "3px solid #6C47FF" : "3px solid transparent",
                    height: 48,
                    opacity: r.on ? 1 : 0.55,
                  }}
                >
                  <td className="px-6 font-medium">{r.trigger}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{r.condition}</td>
                  <td className="px-4">{r.action}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{r.last}</td>
                  <td className="px-6">
                    <div className="flex justify-end items-center h-12" onClick={(e) => e.stopPropagation()}>
                      <Toggle on={r.on} onClick={() => toggle(i)} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>

      <div ref={editorRef}>
      <Card>
        <div className="flex items-center gap-2 mb-5">
          <Workflow size={18} style={{ color: "#6C47FF" }} />
          <h2 className="text-[16px] font-semibold">Edit Rule</h2>
        </div>

        {/* Live IF / THEN preview */}
        <div className="flex items-center flex-wrap gap-2 mb-6 p-4 rounded-lg" style={{ background: "#F7F8FC" }}>
          <span className="text-[12px] font-bold uppercase" style={{ color: "#6B7280", letterSpacing: "0.06em" }}>If</span>
          <Chip bg="#EEE9FF" color="#6C47FF">{draft.trigger}</Chip>
          <span className="text-[12px]" style={{ color: "#9CA3AF" }}>and</span>
          <Chip bg="#E0F2FE" color="#0369A1">{draft.condition || "any condition"}</Chip>
          <ArrowRight size={16} style={{ color: "#9CA3AF" }} />
          <span className="text-[12px] font-bold uppercase" style={{ color: "#6B7280", letterSpacing: "0.06em" }}>Then</span>
          <Chip bg="#DCFCE7" color="#15803D">{draft.action}</Chip>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <Label><div className="mb-2">Trigger</div></Label>
            <select
              value={draft.trigger}
              onChange={(e) => setDraft({ trigger: e.target.value })}
              className="w-full h-10 px-3 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] transition-all"
              style={{ border: "1px solid #E5E7EB" }}
            >
              {TRIGGERS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
          <div>
            <Label><div className="mb-2">Condition</div></Label>
            <input
              value={draft.condition}
              onChange={(e) => setDraft({ condition: e.target.value })}
              placeholder="e.g. Source = Facebook"
              className="w-full h-10 px-3 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] transition-all"
              style={{ border: "1px solid #E5E7EB" }}
            />
          </div>
          <div>
            <Label><div className="mb-2">Action</div></Label>
            <select
              value={draft.action}
              onChange={(e) => setDraft({ action: e.target.value })}
              className="w-full h-10 px-3 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] transition-all"
              style={{ border: "1px solid #E5E7EB" }}
            >
              {ACTIONS.map((x) => <option key={x}>{x}</option>)}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <ButtonSecondary onClick={() => { setRules(RULES.map((r) => ({ ...r }))); setSel(0); toast("Changes discarded"); }}>
            Cancel
          </ButtonSecondary>
          <ButtonPrimary onClick={() => toast.success("Rule saved", { description: `If ${draft.trigger} → ${draft.action}` })}>
            Save
          </ButtonPrimary>
        </div>
      </Card>
      </div>
    </Layout>
  );
}
