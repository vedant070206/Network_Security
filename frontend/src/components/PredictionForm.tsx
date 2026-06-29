import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Info, Link2, ShieldCheck, MousePointerClick, BarChart3 } from "lucide-react";
import ScanningLoader from "./ScanningLoader";
import ResultPanel, { type PredictionResult } from "./ResultPanel";
import { API_URL } from "@/lib/links";

type FeatureKey =
  | "having_IP_Address"
  | "URL_Length"
  | "Shortining_Service"
  | "having_At_Symbol"
  | "double_slash_redirecting"
  | "Prefix_Suffix"
  | "having_Sub_Domain"
  | "SSLfinal_State"
  | "Domain_registeration_length"
  | "Favicon"
  | "port"
  | "HTTPS_token"
  | "Request_URL"
  | "URL_of_Anchor"
  | "Links_in_tags"
  | "SFH"
  | "Submitting_to_email"
  | "Abnormal_URL"
  | "Redirect"
  | "on_mouseover"
  | "RightClick"
  | "popUpWidnow"
  | "Iframe"
  | "age_of_domain"
  | "DNSRecord"
  | "web_traffic"
  | "Page_Rank"
  | "Google_Index"
  | "Links_pointing_to_page"
  | "Statistical_report";

interface Option {
  label: string;
  value: number;
}

interface Field {
  key: FeatureKey;
  label: string;
  tip: string;
  options: Option[];
  default: number;
}

interface Group {
  title: string;
  description: string;
  icon: any;
  fields: Field[];
}

// Standard option presets
const YES_NO_SAFE_YES: Option[] = [
  { label: "No", value: 1 },
  { label: "Yes", value: -1 },
];
const YES_NO_SAFE_NO: Option[] = [
  { label: "Yes", value: 1 },
  { label: "No", value: -1 },
];
const SHORT_MED_LONG: Option[] = [
  { label: "Short", value: 1 },
  { label: "Medium", value: 0 },
  { label: "Long", value: -1 },
];
const NONE_ONE_MANY: Option[] = [
  { label: "None", value: 1 },
  { label: "One", value: 0 },
  { label: "Many", value: -1 },
];
const SSL: Option[] = [
  { label: "Trusted", value: 1 },
  { label: "Suspicious", value: 0 },
  { label: "Invalid", value: -1 },
];
const LONG_SHORT: Option[] = [
  { label: "Long-term", value: 1 },
  { label: "Short-term", value: -1 },
];
const SAFE_MIXED_RISKY: Option[] = [
  { label: "Safe", value: 1 },
  { label: "Mixed", value: 0 },
  { label: "Risky", value: -1 },
];
const LOW_MED_HIGH: Option[] = [
  { label: "Low", value: 1 },
  { label: "Medium", value: 0 },
  { label: "High", value: -1 },
];
const HIGH_MED_LOW_TRAFFIC: Option[] = [
  { label: "High", value: 1 },
  { label: "Medium", value: 0 },
  { label: "Low", value: -1 },
];
const FEW_SOME_MANY: Option[] = [
  { label: "Many", value: 1 },
  { label: "Some", value: 0 },
  { label: "Few", value: -1 },
];

const GROUPS: Group[] = [
  {
    title: "URL Structure",
    description: "How the address itself looks.",
    icon: Link2,
    fields: [
      { key: "having_IP_Address", label: "Uses an IP Address instead of a domain", tip: "e.g. http://192.168.1.10/login", options: YES_NO_SAFE_YES, default: 1 },
      { key: "URL_Length", label: "URL Length", tip: "Phishing URLs tend to be very long", options: SHORT_MED_LONG, default: 1 },
      { key: "Shortining_Service", label: "Uses a URL shortener", tip: "bit.ly, tinyurl, etc.", options: YES_NO_SAFE_YES, default: 1 },
      { key: "having_At_Symbol", label: "Contains an @ symbol", tip: "Browsers ignore text before '@'", options: YES_NO_SAFE_YES, default: 1 },
      { key: "double_slash_redirecting", label: "Has '//' redirect after the protocol", tip: "Suspicious redirect pattern", options: YES_NO_SAFE_YES, default: 1 },
      { key: "Prefix_Suffix", label: "Domain contains a hyphen (-)", tip: "e.g. paypal-secure.com", options: YES_NO_SAFE_YES, default: 1 },
      { key: "having_Sub_Domain", label: "Number of sub-domains", tip: "Many sub-domains can be suspicious", options: NONE_ONE_MANY, default: 1 },
      { key: "HTTPS_token", label: "Has 'https' inside the domain text", tip: "e.g. https-paypal.com — a known trick", options: YES_NO_SAFE_YES, default: 1 },
    ],
  },
  {
    title: "Domain & SSL",
    description: "Certificate, registration and DNS signals.",
    icon: ShieldCheck,
    fields: [
      { key: "SSLfinal_State", label: "SSL Certificate", tip: "Is the certificate trusted by browsers?", options: SSL, default: 1 },
      { key: "Domain_registeration_length", label: "Domain Registration Length", tip: "Long-term registration looks more legitimate", options: LONG_SHORT, default: 1 },
      { key: "Favicon", label: "Favicon loaded from same domain", tip: "Phishing pages often borrow favicons", options: YES_NO_SAFE_NO, default: 1 },
      { key: "port", label: "Uses standard ports only", tip: "Unusual open ports are suspicious", options: YES_NO_SAFE_NO, default: 1 },
      { key: "age_of_domain", label: "Domain older than 6 months", tip: "Fresh domains are more often phishing", options: YES_NO_SAFE_NO, default: 1 },
      { key: "DNSRecord", label: "Valid DNS record present", tip: "Missing DNS records are a red flag", options: YES_NO_SAFE_NO, default: 1 },
      { key: "Abnormal_URL", label: "URL matches WHOIS identity", tip: "Mismatch suggests impersonation", options: YES_NO_SAFE_NO, default: 1 },
    ],
  },
  {
    title: "Page Behavior",
    description: "What the page does when you interact with it.",
    icon: MousePointerClick,
    fields: [
      { key: "Request_URL", label: "External resources usage", tip: "Images/scripts loaded from other domains", options: SAFE_MIXED_RISKY, default: 1 },
      { key: "URL_of_Anchor", label: "Anchor link behavior", tip: "Where the page's links actually point", options: SAFE_MIXED_RISKY, default: 1 },
      { key: "Links_in_tags", label: "Links inside meta/script/link tags", tip: "Suspicious tag usage", options: SAFE_MIXED_RISKY, default: 1 },
      { key: "SFH", label: "Form submission target", tip: "Where the page sends form data", options: SAFE_MIXED_RISKY, default: 1 },
      { key: "Submitting_to_email", label: "Form posts data to an email", tip: "mailto: form action", options: YES_NO_SAFE_YES, default: 1 },
      { key: "Redirect", label: "Number of redirects", tip: "Many redirects can be suspicious", options: LOW_MED_HIGH, default: 1 },
      { key: "on_mouseover", label: "Changes status bar on hover", tip: "Hides the real link", options: YES_NO_SAFE_YES, default: 1 },
      { key: "RightClick", label: "Right-click disabled", tip: "Often used to hide source", options: YES_NO_SAFE_YES, default: 1 },
      { key: "popUpWidnow", label: "Popup window asks for input", tip: "Popups requesting credentials", options: YES_NO_SAFE_YES, default: 1 },
      { key: "Iframe", label: "Uses invisible iframes", tip: "Hidden iframe overlays", options: YES_NO_SAFE_YES, default: 1 },
    ],
  },
  {
    title: "Reputation Signals",
    description: "How the wider web sees this site.",
    icon: BarChart3,
    fields: [
      { key: "web_traffic", label: "Web Traffic", tip: "Popularity ranking of the site", options: HIGH_MED_LOW_TRAFFIC, default: 1 },
      { key: "Page_Rank", label: "Page Rank", tip: "Search engine authority", options: [{ label: "High", value: 1 }, { label: "Low", value: -1 }], default: 1 },
      { key: "Google_Index", label: "Indexed by Google", tip: "Phishing pages are rarely indexed", options: [{ label: "Indexed", value: 1 }, { label: "Not indexed", value: -1 }], default: 1 },
      { key: "Links_pointing_to_page", label: "Inbound links to the page", tip: "Backlinks from other sites", options: FEW_SOME_MANY, default: 1 },
      { key: "Statistical_report", label: "Listed in known phishing reports", tip: "Appears in threat-intel feeds", options: YES_NO_SAFE_YES, default: 1 },
    ],
  },
];

const ALL_FIELDS: Field[] = GROUPS.flatMap((g) => g.fields);
const DEFAULTS = ALL_FIELDS.reduce((acc, f) => {
  acc[f.key] = f.default;
  return acc;
}, {} as Record<FeatureKey, number>);

export default function PredictionForm() {
  const [form, setForm] = useState<Record<FeatureKey, number>>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (k: FeatureKey, v: number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`${API_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ features: form }),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = (await res.json()) as PredictionResult;
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? "Unable to reach the prediction API. Make sure the backend is running on localhost:8000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="detect" className="container mx-auto px-6 py-20">
      <SectionHeader
        eyebrow="Live Analysis"
        title="Run a Phishing Detection"
        subtitle="Answer a few simple questions about the website. We translate your answers into ML signals automatically."
      />

      <div className="grid lg:grid-cols-5 gap-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong p-6 md:p-8 lg:col-span-3"
        >
          <div className="space-y-8 max-h-[680px] overflow-y-auto pr-2">
            {GROUPS.map((group) => (
              <GroupBlock key={group.title} group={group} form={form} onChange={update} />
            ))}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-blue-glow text-primary-foreground font-semibold glow-blue hover:scale-[1.01] transition-transform disabled:opacity-50"
          >
            <Scan className="size-5" />
            {loading ? "Analyzing…" : "Scan Website"}
          </button>
          {error && <p className="mt-4 text-sm text-cyber-red text-center">{error}</p>}
        </motion.div>

        <div className="lg:col-span-2">
          {loading && <ScanningLoader />}
          {!loading && result && <ResultPanel result={result} />}
          {!loading && !result && (
            <div className="glass p-8 h-full min-h-[420px] flex flex-col items-center justify-center text-center">
              <Scan className="size-12 text-cyber-blue mb-4 opacity-70" />
              <h3 className="font-semibold text-lg">Awaiting analysis</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Fill in the four sections and click <span className="text-cyber-blue">Scan Website</span> to run the ML model.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function GroupBlock({
  group,
  form,
  onChange,
}: {
  group: Group;
  form: Record<FeatureKey, number>;
  onChange: (k: FeatureKey, v: number) => void;
}) {
  const Icon = group.icon;
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-start gap-3 mb-4">
        <div className="size-9 rounded-lg bg-cyber-blue/10 border border-cyber-blue/30 flex items-center justify-center shrink-0">
          <Icon className="size-4 text-cyber-blue" />
        </div>
        <div>
          <h3 className="font-semibold">{group.title}</h3>
          <p className="text-xs text-muted-foreground">{group.description}</p>
        </div>
      </div>
      <div className="space-y-4">
        {group.fields.map((f) => (
          <FieldRow key={f.key} field={f} value={form[f.key]} onChange={(v) => onChange(f.key, v)} />
        ))}
      </div>
    </div>
  );
}

function FieldRow({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <div className="flex items-center gap-1.5 min-w-0">
        <label className="text-sm">{field.label}</label>
        <span title={field.tip} className="text-muted-foreground cursor-help shrink-0">
          <Info className="size-3.5" />
        </span>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/5 border border-white/10 w-full sm:w-auto">
        {field.options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 sm:flex-none px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                active
                  ? "bg-cyber-blue text-primary-foreground shadow-[0_0_12px_oklch(0.78_0.18_220/40%)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function SectionHeader({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-2xl mx-auto">
      <p className="text-xs uppercase tracking-[0.25em] text-cyber-blue">{eyebrow}</p>
      <h2 className="text-3xl md:text-4xl font-bold mt-3 text-gradient">{title}</h2>
      {subtitle && <p className="text-muted-foreground mt-3">{subtitle}</p>}
    </div>
  );
}
