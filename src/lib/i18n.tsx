import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "en" | "ta" | "si";

const dict: Record<Lang, Record<string, string>> = {
  en: {},
  ta: {
    Dashboard: "டாஷ்போர்ட்",
    Leads: "வாய்ப்புகள்",
    Pipeline: "குழாய்வழி",
    Vocalytics: "Vocalytics",
    "Coaching AI": "பயிற்சி AI",
    "Smart Calendar": "நாட்காட்டி",
    "Task Board": "பணி பலகை",
    "Mail Agent": "மெயில் ஏஜெண்ட்",
    "Mail Mind": "மெயில் மைண்ட்",
    "Business Intelligence": "வணிக நுண்ணறிவு",
    Rules: "விதிகள்",
    Settings: "அமைப்புகள்",
    Tasks: "பணிகள்",
    Calendar: "நாட்காட்டி",
    Save: "சேமி",
    Cancel: "ரத்து செய்",
    "Add Lead": "வாய்ப்பு சேர்க்கவும்",
    Search: "தேடு",
    Filter: "வடிகட்டி",
    "Import Leads": "வாய்ப்புகள் இறக்கு",
    "Schedule Meeting": "சந்திப்பு திட்டமிடு",
    "Create Rule": "விதி உருவாக்கு",
    "Invite User": "பயனரை அழை",
    Status: "நிலை",
    Source: "மூலம்",
    Name: "பெயர்",
    Phone: "தொலைபேசி",
    Email: "மின்னஞ்சல்",
    "Assigned To": "ஒதுக்கப்பட்டது",
    Created: "உருவாக்கப்பட்டது",
    Actions: "செயல்கள்",
  },
  si: {
    Dashboard: "උපකරණ පුවරුව",
    Leads: "අලෙවි අවස්ථා",
    Pipeline: "නල මාර්ගය",
    Vocalytics: "Vocalytics",
    "Coaching AI": "පුහුණු AI",
    "Smart Calendar": "දිනදර්ශනය",
    "Task Board": "කාර්ය පුවරුව",
    "Mail Agent": "තැපැල් නියෝජිත",
    "Mail Mind": "මේල් මයින්ඩ්",
    "Business Intelligence": "ව්‍යාපාර බුද්ධිය",
    Rules: "නීති",
    Settings: "සැකසීම්",
    Tasks: "කාර්යයන්",
    Calendar: "දිනදර්ශනය",
    Save: "සුරකින්න",
    Cancel: "අවලංගු කරන්න",
    "Add Lead": "අලෙවි අවස්ථාව එකතු කරන්න",
    Search: "සොයන්න",
    Filter: "පෙරහන",
    "Import Leads": "අවස්ථා ආයාත කරන්න",
    "Schedule Meeting": "හමුව සැලසුම් කරන්න",
    "Create Rule": "නීති සාදන්න",
    "Invite User": "පරිශීලකයෙකු ආරාධනා කරන්න",
    Status: "තත්ත්වය",
    Source: "මූලය",
    Name: "නම",
    Phone: "දුරකථන",
    Email: "ඊමේල්",
    "Assigned To": "පවරා ඇත",
    Created: "සාදන ලද",
    Actions: "ක්‍රියා",
  },
};

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (s: string) => string }>({
  lang: "en", setLang: () => {}, t: (s) => s,
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const t = (s: string) => dict[lang][s] ?? s;
  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
