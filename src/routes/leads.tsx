import { createFileRoute } from "@tanstack/react-router";
import { Layout, Card, Badge, ButtonPrimary, ButtonSecondary, Avatar } from "@/components/Layout";
import { LEADS, statusStyle } from "@/lib/data";
import { Phone, Mail, Eye, Upload, Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/leads")({ component: Leads });

function Leads() {
  const { t } = useI18n();
  return (
    <Layout title="Leads">
      <Card style={{ padding: 16 }} className="mb-4">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
            <input placeholder={t("Search") + " leads..."} className="w-full h-10 pl-9 pr-3 text-[14px] rounded-lg"
              style={{ border: "1px solid #E5E7EB" }} />
          </div>
          <select className="h-10 px-3 text-[14px] rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
            <option>{t("Status")}: All</option>
            <option>New</option><option>Contacted</option><option>Qualified</option>
          </select>
          <select className="h-10 px-3 text-[14px] rounded-lg" style={{ border: "1px solid #E5E7EB" }}>
            <option>{t("Source")}: All</option>
            <option>Facebook</option><option>Google</option><option>Landing Page</option>
          </select>
          <input type="date" className="h-10 px-3 text-[14px] rounded-lg" style={{ border: "1px solid #E5E7EB" }} />
          <div className="flex-1" />
          <ButtonSecondary><Upload size={14} />{t("Import Leads")}</ButtonSecondary>
          <ButtonPrimary><Plus size={14} />{t("Add Lead")}</ButtonPrimary>
        </div>
      </Card>

      <Card style={{ padding: 0 }}>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E5E7EB" }}>
              <th className="px-4 py-3 w-8"><input type="checkbox" /></th>
              <th className="text-left px-4">{t("Name")}</th>
              <th className="text-left px-4">{t("Phone")}</th>
              <th className="text-left px-4">{t("Email")}</th>
              <th className="text-left px-4">{t("Source")}</th>
              <th className="text-left px-4">{t("Status")}</th>
              <th className="text-left px-4">{t("Assigned To")}</th>
              <th className="text-left px-4">{t("Created")}</th>
              <th className="text-right px-4">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {LEADS.map((l, i) => {
              const s = statusStyle[l.status];
              return (
                <tr key={l.id} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 48 }}>
                  <td className="px-4"><input type="checkbox" /></td>
                  <td className="px-4"><div className="flex items-center gap-2"><Avatar name={l.name} size={28} />{l.name}</div></td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.phone}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.email}</td>
                  <td className="px-4">{l.source}</td>
                  <td className="px-4"><Badge bg={s.bg} color={s.color}>{l.status}</Badge></td>
                  <td className="px-4">{l.assignedTo}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.created}</td>
                  <td className="px-4">
                    <div className="flex items-center justify-end gap-3" style={{ color: "#6B7280" }}>
                      <Phone size={16} className="cursor-pointer hover:text-[#6C47FF]" />
                      <Mail size={16} className="cursor-pointer hover:text-[#6C47FF]" />
                      <Eye size={16} className="cursor-pointer hover:text-[#6C47FF]" />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#E5E7EB" }}>
          <div className="text-[12px]" style={{ color: "#6B7280" }}>Showing 1–15 of 1,284</div>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-md flex items-center justify-center" style={{ border: "1px solid #E5E7EB" }}><ChevronLeft size={14} /></button>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className="w-8 h-8 rounded-md text-[13px]"
                style={{ background: n === 1 ? "#6C47FF" : "#fff", color: n === 1 ? "#fff" : "#1A1A2E", border: n === 1 ? "none" : "1px solid #E5E7EB" }}>
                {n}
              </button>
            ))}
            <button className="w-8 h-8 rounded-md flex items-center justify-center" style={{ border: "1px solid #E5E7EB" }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
