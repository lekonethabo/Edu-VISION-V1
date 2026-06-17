"use client";

import React, { useState } from "react";
import { 
  Baby, 
  Building, 
  Layers, 
  Heart, 
  Scale, 
  TrendingUp, 
  Users, 
  Activity, 
  Smile, 
  FileSpreadsheet, 
  Wrench,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Edit,
  ClipboardList
} from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { SectionContainer } from "../shared/SectionContainer";
import { FormModal } from "../shared/FormModal";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  BarChart, 
  Bar, 
  Cell 
} from "recharts";

export interface EarlyChildhoodData {
  totalEnrolled: number;
  boys: number;
  girls: number;
  age3: number;
  age4: number;
  age5: number;
  fullDay: number;
  halfDay: number;
  classroomCount: number;
  playgrounds: number;
  toilets: number;
  waterAccess: "Yes" | "No" | "Limited";
  teachers: number;
  assistants: number;
  caregiverRatio: string;
  mealsProvided: "Breakfast" | "Lunch" | "Both" | "None";
  nutritionProgram: "Yes" | "No";
  healthScreening: "Completed" | "Partial" | "Not Started";
  immunizations: "Yes" | "No" | "Partial";
  parentMeetings: number;
  communityOutreach: number;
  enrolmentTrend: { month: string; count: number }[];
}

const INITIAL_ECE_DATA: EarlyChildhoodData[] = [
  {
    totalEnrolled: 84,
    boys: 41,
    girls: 43,
    age3: 22,
    age4: 31,
    age5: 31,
    fullDay: 58,
    halfDay: 26,
    classroomCount: 4,
    playgrounds: 2,
    toilets: 8,
    waterAccess: "Yes",
    teachers: 3,
    assistants: 4,
    caregiverRatio: "1:12",
    mealsProvided: "Both",
    nutritionProgram: "Yes",
    healthScreening: "Completed",
    immunizations: "Yes",
    parentMeetings: 6,
    communityOutreach: 3,
    enrolmentTrend: [
      { month: "Jan", count: 70 },
      { month: "Feb", count: 72 },
      { month: "Mar", count: 75 },
      { month: "Apr", count: 78 },
      { month: "May", count: 82 },
      { month: "Jun", count: 84 }
    ]
  }
];

export const EarlyChildhoodDashboard: React.FC = () => {
  const { items, updateItem } = useLocalStorage<EarlyChildhoodData>(
    "ece_dashboard_metrics",
    INITIAL_ECE_DATA
  );

  const data = items[0] || INITIAL_ECE_DATA[0];

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [formData, setFormData] = useState<EarlyChildhoodData>({ ...data });

  const handleEditOpen = () => {
    setFormData({ ...data });
    setIsEditModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateItem(formData);
    setIsEditModalOpen(false);
  };

  // Pre-configured colors
  const RADAR_COLORS = ["#00A3A3", "#002652", "#97620C", "#D97706"];

  const ageData = [
    { name: "3 Years Old", value: data.age3, color: "#00A3A3" },
    { name: "4 Years Old", value: data.age4, color: "#ffd700" },
    { name: "5 Years Old", value: data.age5, color: "#002652" }
  ];

  return (
    <div className="space-y-6" id="ece-dashboard-container">
      
      {/* Dynamic Header Sector */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[#00A3A3]/10 text-[#00A3A3] rounded-2xl flex-shrink-0">
            <Baby className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#002652] dark:text-[#00A3A3] tracking-tight">
              EARLY CHILDHOOD DASHBOARD OVERVIEW
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Administrative insights for Pre-Primary development programmes. Monitor toddler census indicators, nutrition compliance level, and critical health screenings.
            </p>
          </div>
        </div>
        
        {/* Compliance and meta indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleEditOpen}
            id="btn-edit-ece-metrics"
            className="flex items-center gap-2 bg-[#002652] hover:bg-slate-800 border border-[#002f66] text-slate-100 font-bold text-xs py-2 px-3.5 rounded-xl transition-all cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-[#00A3A3]" />
            <span>Update Dashboard Metrics</span>
          </button>
        </div>
      </div>

      {/* Main Grid KPI Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI: Enrolment */}
        <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative group">
          <div className="p-3 bg-[#002652]/10 text-[#002652] dark:text-sky-400 rounded-xl">
            <Baby className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Toddlers</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 font-sans tracking-tight">
              {data.totalEnrolled}
            </span>
            <span className="text-[9.5px] text-[#00A3A3] block font-bold">
              Boys: {data.boys} / Girls: {data.girls}
            </span>
          </div>
        </div>

        {/* KPI: Staffing Ratio */}
        <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative group">
          <div className="p-3 bg-[#00A3A3]/10 text-[#00A3A3] rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Caregiver Strength</span>
            <span className="text-2xl font-black text-[#002652] dark:text-slate-100 font-sans tracking-tight">
              {data.teachers + data.assistants}
            </span>
            <span className="text-[9.5px] text-[#00A3A3] block font-bold">
              Ratio {data.caregiverRatio}
            </span>
          </div>
        </div>

        {/* KPI: Nutrition Integration */}
        <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative group">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-[#97620C] rounded-xl">
            <Heart className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meals Provided</span>
            <span className="text-2xl font-black text-[#97620C] dark:text-amber-500 font-sans tracking-tight uppercase">
              {data.mealsProvided}
            </span>
            <span className="text-[9.5px] text-[#97620C] block font-bold">
              Nutrition {data.nutritionProgram}
            </span>
          </div>
        </div>

        {/* KPI: Health screening status */}
        <div className="bg-white dark:bg-[#000A14] p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-4 relative group">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 rounded-xl">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="w-full">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Immunizations</span>
            <span className="text-2xl font-black text-emerald-650 dark:text-emerald-400 font-sans tracking-tight uppercase">
              {data.immunizations}
            </span>
            <span className="text-[9.5px] text-emerald-600 block font-bold">
              Screening: {data.healthScreening}
            </span>
          </div>
        </div>
      </div>

      {/* Facilities, Community, and Charts panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Enrolment Trend Area Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-[#000A14] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-150 dark:border-slate-800">
            <div>
              <h3 className="text-xs font-bold text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider">
                6-Month Enrolment Census Trend
              </h3>
            </div>
            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 px-2 py-1 rounded font-bold uppercase tracking-wider">
              Live Flow
            </span>
          </div>
          <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.enrolmentTrend}>
                <defs>
                  <linearGradient id="eceColorTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A3A3" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#00A3A3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#000A14", 
                    borderColor: "#1e293b",
                    borderRadius: "12px",
                    color: "#f8fafc",
                    fontSize: "12px"
                  }} 
                />
                <Area type="monotone" name="Toddlers Count" dataKey="count" stroke="#00A3A3" strokeWidth={2.5} fillOpacity={1} fill="url(#eceColorTrend)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Age Distribution Bar Chart and Program Stats */}
        <div className="bg-white dark:bg-[#000A14] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-[#002652] dark:text-[#00A3A3] pb-3 border-b border-slate-100 dark:border-slate-800">
              Age Representation Breakdown
            </h4>
            <div className="h-44 mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ageData}>
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "#000A14", 
                      borderColor: "#1e293b",
                      borderRadius: "12px",
                      color: "#f8fafc",
                      fontSize: "12px"
                    }} 
                  />
                  <Bar dataKey="value" fill="#00A3A3" radius={[4, 4, 0, 0]}>
                    {ageData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Full Day Program</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100 block">{data.fullDay}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Half Day/Morning</span>
              <span className="text-xl font-black text-slate-800 dark:text-slate-100 block">{data.halfDay}</span>
            </div>
          </div>
        </div>

        {/* Core Infrastructure & Community Engagement Row */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* ECE Facilities and physical indicators */}
          <div className="bg-white dark:bg-[#000A14] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="pb-2 border-b border-slate-150 dark:border-slate-800">
              <h3 className="text-xs font-bold text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider">
                Authorized Educational Infrastructure
              </h3>
            </div>
            
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center items-center">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Classrooms</span>
                <span className="text-2xl font-black text-[#002652] dark:text-slate-200 mt-1 block tracking-tight">{data.classroomCount}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center items-center">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Playgrounds</span>
                <span className="text-2xl font-black text-[#002652] dark:text-slate-200 mt-1 block tracking-tight">{data.playgrounds}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-center items-center">
                <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block">Toilets logs</span>
                <span className="text-2xl font-black text-[#002652] dark:text-slate-200 mt-1 block tracking-tight">{data.toilets}</span>
              </div>
            </div>

            <div className="p-3 bg-[#00A3A3]/10 rounded-xl border border-[#00A3A3]/20 flex justify-between items-center text-xs">
              <span className="text-[#00A3A3] font-semibold uppercase text-[10px]">Ministry Safe Water Access:</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00A3A3] text-white">
                {data.waterAccess === "Yes" ? "Verified Yes" : data.waterAccess}
              </span>
            </div>
          </div>

          {/* ECE Parent/Community Engagement logs */}
          <div className="bg-white dark:bg-[#000A14] p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 flex flex-col justify-between">
            <div className="pb-2 border-b border-slate-150 dark:border-slate-800">
              <h3 className="text-xs font-bold text-[#002652] dark:text-[#00A3A3] uppercase tracking-wider">
                Support & Community Involvement
              </h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 h-full">
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center text-center">
                <span className="text-slate-400 font-bold uppercase text-[10px] block tracking-wider">PTA/Parent Meetings</span>
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2 block tracking-tight">{data.parentMeetings}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Sessions this school year</span>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-col justify-center text-center">
                <span className="text-slate-400 font-bold uppercase text-[10px] block tracking-wider">Community Outreaches</span>
                <span className="text-3xl font-black text-slate-800 dark:text-slate-100 mt-2 block tracking-tight">{data.communityOutreach}</span>
                <span className="text-[10px] text-slate-400 block mt-1">Mobile health syncs</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Edit ECE metrics Modal */}
      <FormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Pre-Primary Dashboard Indicators"
        onSubmit={handleSave}
        id="ece-edit-metrics-modal"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="md:col-span-2 bg-[#00A3A3]/10 p-3 rounded-lg border border-[#00A3A3]/20 mb-2">
            <span className="text-[10px] uppercase font-mono font-black text-[#00A3A3]">Data Synchronization note</span>
            <p className="text-[11px] text-slate-700 dark:text-slate-350 leading-relaxed mt-0.5">
              These counts calculate aggregated pre-primary ratios. Ensure entries replicate authorized village health census data.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Total Enrolled</label>
            <input 
              type="number"
              value={formData.totalEnrolled}
              onChange={(e) => setFormData({ ...formData, totalEnrolled: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Caregiver Ratio (e.g. 1:12)</label>
            <input 
              type="text"
              value={formData.caregiverRatio}
              onChange={(e) => setFormData({ ...formData, caregiverRatio: e.target.value })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Boys Enrolled</label>
            <input 
              type="number"
              value={formData.boys}
              onChange={(e) => setFormData({ ...formData, boys: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Girls Enrolled</label>
            <input 
              type="number"
              value={formData.girls}
              onChange={(e) => setFormData({ ...formData, girls: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">3 Years Olds</label>
            <input 
              type="number"
              value={formData.age3}
              onChange={(e) => setFormData({ ...formData, age3: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">4 Years Olds</label>
            <input 
              type="number"
              value={formData.age4}
              onChange={(e) => setFormData({ ...formData, age4: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">5 Years Olds</label>
            <input 
              type="number"
              value={formData.age5}
              onChange={(e) => setFormData({ ...formData, age5: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Day Program</label>
            <input 
              type="number"
              value={formData.fullDay}
              onChange={(e) => setFormData({ ...formData, fullDay: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Half Day Program</label>
            <input 
              type="number"
              value={formData.halfDay}
              onChange={(e) => setFormData({ ...formData, halfDay: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pre-Prim Classroom Count</label>
            <input 
              type="number"
              value={formData.classroomCount}
              onChange={(e) => setFormData({ ...formData, classroomCount: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Designated Playgrounds</label>
            <input 
              type="number"
              value={formData.playgrounds}
              onChange={(e) => setFormData({ ...formData, playgrounds: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pre-school toilets logs</label>
            <input 
              type="number"
              value={formData.toilets}
              onChange={(e) => setFormData({ ...formData, toilets: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Water Access</label>
            <select
              value={formData.waterAccess}
              onChange={(e) => setFormData({ ...formData, waterAccess: e.target.value as any })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            >
              <option value="Yes">Yes (Fully Available)</option>
              <option value="Limited">Limited / Tanker Supplied</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Nutrition Program</label>
            <select
              value={formData.nutritionProgram}
              onChange={(e) => setFormData({ ...formData, nutritionProgram: e.target.value as any })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            >
              <option value="Yes">Yes (Active)</option>
              <option value="No">No</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Meals Provided</label>
            <select
              value={formData.mealsProvided}
              onChange={(e) => setFormData({ ...formData, mealsProvided: e.target.value as any })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            >
              <option value="Both">Both (Breakfast and Lunch)</option>
              <option value="Breakfast">Breakfast Only</option>
              <option value="Lunch">Lunch Only</option>
              <option value="None">None</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Health Screening</label>
            <select
              value={formData.healthScreening}
              onChange={(e) => setFormData({ ...formData, healthScreening: e.target.value as any })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            >
              <option value="Completed">Completed</option>
              <option value="Partial">Partial</option>
              <option value="Not Started">Not Started</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Teachers Count</label>
            <input 
              type="number"
              value={formData.teachers}
              onChange={(e) => setFormData({ ...formData, teachers: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assistants Count</label>
            <input 
              type="number"
              value={formData.assistants}
              onChange={(e) => setFormData({ ...formData, assistants: Number(e.target.value) })}
              className="w-full p-2.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg outline-none"
            />
          </div>

        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800 mt-6">
          <button
            type="button"
            onClick={() => setIsEditModalOpen(false)}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 bg-transparent rounded-lg hover:bg-slate-50 text-slate-600 dark:text-slate-350 font-bold transition-all"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 rounded-lg text-white font-bold bg-[#00A3A3] hover:bg-[#002652] transition-colors shadow-sm"
          >
            Save ECE Metrics
          </button>
        </div>
      </FormModal>
    </div>
  );
};
