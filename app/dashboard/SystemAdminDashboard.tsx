"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, Users, Database, Server, Key, Activity, Settings, UserPlus, 
  FileText, CheckCircle, GraduationCap, Building2, BookOpen, AlertTriangle, 
  TrendingUp, TrendingDown, BookCheck, Power, Wifi, ShieldAlert,
  HeartPulse, Briefcase, Download, Filter, Map, Droplet, LayoutGrid, FileSearch
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, 
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  AreaChart, Area
} from "recharts";

import { useDashboardData } from "./hooks/useDashboardData";
import { StatCard } from "./components/StatCard";
import { AlertItem } from "./components/AlertItem";
import { ProgressBar } from "./components/ProgressBar";

const COLORS = ["#00A3A3", "#002652", "#ffd700", "#e11d48", "#10b981", "#8b5cf6"];

export const SystemAdminDashboard: React.FC<{ activeTab?: string }> = ({ activeTab = "system_admin" }) => {
  const [academicYear, setAcademicYear] = useState("2024");
  const [regionFilter, setRegionFilter] = useState("All");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  const { data, isLoading, error } = useDashboardData({ year: academicYear, region: regionFilter });

  // Map 'system_admin' (default) to 'overview'
  const currentTab = activeTab === "system_admin" ? "overview" : activeTab;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-rose-500">
        <AlertTriangle className="w-12 h-12 mb-4" />
        <h2 className="text-xl font-bold uppercase tracking-wide">Failed to load dashboard data</h2>
        <p className="text-sm opacity-80 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-[1600px] mx-auto pb-12 relative">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md ${
              toast.type === "success" 
                ? "bg-slate-900/95 dark:bg-[#001428]/95 border-emerald-500/50 text-white"
                : toast.type === "error"
                  ? "bg-slate-900/95 dark:bg-[#001428]/95 border-rose-500/50 text-white"
                  : "bg-slate-900/95 dark:bg-[#001428]/95 border-amber-500/50 text-white"
            }`}
          >
            {toast.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
            {toast.type === "error" && <AlertTriangle className="w-5 h-5 text-rose-400" />}
            {toast.type === "info" && <ShieldAlert className="w-5 h-5 text-amber-400" />}
            <span className="text-sm font-semibold tracking-wide">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header & Global Filters */}
      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-[#002652] dark:text-white uppercase tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-rose-600" />
            System Administration
          </h2>
          <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">
            Super Administrator Control Panel & Analytics
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <Filter className="w-4 h-4 text-slate-400 ml-2" />
            <select 
              value={academicYear} 
              onChange={(e) => setAcademicYear(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5 px-2 outline-none cursor-pointer"
            >
              <option value="2024">Academic Year 2024</option>
              <option value="2025">Academic Year 2025</option>
              <option value="2026">Academic Year 2026</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-1">
            <Map className="w-4 h-4 text-slate-400 ml-2" />
            <select 
              value={regionFilter} 
              onChange={(e) => setRegionFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 dark:text-slate-300 py-1.5 px-2 outline-none cursor-pointer"
            >
              <option value="All">All Regions</option>
              <option value="Central">Central</option>
              <option value="South">South</option>
              <option value="Kweneng">Kweneng</option>
            </select>
          </div>
          <button 
            onClick={() => triggerToast(`Exporting System Admin report for ${academicYear} (${regionFilter})...`, "info")}
            className="flex items-center gap-2 bg-[#002652] hover:bg-[#001b3b] text-white px-4 py-2 text-xs font-bold uppercase rounded-xl transition-colors shadow-sm"
          >
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800" />
            <div className="h-96 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200 dark:border-slate-800" />
          </div>
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {currentTab === "overview" && <OverviewDashboard data={data} triggerToast={triggerToast} />}
            {currentTab === "analytics" && <AnalyticsDashboard data={data} />}
            {currentTab === "schools" && <SchoolsDashboard data={data} />}
            {currentTab === "students" && <StudentsDashboard data={data} />}
            {currentTab === "staff" && <StaffDashboard data={data} />}
            {currentTab === "users" && <UsersDashboard triggerToast={triggerToast} />}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
};

// ==========================================
// 1. OVERVIEW DASHBOARD
// ==========================================
const OverviewDashboard = ({ data, triggerToast }: { data: any, triggerToast: (msg: string, type?: "success" | "error" | "info") => void }) => {
  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Schools" value={data.stats.totalSchools.toLocaleString()} subtitle="Across 10 regions" icon={<Building2 />} color="blue" trend="+2.4%" />
        <StatCard title="Total Enrolment" value={data.stats.totalEnrolment.toLocaleString()} subtitle="Current academic year" icon={<GraduationCap />} color="emerald" trend="+1.2%" />
        <StatCard title="Teaching Staff" value={data.stats.teachingStaff.toLocaleString()} subtitle="Active contracts" icon={<Briefcase />} color="amber" trend="-0.5%" />
        <StatCard title="System Users" value={data.stats.systemUsers.toLocaleString()} subtitle="Active principals/admins" icon={<Users />} color="purple" trend="+5.0%" />
        <StatCard title="Data Completeness" value={`${data.stats.dataCompleteness}%`} subtitle="Required fields filled" icon={<Database />} color="sea" trend="+0.8%" />
        <StatCard title="System Health" value={`${data.stats.systemHealth}%`} subtitle="All DB nodes active" icon={<Server />} color="rose" trend="Stable" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> 
              Multi-Year Enrolment Trends
            </h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.enrolmentTrends} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A3A3" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00A3A3" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorSecondary" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#002652" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#002652" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorEcce" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffd700" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffd700" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc', fontSize: '12px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                  formatter={(value: any) => new Intl.NumberFormat().format(value)}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="primary" name="Primary" stroke="#00A3A3" strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
                <Area type="monotone" dataKey="secondary" name="Secondary" stroke="#002652" strokeWidth={3} fillOpacity={1} fill="url(#colorSecondary)" />
                <Area type="monotone" dataKey="ecce" name="ECCE" stroke="#ffd700" strokeWidth={3} fillOpacity={1} fill="url(#colorEcce)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" /> 
              System Alerts
            </h3>
            <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full uppercase">3 New</span>
          </div>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {data.alerts.map((alert: any, idx: number) => (
               <AlertItem key={idx} {...alert} />
            ))}
          </div>
          
          <button 
            onClick={() => triggerToast("Loading complete system alerts history...", "info")}
            className="w-full mt-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase rounded-xl transition-colors border border-slate-200 dark:border-slate-800"
          >
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ANALYTICS DASHBOARD
// ==========================================
const AnalyticsDashboard = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Region Distribution */}
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Map className="w-4 h-4 text-blue-500" /> 
            Enrolment by Region
          </h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.regionalDistribution} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis type="number" tickFormatter={(val) => `${val/1000}k`} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="region" width={80} tick={{ fontSize: 11, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9', opacity: 0.1}}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                  formatter={(value: any) => new Intl.NumberFormat().format(value)}
                />
                <Bar dataKey="students" name="Total Students" fill="#002652" radius={[0, 4, 4, 0]}>
                  {data.regionalDistribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gender & Demographics */}
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-rose-500" /> 
            National Gender Split
          </h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.studentDemographics.gender}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#00A3A3" /> {/* Male - Teal */}
                  <Cell fill="#002652" /> {/* Female - Prussian */}
                </Pie>
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat().format(value)}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Legend iconType="circle" verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', fontWeight: 'bold' }} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mb-6">
              <span className="text-3xl font-black text-[#002652] dark:text-white">51.2%</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Female Majority</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 3. SCHOOLS & INFRASTRUCTURE
// ==========================================
const SchoolsDashboard = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Grid Connected" value="82%" subtitle="Mains Electricity" icon={<Power />} color="amber" trend="" />
        <StatCard title="Internet Access" value="64%" subtitle="Broadband >5Mbps" icon={<Wifi />} color="blue" trend="" />
        <StatCard title="Potable Water" value="95%" subtitle="Piped or Borehole" icon={<Droplet />} color="sea" trend="" />
        <StatCard title="SPED Units" value="128" subtitle="Special Education" icon={<HeartPulse />} color="rose" trend="" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <BookCheck className="w-4 h-4 text-emerald-500" /> 
            CSE Policy Compliance
          </h3>
          <div className="space-y-5">
            <ProgressBar label="Policies Available in Schools" value={85} color="bg-emerald-500" />
            <ProgressBar label="Shared with Teachers" value={78} color="bg-blue-500" />
            <ProgressBar label="Shared with Parents" value={42} color="bg-amber-500" />
            <ProgressBar label="Shared with School Board" value={65} color="bg-purple-500" />
          </div>
        </div>

        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <Database className="w-4 h-4 text-sea" /> 
            Data Quality & Completeness
          </h3>
          <div className="space-y-5">
            <ProgressBar label="Student Demographics" value={98} color="bg-[#002652]" />
            <ProgressBar label="Staff Qualifications" value={92} color="bg-[#002652]" />
            <ProgressBar label="Infrastructure Metrics" value={75} color="bg-rose-500" />
            <ProgressBar label="ECCE Centre Details" value={60} color="bg-rose-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 4. STUDENTS DASHBOARD (Welfare)
// ==========================================
const StudentsDashboard = ({ data }: { data: any }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Dropout Analysis */}
        <div className="lg:col-span-2 bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-6 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <TrendingDown className="w-4 h-4 text-rose-500" /> 
            National Dropout Reasons (Secondary)
          </h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.dropoutAnalysis} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.2} />
                <XAxis dataKey="reason" axisLine={false} tickLine={false} tick={{ fontSize: 11, fontWeight: 'bold' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                <Tooltip 
                  cursor={{fill: '#f1f5f9', opacity: 0.1}}
                  contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#f8fafc' }}
                />
                <Bar dataKey="count" fill="#e11d48" radius={[4, 4, 0, 0]} barSize={40}>
                  {data.dropoutAnalysis.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#e11d48' : '#fb7185'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Support Services */}
        <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" /> 
            Vulnerability Metrics
          </h3>
          
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">OVC Registered</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200">12,450</p>
            </div>
            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Users className="w-5 h-5" /></div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">SEND Students</p>
              <p className="text-xl font-black text-slate-800 dark:text-slate-200">4,820</p>
            </div>
            <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg"><HeartPulse className="w-5 h-5" /></div>
          </div>
          
          <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Reported Abuse</p>
              <p className="text-xl font-black text-rose-600">312</p>
            </div>
            <div className="p-2 bg-rose-100 text-rose-600 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. STAFF DASHBOARD
// ==========================================
const StaffDashboard = ({ data }: { data: any }) => {
  return (
    <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-3">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-lg font-black text-slate-700 dark:text-slate-300 uppercase tracking-tight">Staff & HR Analytics</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">Detailed cross-tabulation of teacher qualifications, subject shortages, and contract types is currently compiling from regional shards.</p>
      </div>
    </div>
  );
};

// ==========================================
// 6. USERS DASHBOARD (Management & Audit)
// ==========================================
const UsersDashboard = ({ triggerToast }: { triggerToast: (msg: string, type?: "success" | "error" | "info") => void }) => {
  const users = [
    { id: 1, name: "System Super Administrator", email: "admin@system.com", role: "super_admin", status: "Active", lastLogin: "Just now", region: "All" },
    { id: 2, name: "Regional Admin (Central)", email: "region@system.com", role: "region_admin", status: "Active", lastLogin: "2 hours ago", region: "Central" },
    { id: 3, name: "Sub-Regional Admin (Serowe)", email: "subregion@system.com", role: "subregion_admin", status: "Active", lastLogin: "1 day ago", region: "Central" },
    { id: 4, name: "School Head (Mogoditshane)", email: "schoolhead@system.com", role: "school_head", status: "Inactive", lastLogin: "1 week ago", region: "Kweneng" },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-wrap justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
          <div>
            <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" /> Identity & Access Management
            </h3>
            <p className="text-xs text-slate-500 mt-1">Manage RBAC roles and database access permissions.</p>
          </div>
          <button 
            onClick={() => triggerToast("Opening user provisioning wizard...", "info")}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase rounded-xl flex items-center gap-2 transition-colors shadow-sm"
          >
            <UserPlus className="w-4 h-4" /> Provision User
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold border-b border-slate-200 dark:border-slate-800">
                <th className="p-4 font-bold">Identity</th>
                <th className="p-4 font-bold">Security Role</th>
                <th className="p-4 font-bold">Jurisdiction</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold">Last Active</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-slate-100 dark:divide-slate-800">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-800 dark:text-slate-200">{user.name}</div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">{user.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      user.role === 'super_admin' ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400 border border-rose-200/50' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {user.role.replace("_", " ")}
                    </span>
                  </td>
                  <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">{user.region}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${user.status === "Active" ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"}`} />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">{user.status}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-500 text-[10px]">{user.lastLogin}</td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => triggerToast(`Loading edit profile for ${user.name}...`, "info")}
                      className="text-[10px] font-bold uppercase tracking-wider text-[#00A3A3] hover:underline"
                    >
                      Edit
                    </button>
                    <span className="mx-2 text-slate-300 dark:text-slate-700">|</span>
                    <button 
                      onClick={() => triggerToast(`Revoked access for user: ${user.name}.`, "error")}
                      className="text-[10px] font-bold uppercase tracking-wider text-rose-600 hover:underline"
                    >
                      Revoke
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white dark:bg-[#001020] border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-black uppercase text-slate-800 dark:text-slate-200 mb-4 border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
          <FileSearch className="w-4 h-4 text-blue-500" /> System Audit Log
        </h3>
        <div className="space-y-3">
          {[
            { action: "LOGIN", user: "admin@system.com", ip: "192.168.1.100", time: "10 mins ago" },
            { action: "UPDATE", table: "users", record: "ID 4", user: "admin@system.com", ip: "192.168.1.100", time: "1 hour ago" },
            { action: "CREATE", table: "schools", record: "ID 212", user: "region@system.com", ip: "10.0.0.45", time: "Yesterday" },
            { action: "LOGIN_FAILED", user: "unknown", ip: "45.22.19.8", time: "Yesterday" }
          ].map((log, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800 gap-3">
              <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${log.action.includes('FAILED') ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/30' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}`}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                      {log.action} {log.table && <span className="text-slate-400 ml-1">in {log.table}</span>}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5">By {log.user} • {log.ip}</div>
                  </div>
              </div>
              <div className="text-[10px] font-mono text-slate-400 font-bold bg-white dark:bg-slate-950 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 self-start sm:self-auto">
                {log.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

