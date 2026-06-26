"use client";

import React, { useState } from "react";
import { ShieldCheck, BookOpen, User, Lock, ArrowRight, CornerDownRight, GraduationCap } from "lucide-react";
import { motion } from "motion/react";
import { GeometricLogo } from "../components/GeometricLogo";
import { AnimatedBackground } from "../components/AnimatedBackground";

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
    <>
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Main Content */}
      <div className="relative min-h-screen bg-snow/95 backdrop-blur-sm flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans" style={{ zIndex: 1 }}>
        <div className="max-w-md w-full mx-auto space-y-8">
          
          {/* Header branding lockup - with animation */}
          <motion.div 
            className="text-center space-y-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto flex justify-center">
              <GeometricLogo size={72} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-prussian tracking-tight uppercase flex items-center justify-center gap-1">
                Edu-<span className="text-sea">VISION</span> EMIS
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Botswana Educational Management Indicators System
              </p>
            </div>
          </motion.div>

          {/* Form Container - with animation */}
          <motion.div 
            className="bg-white/90 backdrop-blur-lg p-8 rounded-3xl border border-slate-150 shadow-xl space-y-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
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
                  {usersPreset.map((user, index) => (
                    <motion.button
                      type="button"
                      key={user.role}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      onClick={() => {
                        setRole(user.role);
                        setUsername(user.mail);
                        setFullName(user.name);
                      }}
                      className={`text-left p-2.5 rounded-xl border text-xs flex justify-between items-center transition-all duration-200 cursor-pointer ${
                        role === user.role
                          ? "bg-prussian/5 border-prussian shadow-sm"
                          : "border-slate-100 hover:bg-slate-50 hover:border-slate-200"
                      }`}
                    >
                      <div>
                        <span className="font-bold text-slate-850 block">{user.role}</span>
                        <span className="text-[10px] text-slate-450 block">{user.name}</span>
                      </div>
                      {role === user.role && (
                        <motion.span 
                          className="text-xs font-bold text-prussian"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                        >
                          &#10003;
                        </motion.span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Field: Identification */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
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
                    className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sea focus:border-sea outline-none text-slate-800 transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Field: Pass code */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
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
                    className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-sea focus:border-sea outline-none text-slate-800 transition-all duration-200"
                  />
                </div>
              </motion.div>

              {/* Enter workspace button */}
              <motion.button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-prussian hover:bg-prussian/90 rounded-xl text-white font-bold text-xs uppercase cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <span>Operational Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </form>
          </motion.div>

          {/* Footer legal notices */}
          <motion.div 
            className="text-center text-[10px] text-slate-400 leading-relaxed font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <span>This terminal access point is part of the ministerial EMIS network. All operations logged in this workspace comply with international pupil welfare security guidelines.</span>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default LandingPage;
