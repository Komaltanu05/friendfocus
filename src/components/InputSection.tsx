import React, { useState } from 'react';
import { Sparkles, ArrowRight, Clock, BookOpen, AlertCircle, Compass, Flame } from 'lucide-react';

interface InputSectionProps {
  onSubmit: (situation: string) => void;
  isLoading: boolean;
  initialValue?: string;
}

const PRESET_SCENARIOS = [
  {
    label: 'Exam tomorrow, 3 chapters, 2 hours',
    text: 'I have an exam tomorrow, 3 chapters left, and only 2 hours.',
    icon: '⚡',
  },
  {
    label: 'Term paper due at midnight, blank doc',
    text: 'My 4-page psychology paper is due at midnight (in 3 hours) and I only have a blank document and notes.',
    icon: '📝',
  },
  {
    label: 'Math problem set, stuck & 90 mins left',
    text: 'Stuck on calculus problem set with 8 hard problems. Class starts in 90 minutes and I am procrastinating.',
    icon: '📐',
  },
  {
    label: '60 slides to review before morning test',
    text: 'Biology midterm tomorrow morning at 9am. I have 60 lecture slides to review and I feel completely exhausted.',
    icon: '🧬',
  },
];

export const InputSection: React.FC<InputSectionProps> = ({ onSubmit, isLoading, initialValue = '' }) => {
  const [situation, setSituation] = useState(initialValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!situation.trim()) {
      setValidationError('Please share a few words about what you are dealing with right now.');
      return;
    }
    setValidationError(null);
    onSubmit(situation.trim());
  };

  const handleSelectPreset = (text: string) => {
    setSituation(text);
    setValidationError(null);
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Decorative gentle gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-500 via-sky-400 to-emerald-400" />

      <div className="max-w-2xl mx-auto text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold mb-3">
          <Compass className="w-3.5 h-3.5 text-indigo-600" />
          <span>Zero Judgment • Anti-Paralysis</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Overwhelmed? Let's make a real plan.
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
          Tell us where you are stuck, how much time you actually have, and what needs to get done.
          Gemma will cut through the panic with a realistic, bite-sized study schedule.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <label htmlFor="study-situation" className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Your Study Situation
          </label>
          <textarea
            id="study-situation"
            rows={3}
            value={situation}
            onChange={(e) => {
              setSituation(e.target.value);
              if (validationError) setValidationError(null);
            }}
            placeholder="e.g., I have an exam tomorrow, 3 chapters left, and only 2 hours."
            disabled={isLoading}
            className={`w-full rounded-2xl border ${
              validationError
                ? 'border-rose-400 ring-2 ring-rose-100'
                : 'border-slate-300 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
            } p-4 text-slate-800 placeholder-slate-400 text-sm sm:text-base resize-none transition-all outline-hidden bg-slate-50/50 hover:bg-white focus:bg-white`}
          />

          {validationError && (
            <div className="flex items-center gap-1.5 mt-2 text-rose-600 text-xs font-medium">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}
        </div>

        {/* Quick Presets */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span className="font-semibold text-slate-600 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              Quick student presets:
            </span>
            <span className="hidden sm:inline">Click to populate</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESET_SCENARIOS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset.text)}
                disabled={isLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 border border-slate-200/80 text-xs font-medium text-slate-700 transition-all text-left"
              >
                <span>{preset.icon}</span>
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Honest timings work best — even 45 minutes is plenty.</span>
          </div>

          <button
            type="submit"
            disabled={isLoading || !situation.trim()}
            className="w-full sm:w-auto px-7 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-98 cursor-pointer"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                <span>Gemma is thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span>Create My Plan</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
