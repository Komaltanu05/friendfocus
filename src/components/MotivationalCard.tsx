import React from 'react';
import { Quote, Flame, HeartHandshake, Zap } from 'lucide-react';

interface MotivationalCardProps {
  message: string;
  antiProcrastinationTip?: string;
}

export const MotivationalCard: React.FC<MotivationalCardProps> = ({
  message,
  antiProcrastinationTip,
}) => {
  return (
    <div className="space-y-4">
      {/* Motivational message card */}
      <div className="rounded-3xl p-6 sm:p-7 bg-gradient-to-br from-indigo-50/80 via-sky-50/50 to-emerald-50/60 border border-indigo-100/90 shadow-xs relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-indigo-200">
            <Quote className="w-5 h-5 fill-current opacity-90" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              <HeartHandshake className="w-3.5 h-3.5" />
              <span>Study Coach Note</span>
            </div>
            <p className="text-base sm:text-lg font-medium text-slate-800 italic leading-snug">
              "{message}"
            </p>
          </div>
        </div>
      </div>

      {/* Anti-procrastination hack card */}
      {antiProcrastinationTip && (
        <div className="rounded-2xl p-4 sm:p-5 bg-amber-50/80 border border-amber-200/80 flex items-start gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-900 mb-0.5">
              <span>Immediate Anti-Procrastination Hack</span>
            </div>
            <p className="text-xs sm:text-sm text-amber-950/85 leading-relaxed font-normal">
              {antiProcrastinationTip}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
