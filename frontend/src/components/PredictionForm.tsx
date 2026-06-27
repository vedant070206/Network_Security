import { useState } from "react";
import { motion } from "framer-motion";
import { Scan, Info } from "lucide-react";
import ScanningLoader from "./ScanningLoader";
import ResultPanel, { type PredictionResult } from "./ResultPanel";
import { API_URL } from "@/lib/links";

type FieldType = "binary" | "ternary" | "number";

interface Field {
  key: keyof FormState;
  label: string;
  tip: string;
  type: FieldType;
}

interface FormState {
  url_length: number;
  having_ip_address: number;
  prefix_suffix: number;
  ssl_state: number;
  dns_record: number;
  request_url: number;
  url_of_anchor: number;
  sfh: number;
  web_traffic: number;
  google_index: number;
  statistical_report: number;
}

const FIELDS: Field[] = [
  { key: "url_length", label: "URL Length", tip: "Length of the website URL in characters", type: "number" },
  { key: "having_ip_address", label: "Having IP Address", tip: "Does the URL contain a raw IP instead of a domain?", type: "binary" },
  { key: "prefix_suffix", label: "Prefix / Suffix", tip: "Does the domain contain a '-' separator? (common in phishing)", type: "binary" },
  { key: "ssl_state", label: "SSL State", tip: "Trusted (1), Suspicious (0), or Invalid (-1)", type: "ternary" },
  { key: "dns_record", label: "DNS Record", tip: "Is a valid DNS record present?", type: "binary" },
  { key: "request_url", label: "Request URL", tip: "Are external resources loaded from suspicious domains?", type: "ternary" },
  { key: "url_of_anchor", label: "URL of Anchor", tip: "Ratio of anchor tags pointing to external/invalid URLs", type: "ternary" },
  { key: "sfh", label: "SFH (Server Form Handler)", tip: "Where forms submit data — empty/external is suspicious", type: "ternary" },
  { key: "web_traffic", label: "Web Traffic", tip: "Alexa-style traffic rank: high (1), medium (0), low (-1)", type: "ternary" },
  { key: "google_index", label: "Google Index", tip: "Is the site indexed by Google?", type: "binary" },
  { key: "statistical_report", label: "Statistical Report", tip: "Listed in known phishing reports?", type: "binary" },
];

const DEFAULTS: FormState = {
  url_length: 54, having_ip_address: 0, prefix_suffix: 0, ssl_state: 1, dns_record: 1,
  request_url: 1, url_of_anchor: 1, sfh: 1, web_traffic: 1, google_index: 1, statistical_report: 0,
};

export default function PredictionForm() {
  const [form, setForm] = useState<FormState>(DEFAULTS);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (k: keyof FormState, v: number) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`API error ${res.status}`);
      const data = (await res.json()) as PredictionResult;
      setResult(data);
    } catch (e: any) {
      setError(e.message ?? "Unable to reach the prediction API. Make sure Flask is running on localhost:5000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="detect" className="container mx-auto px-6 py-20">
      <SectionHeader eyebrow="Live Analysis" title="Run a Phishing Detection" subtitle="Provide the ML features extracted from the website to get an instant prediction." />

      <div className="grid lg:grid-cols-5 gap-8 mt-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong p-6 md:p-8 lg:col-span-3"
        >
          <div className="grid sm:grid-cols-2 gap-5">
            {FIELDS.map((f) => (
              <FieldInput key={f.key} field={f} value={form[f.key]} onChange={(v) => update(f.key, v)} />
            ))}
          </div>

          <button
            onClick={submit}
            disabled={loading}
            className="mt-8 w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-blue-glow text-primary-foreground font-semibold glow-blue hover:scale-[1.01] transition-transform disabled:opacity-50"
          >
            <Scan className="size-5" />
            {loading ? "Analyzing…" : "Analyze Website"}
          </button>
          {error && (
            <p className="mt-4 text-sm text-cyber-red text-center">{error}</p>
          )}
        </motion.div>

        <div className="lg:col-span-2">
          {loading && <ScanningLoader />}
          {!loading && result && <ResultPanel result={result} />}
          {!loading && !result && (
            <div className="glass p-8 h-full min-h-[420px] flex flex-col items-center justify-center text-center">
              <Scan className="size-12 text-cyber-blue mb-4 opacity-70" />
              <h3 className="font-semibold text-lg">Awaiting analysis</h3>
              <p className="text-sm text-muted-foreground mt-2 max-w-xs">
                Configure the feature values and click <span className="text-cyber-blue">Analyze Website</span> to run the ML model.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function FieldInput({ field, value, onChange }: { field: Field; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5">
        <label className="text-sm font-medium">{field.label}</label>
        <span title={field.tip} className="text-muted-foreground cursor-help">
          <Info className="size-3.5" />
        </span>
      </div>
      {field.type === "number" ? (
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyber-blue/60 focus:outline-none focus:ring-2 focus:ring-cyber-blue/30 transition-all"
        />
      ) : (
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 focus:border-cyber-blue/60 focus:outline-none focus:ring-2 focus:ring-cyber-blue/30 transition-all"
        >
          {field.type === "binary" ? (
            <>
              <option value={1}>Yes (1)</option>
              <option value={0}>No (0)</option>
            </>
          ) : (
            <>
              <option value={1}>Legitimate (1)</option>
              <option value={0}>Suspicious (0)</option>
              <option value={-1}>Phishing (-1)</option>
            </>
          )}
        </select>
      )}
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
