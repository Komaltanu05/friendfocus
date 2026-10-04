import React, { useState, useEffect } from 'react';
import { Sparkles, Brain, Cpu, Clock, Coffee, BookOpen } from 'lucide-react';

const CALMING_TIPS = [
  'Deep breath: 2 hours of focused work beats 6 hours of guilt and distraction.',
  'Gemma is breaking your topic into high-yield, bite-sized tasks...',
  'Scheduling mandatory micro-breaks to keep your cognitive load manageable.',
  'Remember: You do not need to understand 100% of everything to pass or perform well.',
  'Take a sip of water right now while your plan is being formulated.',
];

export const LoadingState: React.FC = () => {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % CALMING_TIPS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-xs text-center space-y-6">
      {/* Animated Icon */}
      <div className="relative inline-flex items-center justify-center">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 animate-pulse">
          <Brain className="w-8 h-8" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
      </div>

      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span>Gemma 4 26B A4B IT Model Active</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
          Crafting Your Realistic Study Plan...
        </h3>
        <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
          Triaging your time and removing the cognitive overwhelm.
        </p>
      </div>

      {/* Rotating calming quote box */}
      <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 border border-slate-200/80 min-h-[70px] flex items-center justify-center transition-all">
        <p className="text-xs sm:text-sm text-slate-600 font-medium italic transition-opacity duration-300">
          "{CALMING_TIPS[tipIndex]}"
        </p>
      </div>

      {/* Skeleton preview */}
      <div className="max-w-md mx-auto space-y-3 pt-2 opacity-60">
        <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-12 bg-slate-100 rounded-2xl animate-pulse" />
        <div className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
      </div>
    </div>
  );
};
