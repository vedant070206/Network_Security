import { Shield } from "lucide-react";
import Hero from "./Hero";
import PredictionForm from "./PredictionForm";
import { ModelInfo, HowItWorks, TechStack, Footer } from "./Sections";

export default function Landing() {
  return (
    <div className="min-h-screen relative overflow-x-hidden">
      <Nav />
      <main>
        <Hero />
        <PredictionForm />
        <ModelInfo />
        <HowItWorks />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
}

function Nav() {
  return (
    <header className="fixed top-4 inset-x-0 z-50 px-6">
      <div className="container mx-auto">
        <div className="glass-strong flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-gradient-to-br from-cyber-blue to-cyber-blue-glow flex items-center justify-center glow-blue">
              <Shield className="size-4 text-primary-foreground" strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <p className="font-bold text-sm">SecureNet AI</p>
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Phishing Detection</p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#detect" className="hover:text-foreground transition-colors">Detect</a>
            <a href="#model" className="hover:text-foreground transition-colors">Model</a>
            <a href="#stack" className="hover:text-foreground transition-colors">Stack</a>
          </nav>
          <div className="md:hidden" />
        </div>
      </div>
    </header>
  );
}
