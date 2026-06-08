/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from "react";
import { 
  motion, 
  AnimatePresence 
} from "motion/react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Linkedin, 
  Github, 
  GraduationCap, 
  Cpu, 
  Database, 
  ArrowRight, 
  Compass, 
  Code2, 
  Settings2, 
  Copy, 
  Check, 
  Award, 
  Terminal, 
  HelpCircle, 
  Sparkles, 
  ExternalLink,
  Layers,
  Activity,
  UserCheck,
  Eye,
  X
} from "lucide-react";

import { 
  contactData, 
  educationData, 
  projectsData, 
  certificationsData, 
  skillsData, 
  Project,
  Certification
} from "./types";

import ParticlesBackground from "./components/ParticlesBackground";
import TiltCard from "./components/TiltCard";
import AiConsole from "./components/AiConsole";
import ProposalGenerator from "./components/ProposalGenerator";
import Interactive3DSpiderRobot from "./components/Interactive3DSpiderRobot";
import InteractiveCursor from "./components/InteractiveCursor";

export default function App() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<"all" | "ai" | "web" | "security">("all");
  const [activeProjectSpec, setActiveProjectSpec] = useState<string | null>("medibot");
  const [hoveredSkillId, setHoveredSkillId] = useState<string | null>(null);
  const [selectedCertToShow, setSelectedCertToShow] = useState<Certification | null>(null);

  // Copy Email Helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText(contactData.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  // Filtered projects
  const filteredProjects = projectsData.filter(p => 
    selectedCategory === "all" ? true : p.category === selectedCategory
  );

  return (
    <div id="portfolio-app-root" className="relative min-h-screen text-slate-100 font-sans selection:bg-violet-600/30 selection:text-violet-300">
      {/* Immersive UI Atmosphere & Floating Orbs */}
      <div className="atmosphere" />
      <InteractiveCursor />
      <div className="floating-orb" style={{ top: "-50px", left: "-50px" }} />
      <div className="floating-orb-secondary" style={{ bottom: "-100px", right: "-100px" }} />

      {/* 3D Space Constellation Canvas Background */}
      <ParticlesBackground />

      {/* Modern Fixed Header */}
      <header id="portfolio-top-bar" className="sticky top-0 z-50 w-full bg-[#030712]/70 backdrop-blur-md border-b border-slate-800/60 py-4 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
            id="brand-signature-block"
          >
            {/* Minimalist interactive stylized avatar placeholder */}
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-500 flex items-center justify-center font-display font-bold text-sm tracking-tighter text-white shadow-lg overflow-hidden group">
              MK
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-sm tracking-tight text-white leading-none">MURALI KARTHIK</span>
              <span className="font-mono text-[9px] text-cyan-400 font-medium tracking-widest mt-0.5 uppercase">AI DEVELOPER</span>
            </div>
          </motion.div>

          <nav id="top-navigation-links" className="hidden md:flex items-center gap-6 text-xs font-mono tracking-wider">
            <a href="#console-section" className="text-slate-400 hover:text-violet-400 transition-colors">AI_Twin</a>
            <a href="#projects-section" className="text-slate-400 hover:text-violet-400 transition-colors">Showcase</a>
            <a href="#certificates-section" className="text-slate-400 hover:text-violet-400 transition-colors">Credentials</a>
            <a href="#skills-section" className="text-slate-400 hover:text-violet-400 transition-colors">Skills_Bento</a>
            <a href="#matchmaker-section" className="text-slate-400 hover:text-cyan-400 transition-colors">Matchmaker</a>
          </nav>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2"
          >
            <button
              id="top-conact-action-email"
              onClick={handleCopyEmail}
              className="text-xs font-mono bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-2 font-medium"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Copied_Port
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-violet-400" />
                  Copy_Email
                </>
              )}
            </button>
          </motion.div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16 space-y-24 md:space-y-36">
        
        {/* HERO SECTION */}
        <section id="hero-grid-hero" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text details */}
          <div className="lg:col-span-7 space-y-6 md:space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 bg-violet-950/40 border border-violet-500/20 text-violet-300 px-3 py-1 rounded-full text-xs font-mono"
            >
              <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
              6th-Semester BCA Candidate
            </motion.div>

            <div className="space-y-3">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white tracking-tight leading-none"
              >
                MURALI <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400">KARTHIK</span>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-lg sm:text-xl font-sans text-slate-300 font-medium pl-1 leading-normal"
              >
                Final Year BCA Student | AI & Software Developer
              </motion.p>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-sm sm:text-base text-slate-400 max-w-xl pl-1 font-sans leading-relaxed"
            >
              A dedicated software engineering designer specializing in AI development, full-stack application routing, and data security vectors. Proficient in Python scripting, Javascript engines, and Supabase security relays to construct responsive, human-aligned software payloads.
            </motion.p>

            {/* Quick Credentials Pills */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl pl-1"
            >
              <div className="flex gap-3 items-start glass-panel !rounded-xl p-3">
                <GraduationCap className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">Education</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 leading-normal">{educationData.college}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">{educationData.university}</span>
                </div>
              </div>

              <div className="flex gap-3 items-start glass-panel !rounded-xl p-3">
                <Award className="w-5 h-5 text-violet-400 mt-0.5 shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-widest leading-none">Job Simulations</span>
                  <span className="text-xs font-semibold text-slate-200 mt-1 leading-normal">Forage Cyber & Data Labeling</span>
                  <span className="text-[10px] text-slate-400 mt-0.5">Partnered by Mastercard</span>
                </div>
              </div>
            </motion.div>

            {/* CTA button links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-3 pl-1 pt-2"
            >
              <a 
                href="#console-section"
                className="bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-sans font-semibold px-6 py-3 rounded-xl transition-all shadow-md shadow-violet-950/20 hover:shadow-violet-950/40 flex items-center gap-2"
              >
                Consult AI Twin
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#matchmaker-section"
                className="bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-350 text-xs sm:text-sm font-sans font-semibold px-6 py-3 rounded-xl transition-all flex items-center gap-2"
              >
                 recruiter score 
                <UserCheck className="w-4 h-4 text-cyan-400" />
              </a>
            </motion.div>
          </div>

          {/* Right Core Interactive 3D Orbit Canvas Element - Fully transparent floating spider mech */}
          <div className="lg:col-span-5 flex items-center justify-center w-full relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="w-full max-w-[450px] aspect-square relative flex items-center justify-center"
              id="hero-3d-interactive-capsule"
            >
              <Interactive3DSpiderRobot />
            </motion.div>
          </div>
        </section>

        {/* INTERACTIVE AI CONSOLE CHAT SECTION */}
        <section id="console-section" className="space-y-6 scroll-mt-24">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-violet-400 uppercase">
              RECRUITER WORKSPACE
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-white mt-1.5 tracking-tight">
              Interactive AI Twin Sandbox Console
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2 leading-relaxed">
              Query my certified database using commands, keywords, or predefined hotkeys. My simulated agent runs 100% offline using vector matching to instantly report academic status, project specs, and communication coordinates.
            </p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
          >
            <AiConsole />
          </motion.div>
        </section>

        {/* DETAILED PROJECTS SHOWCASE SECTION */}
        <section id="projects-section" className="space-y-10 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                PORTFOLIO BUILDS
              </span>
              <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-white mt-1.5 tracking-tight">
                Case Study Project Library
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">
                Click any layout card to focus its system schematic, relational indicators, and logical sequence parameters.
              </p>
            </div>

            {/* Tabs Controller */}
            <div className="flex flex-wrap gap-1.5 glass-panel !rounded-xl p-1">
              {(["all", "ai", "web", "security"] as const).map((cat) => (
                <button
                  id={`tab-filter-${cat}`}
                  key={cat}
                  onClick={() => {
                    setSelectedCategory(cat);
                    // Reset active spec to first filtered project
                    const matching = projectsData.filter(p => cat === "all" ? true : p.category === cat);
                    if (matching.length > 0) setActiveProjectSpec(matching[0].id);
                  }}
                  className={`text-xs font-mono px-3.5 py-1.5 rounded-lg transition-all capitalize focus:outline-none ${
                    selectedCategory === cat
                      ? "bg-violet-650 text-white font-semibold"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat === "all" ? "All core" : cat === "ai" ? "AI Builds" : cat === "web" ? "web apps" : "security"}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout containing interactive Cards and Focused Spec */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left list profile columns (Tilt Cards) */}
            <div className="lg:col-span-5 space-y-4">
              <AnimatePresence mode="popLayout">
                {filteredProjects.map((p, pIdx) => {
                  const isActive = activeProjectSpec === p.id;
                  return (
                    <motion.div
                      id={`project-card-wrapper-${p.id}`}
                      key={p.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: pIdx * 0.05 }}
                    >
                      <TiltCard
                        id={`project-card-${p.id}`}
                        onClick={() => setActiveProjectSpec(p.id)}
                        className={`p-5 rounded-2xl text-left transition-all duration-200 glass-panel ${
                          isActive
                            ? "border-violet-500/70 shadow-lg shadow-violet-950/20"
                            : ""
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <span className="text-[10px] font-mono text-slate-500 font-bold">{p.period}</span>
                          <span className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                            p.category === "ai" ? "bg-purple-950/50 text-purple-400 border border-purple-500/20" : 
                            p.category === "web" ? "bg-emerald-950/50 text-emerald-400 border border-emerald-500/20" :
                            "bg-rose-950/50 text-rose-400 border border-rose-500/20"
                          }`}>
                            {p.category}
                          </span>
                        </div>

                        <h3 className="font-sans font-semibold text-base text-slate-100 tracking-tight mt-3">
                          {p.title}
                        </h3>
                        <p className="text-xs text-slate-400 font-sans mt-1">
                          {p.tagline}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-3">
                          {p.techStack.map((tech) => (
                            <span 
                              key={tech} 
                              className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                      </TiltCard>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Right Detailed System Spec view screen */}
            <div className="lg:col-span-7 h-full">
              {activeProjectSpec ? (() => {
                const proj = projectsData.find(p => p.id === activeProjectSpec);
                if (!proj) return null;
                return (
                  <motion.div
                    id="active-project-detailed-spec-block"
                    key={proj.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel p-6 md:p-8 space-y-6"
                  >
                    <div className="border-b border-slate-850 pb-5">
                      <div className="flex flex-wrap justify-between items-center gap-2">
                        <span className="text-[10px] font-mono text-cyan-400 font-bold bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                          TECHNICAL PROFILE SPEC
                        </span>
                        <span className="text-xs font-mono text-slate-500">{proj.period}</span>
                      </div>
                      <h3 className="text-2xl font-sans font-semibold text-slate-100 tracking-tight mt-3">
                        {proj.title} Showcase
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-400 font-sans mt-1">
                        {proj.tagline}
                      </p>
                    </div>

                    {/* Stats metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {proj.stats.map((s, idx) => (
                        <div key={idx} className="bg-slate-950/50 border border-slate-900 p-3 rounded-xl text-center">
                          <span className="text-[10px] font-mono text-slate-500 uppercase block">{s.label}</span>
                          <span className="text-sm font-sans font-bold text-slate-200 mt-1 block tracking-tight">{s.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bullet Accomplishments */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Core Achievements and Delivery
                      </span>
                      <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                        {proj.description.map((bullet, idx) => (
                          <li key={idx} className="flex gap-2.5 items-start">
                            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 shrink-0" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* GitHub Repository Connection */}
                    {proj.githubUrl && (
                      <div className="bg-slate-950/40 border border-slate-900 rounded-2xl p-4 space-y-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
                            Source Control Integration
                          </span>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-slate-400 shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs font-mono text-cyan-400 font-medium">
                              {proj.githubUrl.replace("https://github.com/", "")}
                            </span>
                          </div>
                        </div>
                        <a
                          href={proj.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-950 text-slate-300 hover:text-cyan-400 transition-all duration-300 flex items-center justify-center gap-2 relative group cursor-pointer"
                        >
                          <span className="relative z-10">Access Repository</span>
                          <span className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                          <svg className="w-3 h-3 text-cyan-400 shrink-0 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </a>
                      </div>
                    )}
                  </motion.div>
                );
              })() : (
                <div className="h-full min-h-[300px] border border-dashed border-slate-800 rounded-2xl flex items-center justify-center text-slate-500">
                  <span className="font-mono text-xs">SELECT WORKSPACE ITEM FOR SCHEMATIC</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FORAGE CYBER & DATA LABELING CERTIFICATES */}
        <section id="certificates-section" className="space-y-6 scroll-mt-24">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-violet-400 uppercase">
              CREDENTIAL STANDARDS
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-white mt-1.5 tracking-tight">
              Vetted Enterprise Job Certifications
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Industry validated simulations verifying skills in corporate network risk mitigation, dataset labeling metrics, and PII auditing models.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            {certificationsData.map((c) => {
              const borderTheme = c.themeColor === "emerald" ? "border-emerald-500/20 hover:border-emerald-500/40 focus:border-emerald-400 shadow-emerald-950/5" : "border-rose-500/20 hover:border-rose-500/40 focus:border-rose-450 shadow-rose-950/5";
              const tagTheme = c.themeColor === "emerald" ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/20" : "bg-rose-950/40 text-rose-400 border-rose-500/20";
              const iconColor = c.themeColor === "emerald" ? "text-emerald-400" : "text-rose-400";

              return (
                <TiltCard
                  id={`cert-card-${c.id}`}
                  key={c.id}
                  className={`glass-panel p-6 rounded-2xl flex flex-col justify-between space-y-6 transition-all ${borderTheme}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Award className={`w-5 h-5 ${iconColor}`} />
                        <span className="font-mono text-xs text-slate-500 font-bold">FORAGE CERTIFIED</span>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${tagTheme}`}>
                        {c.partner || "Professional"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-sans font-semibold text-lg text-slate-100 tracking-tight">
                        {c.title}
                      </h4>
                      <p className="font-mono text-[11px] text-slate-500 mt-0.5">
                        Completed: {c.date} · Verification Code: <code className="text-slate-400 font-semibold">{c.credentialCode}</code>
                      </p>
                    </div>

                    {/* Vetted tasks list */}
                    <div className="space-y-2 pt-1 border-t border-slate-900">
                      <span className="text-[9px] font-mono text-slate-505 block uppercase tracking-wider">Executed Simulation Actions</span>
                      <ul className="space-y-1.5 text-xs text-slate-350 leading-relaxed font-sans">
                        {c.tasks.map((task, idx) => (
                          <li key={idx} className="flex gap-2 items-start">
                            <span className={`w-1 h-1 rounded-full mt-2 shrink-0 ${c.themeColor === 'emerald' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Skills tags footer */}
                  <div className="space-y-4 pt-2 border-t border-slate-900/40">
                    <div>
                      <span className="text-[9px] font-mono text-slate-505 block uppercase tracking-widest mb-1.5">Endorsed Skill Competencies</span>
                      <div className="flex flex-wrap gap-1.5">
                        {c.skillsGained.map((skill) => (
                          <span 
                            key={skill} 
                            className="text-[9px] font-mono bg-slate-950 px-2 py-0.5 rounded border border-slate-850 text-slate-400"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* interactive certificates view button */}
                    <button
                      onClick={() => setSelectedCertToShow(c)}
                      className="w-full text-center text-xs font-mono font-bold uppercase tracking-wider py-2.5 rounded-xl bg-slate-950/70 border border-slate-850/80 hover:border-violet-500/30 text-slate-350 hover:text-white hover:bg-violet-950/30 transition-all flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform" />
                      View Certificate Verification
                    </button>
                  </div>
                </TiltCard>
              );
            })}
          </div>
        </section>

        {/* CORE SKILLS BENTO GRID SECTION */}
        <section id="skills-section" className="space-y-6 scroll-mt-24">
          <div className="max-w-2xl">
            <span className="text-[11px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
              GRID ARSENAL
            </span>
            <h2 className="text-2xl sm:text-3xl font-sans font-semibold text-white mt-1.5 tracking-tight">
              Skill Bento Matrix & Systems
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-2">
              Hover over cards to focus key skill nodes. My profile integrates AI prompting vectors seamlessly with standard web environments.
            </p>
          </div>

          {/* Bento grid layout layout layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {skillsData.map((cat) => {
              const Icon = cat.id === "ai-data" ? Cpu : cat.id === "langs" ? Code2 : cat.id === "web-db" ? Database : Settings2;
              const isFocused = hoveredSkillId === cat.id;

              return (
                <div
                  id={`skill-bento-${cat.id}`}
                  key={cat.id}
                  onMouseEnter={() => setHoveredSkillId(cat.id)}
                  onMouseLeave={() => setHoveredSkillId(null)}
                  className={`glass-panel p-5 rounded-2xl flex flex-col justify-between space-y-6 transition-all duration-300 relative overflow-hidden group ${
                    isFocused ? "border-violet-500/50 shadow-lg shadow-violet-950/15" : ""
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-900 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-violet-400" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-505 uppercase tracking-wide font-bold">
                        {cat.experienceLevel}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="font-sans font-semibold text-sm text-slate-100 tracking-tight">
                        {cat.name}
                      </h4>
                    </div>

                    {/* Skills listed */}
                    <div className="space-y-2 pt-2 border-t border-slate-900/50">
                      <div className="flex flex-col gap-1.5">
                        {cat.skills.map((s) => (
                          <div key={s} className="flex items-center gap-2 text-xs text-slate-300">
                            <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="font-sans">{s}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Absolute visual glowing grid decorations */}
                  <div className="absolute -bottom-30 -right-30 w-44 h-44 bg-violet-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-violet-600/10 transition-colors" />
                </div>
              );
            })}
          </div>
        </section>

        {/* RECRUITER PROPOSAL FIT MATCHMAKER CALCULATOR */}
        <section id="matchmaker-section" className="scroll-mt-24">
          <ProposalGenerator />
        </section>

        {/* HERO SECTION CORE CONNECTION/CONTACT BLOCK */}
        <section id="contact-coordinates-area" className="w-full max-w-4xl mx-auto text-center space-y-8 pr-4 pl-4 py-8">
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-[#00f2fe] uppercase bg-cyan-950/40 border border-cyan-500/20 px-3 py-1 rounded-full">
              LAUNCH CHANNELS
            </span>
            <h2 className="text-3xl sm:text-4xl font-sans font-semibold text-white mt-4 tracking-tight">
              Establish System Interfacing
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Ready to construct innovative, human-aligned AI chatbot systems, Web dashboards, or secure databases. Get in touch directly.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {/* Cell Phone */}
            <a
              id="click-contact-dial"
              href={`tel:${contactData.phone}`}
              className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 hover:border-slate-700 p-4 rounded-xl text-left transition-all hover:bg-slate-900/40 group"
            >
              <Phone className="w-5 h-5 text-cyan-400 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">Mobile Line</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5">{contactData.phone}</span>
              </div>
            </a>

            {/* LinkedIn */}
            <a
              id="click-contact-linkedin"
              href={contactData.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 hover:border-slate-700 p-4 rounded-xl text-left transition-all hover:bg-slate-900/40 group"
            >
              <Linkedin className="w-5 h-5 text-violet-400 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">LinkedIn Connect</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  muralikarthikhugar
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </span>
              </div>
            </a>

            {/* GitHub */}
            <a
              id="click-contact-github"
              href={contactData.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-slate-950/40 border border-slate-850 hover:border-slate-700 p-4 rounded-xl text-left transition-all hover:bg-[#0c0f1e]/80 group"
            >
              <Github className="w-5 h-5 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">OS Repository</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 flex items-center gap-1.5">
                  muralikarthikhugar-ai
                  <ExternalLink className="w-3 h-3 text-slate-600" />
                </span>
              </div>
            </a>
          </div>

          <div className="pt-2">
            <button
              id="main-bottom-copy-email-box"
              onClick={handleCopyEmail}
              className="bg-violet-650 hover:bg-violet-600 text-white font-sans text-xs sm:text-sm font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-violet-950/20 inline-flex items-center gap-2 focus:outline-none"
            >
              {copiedEmail ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  Email Copy Completed!
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 text-violet-300" />
                  Copy Primary Email Node Address
                </>
              )}
            </button>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer id="portfolio-main-footer" className="bg-[#02050c] border-t border-slate-900 py-8 px-4 text-center text-xs font-mono text-slate-600 space-y-2 mt-16">
        <p>© 2026 Murali Karthik. Vetted Professional Web Portfolio and Resume Database.</p>
        <p className="text-[10px] text-slate-700 uppercase tracking-widest font-semibold flex items-center justify-center gap-1.5 select-all">
          <Terminal className="w-3 h-3" />
          SYSTEM_PORT_INBOUND // OK
        </p>
      </footer>

      {/* Certificate Verification Modal Overlay */}
      <AnimatePresence>
        {selectedCertToShow && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setSelectedCertToShow(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-xl bg-[#090d16] border border-violet-500/30 rounded-3xl overflow-hidden shadow-2xl p-6 sm:p-8 space-y-6 md:space-y-8 select-text cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Banner decoration */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-cyan-400" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedCertToShow(null)}
                className="absolute top-4 right-4 text-slate-500 hover:text-white bg-slate-950/60 p-2 rounded-full border border-slate-900 transition-colors cursor-pointer"
                id="close-cert-modal-action"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Certification design frame */}
              <div className="border-2 border-dashed border-slate-800/60 rounded-2xl p-5 sm:p-8 relative space-y-6 md:space-y-8 bg-slate-950/20">
                
                {/* Header Credentials */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-violet-950/50 border border-violet-500/30 flex items-center justify-center">
                      <Award className="w-6 h-6 text-violet-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase font-bold tracking-widest">Accredited Issuer</span>
                      <span className="text-sm font-sans font-extrabold text-white">Forage Cyber & Data Labeling</span>
                    </div>
                  </div>
                  {selectedCertToShow.partner && (
                    <div className="bg-gradient-to-r from-violet-950/40 to-cyan-950/40 border border-violet-500/30 text-violet-300 font-mono text-[10px] px-3 py-1 rounded-full uppercase tracking-wider font-bold">
                      {selectedCertToShow.partner}
                    </div>
                  )}
                </div>

                {/* Certificate main text body */}
                <div className="text-center space-y-3">
                  <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase font-extrabold block">
                    Certificate of Completion
                  </span>
                  <p className="text-slate-400 font-sans text-xs">
                    This is to verify that
                  </p>
                  <h3 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-violet-350 via-white to-cyan-330">
                    Murali Karthik
                  </h3>
                  <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed font-sans">
                    has successfully completed the interactive, enterprise-validated simulations program in:
                  </p>
                  <p className="text-sm sm:text-base font-sans font-bold text-slate-100 tracking-tight">
                    {selectedCertToShow.title}
                  </p>
                </div>

                {/* Completed specs block */}
                <div className="bg-slate-950/70 border border-slate-900 p-4 rounded-xl space-y-2.5">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase tracking-wider font-bold">
                    Completed Simulation Tasks and Tested Skills:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-350 leading-relaxed font-sans">
                    {selectedCertToShow.tasks.map((task, idx) => (
                      <li key={idx} className="flex gap-2 items-start text-left">
                        <span className="w-1.5 h-1.5 bg-violet-500 rounded-full mt-1.5 shrink-0" />
                        <span>{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom signatures and security credential details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-5 border-t border-slate-900/60">
                  <div className="space-y-1 text-left">
                    <span className="text-[9px] font-mono text-slate-500 block uppercase tracking-wider">Verification Authority</span>
                    <span className="text-[11px] font-mono text-slate-300 block font-bold">Forage Verification Registry</span>
                    <span className="text-[9px] font-mono text-emerald-400 block font-bold">● Vetted Record Active</span>
                  </div>
                  <div className="space-y-1 text-left sm:text-right">
                    <span className="text-[9px] font-mono text-slate-505 block uppercase tracking-wider">Credential Identification</span>
                    <span className="text-[10px] font-mono text-slate-300 block font-bold">
                      {selectedCertToShow.credentialCode}
                    </span>
                    <span className="text-[9px] text-slate-400 block font-mono">
                      Completed: {selectedCertToShow.date}
                    </span>
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
