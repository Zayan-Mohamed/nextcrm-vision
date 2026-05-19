import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Layout, Card, Badge, ButtonPrimary, ButtonSecondary, Avatar } from "@/components/Layout";
import { LEADS, STATUSES, statusStyle } from "@/lib/data";
import { Phone, Mail, Eye, Upload, Plus, Search, ChevronLeft, ChevronRight, UserPlus, Tag, Trash2, X } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/leads")({ component: Leads });

const FILTERS = ["All", ...STATUSES] as const;

function Leads() {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(
    () =>
      LEADS.filter(
        (l) =>
          (filter === "All" || l.status === filter) &&
          (l.name.toLowerCase().includes(query.toLowerCase()) ||
            l.company.toLowerCase().includes(query.toLowerCase())),
      ),
    [query, filter],
  );

  const allSelected = rows.length > 0 && rows.every((l) => selected.has(l.id));
  const toggleAll = () =>
    setSelected(allSelected ? new Set() : new Set(rows.map((l) => l.id)));
  const toggleOne = (id: string) =>
    setSelected((s) => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  const bulk = (label: string) => {
    toast.success(`${label} · ${selected.size} lead${selected.size > 1 ? "s" : ""}`);
    setSelected(new Set());
  };

  return (
    <Layout title="Leads">
      <Card style={{ padding: 16 }} className="mb-4">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-55 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("Search") + " leads, companies..."}
              className="w-full h-10 pl-9 pr-3 text-[14px] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6C47FF]/25 focus:border-[#6C47FF] transition-all"
              style={{ border: "1px solid #E5E7EB" }}
            />
          </div>
          <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F0F1F6" }}>
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={"nc-seg nc-press px-3 py-1.5 rounded-md text-[12px] font-medium" + (filter === f ? " is-on" : "")}
                style={{ background: filter === f ? "#6C47FF" : "transparent", color: filter === f ? "#fff" : "#6B7280" }}
              >
                {f === "All" ? f : t(f)}
              </button>
            ))}
          </div>
          <div className="flex-1" />
          <ButtonSecondary onClick={() => toast.success("Imported 124 leads", { description: "leads-may.csv" })}>
            <Upload size={14} />{t("Import Leads")}
          </ButtonSecondary>
          <ButtonPrimary onClick={() => toast("New lead form", { description: "Capture a lead manually" })}>
            <Plus size={14} />{t("Add Lead")}
          </ButtonPrimary>
        </div>
      </Card>

      {/* Contextual bulk-action bar */}
      {selected.size > 0 && (
        <div
          className="nc-fade flex items-center gap-3 mb-4 px-4 py-3 rounded-xl"
          style={{ background: "#1A1A2E", color: "#fff", boxShadow: "0 8px 24px rgba(26,26,46,0.25)" }}
        >
          <span className="text-[14px] font-semibold">{selected.size} selected</span>
          <div className="flex-1" />
          <button onClick={() => bulk("Assigned owner")} className="nc-press inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-white/10">
            <UserPlus size={14} /> Assign
          </button>
          <button onClick={() => bulk("Email queued")} className="nc-press inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-white/10">
            <Mail size={14} /> Email
          </button>
          <button onClick={() => bulk("Tagged")} className="nc-press inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md hover:bg-white/10">
            <Tag size={14} /> Tag
          </button>
          <button onClick={() => bulk("Deleted")} className="nc-press inline-flex items-center gap-1.5 text-[13px] font-medium px-3 py-1.5 rounded-md" style={{ color: "#FCA5A5" }}>
            <Trash2 size={14} /> Delete
          </button>
          <button onClick={() => setSelected(new Set())} className="nc-press ml-2 p-1.5 rounded-md hover:bg-white/10" aria-label="Clear selection">
            <X size={15} />
          </button>
        </div>
      )}

      <Card style={{ padding: 0 }}>
        <table className="w-full text-[14px]">
          <thead>
            <tr style={{ color: "#6B7280", fontSize: 12, textTransform: "uppercase", letterSpacing: "0.05em", borderBottom: "1px solid #E5E7EB" }}>
              <th className="px-4 py-3 w-8">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} className="accent-[#6C47FF] cursor-pointer" />
              </th>
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
            {rows.map((l, i) => {
              const s = statusStyle[l.status];
              const on = selected.has(l.id);
              return (
                <tr
                  key={l.id}
                  className="transition-colors hover:bg-[#F4F0FF]"
                  style={{ background: on ? "#F4F0FF" : i % 2 ? "#F9FAFB" : "#fff", height: 48 }}
                >
                  <td className="px-4">
                    <input type="checkbox" checked={on} onChange={() => toggleOne(l.id)} className="accent-[#6C47FF] cursor-pointer" />
                  </td>
                  <td className="px-4"><div className="flex items-center gap-2"><Avatar name={l.name} size={28} />{l.name}</div></td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.phone}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.email}</td>
                  <td className="px-4">{l.source}</td>
                  <td className="px-4"><Badge bg={s.bg} color={s.color}>{l.status}</Badge></td>
                  <td className="px-4">{l.assignedTo}</td>
                  <td className="px-4" style={{ color: "#6B7280" }}>{l.created}</td>
                  <td className="px-4">
                    <div className="flex items-center justify-end gap-3" style={{ color: "#6B7280" }}>
                      <Phone size={16} className="cursor-pointer hover:text-[#6C47FF]" onClick={() => toast(`Calling ${l.name}…`)} />
                      <Mail size={16} className="cursor-pointer hover:text-[#6C47FF]" onClick={() => toast(`Compose to ${l.name}`)} />
                      <Eye size={16} className="cursor-pointer hover:text-[#6C47FF]" onClick={() => toast(`Open ${l.name}'s record`)} />
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td colSpan={9} className="text-center py-12 text-[14px]" style={{ color: "#9CA3AF" }}>
                  No leads match “{query || filter}”.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t" style={{ borderColor: "#E5E7EB" }}>
          <div className="text-[12px]" style={{ color: "#6B7280" }}>
            Showing {rows.length} of 1,284
          </div>
          <div className="flex items-center gap-1">
            <button className="nc-press w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#F7F8FC]" style={{ border: "1px solid #E5E7EB" }}><ChevronLeft size={14} /></button>
            {[1, 2, 3, 4].map((n) => (
              <button key={n} className="nc-press w-8 h-8 rounded-md text-[13px]"
                style={{ background: n === 1 ? "#6C47FF" : "#fff", color: n === 1 ? "#fff" : "#1A1A2E", border: n === 1 ? "none" : "1px solid #E5E7EB" }}>
                {n}
              </button>
            ))}
            <button className="nc-press w-8 h-8 rounded-md flex items-center justify-center hover:bg-[#F7F8FC]" style={{ border: "1px solid #E5E7EB" }}><ChevronRight size={14} /></button>
          </div>
        </div>
      </Card>
    </Layout>
  );
}
