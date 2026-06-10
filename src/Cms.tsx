import React, { useState, useEffect } from "react";
import { usePortfolio } from "./DataContext";
import { Save, Check, AlertCircle, ArrowLeft, LogIn, Lock, User, Plus, Trash2, LayoutGrid, Briefcase, Code2, Award, FileText, Smartphone, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

// Helper Field Components
const Input = ({ label, value, onChange, placeholder = "" }: any) => (
  <div className="mb-4">
    <label className="block text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-1.5">{label}</label>
    <input
      type="text"
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0a0d16] border border-white/10 rounded-lg py-2 pl-3 pr-4 text-sm font-mono text-emerald-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
    />
  </div>
);

const TextArea = ({ label, value, onChange, rows=3, placeholder="" }: any) => (
  <div className="mb-4">
    <label className="block text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-1.5">{label}</label>
    <textarea
      value={value || ""}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      className="w-full bg-[#0a0d16] border border-white/10 rounded-lg py-2 pl-3 pr-4 text-sm font-mono text-emerald-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none scrollbar-thin scrollbar-thumb-white/10"
    />
  </div>
);

const ArrayCSV = ({ label, value=[], onChange, placeholder="" }: any) => (
  <TextArea
     label={label + " (Comma separated)"}
     value={(value || []).join(", ")}
     onChange={(val: string) => onChange(val.split(",").map(s => s.trim()).filter(Boolean))}
     rows={2}
     placeholder={placeholder}
  />
);

const ArrayLines = ({ label, value=[], onChange, placeholder="" }: any) => (
  <TextArea
     label={label + " (One item per line)"}
     value={(value || []).join("\n")}
     onChange={(val: string) => onChange(val.split("\n").filter(Boolean))}
     rows={4}
     placeholder={placeholder}
  />
);

const StatsLines = ({ label, value=[], onChange}: any) => (
  <TextArea
     label={label + " (Format -> Label: Value)"}
     value={(value || []).map((s:any) => `${s.label || ''}: ${s.value || ''}`).join("\n")}
     onChange={(val: string) => {
         const lines = val.split("\n").filter(Boolean);
         const mapped = lines.map(l => {
            const idx = l.indexOf(":");
            if (idx > -1) {
               return { label: l.slice(0, idx).trim(), value: l.slice(idx+1).trim() };
            }
            return { label: l.trim(), value: "N/A" };
         });
         onChange(mapped);
     }}
     rows={3}
  />
);

export default function Cms() {
  const { heroData, contactData, educationData, projectsData, certificationsData, skillsData, unstructuredKnowledge, refreshData } = usePortfolio();
  
  const [token, setToken] = useState(localStorage.getItem("cms_token") || "");
  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  const [formData, setFormData] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");
  
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!formData && contactData && heroData) {
      setFormData({
        heroData,
        contactData,
        educationData,
        projectsData: projectsData || [],
        certificationsData: certificationsData || [],
        skillsData: skillsData || [],
        unstructuredKnowledge: unstructuredKnowledge || ""
      });
    }
  }, [heroData, contactData, educationData, projectsData, certificationsData, skillsData, unstructuredKnowledge]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: loginUser, password: loginPass })
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.token);
        localStorage.setItem("cms_token", data.token);
      } else {
        setLoginError(data.error || "Login failed");
      }
    } catch {
      setLoginError("Network connection failed.");
    }
  };

  const handleLogout = () => {
    setToken("");
    localStorage.removeItem("cms_token");
  };

  const handleSave = async () => {
    setErrorMsg(null);
    setSuccess(false);
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!res.ok) {
        if (res.status === 401) {
          handleLogout();
          throw new Error("Session expired. Please log in again.");
        }
        throw new Error("Failed to save changes.");
      }
      
      await refreshData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (e: any) {
      setErrorMsg(e.message || "Failed to update database.");
    } finally {
      setIsSaving(false);
    }
  };

  // Login Screen
  if (!token) {
    return (
      <div className="min-h-screen bg-[#030712] text-slate-200 font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-blue-900/20 to-transparent pointer-events-none" />
        
        <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
          <span className="font-mono text-sm tracking-widest uppercase">BACK TO SITE</span>
        </Link>
        
        <div className="glass-panel p-8 rounded-2xl w-full max-w-md border border-white/10 relative z-10 shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
              <Lock className="w-8 h-8 text-blue-400" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-center text-white mb-2">Admin Gateway</h2>
          <p className="text-center text-sm font-mono text-slate-400 mb-8">Secure CMS authenticated via JWT</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/50 p-3 rounded-lg text-red-400 text-xs font-mono text-center">
                {loginError}
              </div>
            )}
            <Input label="ID" value={loginUser} onChange={setLoginUser} placeholder="admin" />
            <div className="mb-4">
               <label className="block text-[11px] uppercase tracking-widest font-semibold text-slate-500 mb-1.5">PASSPHRASE</label>
               <input 
                  type="password" value={loginPass} onChange={e=>setLoginPass(e.target.value)} placeholder="••••••••"
                  className="w-full bg-[#0a0d16] border border-white/10 rounded-lg py-2 pl-3 pr-4 text-sm font-mono text-emerald-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all"
               />
            </div>
            
            <button type="submit" className="w-full mt-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-sm px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20">
              <LogIn className="w-4 h-4" /> AUTHORIZE
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-blue-400 font-mono text-sm">
        <div className="animate-pulse flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-blue-500/50 border-t-blue-400 rounded-full animate-spin" />
          Fetching data models...
        </div>
      </div>
    );
  }

  // GUI Renders
  const renderGeneral = () => (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="bg-[#050810]/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
           <Sparkles className="w-4 h-4 text-blue-400" /> HERO SECTION (INTRO)
        </h3>
        <div className="grid grid-cols-1 gap-x-6">
          <Input label="Title (e.g. Murali Karthik)" value={formData.heroData.title} onChange={(v:any) => setFormData({...formData, heroData: {...formData.heroData, title: v}})} />
          <Input label="Badge Text" value={formData.heroData.badge} onChange={(v:any) => setFormData({...formData, heroData: {...formData.heroData, badge: v}})} />
          <Input label="Tagline" value={formData.heroData.tagline} onChange={(v:any) => setFormData({...formData, heroData: {...formData.heroData, tagline: v}})} />
          <TextArea label="Description" rows={3} value={formData.heroData.description} onChange={(v:any) => setFormData({...formData, heroData: {...formData.heroData, description: v}})} />
        </div>
      </div>

      <div className="bg-[#050810]/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
           <Smartphone className="w-4 h-4 text-blue-400" /> CONTACT INFORMATION
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Input label="Email" value={formData.contactData.email} onChange={(v:any) => setFormData({...formData, contactData: {...formData.contactData, email: v}})} />
          <Input label="Phone" value={formData.contactData.phone} onChange={(v:any) => setFormData({...formData, contactData: {...formData.contactData, phone: v}})} />
          <Input label="Address" value={formData.contactData.address} onChange={(v:any) => setFormData({...formData, contactData: {...formData.contactData, address: v}})} />
          <Input label="LinkedIn" value={formData.contactData.linkedin} onChange={(v:any) => setFormData({...formData, contactData: {...formData.contactData, linkedin: v}})} />
          <Input label="GitHub" value={formData.contactData.github} onChange={(v:any) => setFormData({...formData, contactData: {...formData.contactData, github: v}})} />
        </div>
      </div>

      <div className="bg-[#050810]/50 border border-white/5 rounded-xl p-6">
        <h3 className="text-sm font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
           <Award className="w-4 h-4 text-blue-400" /> EDUCATION DETAILS
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <Input label="Degree" value={formData.educationData.degree} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, degree: v}})} />
          <Input label="Semester" value={formData.educationData.semester} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, semester: v}})} />
          <Input label="College" value={formData.educationData.college} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, college: v}})} />
          <Input label="University" value={formData.educationData.university} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, university: v}})} />
          <Input label="CGPA" value={formData.educationData.cgpa} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, cgpa: v}})} />
          <Input label="Status" value={formData.educationData.status} onChange={(v:any) => setFormData({...formData, educationData: {...formData.educationData, status: v}})} />
        </div>
      </div>
    </div>
  );

  const renderProjects = () => {
    const update = (idx: number, key: string, val: any) => {
      const arr = [...formData.projectsData];
      arr[idx] = { ...arr[idx], [key]: val };
      setFormData({ ...formData, projectsData: arr });
    };
    return (
       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
         <div className="flex justify-between items-center bg-[#050810]/80 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Briefcase className="w-4 h-4 text-blue-400"/> MANAGING {formData.projectsData.length} PROJECTS</h3>
            <button onClick={() => setFormData({...formData, projectsData: [{id:`proj-${Date.now()}`, title:"New Project", tagline:"", period:"", category:"ai", techStack:[], description:[], stats:[], githubUrl:""}, ...formData.projectsData]})} className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors">
               <Plus className="w-4 h-4"/> ADD RECORD
            </button>
         </div>
         {formData.projectsData.map((proj: any, idx: number) => (
           <div key={proj.id || idx} className="bg-[#050810]/50 p-6 rounded-xl border border-white/5 relative group">
              <button onClick={() => {
                 const arr = [...formData.projectsData]; arr.splice(idx, 1);
                 setFormData({...formData, projectsData: arr});
              }} className="absolute top-4 right-4 text-red-500/50 hover:text-red-400 bg-red-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Input label="ID (Unique key)" value={proj.id} onChange={(v:any) => update(idx, 'id', v)} />
                <Input label="Title" value={proj.title} onChange={(v:any) => update(idx, 'title', v)} />
                <Input label="Tagline" value={proj.tagline} onChange={(v:any) => update(idx, 'tagline', v)} />
                <Input label="Category (e.g. ai, web, security)" value={proj.category} onChange={(v:any) => update(idx, 'category', v)} />
                <Input label="Period (e.g. 2025 - 2026)" value={proj.period} onChange={(v:any) => update(idx, 'period', v)} />
                <Input label="GitHub Link" value={proj.githubUrl} onChange={(v:any) => update(idx, 'githubUrl', v)} />
              </div>
              <ArrayCSV label="Tech Stack" value={proj.techStack} onChange={(v:any) => update(idx, 'techStack', v)} />
              <ArrayLines label="Description Points" value={proj.description} onChange={(v:any) => update(idx, 'description', v)} />
              <StatsLines label="Project Stats" value={proj.stats} onChange={(v:any) => update(idx, 'stats', v)} />
           </div>
         ))}
       </div>
    );
  };

  const renderCerts = () => {
    const update = (idx: number, key: string, val: any) => {
      const arr = [...formData.certificationsData];
      arr[idx] = { ...arr[idx], [key]: val };
      setFormData({ ...formData, certificationsData: arr });
    };
    return (
       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
         <div className="flex justify-between items-center bg-[#050810]/80 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Award className="w-4 h-4 text-blue-400"/> MANAGING {formData.certificationsData.length} CERTS</h3>
            <button onClick={() => setFormData({...formData, certificationsData: [{id:`cert-${Date.now()}`, title:"New Certificate", issuer:"", partner:"", date:"", credentialCode:"", verificationCode:"", themeColor:"blue", tasks:[], skillsGained:[]}, ...formData.certificationsData]})} className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors">
               <Plus className="w-4 h-4"/> ADD RECORD
            </button>
         </div>
         {formData.certificationsData.map((cert: any, idx: number) => (
           <div key={cert.id || idx} className="bg-[#050810]/50 p-6 rounded-xl border border-white/5 relative group">
              <button onClick={() => {
                 const arr = [...formData.certificationsData]; arr.splice(idx, 1);
                 setFormData({...formData, certificationsData: arr});
              }} className="absolute top-4 right-4 text-red-500/50 hover:text-red-400 bg-red-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Input label="ID" value={cert.id} onChange={(v:any) => update(idx, 'id', v)} />
                <Input label="Title" value={cert.title} onChange={(v:any) => update(idx, 'title', v)} />
                <Input label="Issuer" value={cert.issuer} onChange={(v:any) => update(idx, 'issuer', v)} />
                <Input label="Partner" value={cert.partner} onChange={(v:any) => update(idx, 'partner', v)} />
                <Input label="Date" value={cert.date} onChange={(v:any) => update(idx, 'date', v)} />
                <Input label="Theme Color Code" value={cert.themeColor} onChange={(v:any) => update(idx, 'themeColor', v)} />
                <Input label="Credential Code" value={cert.credentialCode} onChange={(v:any) => update(idx, 'credentialCode', v)} />
              </div>
              <ArrayLines label="Tasks / Description" value={cert.tasks} onChange={(v:any) => update(idx, 'tasks', v)} />
              <ArrayCSV label="Skills Gained" value={cert.skillsGained} onChange={(v:any) => update(idx, 'skillsGained', v)} />
           </div>
         ))}
       </div>
    );
  };

  const renderSkills = () => {
    const update = (idx: number, key: string, val: any) => {
      const arr = [...formData.skillsData];
      arr[idx] = { ...arr[idx], [key]: val };
      setFormData({ ...formData, skillsData: arr });
    };
    return (
       <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
         <div className="flex justify-between items-center bg-[#050810]/80 p-4 rounded-xl border border-white/5">
            <h3 className="text-sm font-bold text-white flex items-center gap-2"><Code2 className="w-4 h-4 text-blue-400"/> MANAGING {formData.skillsData.length} SKILL CATS</h3>
            <button onClick={() => setFormData({...formData, skillsData: [{id:`cat-${Date.now()}`, name:"New Category", skills:[], iconName:"Cpu", colorClass:"", experienceLevel:""}, ...formData.skillsData]})} className="flex items-center gap-2 bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/50 text-blue-300 px-3 py-1.5 rounded-lg text-xs font-mono transition-colors">
               <Plus className="w-4 h-4"/> ADD RECORD
            </button>
         </div>
         {formData.skillsData.map((cat: any, idx: number) => (
           <div key={cat.id || idx} className="bg-[#050810]/50 p-6 rounded-xl border border-white/5 relative group">
              <button onClick={() => {
                 const arr = [...formData.skillsData]; arr.splice(idx, 1);
                 setFormData({...formData, skillsData: arr});
              }} className="absolute top-4 right-4 text-red-500/50 hover:text-red-400 bg-red-500/10 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
                <Input label="ID" value={cat.id} onChange={(v:any) => update(idx, 'id', v)} />
                <Input label="Category Name" value={cat.name} onChange={(v:any) => update(idx, 'name', v)} />
                <Input label="Experience Level" value={cat.experienceLevel} onChange={(v:any) => update(idx, 'experienceLevel', v)} />
                <Input label="Lucide Icon Name" value={cat.iconName} onChange={(v:any) => update(idx, 'iconName', v)} />
                <Input label="Tailwind Color Class" value={cat.colorClass} onChange={(v:any) => update(idx, 'colorClass', v)} />
              </div>
              <ArrayCSV label="Skills List" value={cat.skills} onChange={(v:any) => update(idx, 'skills', v)} />
           </div>
         ))}
       </div>
    );
  };

  const renderKnowledge = () => (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
       <div className="bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs font-mono px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
         <Sparkles className="w-4 h-4 shrink-0" />
         This unstructured text acts as the "Brain" for your AI Twin. Add background info, tone instructions, and custom personality details.
       </div>
       <textarea
          value={formData.unstructuredKnowledge}
          onChange={(e) => setFormData({ ...formData, unstructuredKnowledge: e.target.value })}
          className="flex-1 w-full bg-[#0a0d16] border border-white/10 rounded-xl p-4 text-sm font-mono text-emerald-400 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all resize-none scrollbar-thin scrollbar-thumb-white/10"
          spellCheck={false}
          placeholder="Enter AI twin background persona..."
       />
    </div>
  );

  const renderRaw = () => (
    <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
       <div className="bg-blue-900/30 text-blue-300 border border-blue-500/30 text-xs font-mono px-4 py-3 rounded-lg mb-4 flex items-center gap-3">
         <AlertCircle className="w-4 h-4 shrink-0" />
         Raw JSON editing is disabled to preserve database schema integrity. Use the graphical editors to make safe modifications.
       </div>
       <textarea
          readOnly
          value={JSON.stringify(formData, null, 2)}
          className="flex-1 w-full bg-[#050810]/80 text-emerald-400 font-mono text-xs sm:text-sm p-4 outline-none resize-none overflow-auto border border-white/5 rounded-xl block m-0 scrollbar-thin scrollbar-thumb-white/10 opacity-75 focus:outline-none"
          spellCheck={false}
       />
    </div>
  );

  // Dashboard Screen
  return (
    <div className="min-h-screen bg-[#030712] text-slate-200 font-sans p-4 sm:p-8 relative overflow-hidden flex flex-col">
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6 shrink-0 relative z-10 mb-6 w-full max-w-7xl mx-auto">
        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-tight flex items-center gap-3">
            <Link to="/" className="p-2 hover:bg-white/5 rounded-full transition-colors mr-1">
              <ArrowLeft className="w-5 h-5 text-slate-400 hover:text-white" />
            </Link>
            <div className="flex items-center gap-3">
               GUI Database Manager
               <span className="bg-blue-500/20 border border-blue-500/50 text-blue-400 text-[10px] font-mono px-2 py-0.5 rounded-full flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse mr-0.5" /> ONLINE
               </span>
            </div>
          </h1>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={handleLogout} className="text-xs uppercase font-mono tracking-widest text-slate-400 hover:text-red-400 px-3 transition-colors">
            Log Out
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 sm:flex-none justify-center bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-mono text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            {isSaving ? <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" /> : success ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {isSaving ? "Syncing to Cloud..." : success ? "Synced!" : "Save to DB"}
          </button>
        </div>
      </div>

      {errorMsg && (
        <div className="max-w-7xl mx-auto w-full bg-red-500/10 border border-red-500/50 p-4 rounded-xl flex items-start gap-3 shrink-0 mb-6 relative z-10">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-red-400">Transaction Failed</h4>
            <p className="text-xs text-red-300 font-mono">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row gap-6 relative z-10 min-h-0">
        
        {/* Sidebar Nav */}
        <div className="glass-panel w-full md:w-64 shrink-0 border border-white/10 rounded-2xl p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible overflow-y-hidden">
          <button onClick={() => setActiveTab('general')} className={`shrink-0 p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono font-semibold transition-all ${activeTab === 'general' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
            <LayoutGrid className="w-4 h-4 shrink-0" /> General Info
          </button>
          
          <button onClick={() => setActiveTab('projects')} className={`shrink-0 p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono font-semibold transition-all ${activeTab === 'projects' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
            <Briefcase className="w-4 h-4 shrink-0" /> Projects <span className="ml-auto bg-white/10 px-2 py-0.5 rounded text-[10px] hidden md:block">{formData.projectsData.length}</span>
          </button>
          
          <button onClick={() => setActiveTab('certs')} className={`shrink-0 p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono font-semibold transition-all ${activeTab === 'certs' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
            <Award className="w-4 h-4 shrink-0" /> Certifications <span className="ml-auto bg-white/10 px-2 py-0.5 rounded text-[10px] hidden md:block">{formData.certificationsData.length}</span>
          </button>
          
          <button onClick={() => setActiveTab('skills')} className={`shrink-0 p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono font-semibold transition-all ${activeTab === 'skills' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
            <Code2 className="w-4 h-4 shrink-0" /> Skills <span className="ml-auto bg-white/10 px-2 py-0.5 rounded text-[10px] hidden md:block">{formData.skillsData.length}</span>
          </button>

          <button onClick={() => setActiveTab('knowledge')} className={`shrink-0 p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono font-semibold transition-all ${activeTab === 'knowledge' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-400 hover:bg-white/5 border border-transparent'}`}>
            <Sparkles className="w-4 h-4 shrink-0" /> AI Knowledge
          </button>
          
          <div className="hidden md:block my-2 border-t border-white/5"></div>
          
          <button onClick={() => setActiveTab('raw')} className={`shrink-0 md:mt-auto p-3 rounded-xl flex items-center justify-center md:justify-start gap-3 text-xs uppercase tracking-widest font-mono transition-all ${activeTab === 'raw' ? 'bg-blue-500/10 border border-blue-500/30 text-blue-400 shadow-md' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5 border border-transparent'}`}>
            <FileText className="w-4 h-4 shrink-0" /> Raw Output
          </button>
        </div>

        {/* Content Area */}
        <div className="glass-panel flex-1 border border-white/10 rounded-2xl overflow-y-auto p-4 sm:p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activeTab === 'general' && renderGeneral()}
          {activeTab === 'projects' && renderProjects()}
          {activeTab === 'certs' && renderCerts()}
          {activeTab === 'skills' && renderSkills()}
          {activeTab === 'knowledge' && renderKnowledge()}
          {activeTab === 'raw' && renderRaw()}
        </div>
      </div>
    </div>
  );
}
