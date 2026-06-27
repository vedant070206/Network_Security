import { motion } from "framer-motion";
import { Shield, ArrowRight, Sparkles } from "lucide-react";


export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-28 pb-24 grid-bg">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />
      <div className="container mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-cyber-blue mb-8">
            <Sparkles className="size-3.5" />
            ML + MLOps + Cybersecurity
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]">
            <span className="text-gradient">AI Powered</span>
            <br />
            <span className="text-foreground">Phishing Detection System</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Analyze website security using Machine Learning and Network Security intelligence.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#detect"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyber-blue to-cyber-blue-glow text-primary-foreground font-semibold glow-blue hover:scale-[1.02] transition-transform"
            >
              Start Detection <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Floating shield */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mt-16 relative mx-auto w-fit"
          >
            <div className="absolute inset-0 rounded-full bg-cyber-blue/20 blur-3xl" />
            <div className="relative size-32 rounded-full glass-strong flex items-center justify-center animate-float glow-blue">
              <Shield className="size-14 text-cyber-blue" strokeWidth={1.5} />
              <span className="absolute inset-0 rounded-full border border-cyber-blue/40 animate-pulse-ring" />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
