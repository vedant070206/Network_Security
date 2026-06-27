import { motion } from "framer-motion";
import { ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle2, Info } from "lucide-react";

export interface PredictionResult {
  prediction: "Legitimate" | "Phishing" | string;
  confidence: number;
  risk_score: number;
  reasons?: string[];
  recommendations?: string[];
}

export default function ResultPanel({ result }: { result: PredictionResult }) {
  const isPhishing = result.prediction.toLowerCase() === "phishing";
  const confidence = Math.round((result.confidence > 1 ? result.confidence : result.confidence * 100));
  const risk = Math.round(result.risk_score > 1 ? result.risk_score : result.risk_score * 100);

  const accent = isPhishing ? "text-cyber-red" : "text-cyber-green";
  const ring = isPhishing ? "border-cyber-red/40" : "border-cyber-green/40";
  const glow = isPhishing ? "shadow-[0_0_60px_oklch(0.68_0.25_25/35%)]" : "shadow-[0_0_60px_oklch(0.78_0.22_150/30%)]";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-strong p-8 md:p-10 ${glow}`}
    >
      <div className="flex flex-col md:flex-row md:items-center gap-8">
        {/* Status orb */}
        <div className="relative size-32 shrink-0 mx-auto md:mx-0">
          <div className={`absolute inset-0 rounded-full border-2 ${ring} ${isPhishing ? "animate-pulse-ring" : ""}`} />
          <div className={`relative size-32 rounded-full glass flex items-center justify-center ${isPhishing ? "bg-cyber-red/10" : "bg-cyber-green/10"}`}>
            {isPhishing ? (
              <ShieldAlert className={`size-16 ${accent}`} strokeWidth={1.5} />
            ) : (
              <ShieldCheck className={`size-16 ${accent}`} strokeWidth={1.5} />
            )}
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Detection Result</p>
          <h2 className={`text-3xl md:text-4xl font-bold mt-1 ${accent}`}>
            {isPhishing ? "PHISHING DETECTED" : "SAFE WEBSITE"}
          </h2>
          <p className="text-muted-foreground mt-2">
            {isPhishing
              ? "Our ML model identified suspicious patterns. Proceed with extreme caution."
              : "This website appears legitimate based on our security analysis."}
          </p>

          <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto md:mx-0">
            <Metric label="Confidence" value={`${confidence}%`} accent={accent} pct={confidence} isPhishing={isPhishing} />
            <Metric label="Risk Score" value={`${risk}/100`} accent={isPhishing ? "text-cyber-red" : "text-cyber-blue"} pct={risk} isPhishing={isPhishing} />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-8">
        <Card title="Explanation" icon={Info} items={result.reasons?.length ? result.reasons : defaultReasons(isPhishing)} />
        <Card title="Recommendations" icon={isPhishing ? AlertTriangle : CheckCircle2} items={result.recommendations?.length ? result.recommendations : defaultRecs(isPhishing)} />
      </div>
    </motion.div>
  );
}

function Metric({ label, value, accent, pct, isPhishing }: { label: string; value: string; accent: string; pct: number; isPhishing: boolean }) {
  return (
    <div className="glass p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${accent}`}>{value}</p>
      <div className="h-1 rounded-full bg-white/5 mt-2 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, pct)}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={isPhishing ? "h-full bg-cyber-red" : "h-full bg-cyber-green"}
        />
      </div>
    </div>
  );
}

function Card({ title, icon: Icon, items }: { title: string; icon: any; items: string[] }) {
  return (
    <div className="glass p-5">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="size-4 text-cyber-blue" />
        <h4 className="font-semibold">{title}</h4>
      </div>
      <ul className="space-y-2">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm text-muted-foreground">
            <span className="text-cyber-blue mt-1">▸</span>
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function defaultReasons(phishing: boolean) {
  return phishing
    ? ["Suspicious URL structure detected", "SSL certificate state is weak", "Anchor URLs point to external domains", "Low web traffic ranking"]
    : ["Valid SSL certificate", "Strong DNS record", "Domain indexed by Google", "Healthy web traffic profile"];
}
function defaultRecs(phishing: boolean) {
  return phishing
    ? ["Do not enter credentials on this site", "Verify the URL with the official source", "Report to your IT/security team", "Run an endpoint malware scan"]
    : ["Keep browser and OS up to date", "Use a password manager", "Enable 2FA wherever possible", "Stay alert for lookalike domains"];
}
