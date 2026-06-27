import { motion } from "framer-motion";
import { Shield, Radar, Cpu, Activity, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

const STEPS = [
  { icon: Radar, label: "Extracting features" },
  { icon: Cpu, label: "Running ML model" },
  { icon: Activity, label: "Checking website behavior" },
  { icon: Shield, label: "Calculating risk score" },
  { icon: Sparkles, label: "Finalizing prediction" },
];

export default function ScanningLoader() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const i = setInterval(() => setStep((s) => (s + 1) % STEPS.length), 900);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="glass-strong p-10 md:p-14">
      <div className="flex flex-col items-center text-center">
        {/* Radar */}
        <div className="relative size-44 mb-8">
          <div className="absolute inset-0 rounded-full border border-cyber-blue/30" />
          <div className="absolute inset-4 rounded-full border border-cyber-blue/20" />
          <div className="absolute inset-8 rounded-full border border-cyber-blue/20" />
          <div className="absolute inset-0 rounded-full overflow-hidden animate-radar">
            <div className="absolute top-1/2 left-1/2 w-1/2 h-1/2 origin-top-left"
                 style={{ background: "conic-gradient(from 0deg, transparent 0deg, oklch(0.72 0.20 235 / 60%) 60deg, transparent 90deg)" }} />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="size-12 text-cyber-blue animate-float" strokeWidth={1.5} />
          </div>
          <span className="absolute inset-0 rounded-full border border-cyber-blue/50 animate-pulse-ring" />
        </div>

        <h3 className="text-2xl font-bold text-gradient">Scanning Website…</h3>
        <p className="text-muted-foreground text-sm mt-2">Running AI-powered threat detection pipeline</p>

        {/* Progress bar */}
        <div className="w-full max-w-md h-1.5 rounded-full bg-white/5 mt-8 overflow-hidden relative">
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyber-blue to-cyber-blue-glow"
            initial={{ width: "0%" }}
            animate={{ width: ["10%", "95%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Steps */}
        <div className="mt-8 w-full max-w-md space-y-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const active = i === step;
            const done = i < step;
            return (
              <motion.div
                key={s.label}
                animate={{ opacity: active ? 1 : done ? 0.6 : 0.35 }}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  active ? "border-cyber-blue/40 bg-cyber-blue/10" : "border-white/5"
                }`}
              >
                <Icon className={`size-4 ${active ? "text-cyber-blue" : "text-muted-foreground"}`} />
                <span className="text-sm">{s.label}</span>
                {done && <span className="ml-auto text-cyber-green text-xs">✓</span>}
                {active && <span className="ml-auto text-cyber-blue text-xs">…</span>}
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
