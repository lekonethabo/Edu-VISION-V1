"use client";

import React, { useState } from "react";
import {
  ShieldCheck,
  User,
  Lock,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GeometricLogo } from "../components/GeometricLogo";
import { loginAction } from "./actions";

interface LandingPageProps {
  onLogin: (role: string, name: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
  const [regID, setRegID] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAction(regID.trim(), password);

      if (result.success && result.user) {
        // Authenticated — pass regID as both role and name for the portal to use
        onLogin("School Administrator", result.user.regID);
      } else {
        setError(result.error || "Authentication failed. Please try again.");
      }
    } catch {
      setError("A network error occurred. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-snow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-md w-full mx-auto space-y-8">

        {/* Header branding lockup */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-center space-y-4"
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

        {/* Form Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
          className="bg-white p-8 rounded-3xl border border-slate-150 shadow-sm space-y-6"
        >
          <div className="border-b border-slate-100 pb-3 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
              School Login
            </h3>
            <span className="flex items-center gap-1 text-[10px] bg-sky-50 text-prussian px-2 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3 h-3 text-sea" /> Secure Login
            </span>
          </div>

          {/* Error toast */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.97 }}
                transition={{ duration: 0.25 }}
                className="flex items-start gap-2.5 bg-slate-900/95 border border-amber-500/50 text-white rounded-xl p-3.5"
              >
                <AlertCircle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs font-medium leading-relaxed">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Field: Registration Number (Username) */}
            <div>
              <label
                htmlFor="login-reg-id"
                className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1.5"
              >
                School Registration Number
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <User className="w-4 h-4" />
                </span>
                <input
                  id="login-reg-id"
                  type="text"
                  required
                  placeholder="e.g. E5/7/29"
                  value={regID}
                  onChange={(e) => {
                    setRegID(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl focus:ring-1 focus:ring-prussian outline-hidden text-slate-800 placeholder:text-slate-350 disabled:opacity-60 transition-opacity"
                />
              </div>
            </div>

            {/* Field: Password */}
            <div>
              <label
                htmlFor="login-password"
                className="block text-[10.5px] font-bold text-slate-500 uppercase tracking-wider mb-1"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  id="login-password"
                  type="password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  disabled={isLoading}
                  className="w-full text-xs pl-9 pr-3 py-3 bg-slate-50 border rounded-xl outline-hidden text-slate-800 placeholder:text-slate-350 disabled:opacity-60 transition-opacity"
                />
              </div>
            </div>

            {/* Enter workspace button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 mt-2 bg-prussian hover:bg-prussian/90 rounded-xl text-white font-bold text-xs uppercase cursor-pointer transition-all shadow-xs disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Footer legal notices */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center text-[10px] text-slate-400 leading-relaxed font-semibold"
        >
          <span>
            This terminal access point is part of the ministerial EMIS network.
            All operations logged in this workspace comply with international
            pupil welfare security guidelines.
          </span>
        </motion.div>
      </div>
    </div>
  );
};

export default LandingPage;
