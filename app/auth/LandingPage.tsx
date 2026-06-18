"use client";

import React, { useState } from "react";
import { ShieldCheck, User, Lock, ArrowRight, AlertCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { GeometricLogo } from "../components/GeometricLogo";
import { signIn } from "next-auth/react";

interface LandingPageProps {
  onLogin: (role: string, name: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [regID, setRegID] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        regID,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid User ID or Security Passcode. Please check your credentials and try again.");
      } else {
        // Successfully authenticated, progress to dashboard
        onLogin("School Administrator", regID);
      }
    } catch (err) {
      setError("A network error occurred. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-8">
        
        {/* Header branding lockup */}
        <div className="text-center space-y-4">
          <div className="mx-auto flex justify-center">
            <GeometricLogo size={72} />
          </div>
          <div>
            <h1 className="text-2xl font-black text-prussian tracking-tight uppercase flex items-center justify-center gap-1">
              Edu-<span className="text-sea">VISION</span> EMIS
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Botswana Educational Management Information System
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

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700"
            >
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Field: UserID */}
            <div>
              <label className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                UserID
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  placeholder="Enter UserID"
                  value={regID}
                  onChange={(e) => setRegID(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-prussian outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Field: Security Passcode */}
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-1 focus:ring-prussian outline-hidden text-slate-800"
                />
              </div>
            </div>

            {/* Enter workspace button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-prussian hover:bg-prussian/90 rounded-xl text-white font-bold text-xs uppercase cursor-pointer transition-colors shadow-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Enter Operational Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
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
