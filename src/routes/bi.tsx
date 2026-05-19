import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Layout, Card, Badge, Label } from "@/components/Layout";
import { BI_SAMPLE } from "@/lib/data";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Search, Sparkles, Database, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/bi")({ component: BI });

interface QA {
  question: string;
  answer: string;
  confidence: number;
  sources: string[];
  rows: { lead: string; score: number; signals: string }[];
  chart: { name: string; score: number }[];
  followups: string[];
}

// Canned analytics — prototype intelligence layer (no backend).
const KB: Record<string, QA> = {
  "Which leads are hottest this week?": {
    question: BI_SAMPLE.question,
    answer: BI_SAMPLE.answer,
    confidence: 92,
    sources: ["1,284 leads", "47 calls (7d)", "Email engagement", "Pricing-page visits"],
    rows: BI_SAMPLE.rows,
    chart: BI_SAMPLE.chart,
    followups: ["Where do deals stall most?", "Which rep closes fastest?"],
  },
  "Where do deals stall most?": {
    question: "Where do deals stall most?",
    answer:
      "Deals stall most heavily at the Proposal stage. 19 of 62 active deals have sat in Proposal for 7+ days, with an average idle time of 11 days — 2.4x longer than any other stage. The common thread is unaddressed budget/timing objections raised on the last call but never followed up. Recommend an automated 5-day Proposal nudge.",
    confidence: 88,
    sources: ["62 active deals", "Pipeline stage history", "Call transcripts", "Rule engine"],
    rows: [
      { lead: "Proposal", score: 19, signals: "Avg 11 days idle, budget objections" },
      { lead: "Qualified", score: 8, signals: "Avg 5 days, awaiting demo" },
      { lead: "Contacted", score: 6, signals: "Avg 4 days, no reply" },
      { lead: "New", score: 4, signals: "Avg 2 days, unassigned" },
      { lead: "Closed", score: 2, signals: "Avg 1 day, contract review" },
    ],
    chart: [
      { name: "Proposal", score: 19 },
      { name: "Qualified", score: 8 },
      { name: "Contacted", score: 6 },
      { name: "New", score: 4 },
      { name: "Closed", score: 2 },
    ],
    followups: ["Which leads are hottest this week?", "Top objections last 30 days?"],
  },
  "Top objections last 30 days?": {
    question: "Top objections last 30 days?",
    answer:
      "Across 142 analysed calls in the last 30 days, pricing/budget is the dominant objection (38%), followed by timing/approval cycles (24%) and integration risk (17%). Pricing objections cluster in the SMB segment, while integration risk dominates Enterprise. Reps who reframed price against ROI within 60 seconds closed 31% more often.",
    confidence: 90,
    sources: ["142 analysed calls", "Coaching AI", "Sentiment model", "30-day window"],
    rows: [
      { lead: "Pricing / budget", score: 38, signals: "Concentrated in SMB segment" },
      { lead: "Timing / approval", score: 24, signals: "Q3 cycles closed, Q4 sign-off" },
      { lead: "Integration risk", score: 17, signals: "Enterprise, legacy API concerns" },
      { lead: "Competitor in play", score: 13, signals: "2 named competitors" },
      { lead: "No clear need", score: 8, signals: "Weak discovery on call" },
    ],
    chart: [
      { name: "Pricing", score: 38 },
      { name: "Timing", score: 24 },
      { name: "Integration", score: 17 },
      { name: "Competitor", score: 13 },
      { name: "No need", score: 8 },
    ],
    followups: ["Where do deals stall most?", "Which rep closes fastest?"],
  },
  "Which rep closes fastest?": {
    question: "Which rep closes fastest?",
    answer:
      "Pradeep Silva has the fastest close velocity: an average of 9 days from Qualified to Closed, against a team average of 17 days. He runs tighter discovery (fewer, sharper questions) and sends proposals within 2 hours of a call. Amara Perera is close behind at 11 days with the highest win rate (34%).",
    confidence: 86,
    sources: ["Rep activity logs", "Pipeline timestamps", "Top reps table", "90-day window"],
    rows: [
      { lead: "Pradeep Silva", score: 9, signals: "Fast proposals, tight discovery" },
      { lead: "Amara Perera", score: 11, signals: "Highest win rate (34%)" },
      { lead: "Kavindra Fernando", score: 14, signals: "Strong demos, slower follow-up" },
      { lead: "Nishani W.", score: 18, signals: "Thorough but long cycles" },
      { lead: "Thilak J.", score: 21, signals: "High volume, lower focus" },
    ],
    chart: [
      { name: "Pradeep", score: 9 },
      { name: "Amara", score: 11 },
      { name: "Kavindra", score: 14 },
      { name: "Nishani", score: 18 },
      { name: "Thilak", score: 21 },
    ],
    followups: ["Which leads are hottest this week?", "Top objections last 30 days?"],
  },
};

const QUESTIONS = Object.keys(KB);

function BI() {
  const [active, setActive] = useState(QUESTIONS[0]);
  const [draft, setDraft] = useState(QUESTIONS[0]);
  const [phase, setPhase] = useState<"thinking" | "typing" | "done">("done");
  const [typed, setTyped] = useState(KB[QUESTIONS[0]].answer);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const qa = KB[active];

  const ask = (q: string) => {
    const key = KB[q] ? q : QUESTIONS[0];
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setActive(key);
    setDraft(KB[key].question);
    setTyped("");
    setPhase("thinking");
  };

  // Thinking pause, then stream the answer in word-by-word.
  useEffect(() => {
    if (phase !== "thinking") return;
    const t = setTimeout(() => setPhase("typing"), 650);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [phase, active]);

  useEffect(() => {
    if (phase !== "typing") return;
    const words = qa.answer.split(" ");
    let i = 0;
    const tick = () => {
      i++;
      setTyped(words.slice(0, i).join(" "));
      if (i < words.length) {
        const t = setTimeout(tick, 18);
        timers.current.push(t);
      } else {
        setPhase("done");
      }
    };
    tick();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <Layout title="Business Intelligence">
      <Card className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #6C47FF 0%, #00C48C 100%)" }}>
            <Sparkles size={20} color="#fff" />
          </div>
          <div>
            <h2 className="text-[16px] font-semibold">Ask your CRM anything</h2>
            <div className="text-[13px]" style={{ color: "#6B7280" }}>
              AI-powered analytics over your leads, calls, and deals
            </div>
          </div>
        </div>
        <form
          className="relative"
          onSubmit={(e) => { e.preventDefault(); ask(draft); }}
        >
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#6B7280" }} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            className="w-full h-12 pl-11 pr-28 text-[15px] rounded-lg focus:outline-none"
            style={{ border: "1px solid #E5E7EB", background: "#F7F8FC" }}
          />
          <button
            type="submit"
            className="nc-press absolute right-2 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 h-9 rounded-md text-white"
            style={{ background: "#6C47FF", boxShadow: "0 3px 10px rgba(108,71,255,0.30)" }}
          >
            Ask <ArrowRight size={14} />
          </button>
        </form>
        <div className="flex flex-wrap gap-2 mt-4">
          {QUESTIONS.map((s) => {
            const on = s === active;
            return (
              <button
                key={s}
                onClick={() => ask(s)}
                className="nc-press text-[12px] px-3 py-1.5 rounded-full"
                style={{
                  background: on ? "#6C47FF" : "#EEE9FF",
                  color: on ? "#fff" : "#6C47FF",
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </Card>

      <Card key={active} className="nc-section">
        <div className="flex items-start justify-between mb-4">
          <div>
            <Label>Answer</Label>
            <h2 className="text-[16px] font-semibold mt-1">{qa.question}</h2>
          </div>
          <Badge bg="#DCFCE7" color="#15803D">Confidence: {qa.confidence}%</Badge>
        </div>

        {/* Confidence meter */}
        <div className="h-1.5 rounded-full mb-5" style={{ background: "#F0F1F6" }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{
              width: phase === "done" ? `${qa.confidence}%` : "8%",
              background: "linear-gradient(90deg, #6C47FF, #00C48C)",
              transitionDuration: "0.8s",
            }}
          />
        </div>

        {phase === "thinking" ? (
          <div className="flex items-center gap-2 text-[14px] mb-6" style={{ color: "#6B7280" }}>
            <Sparkles size={15} style={{ color: "#6C47FF" }} className="animate-pulse" />
            Analysing customer history…
          </div>
        ) : (
          <p className="text-[14px] leading-[1.65] mb-6">
            {typed}
            {phase === "typing" && (
              <span className="inline-block w-0.5 h-[1em] align-middle ml-0.5 animate-pulse"
                style={{ background: "#6C47FF" }} />
            )}
          </p>
        )}

        {/* Sources */}
        <div className="flex items-center gap-2 flex-wrap mb-6">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase"
            style={{ color: "#6B7280", letterSpacing: "0.05em" }}>
            <Database size={12} /> Sources
          </span>
          {qa.sources.map((src) => (
            <span key={src} className="text-[12px] px-2.5 py-1 rounded-full"
              style={{ background: "#F0F1F6", color: "#374151" }}>
              {src}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label><div className="mb-3">Breakdown</div></Label>
            <div style={{ height: 260 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={qa.chart} layout="vertical" margin={{ left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis type="number" tick={{ fontSize: 11, fill: "#6B7280" }} />
                  <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "#6B7280" }} width={70} />
                  <Tooltip />
                  <Bar dataKey="score" fill="#6C47FF" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div>
            <Label><div className="mb-3">Supporting Data</div></Label>
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ color: "#6B7280", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Value</th>
                  <th className="text-left py-2 pl-3">Signals</th>
                </tr>
              </thead>
              <tbody>
                {qa.rows.map((r, i) => (
                  <tr key={r.lead} style={{ background: i % 2 ? "#F9FAFB" : "#fff", height: 40 }}>
                    <td className="px-2 font-medium">{r.lead}</td>
                    <td className="px-2 text-right font-semibold" style={{ color: "#6C47FF" }}>{r.score}</td>
                    <td className="px-3" style={{ color: "#6B7280" }}>{r.signals}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Follow-ups */}
        <div className="mt-6 pt-5 border-t" style={{ borderColor: "#F3F4F6" }}>
          <Label><div className="mb-2">Ask a follow-up</div></Label>
          <div className="flex flex-wrap gap-2">
            {qa.followups.map((f) => (
              <button
                key={f}
                onClick={() => ask(f)}
                className="nc-press inline-flex items-center gap-1.5 text-[13px] px-3 py-2 rounded-lg"
                style={{ background: "#fff", border: "1px solid #E5E7EB", color: "#1A1A2E" }}
              >
                <Sparkles size={12} style={{ color: "#6C47FF" }} />
                {f}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </Layout>
  );
}
