import React from 'react';
import { Cpu, Heart, Sparkles, Github } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200/80 bg-white/70 py-8 text-center text-xs text-slate-500">
      <div className="max-w-4xl mx-auto px-4 space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="font-bold text-slate-700">FriendFocus</span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 text-slate-600">
            Built with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for stressed students
          </span>
          <span>•</span>
          <span className="inline-flex items-center gap-1 font-mono text-[11px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
            <Cpu className="w-3 h-3 text-emerald-600" />
            gemma-4-26b-a4b-it
          </span>
        </div>

        <p className="max-w-md mx-auto text-slate-400 text-[11px] leading-relaxed">
          Open-source AI Hackathon project. Engineered with Gemma 4 26B A4B IT open-weights intelligence. Zero ads, zero user tracking, zero data selling.
        </p>
      </div>
    </footer>
  );
};
