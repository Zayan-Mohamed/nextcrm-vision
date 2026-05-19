// Dummy data for Next CRM prototype (Sri Lankan context, LKR currency).

export const SL_NAMES = [
  "Pradeep Silva", "Amara Perera", "Kavindra Fernando", "Nishani Wickramasinghe",
  "Thilak Jayawardena", "Sachini Rathnayake", "Ruwan Bandara", "Dilani Senanayake",
  "Chamara Dissanayake", "Nethmi Gunasekara", "Asanka Mendis", "Hashini Karunaratne",
  "Lalith Abeysekera", "Tharindu Liyanage", "Manori De Silva",
];

export const COMPANIES = [
  "Ceylon Tech (Pvt) Ltd", "Lanka Logistics", "Colombo Holdings", "Kandy Spice Co.",
  "Galle Marine", "Hela Apparel", "Serendib Finance", "Aitken Spence",
  "Dialog Axiata", "MAS Holdings", "Brandix", "Hayleys Group",
];

export const SOURCES = ["Facebook", "Google", "Landing Page", "API", "Manual"];
export const STATUSES = ["New", "Contacted", "Qualified", "Proposal", "Closed"] as const;
export type Status = typeof STATUSES[number];

export const statusStyle: Record<Status, { bg: string; color: string }> = {
  New:        { bg: "#E0F2FE", color: "#0369A1" },
  Contacted:  { bg: "#FEF9C3", color: "#854D0E" },
  Qualified:  { bg: "#DCFCE7", color: "#15803D" },
  Proposal:   { bg: "#F3E8FF", color: "#7E22CE" },
  Closed:     { bg: "#D1FAE5", color: "#065F46" },
};

const phone = (i: number) => `+94 77 ${100 + i} ${String(1000 + i * 7).slice(-4)}`;
const email = (name: string) =>
  name.toLowerCase().replace(/\s+/g, ".") + "@" + ["gmail.com", "outlook.com", "dialog.lk", "lanka.com"][name.length % 4];

export const LEADS = Array.from({ length: 15 }, (_, i) => {
  const name = SL_NAMES[i % SL_NAMES.length];
  return {
    id: `L-${1001 + i}`,
    name,
    phone: phone(i),
    email: email(name),
    source: SOURCES[i % SOURCES.length],
    status: STATUSES[i % STATUSES.length] as Status,
    assignedTo: SL_NAMES[(i + 3) % SL_NAMES.length],
    created: `2026-05-${String(((i * 2) % 18) + 1).padStart(2, "0")}`,
    company: COMPANIES[i % COMPANIES.length],
    value: 50000 + (i * 37) * 1000,
    days: (i * 3) % 14,
  };
});

export const KPIS = [
  { label: "Total Leads", value: "1,284", delta: "+8.2%" },
  { label: "Active Deals", value: "342", delta: "+4.1%" },
  { label: "Calls Today", value: "47", delta: "+12%" },
  { label: "Revenue Pipeline", value: "LKR 48.2M", delta: "+6.5%" },
  { label: "Conversion Rate", value: "18.4%", delta: "+1.2%" },
  { label: "Avg Deal Size", value: "LKR 141K", delta: "+3.0%" },
];

export const LEADS_30D = Array.from({ length: 30 }, (_, i) => ({
  day: `D${i + 1}`,
  leads: Math.round(20 + 18 * Math.sin(i / 3) + (i % 5) * 4 + 10),
}));

export const PIPELINE_BARS = STATUSES.map((s, i) => ({
  stage: s,
  deals: [42, 31, 28, 19, 12][i],
}));

export const ACTIVITY = [
  { type: "call",  who: "Pradeep Silva",       text: "Outbound call · 8m 12s",          time: "2m ago" },
  { type: "email", who: "Amara Perera",         text: "Replied to proposal",              time: "14m ago" },
  { type: "task",  who: "Kavindra Fernando",    text: "Created follow-up task",           time: "1h ago" },
  { type: "call",  who: "Nishani Wickramasinghe", text: "Missed call",                    time: "2h ago" },
  { type: "email", who: "Thilak Jayawardena",   text: "Opened campaign email",            time: "3h ago" },
  { type: "task",  who: "Sachini Rathnayake",   text: "Task marked Done",                 time: "4h ago" },
  { type: "call",  who: "Ruwan Bandara",        text: "Inbound call · 4m 02s",            time: "5h ago" },
  { type: "email", who: "Dilani Senanayake",    text: "Clicked pricing link",             time: "6h ago" },
];

export const TOP_REPS = [
  { name: "Pradeep Silva",       calls: 84, closed: 12, revenue: "LKR 6.4M" },
  { name: "Amara Perera",        calls: 71, closed: 10, revenue: "LKR 5.1M" },
  { name: "Kavindra Fernando",   calls: 65, closed:  9, revenue: "LKR 4.8M" },
  { name: "Nishani Wickramasinghe", calls: 60, closed: 8, revenue: "LKR 4.2M" },
  { name: "Thilak Jayawardena",  calls: 54, closed:  7, revenue: "LKR 3.7M" },
];

// Pipeline (Kanban) -------------------------------------------------------
const stageCounts: Record<Status, number> = { New: 8, Contacted: 6, Qualified: 5, Proposal: 4, Closed: 3 };
export const PIPELINE_CARDS: Record<Status, Array<{
  id: string; name: string; company: string; value: number; rep: string; days: number;
}>> = Object.fromEntries(
  STATUSES.map((s) => [
    s,
    Array.from({ length: stageCounts[s] }, (_, i) => ({
      id: `${s}-${i}`,
      name: SL_NAMES[(STATUSES.indexOf(s) * 5 + i) % SL_NAMES.length],
      company: COMPANIES[(STATUSES.indexOf(s) * 3 + i) % COMPANIES.length],
      value: 75000 + i * 42000 + STATUSES.indexOf(s) * 30000,
      rep: SL_NAMES[(i + 2) % SL_NAMES.length],
      days: (i + 1) * 2,
    })),
  ])
) as any;

// Vocalytics --------------------------------------------------------------
export const CALL_LOG = Array.from({ length: 8 }, (_, i) => ({
  id: `C-${i + 1}`,
  caller: SL_NAMES[i % SL_NAMES.length],
  phone: phone(i + 10),
  duration: `${4 + i}m ${10 + i * 3}s`,
  when: `2026-05-19 ${10 + i}:${String(15 + i).padStart(2, "0")}`,
  status: (["Transcribed", "Analysed", "Pending"] as const)[i % 3],
}));

export const TRANSCRIPT = [
  { who: "Agent",    text: "Good morning Pradeep, this is Amara from Next CRM. How are you today?" },
  { who: "Customer", text: "Doing well, thanks. I was hoping to get a quick walkthrough of pricing." },
  { who: "Agent",    text: "Of course. Could you tell me how many seats you'd be onboarding?" },
  { who: "Customer", text: "We're a 25-person sales team, expanding to 40 by Q3." },
  { who: "Agent",    text: "Got it. Our growth tier covers up to 50 seats and includes Vocalytics." },
  { who: "Customer", text: "What's the cost in LKR? And do you do annual billing?" },
  { who: "Agent",    text: "Annual works out to LKR 9,500 per seat per month. 15% discount included." },
  { who: "Customer", text: "Reasonable. Send me a proposal, we'll review this week." },
  { who: "Agent",    text: "I'll have it in your inbox within the hour. Thank you, Pradeep." },
];

// Coaching ----------------------------------------------------------------
export const COACH_TEAM = TOP_REPS.map((r, i) => ({
  name: r.name,
  callScore: 92 - i * 4,
  objection: 88 - i * 5,
  empathy: 90 - i * 3,
  ratio: `${40 + i * 2} / ${60 - i * 2}`,
  improve: ["Open-ended Qs", "Pricing pushback", "Active listening", "Recap clarity", "Discovery depth"][i],
}));

export const COACH_RADAR = [
  { axis: "Questioning",        score: 82 },
  { axis: "Empathy",            score: 90 },
  { axis: "Closing",            score: 74 },
  { axis: "Product Knowledge",  score: 88 },
  { axis: "Objection Handling", score: 71 },
];

// Calendar ----------------------------------------------------------------
export const MEETINGS: Record<number, { type: string; lead: string; time: string }> = {
  3: { type: "Demo",     lead: "Pradeep Silva",    time: "10:00" },
  5: { type: "Follow-up",lead: "Amara Perera",     time: "14:30" },
  7: { type: "Call",     lead: "Kavindra Fernando",time: "09:00" },
  9: { type: "Demo",     lead: "Nishani W.",       time: "11:15" },
  11:{ type: "Proposal", lead: "Thilak J.",        time: "16:00" },
  13:{ type: "Call",     lead: "Sachini R.",       time: "10:30" },
  15:{ type: "Demo",     lead: "Ruwan Bandara",    time: "13:00" },
  18:{ type: "Follow-up",lead: "Dilani S.",        time: "15:30" },
  20:{ type: "Call",     lead: "Chamara D.",       time: "09:45" },
  22:{ type: "Demo",     lead: "Nethmi G.",        time: "11:00" },
  25:{ type: "Proposal", lead: "Asanka Mendis",    time: "14:00" },
  28:{ type: "Call",     lead: "Hashini K.",       time: "16:30" },
};

export const TODAY_AGENDA = [
  { time: "09:00", type: "Call",      lead: "Kavindra Fernando" },
  { time: "10:30", type: "Demo",      lead: "Pradeep Silva" },
  { time: "12:00", type: "Follow-up", lead: "Amara Perera" },
  { time: "14:00", type: "Proposal",  lead: "Thilak Jayawardena" },
  { time: "16:30", type: "Call",      lead: "Sachini Rathnayake" },
];

// Tasks -------------------------------------------------------------------
type Prio = "High" | "Medium" | "Low";
const mkTask = (title: string, lead: string, prio: Prio, due: string, who: string) =>
  ({ title, lead, prio, due, who });
export const TASKS = {
  "To Do": [
    mkTask("Send pricing proposal", "Pradeep Silva", "High",   "May 20", "AP"),
    mkTask("Follow up on demo",     "Amara Perera",  "Medium", "May 21", "KF"),
    mkTask("Qualify new lead",      "Nethmi G.",     "Low",    "May 22", "RB"),
    mkTask("Prepare deck",          "Ruwan Bandara", "Medium", "May 23", "AP"),
    mkTask("Call back Dilani",      "Dilani S.",     "High",   "May 20", "TJ"),
  ],
  "In Progress": [
    mkTask("Negotiate contract",    "Thilak J.",     "High",   "May 19", "AP"),
    mkTask("Demo prep",             "Sachini R.",    "Medium", "May 20", "KF"),
    mkTask("Custom quote",          "Chamara D.",    "High",   "May 21", "AP"),
    mkTask("Tech eval",             "Asanka Mendis", "Low",    "May 23", "RB"),
  ],
  "Awaiting Response": [
    mkTask("Awaiting signed MSA",   "Hashini K.",    "High",   "May 22", "AP"),
    mkTask("Awaiting POC results",  "Lalith A.",     "Medium", "May 24", "TJ"),
    mkTask("Awaiting budget approval","Tharindu L.", "Low",    "May 26", "KF"),
  ],
  "Done": [
    mkTask("Sent welcome kit",      "Pradeep Silva", "Low",    "May 18", "AP"),
    mkTask("Closed deal",           "Manori D.",     "High",   "May 17", "AP"),
    mkTask("Demo delivered",        "Nishani W.",    "Medium", "May 17", "KF"),
    mkTask("Onboarding done",       "Ruwan Bandara", "Low",    "May 16", "RB"),
    mkTask("Renewal signed",        "Thilak J.",     "High",   "May 15", "AP"),
    mkTask("Discovery call",        "Sachini R.",    "Medium", "May 15", "TJ"),
  ],
} as const;

// Mail Agent --------------------------------------------------------------
export const CAMPAIGNS = [
  { name: "Q2 Outbound · SMB",       status: "Active", leads: 240, open: "45%", click: "14%", created: "2026-04-22" },
  { name: "Demo Follow-up Sequence", status: "Active", leads: 132, open: "52%", click: "21%", created: "2026-04-10" },
  { name: "Re-engagement",           status: "Paused", leads: 88,  open: "31%", click:  "8%", created: "2026-03-28" },
  { name: "Spring Promotion",        status: "Draft",  leads: 0,   open:  "–",  click:  "–",  created: "2026-05-15" },
  { name: "Enterprise ABM",          status: "Active", leads: 42,  open: "61%", click: "27%", created: "2026-02-14" },
];

// Mail Mind ---------------------------------------------------------------
export const MAIL_MIND_CAMPAIGNS = [
  { name: "Cold outreach – Apparel",     replies: 14, open: "48%", status: "Running" },
  { name: "Cold outreach – Logistics",   replies: 9,  open: "41%", status: "Running" },
  { name: "Re-activation",               replies: 22, open: "57%", status: "Completed" },
  { name: "Event invite – CEO Roundtable", replies: 6, open: "52%", status: "Running" },
  { name: "Pricing follow-up",           replies: 11, open: "44%", status: "Paused" },
];
export const UNSUBSCRIBED = [
  { name: "Ravi Kumar",    email: "ravi@example.com",     when: "2026-05-15" },
  { name: "Anjali Perera", email: "anjali@example.lk",    when: "2026-05-14" },
  { name: "Suresh M.",     email: "suresh@hela.lk",       when: "2026-05-13" },
  { name: "Dinesh F.",     email: "dinesh@brandix.com",   when: "2026-05-11" },
];

// Rules -------------------------------------------------------------------
export const RULES = [
  { trigger: "Lead created",          condition: "Source = Facebook", action: "Assign to Amara",   on: true,  last: "2h ago" },
  { trigger: "Call ended",            condition: "Duration > 5m",     action: "Create follow-up",  on: true,  last: "1h ago" },
  { trigger: "Email opened ≥ 3x",     condition: "–",                  action: "Tag as Hot",        on: true,  last: "30m ago" },
  { trigger: "Deal stalled 7 days",   condition: "Stage = Proposal",  action: "Notify manager",    on: false, last: "Yesterday" },
  { trigger: "Form submitted",        condition: "Page = /pricing",   action: "Send pricing PDF",  on: true,  last: "10m ago" },
  { trigger: "Unsubscribe",           condition: "–",                  action: "Mark Do Not Email", on: true,  last: "3h ago" },
];

// Settings ----------------------------------------------------------------
export const USERS = [
  { name: "Pradeep Silva",      email: "pradeep@nextcrm.lk",   role: "Admin",   status: "Active",   last: "Just now" },
  { name: "Amara Perera",       email: "amara@nextcrm.lk",     role: "Manager", status: "Active",   last: "5m ago" },
  { name: "Kavindra Fernando",  email: "kavindra@nextcrm.lk",  role: "Agent",   status: "Active",   last: "12m ago" },
  { name: "Nishani Wickramasinghe", email: "nishani@nextcrm.lk", role: "Agent", status: "Active",   last: "1h ago" },
  { name: "Thilak Jayawardena", email: "thilak@nextcrm.lk",    role: "Manager", status: "Active",   last: "3h ago" },
  { name: "Sachini Rathnayake", email: "sachini@nextcrm.lk",   role: "Agent",   status: "Inactive", last: "2d ago" },
  { name: "Ruwan Bandara",      email: "ruwan@nextcrm.lk",     role: "Agent",   status: "Active",   last: "20m ago" },
  { name: "Dilani Senanayake",  email: "dilani@nextcrm.lk",    role: "Agent",   status: "Active",   last: "45m ago" },
];

export const INTEGRATIONS = [
  { name: "Twilio",            connected: true  },
  { name: "Aircall",           connected: false },
  { name: "Zoom Phone",        connected: false },
  { name: "SendGrid",          connected: true  },
  { name: "Meta Ads",          connected: true  },
  { name: "Google Ads",        connected: false },
  { name: "WhatsApp Business", connected: false },
];

// BI ----------------------------------------------------------------------
export const BI_SAMPLE = {
  question: "Which leads are hottest this week?",
  answer:
    "Based on engagement signals (email opens, call durations, pricing-page visits) over the last 7 days, 6 leads stand out. Pradeep Silva and Amara Perera both visited the pricing page 3+ times and engaged on calls longer than 8 minutes. Recommend prioritizing outreach within the next 24 hours.",
  rows: [
    { lead: "Pradeep Silva",       score: 94, signals: "3 pricing visits, 12m call, opened proposal" },
    { lead: "Amara Perera",        score: 91, signals: "Replied to 2 emails, 9m demo" },
    { lead: "Thilak Jayawardena",  score: 87, signals: "Booked demo, opened 4 emails" },
    { lead: "Kavindra Fernando",   score: 82, signals: "Pricing page x2" },
    { lead: "Nishani Wickramasinghe", score: 78, signals: "Replied positively, asked for ROI" },
    { lead: "Sachini Rathnayake",  score: 74, signals: "Returned to /features 3x" },
  ],
  chart: [
    { name: "Pradeep", score: 94 },
    { name: "Amara",   score: 91 },
    { name: "Thilak",  score: 87 },
    { name: "Kavindra",score: 82 },
    { name: "Nishani", score: 78 },
    { name: "Sachini", score: 74 },
  ],
};
