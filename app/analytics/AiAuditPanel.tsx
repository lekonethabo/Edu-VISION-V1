"use client";

import React, { useState } from "react";
import { Sparkles, Loader2, BookOpen, UserCheck, ShieldCheck, FileText, AlertCircle, RefreshCw } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { 
  Student, 
  Teacher, 
  Textbook, 
  SchoolInfo, 
  Facilities 
} from "../types";
import { 
  INITIAL_STUDENTS, 
  INITIAL_TEACHERS, 
  INITIAL_TEXTBOOKS, 
  INITIAL_SCHOOL_INFO, 
  INITIAL_FACILITIES 
} from "../constants";

// Simple custom Markdown-to-HTML transformer to render beautiful typography
function parseSimpleMarkdown(markdown: string) {
  if (!markdown) return "";
  
  // Scrubber to convert standard bullet marks, bold blocks, headers and spaces
  let html = markdown
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-sm font-bold text-prussian dark:text-sea mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-base font-bold text-prussian dark:text-sea border-b border-slate-200 pb-1 mt-6 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-lg font-black text-prussian dark:text-sea border-b-2 mt-8 mb-4">$1</h1>');

  // Bold headings
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900 dark:text-slate-100">$1</strong>');
  
  // Lists
  html = html.replace(/^\s*\*\s+(.*$)/gim, '<li class="ml-4 list-disc text-xs text-slate-700 dark:text-slate-300">$1</li>');
  html = html.replace(/^\s*-\s+(.*$)/gim, '<li class="ml-4 list-disc text-xs text-slate-705 dark:text-slate-300">$1</li>');
  
  // Single line-breaks
  html = html.replace(/\n$/gim, "<br />");
  
  return html;
}

export const AiAuditPanel: React.FC = () => {
  // Pull all localStorage states to aggregate the database context
  const { items: students } = useLocalStorage<Student>("students", INITIAL_STUDENTS);
  const { items: teachers } = useLocalStorage<Teacher>("teachers", INITIAL_TEACHERS);
  const { items: textbooks } = useLocalStorage<Textbook>("textbooks", INITIAL_TEXTBOOKS);
  const { items: schoolInfoList } = useLocalStorage<SchoolInfo>("school_info", [INITIAL_SCHOOL_INFO]);
  const { items: facilitiesList } = useLocalStorage<Facilities>("facilities_stats", [INITIAL_FACILITIES]);

  const schoolInfo = schoolInfoList[0] || INITIAL_SCHOOL_INFO;
  const facilities = facilitiesList[0] || INITIAL_FACILITIES;

  const [auditType, setAuditType] = useState<string>("full");
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleRunAudit = async () => {
    setLoading(true);
    setErrorMsg(null);
    setReport("");

    // Aggregate active state data as database snapshot context
    const contextData = {
      agency: "EMIS National Portal",
      timestamp: new Date().toISOString(),
      schoolIdentity: schoolInfo,
      physicalFacilities: facilities,
      studentsCount: students.length,
      teachersCount: teachers.length,
      textbooksCatalog: textbooks,
      // Sample breakdown statistics
      demographics: {
        totalBoys: students.filter(s => s.sex === "Male").length,
        totalGirls: students.filter(s => s.sex === "Female").length,
      }
    };

    let promptQuery = "";
    if (auditType === "full") {
      promptQuery = "Perform a Comprehensive School Readiness and Quality Audit. Evaluate class-size density, student-teacher ratios, and syllabus textbooks distribution completeness.";
    } else if (auditType === "ratios") {
      promptQuery = "Audit the Pupil-Teacher ratios (PTR) and Classroom Occupancy ratings. Evaluate classrooms availability verses the student size. Flag deficits and provide specific corrective recommendations.";
    } else if (auditType === "textbooks") {
      promptQuery = "Audit Curriculum Textbooks provision. Highlight subjects featuring high deficit counts. Recommend dynamic procurement distributions and allocate standard priority codes.";
    } else if (auditType === "protection") {
      promptQuery = "Review physical safety, special needs classrooms access and child protective systems. Assess disability ramps ratio, girls toilet parity, and report on policy readiness.";
    }

    try {
      const response = await fetch("/app/api/gemini/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptQuery,
          contextData: contextData
        })
      });

      // Simple fallback if routes need /api absolute path resolution
      let data;
      if (!response.ok) {
        // Try fallback to /api/gemini directly in case NextJS routes resolve there
        const fallbackRes = await fetch("/api/gemini", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: promptQuery,
            contextData: contextData
          })
        });
        if (!fallbackRes.ok) {
          const errData = await fallbackRes.json();
          throw new Error(errData.error || "An expected error occurred on reports generation.");
        }
        data = await fallbackRes.json();
      } else {
        data = await response.json();
      }

      if (data.error) {
        throw new Error(data.error);
      }
      setReport(data.text || "Your audit report is empty.");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to trigger analysis. Please confirm your GEMINI_API_KEY environment variable is defined in Settings > Secrets.");
    } finally {
      setLoading(false);
    }
  };

  const auditOptions = [
    {
      id: "full",
      title: "Comprehensive School Readiness Audit",
      description: "Aggregates all registers to compile an institutional health scorecard.",
      icon: <FileText className="w-5 h-5 text-prussian" />
    },
    {
      id: "ratios",
      title: "Pupil-Teacher Ratio & Spatial Density",
      description: "Analyses classroom counts versus total enrollments and detects overcrowding.",
      icon: <UserCheck className="w-5 h-5 text-sea" />
    },
    {
      id: "textbooks",
      title: "Textbook Procurement Deficit Review",
      description: "Locates subject learning card shortages across Standard levels 1-7.",
      icon: <BookOpen className="w-5 h-5 text-golden" />
    },
    {
      id: "protection",
      title: "Special Needs (SEND) & Safety Compliance",
      description: "Monitors physical accessibility, girls sanitation ratios, and protective guidelines.",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />
    }
  ];

  return (
    <div className="space-y-6" id="ai-auditor-panel">
      {errorMsg && (
        <div className="p-4 rounded border-l-4 bg-red-50 border-red-500 text-red-800 text-xs font-semibold flex items-start gap-3">
          <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">Audit Dispatch Failure</span>
            <span>{errorMsg}</span>
          </div>
        </div>
      )}

      <SectionContainer
        title="Edu-VISION Intelligent AI Compliance Auditor"
        description="Verify school-wide compliance metrics, discover textbook stock shortages, analyze student-teacher density indexes by utilizing instant local data synthesis."
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Controls Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-3xl border border-slate-150 dark:border-slate-800 space-y-3">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-prussian dark:text-sea block">
                Select Audit Focus Angle
              </span>
              <div className="space-y-2">
                {auditOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAuditType(opt.id)}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs flex gap-3.5 items-start cursor-pointer ${
                      auditType === opt.id
                        ? "bg-white dark:bg-slate-950 border-sea shadow-xs"
                        : "bg-slate-100/50 border-transparent hover:bg-slate-100"
                    }`}
                  >
                    <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl flex-shrink-0 shadow-2xs">
                      {opt.icon}
                    </div>
                    <div>
                      <span className="font-bold text-slate-800 dark:text-slate-100 block mb-0.5">{opt.title}</span>
                      <span className="text-slate-500 text-[11px] block leading-relaxed">{opt.description}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={handleRunAudit}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2.5 py-4.5 rounded-2xl text-white font-extrabold text-xs bg-prussian hover:bg-prussian/90 disabled:opacity-50 transition-all cursor-pointer shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-cyan-300" />
                    <span>Analyzing Registers...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
                    <span>Generate AI Compliance Report</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-2">
            <div className="border border-slate-205 dark:border-slate-800 rounded-3xl bg-white dark:bg-ink overflow-hidden flex flex-col min-h-[420px] shadow-sm">
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-150 dark:border-slate-800 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sea" />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">Generated Executive Report</span>
                </div>
                {report && (
                  <button
                    onClick={handleRunAudit}
                    className="p-1 px-2 hover:bg-slate-100 rounded text-[10px] font-bold text-prussian flex items-center gap-1 cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Recalculate</span>
                  </button>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center">
                {loading ? (
                  <div className="text-center space-y-4 py-12 max-w-sm mx-auto">
                    <Loader2 className="w-10 h-10 animate-spin text-sea mx-auto" />
                    <h5 className="text-xs font-bold text-slate-800">Synthesizing school-wide datasets...</h5>
                    <p className="text-[11px] text-slate-450 leading-relaxed">
                      Consulting Gemini. Transforming database registers into compliance recommendations.
                    </p>
                  </div>
                ) : report ? (
                  <div className="prose dark:prose-invert max-w-none text-xs text-slate-850 space-y-4">
                    <div 
                      className="space-y-3.5 leading-relaxed text-slate-700 dark:text-slate-350"
                      dangerouslySetInnerHTML={{ __html: parseSimpleMarkdown(report) }} 
                    />
                  </div>
                ) : (
                  <div className="text-center py-12 max-w-sm mx-auto space-y-3">
                    <div className="w-14 h-14 bg-sea/5 rounded-full flex items-center justify-center mx-auto text-sea">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">Ready to Audit</h4>
                    <p className="text-xs text-slate-500 leading-normal">
                      Select an evaluation mode on the left and click the button to trigger compliance analysis on the active registry statistics.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </SectionContainer>
    </div>
  );
};

export default AiAuditPanel;
