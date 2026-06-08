import React, { useState, useRef, useEffect } from "react";
import { Terminal, Send, HelpCircle, CornerDownLeft, Sparkles, Code2, ShieldAlert, BadgeCheck } from "lucide-react";
import { projectsData, certificationsData, contactData, educationData } from "../types";

interface Message {
  type: "user" | "bot" | "command";
  text: string;
  timestamp: string;
  isCustomHtml?: boolean;
}

export default function AiConsole() {
  const [messages, setMessages] = useState<Message[]>([
    {
      type: "bot",
      text: "System initialized. Murali Karthik AI Agent v1.0 is online.\nHow can I assist you with my skills, credentials, or projects today? Choose a common prompt below or ask anything!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const presetPrompts = [
    { label: "⚡ Key Projects Showcase", val: "projects" },
    { label: "🛡️ Certifications Hub", val: "certifications" },
    { label: "📊 Skills Portfolio", val: "skills" },
    { label: "🎓 Academic Background", val: "education" },
    { label: "📞 Contact Murali Directly", val: "contact" },
  ];

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    // Save user message
    const userMsg: Message = {
      type: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      // Query the backend server-side Gemini API endpoint
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: textToSend }),
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      const reply = data.text || "No response received from Gemini engine.";

      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isCustomHtml: false,
        },
      ]);
      setIsTyping(false);
    } catch (err) {
      console.warn("Backend chat failed or GEMINI_API_KEY is not defined. Falling back to rule-based responses.", err);
      // Seamless static prompt fallback so everything remains interactive
      setTimeout(() => {
        const normalizedQuery = textToSend.toLowerCase().trim();
        let reply = "";
        let isCustomHtml = false;

        if (normalizedQuery.includes("project") || normalizedQuery === "projects") {
          reply = `I have completed 4 major projects specialized in Full-stack web and AI application deployment. Here is an immediate high-level summary:
          
1. **MediBot**: An AI Chatbot utilizing Gemini models providing fast Emergency instructions & dynamic first aid advice (<1.2s response target).
2. **OmniBot**: A completely localized multipurpose AI application designed for task automation.
3. **Cyber-Crime Reporting Portal**: Secure reporting portal integrated with Supabase and complex relational analytics.
4. **CS Mindspace**: High-fidelity Academic web platform built with a SQL database structure.

*Which specific project would you like me to map out for you? (Type 'Medibot', 'Omnibot', 'Mindspace', or 'Cybercrime')*`;
        } else if (normalizedQuery.includes("medibot")) {
          reply = `**MediBot** | AI-Powered First-Aid Assistant (Jan 2026 - Feb 2026)
          
- **Core Strategy**: Built to provide instantaneous medical first-aid advisory in stress moments.
- **AI Integrations**: Leveraged the **Gemini model** as an intelligent text classification engine.
- **Performance**: Standardized prompt contexts to lower response speeds down to **< 1.2 seconds**.
- **Tech Stack Used**: Gemini API SDK, Python wrapper, continuous testing logs, and JavaScript.`;
        } else if (normalizedQuery.includes("omnibot") || normalizedQuery.includes("omni")) {
          reply = `**OmniBot** | Multipurpose Local AI Assistant (Late 2025)
          
- **Core Concept**: Designed a secure system focusing on total offline functionality.
- **Safety Standard**: Safeguarded absolute user data sovereignty by holding local language models.
- **Workflow Automation**: Designed triggers for background folder operations and document indexing safely.`;
        } else if (normalizedQuery.includes("mindspace") || normalizedQuery.includes("cs")) {
          reply = `**CS Mindspace** | Educational Academic Portal (Late 2025)
          
- **Core Focus**: Engineered a rich web framework to track academic syllabus workflows.
- **UI Design**: Crafted using clean components optimized for quick reading and resource listings.
- **Database Architecture**: Mapped structural relationships in phpMyAdmin, targeting seamless host migration.`;
        } else if (normalizedQuery.includes("cybercrime") || normalizedQuery.includes("crime") || normalizedQuery.includes("portal")) {
          reply = `**Cyber-Crime Reporting Portal** (Feb 2026)
          
- **Target Role**: Main developer orchestrating database security and analysis charts.
- **Relational Backend**: Connected with **Supabase Backend as a Service** using core SQL.
- **Security Protocols**: Armed with granular Row Level Security (RLS) policies to safeguard identity.`;
        } else if (normalizedQuery.includes("certification") || normalizedQuery === "certifications" || normalizedQuery.includes("forage") || normalizedQuery.includes("mastercard")) {
          reply = `I successfully completed two critical industry job simulations with Forage in June 2026:

1. 🛡️ **Cybersecurity Simulation with Mastercard**
   - *Deliverable*: Configured robust phishing simulations and analyzed targeted scam trends.
   - *Verification ID*: \`RpBs5NBxAboB98tFE\`

2. 📊 **Data Labeling Job Simulation**
   - *Deliverable*: Managed enterprise batch labeling workflows, structured QA datasets, and trained strict PII protection audits.
   - *Verification ID*: \`w7Rk5cdTpEAdW5sFw\`

All certificate templates have been fully validated mathematically and verified in my resume!`;
        } else if (normalizedQuery.includes("skill") || normalizedQuery === "skills" || normalizedQuery.includes("language") || normalizedQuery.includes("python")) {
          reply = `Here is a high-level query of my core technical arsenal:

- 🧠 **AI & Prompt Engineering**: Chatbot architecture, NLP context windowing, Google AI Studio, Hugging Face integrations.
- 💻 **Main Languages**: Python core scripts, modern JavaScript, PHP, C# OOP, and R programming.
- 🗄️ **Database & Backend**: SQL structure, Supabase relational models, phpMyAdmin modeling.
- ⚙️ **Core Competence**: Modular systems layout, continuous debugging, high-durability developer logs.`;
        } else if (normalizedQuery.includes("education") || normalizedQuery.includes("bca") || normalizedQuery.includes("college") || normalizedQuery.includes("cgpa")) {
          reply = `I am finishing my final semester (6th Semester) as a **Bachelor of Computer Applications (BCA)** student:

- **College**: Laxmi Venkatesh Desai (LVD) College
- **University Affiliate**: Raichur University, Karnataka, India
- **Current Standing**: 8.5 CGPA
- **Profile Specialties**: Machine Learning workflows, full-stack website engineering, and data-driven cryptographic security.`;
        } else if (normalizedQuery.includes("contact") || normalizedQuery.includes("mail") || normalizedQuery.includes("phone")) {
          reply = `Let's work together! Here are my vetted coordinates:

- 📧 **Direct Email**: \`muralikarthikhugar@gmail.com\`
- 📱 **Mobile Phone**: \`+91 6360049503\`
- 📍 **Primary Location**: Raichur, Karnataka, India
- 💼 **LinkedIn Profile**: [linkedin.com/in/muralikarthikhugar](https://www.linkedin.com/in/muralikarthikhugar)
- 🐙 **GitHub Repository**: [github.com/muralikarthikhugar-ai](https://github.com/muralikarthikhugar-ai)`;
        } else if (normalizedQuery.includes("hello") || normalizedQuery.includes("hi ") || normalizedQuery === "hi" || normalizedQuery.includes("hey")) {
          reply = `Hello! I am Murali's AI Twin. I'm trained directly on his exact technical history, code projects, and credentials. 

To explore what I can do, type any key terms like:
- **'projects'** (to view a summary of my software builds)
- **'certifications'** (to see credentials and verification)
- **'skills'** (to view complete language proficiencies)
- **'contact'** (to retrieve immediate hire parameters)`;
        } else {
          reply = `Interesting query! While I might not have a direct static formula for that, I can confirm that Murali has strong competencies in Python, database modeling, and AI chatbot architecture.

You can try using direct keywords like **'projects'**, **'skills'**, **'education'**, **'certifications'**, or **'contact'** to extract detailed metrics from his certified workspace.`;
        }

        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isCustomHtml,
          },
        ]);
        setIsTyping(false);
      }, 1000);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage(inputText);
    }
  };

  return (
    <div id="ai-agent-console" className="w-full glass-panel overflow-hidden flex flex-col">
      {/* Console Top Header */}
      <div className="bg-[#131b2e] px-4 py-3 border-b border-violet-500/20 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
          <span className="ml-2 font-mono text-xs text-gray-400 flex items-center gap-1.5 font-semibold">
            <Terminal className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
            murali.karthik@agency-prod:~
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono text-[10px] text-violet-400 bg-violet-950/50 px-2 py-0.5 rounded border border-violet-500/20">
          <Sparkles className="w-3 h-3" />
          AI ENGINE ACTIVE
        </div>
      </div>

      {/* Message Output History */}
      <div className="flex-1 p-4 md:p-6 h-[340px] overflow-y-auto font-mono text-sm leading-relaxed text-gray-300 space-y-4 scrollbar-thin scrollbar-thumb-violet-500/20">
        {messages.map((msg, idx) => (
          <div
            id={`msg-node-${idx}`}
            key={idx}
            className={`flex flex-col max-w-[85%] ${
              msg.type === "user" ? "ml-auto items-end" : "mr-auto items-start"
            }`}
          >
            {/* Header label */}
            <span className="text-[10px] text-gray-500 mb-1">
              {msg.type === "user" ? "visitor_user" : "murali_ai_agent"} · {msg.timestamp}
            </span>

            {/* Bubble */}
            <div
              className={`rounded-xl px-4 py-2.5 whitespace-pre-line text-xs sm:text-sm ${
                msg.type === "user"
                  ? "bg-violet-600 text-white rounded-tr-none shadow-md shadow-violet-900/10"
                  : "bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none"
              }`}
            >
              {msg.text.split("\n").map((line, lIdx) => {
                // Quick markdown bold parser
                let parsedLine: React.ReactNode = line;
                if (line.includes("**")) {
                  const parts = line.split("**");
                  parsedLine = parts.map((part, pIdx) =>
                    pIdx % 2 === 1 ? <strong key={pIdx} className="text-violet-400 font-semibold">{part}</strong> : part
                  );
                }
                
                // Code wrapper parser
                if (line.includes("`")) {
                  const subParts = line.split("`");
                  parsedLine = subParts.map((subPart, sIdx) =>
                    sIdx % 2 === 1 ? (
                      <code key={sIdx} className="bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800 text-cyan-400 text-xs text-nowrap select-all font-semibold">
                        {subPart}
                      </code>
                    ) : (
                      subPart
                    )
                  );
                }

                // Parse Link
                if (line.includes("[")) {
                  // e.g. [label](url)
                  const match = line.match(/\[(.*?)\]\((.*?)\)/);
                  if (match) {
                    const before = line.substring(0, line.indexOf("["));
                    const after = line.substring(line.indexOf(")") + 1);
                    parsedLine = (
                      <span>
                        {before}
                        <a
                          href={match[2]}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 underline hover:text-cyan-300 font-semibold"
                        >
                          {match[1]}
                        </a>
                        {after}
                      </span>
                    );
                  }
                }

                return (
                  <div key={lIdx} className="min-h-[1.25rem]">
                    {parsedLine}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex flex-col items-start max-w-[85%]">
            <span className="text-[10px] text-gray-500 mb-1">murali_ai_agent · Typing...</span>
            <div className="bg-slate-900 border border-slate-800 text-slate-400 rounded-xl rounded-tl-none px-4 py-2 text-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce" />
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="text-[10px] text-violet-500 font-semibold ml-1">Analyzing workspace context...</span>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Preset Command Buttons */}
      <div className="px-4 py-2 border-t border-violet-500/10 bg-slate-950/30 flex flex-wrap gap-1.5">
        <span className="text-[10px] font-mono text-slate-500 self-center mr-1">Hotkeys:</span>
        {presetPrompts.map((p) => (
          <button
            id={`preset-btn-${p.val}`}
            key={p.val}
            onClick={() => handleSendMessage(p.val)}
            className="text-[11px] font-mono bg-violet-950/40 hover:bg-violet-900/40 border border-violet-500/20 hover:border-violet-400/40 text-violet-300 px-2.5 py-1 rounded-full transition-all focus:outline-none flex items-center gap-1"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Console Input Bar */}
      <div className="p-3 bg-slate-950/50 border-t border-violet-500/25 flex gap-2 items-center">
        <div className="text-violet-400 font-mono text-xs pl-2 select-none font-bold animate-pulse">&gt;</div>
        <input
          id="ai-console-input-field"
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Query database... (e.g., 'What is Medibot?')"
          className="flex-1 bg-transparent border-none text-slate-200 outline-none font-mono text-xs sm:text-sm placeholder-slate-600 py-1"
        />
        <button
          id="ai-console-submit-btn"
          onClick={() => handleSendMessage(inputText)}
          disabled={!inputText.trim()}
          className="bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors flex items-center justify-center"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
