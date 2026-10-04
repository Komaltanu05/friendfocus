import React, { useState } from 'react';
import { Cpu, Info, Check, Sparkles } from 'lucide-react';

export const ModelBadge: React.FC = () => {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="relative inline-flex items-center">
      <button
        onClick={() => setShowInfo(!showInfo)}
        type="button"
        className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/80 transition-all shadow-xs"
        title="View model details"
      >
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <Cpu className="w-3.5 h-3.5 text-emerald-600" />
        <span>Gemma 4 26B A4B IT</span>
        <code className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-emerald-200/60 text-[10px] font-mono text-emerald-900">
          gemma-4-26b-a4b-it
        </code>
        <Info className="w-3 h-3 text-emerald-600/70 group-hover:text-emerald-900 transition-colors" />
      </button>

      {showInfo && (
        <div className="absolute right-0 top-full mt-2 w-80 p-4 bg-white rounded-2xl shadow-xl border border-slate-200 z-50 text-left text-xs animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Gemma Architecture
            </div>
            <button
              onClick={() => setShowInfo(false)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              ✕
            </button>
          </div>
          <p className="text-slate-600 leading-relaxed mb-3">
            FriendFocus is specifically built on <strong>Gemma 4 26B A4B IT</strong> (Model ID:{' '}
            <code className="text-[11px] font-mono bg-slate-100 px-1 py-0.5 rounded text-emerald-700">
              gemma-4-26b-a4b-it
            </code>
            ).
          </p>
          <ul className="space-y-1.5 text-slate-600">
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Optimized instruction-tuned open weights model</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Runs 100% server-side to protect student privacy</span>
            </li>
            <li className="flex items-start gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Tailored for anti-procrastination triage & micro-planning</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
