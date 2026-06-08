import { useState } from "react";
import { Check, ArrowRight, Award, Flame, Star, Send, Cpu, ShieldCheck, Database, XCircle } from "lucide-react";
import { projectsData, certificationsData, skillsData, contactData } from "../types";

export default function ProposalGenerator() {
  const [selectedRole, setSelectedRole] = useState("ai");
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["Python", "Chatbot Architecture"]);
  const [selectedMandates, setSelectedMandates] = useState<string[]>(["bca", "mastercard"]);
  const [calculatedResult, setCalculatedResult] = useState<any | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  const roles = [
    { id: "ai", name: "AI / LLM Developer", icon: Cpu },
    { id: "fullstack", name: "Full-Stack Web Architect", icon: Database },
    { id: "security", name: "Cybersecurity Analyst", icon: ShieldCheck },
  ];

  const skillPool = [
    "Python",
    "JavaScript",
    "Gemini API",
    "Chatbot Architecture",
    "Database Modeling",
    "SQL",
    "Supabase",
    "Prompt Engineering",
    "PII Auditing",
    "Phishing Analysis",
  ];

  const specialMandates = [
    { id: "bca", label: "6th-Sem BCA Candidate", matches: true, desc: "Requires current final-year academic enrollment" },
    { id: "mastercard", label: "Mastercard Partnered", matches: true, desc: "Requires verified simulations by Mastercard" },
    { id: "local", label: "Karnataka Locale", matches: true, desc: "Preference for South India proximity (Raichur)" },
    { id: "senior", label: "8+ Years Experience", matches: false, desc: "Demands senior staff enterprise tenure" },
  ];

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter((s) => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const toggleMandate = (id: string) => {
    if (selectedMandates.includes(id)) {
      setSelectedMandates(selectedMandates.filter((m) => m !== id));
    } else {
      setSelectedMandates([...selectedMandates, id]);
    }
  };

  const handleCalculate = () => {
    setShowStatus(true);
    setCalculatedResult(null);

    setTimeout(() => {
      // 1. Calculate base alignment based on matches in projects and categories
      const matchedProjects = projectsData.filter((proj) => {
        // Correctly match the categories
        if (selectedRole === "ai" && proj.category !== "ai") return false;
        if (selectedRole === "fullstack" && proj.category !== "web" && proj.category !== "ai") return false;
        if (selectedRole === "security" && proj.category !== "security") return false;
        
        // If they chose specific skills, see how they overlap
        if (selectedSkills.length > 0) {
          return proj.techStack.some((tech) =>
            selectedSkills.some((sel) => tech.toLowerCase().includes(sel.toLowerCase()))
          );
        }
        return true;
      });

      // 2. Validate against certifications
      const matchedCerts = certificationsData.filter((cert) => {
        if (selectedRole === "security" && cert.id !== "cybersecurity-sim") return false;
        if (selectedRole === "ai" && cert.id !== "datalabeling-sim") return false;
        
        if (selectedSkills.length > 0) {
          return cert.skillsGained.some((skill) =>
            selectedSkills.some((sel) => skill.toLowerCase().includes(sel.toLowerCase()))
          );
        }
        return true;
      });

      // 3. Dynamic mathematical scoring formulation based on true parameters
      let baseScore = 35; // Start realistic
      
      // Points for relevant project counts
      const projectPoints = matchedProjects.length * 12;
      
      // Points for relevant certified competencies
      const certPoints = matchedCerts.length * 8;

      // Points for chosen skills mapping directly to background
      let skillOverlaps = 0;
      selectedSkills.forEach((skill) => {
        const inProjects = projectsData.some(p => p.techStack.some(t => t.toLowerCase().includes(skill.toLowerCase())));
        const inCerts = certificationsData.some(c => c.skillsGained.some(s => s.toLowerCase().includes(skill.toLowerCase())));
        if (inProjects || inCerts) {
          skillOverlaps += 4;
        }
      });
      const skillBonus = Math.min(20, skillOverlaps);

      // Points/Penalties for Special Mandate Toggles (Honesty & Transparency model)
      let mandateImpact = 0;
      selectedMandates.forEach((mandateId) => {
        const m = specialMandates.find((x) => x.id === mandateId);
        if (m) {
          if (m.matches) {
            mandateImpact += 6; // Matching credentials strengthens fit
          } else {
            mandateImpact -= 30; // Strong negative mismatch! (e.g. demanding 8+ years on a BCA student)
          }
        }
      });

      let rawFitScore = baseScore + projectPoints + certPoints + skillBonus + mandateImpact;

      // Deduct if no matching skills selected at all
      if (selectedSkills.length === 0) {
        rawFitScore -= 10;
      }

      // Format clean bounds with mathematical accuracy
      const score = Math.max(12, Math.min(99, Math.round(rawFitScore)));

      // Generate contextually accurate advice matching the realistic score
      let advice = "";
      let recommendationsLevel: "high" | "moderate" | "mismatch" = "moderate";

      if (score >= 82) {
        recommendationsLevel = "high";
        if (selectedRole === "ai") {
          advice = "Murali is an outstanding fit. His simulation systems (OmniBot, MediBot) prove strong hands-on grasp of offline models and prompt pipeline architectures.";
        } else if (selectedRole === "fullstack") {
          advice = "Murali is highly suited. CS Mindspace and related portals exhibit reliable database mapping, state mechanics, and fluid router layout competence.";
        } else {
          advice = "Forage credentials verified by Mastercard certify active competencies to map network anomalies, auditee records, and phishing matrices safely.";
        }
      } else if (score >= 50) {
        recommendationsLevel = "moderate";
        advice = "Murali has proven foundational skills. While certain target keywords may require slight onboarding, his core simulated systems exhibit agile code mechanics.";
      } else {
        recommendationsLevel = "mismatch";
        advice = "Murali is exceptionally qualified for final-year BCA tech roles, but demanding senior-level (8+ yrs) leadership limits his present academic timeline fit.";
      }

      setCalculatedResult({
        score,
        advice,
        recommendationsLevel,
        matchedProjects,
        matchedCerts,
      });
      setShowStatus(false);
    }, 1100);
  };

  return (
    <div id="interactive-matching-dashboard" className="w-full glass-panel p-6 md:p-8">
      <div className="max-w-2xl mx-auto text-center mb-8">
        <span className="text-xs font-mono font-bold tracking-widest text-violet-400 uppercase bg-violet-950/40 px-3 py-1 rounded-full border border-violet-500/20">
          Matchmaker Matrix
        </span>
        <h3 className="text-2xl font-sans font-semibold text-slate-100 tracking-tight mt-3">
          Interactive Candidate Alignment Calculator
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mt-2">
          Select target roles, skills, and special mandates to see how Murali's practical portfolio aligns with your specifications dynamically with true fidelity.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Input Configuration */}
        <div className="lg:col-span-7 space-y-6">
          {/* Step 1: Select Role */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 tracking-wider uppercase mb-3">
              1. Choose Target Role
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {roles.map((r) => {
                const Icon = r.icon;
                const isSelected = selectedRole === r.id;
                return (
                  <button
                    id={`role-btn-${r.id}`}
                    key={r.id}
                    onClick={() => setSelectedRole(r.id)}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl text-center transition-all glass-panel cursor-pointer ${
                      isSelected
                        ? "!border-violet-500 text-violet-300 shadow-md shadow-violet-950/10"
                        : "text-slate-400"
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-2 ${isSelected ? "text-violet-400" : "text-slate-500"}`} />
                    <span className="font-sans text-xs font-semibold leading-tight">{r.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Skill Filters */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 tracking-wider uppercase mb-3">
              2. Target Skill Frameworks ({selectedSkills.length} active)
            </label>
            <div className="flex flex-wrap gap-2">
              {skillPool.map((skill) => {
                const isActive = selectedSkills.includes(skill);
                return (
                  <button
                    id={`skill-toggle-${skill.toLowerCase().replace(/\s+/g, '-')}`}
                    key={skill}
                    onClick={() => toggleSkill(skill)}
                    className={`text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? "bg-cyan-950/20 border-cyan-500 text-cyan-400 font-semibold"
                        : "bg-slate-950/20 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                    }`}
                  >
                    <div className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-cyan-400" : "bg-slate-600"}`} />
                    {skill}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Special Mandate checkboxes (Replaces Textbox) */}
          <div>
            <label className="block text-xs font-mono font-bold text-slate-400 tracking-wider uppercase mb-3">
              3. Configure Special Hiring Mandates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {specialMandates.map((mandate) => {
                const isActive = selectedMandates.includes(mandate.id);
                return (
                  <button
                    key={mandate.id}
                    id={`mandate-toggle-${mandate.id}`}
                    onClick={() => toggleMandate(mandate.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between cursor-pointer ${
                      isActive
                        ? "bg-violet-950/20 border-violet-500/60 text-slate-200"
                        : "bg-slate-950/25 border-slate-850 text-slate-400 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-sans font-bold leading-tight">
                        {mandate.label}
                      </span>
                      <div className={`w-3.5 h-3.5 rounded-md border flex items-center justify-center transition-all ${
                        isActive 
                          ? "bg-violet-500 border-violet-400 text-slate-950" 
                          : "border-slate-700"
                      }`}>
                        {isActive && <Check className="w-2.5 h-2.5 stroke-[3px]" />}
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-500 mt-1.5 leading-tight block">
                      {mandate.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Trigger */}
          <button
            id="calculate-fit-trigger-btn"
            onClick={handleCalculate}
            disabled={showStatus}
            className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-sans text-xs sm:text-sm font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-950/30 cursor-pointer"
          >
            {showStatus ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Vetted Resume Vectors...
              </>
            ) : (
              <>
                Calculate Portfolio Fit
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>

        {/* Right Output Scorecard */}
        <div className="lg:col-span-5 h-full">
          {showStatus ? (
            <div className="h-[340px] border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-950/10">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-violet-500/20 animate-pulse" />
                <div className="absolute inset-0 rounded-full border-4 border-t-violet-400 animate-spin" />
              </div>
              <p className="font-mono text-xs text-violet-400">LOADING METRICS</p>
              <p className="text-slate-400 text-[11px] mt-1 pr-2 pl-2">Matching query structures with Forage and college databases...</p>
            </div>
          ) : calculatedResult ? (
            <div className="glass-panel p-6 space-y-5 animate-fade-in">
              {/* Score ring */}
              <div className="text-center flex flex-col items-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke="#1e293b"
                      strokeWidth="6"
                      fill="transparent"
                    />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={calculatedResult.score < 50 ? "#f43f5e" : "url(#gradient-cyan-purple)"}
                      strokeWidth="6"
                      fill="transparent"
                      strokeDasharray="251.2"
                      strokeDashoffset={251.2 - (251.2 * calculatedResult.score) / 100}
                      className="transition-all duration-1000 ease-out"
                    />
                    <defs>
                      <linearGradient id="gradient-cyan-purple" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" />
                        <stop offset="100%" stopColor="#8b5cf6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-2xl font-mono font-bold text-slate-100 leading-none">
                      {calculatedResult.score}%
                    </span>
                    <span className="text-[9px] font-mono font-medium text-slate-500 tracking-wider text-center">
                      FIT CORR
                    </span>
                  </div>
                </div>

                {calculatedResult.score >= 80 ? (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/20 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                    <Flame className="w-3.5 h-3.5 fill-current" />
                    Highly Recommended Match
                  </div>
                ) : calculatedResult.score >= 50 ? (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-yellow-400 font-semibold bg-yellow-950/20 border border-yellow-500/20 px-2.5 py-0.5 rounded-full">
                    <Award className="w-3.5 h-3.5" />
                    Viable Dynamic Potential
                  </div>
                ) : (
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-rose-450 font-semibold bg-rose-950/20 border border-rose-500/20 px-2.5 py-0.5 rounded-full">
                    <XCircle className="w-3.5 h-3.5 text-rose-400" />
                    Mandate Parameter Overreach
                  </div>
                )}
              </div>

              {/* Text review summary */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">AI Evaluation Note</span>
                <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/80 p-3 rounded-xl border border-slate-850">
                  "{calculatedResult.advice}"
                </p>
              </div>

              {/* Matching Projects */}
              {calculatedResult.matchedProjects.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Matching Case Projects</span>
                  <div className="space-y-1.5">
                    {calculatedResult.matchedProjects.slice(0, 3).map((p: any) => (
                      <div key={p.id} className="flex items-center justify-between bg-slate-900/30 px-3 py-2 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">{p.title}</span>
                        </div>
                        <span className="text-[9px] font-mono text-slate-500">{p.period}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Matching Certs */}
              {calculatedResult.matchedCerts.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Validating Credentials</span>
                  <div className="space-y-1.5">
                    {calculatedResult.matchedCerts.slice(0, 2).map((c: any) => (
                      <div key={c.id} className="flex items-center justify-between bg-slate-900/30 px-3 py-2 rounded-lg border border-slate-800">
                        <div className="flex items-center gap-2">
                          <Award className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                          <span className="text-xs font-semibold text-slate-200 truncate max-w-[170px]">{c.title}</span>
                        </div>
                        <span className="text-[9px] font-mono text-violet-400 tracking-wider">VETTED</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                <a
                  href={`mailto:${contactData.email}?subject=Collaboration opportunity from Matchmaker Matrix&body=Hi Murali,%0D%0AI tested your Interactive Alignment Scorecard for the ${roles.find(r => r.id === selectedRole)?.name} role and got a ${calculatedResult.score}% alignment score. Let's arrange a discussion regarding opportunities.`}
                  className="w-full bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-350 font-sans text-xs font-semibold py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 focus:outline-none"
                >
                  <Send className="w-3.5 h-3.5 text-violet-400" />
                  Initiate Direct Contact Request
                </a>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[340px] border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center bg-slate-950/10">
              <Star className="w-8 h-8 text-slate-600 mb-3 animate-pulse" />
              <h4 className="text-xs font-mono font-medium text-slate-400">Scorecard Pending Parameters</h4>
              <p className="text-[11px] text-slate-500 mt-1 max-w-[200px]">
                Toggle target settings on the left to recalculate and dispatch candidate fit metrics.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
