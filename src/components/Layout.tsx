import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, KanbanSquare, Mic, Brain, Calendar,
  ListChecks, Mail, Send, BarChart3, Workflow, Settings as Cog,
  Bell, Search,
} from "lucide-react";
import type { ReactNode } from "react";
import { useI18n, type Lang } from "@/lib/i18n";

const NAV = [
  { to: "/",            label: "Dashboard",             icon: LayoutDashboard },
  { to: "/leads",       label: "Leads",                 icon: Users },
  { to: "/pipeline",    label: "Pipeline",              icon: KanbanSquare },
  { to: "/vocalytics",  label: "Vocalytics",            icon: Mic },
  { to: "/coaching",    label: "Coaching AI",           icon: Brain },
  { to: "/calendar",    label: "Smart Calendar",        icon: Calendar },
  { to: "/tasks",       label: "Task Board",            icon: ListChecks },
  { to: "/mail-agent",  label: "Mail Agent",            icon: Mail },
  { to: "/mail-mind",   label: "Mail Mind",             icon: Send },
  { to: "/bi",          label: "Business Intelligence", icon: BarChart3 },
  { to: "/rules",       label: "Rules",                 icon: Workflow },
  { to: "/settings",    label: "Settings",              icon: Cog },
];

export function Avatar({ name, size = 32 }: { name: string; size?: number }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div
      className="rounded-full flex items-center justify-center text-white font-semibold shrink-0"
      style={{
        width: size, height: size, fontSize: size * 0.4,
        background: "linear-gradient(135deg, #6C47FF 0%, #00C48C 100%)",
      }}
    >
      {initials}
    </div>
  );
}

function Sidebar() {
  const { pathname } = useLocation();
  const { t } = useI18n();
  return (
    <aside
      className="w-[240px] shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ background: "#1A1A2E", color: "#fff" }}
    >
      <div className="px-6 py-6 flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#6C47FF" }} />
        <span className="text-[18px] font-semibold">Next CRM</span>
      </div>
      <nav className="px-3 flex-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className="flex items-center gap-3 px-3 py-2.5 mb-1 text-[14px] rounded-lg transition-colors"
              style={{
                background: active ? "#6C47FF" : "transparent",
                color: active ? "#fff" : "rgba(255,255,255,0.75)",
              }}
            >
              <Icon size={18} />
              <span>{t(item.label)}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 text-[12px]" style={{ color: "rgba(255,255,255,0.5)" }}>
        v1.0 · Prototype
      </div>
    </aside>
  );
}

function TopBar() {
  const { lang, setLang, t } = useI18n();
  const langs: { code: Lang; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "ta", label: "தமிழ்" },
    { code: "si", label: "සිංහල" },
  ];
  return (
    <header
      className="h-16 sticky top-0 z-10 flex items-center px-6 gap-6"
      style={{ background: "#fff", borderBottom: "1px solid #E5E7EB" }}
    >
      <div className="flex-1 max-w-xl relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
        <input
          placeholder={t("Search") + "..."}
          className="w-full h-10 pl-9 pr-3 rounded-lg text-[14px]"
          style={{ border: "1px solid #E5E7EB", background: "#F7F8FC" }}
        />
      </div>
      <div className="flex items-center gap-1 p-1 rounded-lg" style={{ background: "#F7F8FC" }}>
        {langs.map((l) => (
          <button
            key={l.code}
            onClick={() => setLang(l.code)}
            className="px-3 py-1.5 rounded-md text-[12px] font-medium transition-colors"
            style={{
              background: lang === l.code ? "#6C47FF" : "transparent",
              color: lang === l.code ? "#fff" : "#6B7280",
            }}
          >
            {l.label}
          </button>
        ))}
      </div>
      <button className="relative" style={{ color: "#6B7280" }}>
        <Bell size={20} />
        <span
          className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
          style={{ background: "#F05A5A" }}
        />
      </button>
      <Avatar name="Amara Perera" />
    </header>
  );
}

export function Layout({ children, title }: { children: ReactNode; title: string }) {
  const { t } = useI18n();
  return (
    <div className="flex min-w-[1280px]" style={{ background: "#F7F8FC", color: "#1A1A2E", fontFamily: "Inter, sans-serif" }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 p-8">
          <h1 className="text-[24px] font-semibold mb-6">{t(title)}</h1>
          {children}
        </main>
      </div>
    </div>
  );
}

// Reusable primitives -----------------------------------------------------
export function Card({ children, className = "", style }: { children: ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={"rounded-xl " + className}
      style={{ background: "#fff", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: 24, ...style }}
    >
      {children}
    </div>
  );
}

export function Badge({ children, bg = "#EEE9FF", color = "#6C47FF" }: { children: ReactNode; bg?: string; color?: string }) {
  return (
    <span
      className="inline-flex items-center font-medium"
      style={{
        background: bg, color, borderRadius: 999, padding: "4px 10px", fontSize: 12,
      }}
    >
      {children}
    </span>
  );
}

export function ButtonPrimary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center gap-2 text-[14px] font-medium"
      style={{ background: "#6C47FF", color: "#fff", borderRadius: 8, padding: "10px 20px" }}
    >
      {children}
    </button>
  );
}
export function ButtonSecondary({ children, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      className="inline-flex items-center gap-2 text-[14px] font-medium"
      style={{ background: "#fff", color: "#1A1A2E", borderRadius: 8, padding: "10px 20px", border: "1px solid #E5E7EB" }}
    >
      {children}
    </button>
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <div className="text-[12px] font-medium uppercase" style={{ letterSpacing: "0.05em", color: "#6B7280" }}>
      {children}
    </div>
  );
}
