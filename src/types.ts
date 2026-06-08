/**
 * Types and static data for Murali Karthik's Web Portfolio.
 */

export interface Contact {
  phone: string;
  email: string;
  address: string;
  linkedin: string;
  github: string;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  period: string;
  description: string[];
  techStack: string[];
  category: 'ai' | 'web' | 'security';
  stats: { label: string; value: string }[];
  githubUrl?: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  partner?: string;
  date: string;
  credentialCode?: string;
  verificationCode?: string;
  tasks: string[];
  skillsGained: string[];
  themeColor: 'emerald' | 'crimson' | 'sky';
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
  iconName: string;
  colorClass: string;
  experienceLevel: string; // e.g. "Advanced", "Proficient"
}

export interface Education {
  degree: string;
  semester: string;
  college: string;
  university: string;
  cgpa: string;
  status: string;
}

export const contactData: Contact = {
  phone: "6360049503",
  email: "muralikarthikhugar@gmail.com",
  address: "Raichur, Karnataka, India",
  linkedin: "https://www.linkedin.com/in/muralikarthikhugar",
  github: "https://github.com/muralikarthikhugar-ai",
};

export const educationData: Education = {
  degree: "Bachelor of Computer Applications (BCA)",
  semester: "6th Semester (Final Year)",
  college: "Laxmi Venkatesh Desai (LVD) College",
  university: "Raichur University",
  cgpa: "8.5",
  status: "Currently Enrolled",
};

export const projectsData: Project[] = [
  {
    id: "medibot",
    title: "MediBot-AI",
    tagline: "Flask-Based AI Medical Assistant",
    period: "Jan 2026 - Feb 2026",
    category: "ai",
    techStack: ["Flask", "Python", "Google Gemini API", "HTML5", "CSS3 / JavaScript", "google-generativeai"],
    description: [
      "Developed a robust, responsive medical assistant web application powered by the Flask microframework and Google Gemini API.",
      "Integrated the python 'google.generativeai' module to parse and formulate context-critical medical advice and dynamic situational guidelines.",
      "Implemented a secure local chat interface, CORS support, environment variables configuration, and structured static templates."
    ],
    stats: [
      { label: "Engine Environment", value: "Flask / Python" },
      { label: "Inference Latency", value: "<1.1s" },
      { label: "Orchestration SDK", value: "Gemini Pro" }
    ],
    githubUrl: "https://github.com/muralikarthikhugar-ai/Medibot-AI"
  },
  {
    id: "omnibot",
    title: "OmniBot",
    tagline: "Secure Offline Multimodal AI Chatbot",
    period: "Late 2025",
    category: "ai",
    techStack: ["Python", "CustomTkinter", "Ollama (Offline)", "PIL (Pillow)", "PyPDF2", "System Architecture"],
    description: [
      "Built a secure, fully offline desktop AI companion and chatbot made using Ollama for offline speech and general intelligence parsing.",
      "Developed an elegant, high-contrast local GUI using CustomTkinter, featuring responsive controls and dark-themed canvas panels.",
      "Engineered offline system integrations for image analysis (PIL) and multi-format document parsing (PyPDF2) with zero cloud requirements."
    ],
    stats: [
      { label: "Inference Locality", value: "100% Offline" },
      { label: "Engine Model Core", value: "Ollama LLM" },
      { label: "UI Framework", value: "CustomTkinter" }
    ],
    githubUrl: "https://github.com/muralikarthikhugar-ai/OmniBot"
  },
  {
    id: "csmindspace",
    title: "CS-MINDSPACE",
    tagline: "Central Hub for Academic resources",
    period: "Late 2025",
    category: "web",
    techStack: ["Supabase", "PHP", "MySQL (phpMyAdmin)", "HTML5 & CSS3", "Bootstrap / Tailwind", "Apache Server"],
    description: [
      "Created a centralized academic web portal accommodating specialized Student, Teacher, and Admin modules built using the Supabase cloud backend.",
      "Structured a robust, secure relational schema integrating Supabase Postgres rules to maintain stateful academic records and syllabus documentation.",
      "Modernized system routing with high-speed, query-indexed navigation grids and secure file retrieval components centered on course codes."
    ],
    stats: [
      { label: "Database Cloud", value: "Supabase BaaS" },
      { label: "Core Modules", value: "3 (Student/Teacher/Admin)" },
      { label: "Styling Setup", value: "Bootstrap & Tailwind" }
    ],
    githubUrl: "https://github.com/muralikarthikhugar-ai/CS-MINDSPACE"
  },
  {
    id: "cybercrime",
    title: "CYBER-CRIME-REPORTING-PORTAL",
    tagline: "Karnataka National Incident Management System",
    period: "Feb 2026",
    category: "security",
    techStack: ["Supabase", "PostgreSQL", "Web Speech API (Kannada/Telugu/Hindi)", "JWT Security", "Row Level Security (RLS)"],
    description: [
      "Designed a decentralized, forensic incident reporting ledger for digital crimes covering all 31 administrative districts in Karnataka.",
      "Integrated native multilingual Web Speech API bindings, allowing citizens to dictate complex evidence in Kannada (ಕನ್ನಡ), Hindi, Telugu, and English.",
      "Built a robust cloud infrastructure on Supabase featuring Postgres RLS, secure JWT user accounts, and direct object storage buckets for forensic files."
    ],
    stats: [
      { label: "Regional Jurisdictions", value: "31 Districts (KA)" },
      { label: "Translation Engines", value: "Speech-to-Text" },
      { label: "DB Architecture", value: "PostgreSQL BaaS" }
    ],
    githubUrl: "https://github.com/muralikarthikhugar-ai/CYBER-CRIME-REPORTING-PORTAL"
  }
];

export const certificationsData: Certification[] = [
  {
    id: "cybersecurity-sim",
    title: "Cybersecurity Job Simulation",
    issuer: "Forage",
    partner: "Mastercard",
    date: "June 2026",
    credentialCode: "RpBs5NBxAboB98tFE",
    verificationCode: "6a239e7f58ea7bf1aa07e510",
    themeColor: "crimson",
    tasks: [
      "Designed a fully styled corporate phishing email simulation program.",
      "Interpreted, analyzed, and categorized phishing simulation results for active risk profiles."
    ],
    skillsGained: ["Email Security", "Phishing Analysis", "Risk Assessment", "Corporate Cryptography"]
  },
  {
    id: "datalabeling-sim",
    title: "Data Labeling Job Simulation",
    issuer: "Forage",
    partner: "Forage Program",
    date: "June 2026",
    credentialCode: "w7Rk5cdTpEAdW5sFw",
    verificationCode: "6a239e7f58ea7bf1aa07e510",
    themeColor: "emerald",
    tasks: [
      "Performed enterprise-grade Batch Labeling workflows.",
      "Managed PII (Personally Identifiable Information) Awareness compliance.",
      "Executed active review pipelines, strict quality controls, and data iterations."
    ],
    skillsGained: ["Batch Annotation", "PII Auditing", "Quality Assurance", "Machine Learning Training Pipelines"]
  }
];

export const skillsData: SkillCategory[] = [
  {
    id: "ai-data",
    name: "AI & Data Analysis",
    skills: ["Machine Learning Integrations", "Chatbot Architecture", "Data Processing", "Prompt Engineering", "Google AI Studio", "Hugging Face Models"],
    iconName: "Cpu",
    colorClass: "from-purple-500/10 to-pink-500/10 border-purple-500/20 text-purple-400",
    experienceLevel: "Specialized Core"
  },
  {
    id: "langs",
    name: "Programming Languages",
    skills: ["Python", "JavaScript", "PHP", "C#", "R Language"],
    iconName: "Code2",
    colorClass: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-400",
    experienceLevel: "Proficient"
  },
  {
    id: "web-db",
    name: "Web & Database Eng",
    skills: ["Full-Stack Web Development", "SQL Database Modeling", "phpMyAdmin Orchestration", "Supabase Backend Integration", "Modern CSS & Tailwind"],
    iconName: "Database",
    colorClass: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-400",
    experienceLevel: "Advanced"
  },
  {
    id: "core-comp",
    name: "Core Competencies",
    skills: ["System Architecture", "Continuous Code Debugging", "Technical Documentation Documentation", "UX/UI Flow Mapping"],
    iconName: "Settings2",
    colorClass: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    experienceLevel: "Academic & Practical Excellence"
  }
];
