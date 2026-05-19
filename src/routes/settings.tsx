import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Badge, ButtonPrimary, ButtonSecondary, Avatar, Label } from "@/components/Layout";
import { USERS, INTEGRATIONS } from "@/lib/data";
import { Plus, Check } from "lucide-react";
import { useI18n, type Lang } from "@/lib/i18n";

export const Route = createFileRoute("/settings")({ component: Settings });

const TABS = ["General", "Users & Roles", "Integrations", "Notifications", "Language"] as const;
type Tab = typeof TABS[number];

const FOCUS = "focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] transition-all";

const roleStyle = (r: string) =>
  r === "Admin"   ? { bg: "#F3E8FF", color: "#7E22CE" } :
  r === "Manager" ? { bg: "#E0F2FE", color: "#0369A1" } :
                    { bg: "#DCFCE7", color: "#15803D" };

function Toggle({ on, onClick }: { on: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="nc-press w-9 h-5 rounded-full p-0.5 flex items-center cursor-pointer transition-all shrink-0"
      style={{ background: on ? "#6C47FF" : "#E5E7EB", justifyContent: on ? "flex-end" : "flex-start" }}>
      <div className="w-4 h-4 rounded-full bg-white" style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }} />
    </div>
  );
}

function Settings() {
  const [tab, setTab] = useState<Tab>("Users & Roles");
  const { lang, setLang, t } = useI18n();

  return (
    <Layout title="Settings">
      <div className="flex gap-1 mb-6 border-b" style={{ borderColor: "#E5E7EB" }}>
        {TABS.map((tb) => (
          <button key={tb} onClick={() => setTab(tb)}
            className={"nc-tab px-4 py-3 text-[14px] font-medium" + (tab === tb ? " is-active" : "")}
            style={{ color: tab === tb ? "#6C47FF" : "#6B7280", marginBottom: -1 }}>
            {t(tb)}
          </button>
        ))}
      </div>

      <div key={tab} className="nc-section">
        {tab === "Users & Roles" && <UsersTab />}
        {tab === "Integrations" && <IntegrationsTab />}
        {tab === "Language" && <LanguageTab lang={lang} setLang={setLang} />}
        {tab === "General" && <GeneralTab />}
        {tab === "Notifications" && <NotificationsTab />}
      </div>

      {tab !== "Integrations" && (
        <div className="mt-8">
          <h2 className="text-[20px] font-semibold mb-4">Integrations</h2>
          <IntegrationsTab />
        </div>
      )}
    </Layout>
  );
}

function GeneralTab() {
  return (
    <Card>
      <h2 className="text-[16px] font-semibold mb-1">Organisation</h2>
      <p className="text-[13px] mb-6" style={{ color: "#6B7280" }}>Workspace defaults applied across the CRM.</p>
      <div className="grid grid-cols-2 gap-5 max-w-3xl">
        {[
          { l: "Organisation Name", v: "Next CRM (Pvt) Ltd" },
          { l: "Support Email", v: "support@nextcrm.lk" },
        ].map((f) => (
          <div key={f.l}>
            <Label><div className="mb-2">{f.l}</div></Label>
            <input defaultValue={f.v} className={"w-full h-10 px-3 rounded-lg text-[14px] " + FOCUS} style={{ border: "1px solid #E5E7EB" }} />
          </div>
        ))}
        <div>
          <Label><div className="mb-2">Timezone</div></Label>
          <select className={"w-full h-10 px-3 rounded-lg text-[14px] " + FOCUS} style={{ border: "1px solid #E5E7EB" }}>
            <option>Asia/Colombo (GMT+5:30)</option><option>Asia/Dubai (GMT+4)</option><option>UTC</option>
          </select>
        </div>
        <div>
          <Label><div className="mb-2">Default Currency</div></Label>
          <select className={"w-full h-10 px-3 rounded-lg text-[14px] " + FOCUS} style={{ border: "1px solid #E5E7EB" }}>
            <option>LKR — Sri Lankan Rupee</option><option>USD — US Dollar</option><option>AED — UAE Dirham</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-6 max-w-3xl">
        <ButtonSecondary onClick={() => toast("Reverted to last saved settings")}>Reset</ButtonSecondary>
        <ButtonPrimary onClick={() => toast.success("Settings saved")}>Save Changes</ButtonPrimary>
      </div>
    </Card>
  );
}

function NotificationsTab() {
  const [prefs, setPrefs] = useState<Record<string, boolean>>({
    "Daily performance digest": true,
    "New lead assigned to me": true,
    "Call transcription ready": true,
    "Deal stalled alert": false,
    "Weekly coaching summary": true,
    "Campaign reply received": false,
  });
  return (
    <Card>
      <h2 className="text-[16px] font-semibold mb-1">Notifications</h2>
      <p className="text-[13px] mb-5" style={{ color: "#6B7280" }}>Choose what Next CRM notifies you about.</p>
      <div className="divide-y" style={{ borderColor: "#F3F4F6" }}>
        {Object.entries(prefs).map(([k, v]) => (
          <div key={k} className="flex items-center justify-between py-3.5">
            <div>
              <div className="text-[14px] font-medium">{k}</div>
              <div className="text-[12px]" style={{ color: "#6B7280" }}>
                {v ? "Email + in-app" : "Off"}
              </div>
            </div>
            <Toggle on={v} onClick={() => {
              setPrefs((p) => ({ ...p, [k]: !p[k] }));
              toast(`${k} ${!v ? "enabled" : "disabled"}`);
            }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

function UsersTab() {
  return (
    <Card style={{ padding: 0 }}>
      <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: "#E5E7EB" }}>
        <h2 className="text-[16px] font-semibold">Users</h2>
        <ButtonPrimary onClick={() => toast("Invite sent", { description: "An invitation email is on its way." })}>
          <Plus size={14} />Invite User
        </ButtonPrimary>
      </div>
      <table className="w-full text-[14px]">
        <thead>
          <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            <th className="text-left px-6 py-3">User</th>
            <th className="text-left px-4">Email</th>
            <th className="text-left px-4">Role</th>
            <th className="text-left px-4">Status</th>
            <th className="text-right px-6">Last Active</th>
          </tr>
        </thead>
        <tbody>
          {USERS.map((u, i) => {
            const r = roleStyle(u.role);
            return (
              <tr key={u.email} className="transition-colors hover:bg-[#F4F0FF]" style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                <td className="px-6"><div className="flex items-center gap-2"><Avatar name={u.name} size={28} />{u.name}</div></td>
                <td className="px-4" style={{ color: "#6B7280" }}>{u.email}</td>
                <td className="px-4"><Badge bg={r.bg} color={r.color}>{u.role}</Badge></td>
                <td className="px-4">
                  <Badge bg={u.status === "Active" ? "#D1FAE5" : "#F3F4F6"} color={u.status === "Active" ? "#065F46" : "#6B7280"}>
                    {u.status}
                  </Badge>
                </td>
                <td className="px-6 text-right" style={{ color: "#6B7280" }}>{u.last}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}

function IntegrationsTab() {
  const [conn, setConn] = useState<Record<string, boolean>>(
    Object.fromEntries(INTEGRATIONS.map((it) => [it.name, it.connected])),
  );
  return (
    <div className="grid grid-cols-4 gap-4 nc-stagger">
      {INTEGRATIONS.map((it) => {
        const connected = conn[it.name];
        return (
          <Card key={it.name} hover>
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 font-bold"
              style={{ background: "#EEE9FF", color: "#6C47FF" }}>
              {it.name[0]}
            </div>
            <div className="font-semibold text-[14px] mb-1">{it.name}</div>
            <div className="text-[12px] mb-4" style={{ color: "#6B7280" }}>
              {connected ? "Active integration" : "Not connected"}
            </div>
            {connected ? (
              <button
                onClick={() => { setConn((c) => ({ ...c, [it.name]: false })); toast(`${it.name} disconnected`); }}
                className="nc-press inline-flex items-center"
              >
                <Badge bg="#DCFCE7" color="#15803D"><Check size={10} className="inline mr-1" />Connected</Badge>
              </button>
            ) : (
              <ButtonSecondary onClick={() => { setConn((c) => ({ ...c, [it.name]: true })); toast.success(`${it.name} connected`); }}>
                Connect
              </ButtonSecondary>
            )}
          </Card>
        );
      })}
    </div>
  );
}

function LanguageTab({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const opts: { code: Lang; flag: string; label: string }[] = [
    { code: "en", flag: "🇬🇧", label: "English" },
    { code: "ta", flag: "🇮🇳", label: "தமிழ் (Tamil)" },
    { code: "si", flag: "🇱🇰", label: "සිංහල (Sinhala)" },
  ];
  return (
    <Card>
      <h2 className="text-[16px] font-semibold mb-2">Language</h2>
      <p className="text-[13px] mb-6" style={{ color: "#6B7280" }}>
        This will translate all UI labels.
      </p>
      <div className="space-y-3">
        {opts.map((o) => (
          <label key={o.code} className="nc-card-hover nc-press flex items-center gap-4 p-4 rounded-lg cursor-pointer"
            style={{ border: "1px solid " + (lang === o.code ? "#6C47FF" : "#E5E7EB"), background: lang === o.code ? "#EEE9FF" : "#fff" }}>
            <input type="radio" checked={lang === o.code} onChange={() => { setLang(o.code); toast(`Language: ${o.label}`); }} className="accent-[#6C47FF]" />
            <span className="text-[22px]">{o.flag}</span>
            <span className="text-[14px] font-medium">{o.label}</span>
          </label>
        ))}
      </div>
    </Card>
  );
}
