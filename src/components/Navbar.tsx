import React, { useState } from 'react';
import { Sparkles, BookOpenCheck, HelpCircle, Heart, ShieldCheck, Zap } from 'lucide-react';
import { ModelBadge } from './ModelBadge';

export const Navbar: React.FC = () => {
  const [showAbout, setShowAbout] = useState(false);

  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo and Name */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-sm shadow-indigo-200">
            <BookOpenCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900">
                Friend<span className="text-indigo-600">Focus</span>
              </span>
              <span className="hidden sm:inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                Study Triage
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden md:block leading-none mt-0.5">
              Realistic, low-stress plans for overwhelmed students
            </p>
          </div>
        </div>

        {/* Right side items */}
        <div className="flex items-center gap-2 sm:gap-3">
          <ModelBadge />

          <button
            onClick={() => setShowAbout(true)}
            type="button"
            className="p-2 text-slate-500 hover:text-slate-800 rounded-lg hover:bg-slate-100 transition-colors"
            title="About FriendFocus"
          >
            <HelpCircle className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* About Modal */}
      {showAbout && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-slate-900 text-base">About FriendFocus</h3>
              </div>
              <button
                onClick={() => setShowAbout(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-semibold p-1"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3 text-sm text-slate-600 leading-relaxed">
              <p>
                <strong>FriendFocus</strong> is designed for high-stress academic moments—when exams are close, deadlines loom, and panic or paralysis sets in.
              </p>
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-800">
                  <Zap className="w-4 h-4 text-amber-500" />
                  Why standard study plans fail:
                </div>
                <p className="text-xs text-slate-600">
                  Overwhelmed brains freeze when facing a 10-hour to-do list. FriendFocus triages your exact constraints into small, bite-sized study blocks, mandatory brain resets, and high-yield active revision.
                </p>
              </div>

              <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-100 space-y-1.5 text-xs text-emerald-900">
                <div className="font-semibold flex items-center gap-1.5 text-emerald-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Open Source & Hackathon Ready
                </div>
                <p>
                  Powered exclusively by <strong>Gemma 4 26B A4B IT</strong> (<code>gemma-4-26b-a4b-it</code>). Runs server-side. No logins, tracking, or unnecessary bloat.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowAbout(false)}
                className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 text-white font-medium text-sm hover:bg-indigo-700 transition-colors"
              >
                Got it, let's study!
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
