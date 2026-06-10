import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Contact, Project, Certification, SkillCategory, Education } from "./types";

export interface HeroData {
  title: string;
  tagline: string;
  badge: string;
  description: string;
}

export interface PortfolioData {
  heroData: HeroData;
  contactData: Contact;
  educationData: Education;
  projectsData: Project[];
  certificationsData: Certification[];
  skillsData: SkillCategory[];
  unstructuredKnowledge: string;
}

interface PortfolioContextType extends PortfolioData {
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/content");
      if (!res.ok) throw new Error("Failed to fetch data");
      const jsonData = await res.json();
      setData(jsonData);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-violet-400 font-mono text-sm">
        <div className="animate-pulse flex items-center gap-2">
          <span>// ESTABLISHING CONNECTION</span>
          <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
        </div>
      </div>
    );
  }

  return (
    <PortfolioContext.Provider value={{ ...data, loading, error, refreshData: fetchData }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (context === undefined) {
    throw new Error("usePortfolio must be used within a PortfolioProvider");
  }
  return context;
};
