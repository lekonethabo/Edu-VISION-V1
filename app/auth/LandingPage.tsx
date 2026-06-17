"use client";

import React, { useState } from "react";
import { ShieldCheck, BookOpen, User, Lock, ArrowRight, CornerDownRight } from "lucide-react";
import { motion } from "motion/react";
import { EduVisionLogo } from "../components/EduVisionLogo";

interface LandingPageProps {
  onLogin: (role: string, name: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("admin@emis.gov.bw");
  const [password, setPassword] = useState("••••••••");
  const [role, setRole] = useState("School Administrator");
  const [fullName, setFullName] = useState("K. NGWAKO (EMIS)");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(role, fullName);
  };

  const usersPreset = [
    { name: "K. NGWAKO (EMIS)", role: "School Administrator", mail: "admin@emis.gov.bw" },
    { name: "INSPECTOR MOREMI", role: "Ministerial Inspector", mail: "moremi@gov.bw" },
    { name: "HEADMASTER PAKANE", role: "School Principal", mail: "pakane@edu.bw" }
  ];

  return (
    <div className="min-h-screen bg-snow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Header branding lockup */}
        <div className="text-center space-y-4">
          <EduVisionLogo size="xl" className="mx-auto" />
          <div>
            <h1 className="text-2xl font-black text-prussian tracking-tight uppercase flex items-center justify-center gap-1">
              Edu-<span className="text-sea">VISION</span> EMIS
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Botswana Educational Management Indicators System
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white p-8 rounded-3xl border border-slate-150 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              Credentials Sign-in
            </h3>
            <span className="flex items-center gap-1 text-[10px] bg-sky-50 text-prussian px-2 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3 h-3 text-sea" /> Secure Login
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: Role Preset */}
            <div>
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                Acting Operational Role
              </label>
              <div className="grid grid-cols-1 gap-2">
                {usersPreset.map((user) => (
                  <button
                    type="button"
                    key={user.role}
                    onClick={() => {
                      setRole(user.role);
                      setUsername(user.mail);
                      setFullName(user.name);
                    }}
                    className={`text-left p-2.5 rounded-xl border text-xs flex justify-between items-center transition-colors cursor-pointer ${
                      role === user.role
                        ? "bg-prussian/5 border-prussian"
                        : "border-slate-100 hover:bg-slate-50"
                    }`}
                  >
                    <div>
                      <span className="font-bold text-slate-850 block">{user.role}</span>
                      <span className="text-[10px] text-slate-450 block">{user.name}</span>
                    </div>
                    {role === user.role && (
                      <span className="text-xs font-bold text-prussian">&#10003;</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Field: Identification */}
            <div>
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Official Email Access
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-1 focus:ring-prussian outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Field: Pass code */}
            <div>
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Security Passcode
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Enter workspace button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-prussian hover:bg-prussian/90 rounded-xl text-white font-bold text-xs uppercase cursor-pointer transition-colors shadow-xs"
            >
              <span>Enter Operational Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Footer legal notices */}
        <div className="text-center text-[10px] text-slate-400 leading-relaxed font-semibold">
          <span>This terminal access point is part of the ministerial EMIS network. All operations logged in this workspace comply with international pupil welfare security guidelines.</span>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
