import { motion } from "framer-motion";
import {
  Brain, Server, LineChart, Container, Cloud, GitBranch,
  Database, Sigma, Cog,
  Boxes, FlaskConical, Activity, Workflow, Rocket,
  Github, Linkedin, Mail
} from "lucide-react";
import { SectionHeader } from "./PredictionForm";
import { SOCIAL } from "@/lib/links";

const MODEL_INFO = [
  { icon: Brain, label: "Model", value: "Random Forest / Gradient Boosting" },
  { icon: FlaskConical, label: "Framework", value: "Scikit-Learn" },
  { icon: Server, label: "Backend", value: "FastAPI" },
  { icon: LineChart, label: "Experiment Tracking", value: "MLflow" },
  { icon: Rocket, label: "Deployment Ready", value: "Docker • Azure • AWS" },
];

const STEPS = [
  { icon: Database, title: "Data Collection", desc: "Curated phishing & legitimate URL datasets ingested into the pipeline." },
  { icon: Cog, title: "Feature Engineering", desc: "URL, network and behavior features extracted, encoded and validated." },
  { icon: Brain, title: "ML Model Prediction", desc: "Tree-based ensemble model predicts class with calibrated confidence." },
  { icon: Activity, title: "Threat Detection", desc: "Heuristics + model output classify the website in real time." },
  { icon: Workflow, title: "Security Recommendation", desc: "Tailored guidance returned for users and security teams." },
];

export function ModelInfo() {
  return (
    <section className="container mx-auto px-6 py-20">
      <SectionHeader eyebrow="Under the Hood" title="Model Information" subtitle="Production-grade ML stack designed for reliability, traceability and scale." />
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 mt-12">
        {MODEL_INFO.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass p-5 hover:border-cyber-blue/40 transition-colors group"
          >
            <div className="size-10 rounded-lg bg-cyber-blue/10 flex items-center justify-center mb-4 group-hover:bg-cyber-blue/20 transition-colors">
              <m.icon className="size-5 text-cyber-blue" />
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">{m.label}</p>
            <p className="font-semibold mt-1 leading-tight">{m.value}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section className="container mx-auto px-6 py-20">
      <SectionHeader eyebrow="Pipeline" title="How It Works" subtitle="From raw URL to security recommendation in milliseconds." />
      <div className="relative mt-14 max-w-3xl mx-auto">
        <div className="absolute left-6 top-2 bottom-2 w-px bg-gradient-to-b from-cyber-blue/60 via-cyber-blue/20 to-transparent" />
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative pl-16"
            >
              <div className="absolute left-0 top-1 size-12 rounded-xl glass-strong flex items-center justify-center glow-blue">
                <s.icon className="size-5 text-cyber-blue" />
              </div>
              <div className="glass p-5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyber-blue">0{i + 1}</span>
                  <h3 className="font-semibold">{s.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-16">
      <div className="container mx-auto px-6 py-12 flex flex-col md:flex-row gap-6 items-center justify-between">
        <p className="text-sm text-muted-foreground text-center md:text-left max-w-xl">
          Built by <span className="text-foreground font-semibold">Vedant Thakar</span> using Machine Learning, MLOps and Cybersecurity principles.
        </p>
        <div className="flex items-center gap-2">
          <FooterLink href={SOCIAL.github} icon={Github} label="GitHub" />
          <FooterLink href={SOCIAL.linkedin} icon={Linkedin} label="LinkedIn" />
          <FooterLink href={SOCIAL.email} icon={Mail} label="Email" />
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, icon: Icon, label }: { href: string; icon: any; label: string }) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:bg-white/10 transition-colors text-sm font-medium"
    >
      <Icon className="size-4 text-cyber-blue" />
      {label}
    </a>
  );
}
