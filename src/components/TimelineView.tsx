import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Share2,
  Printer,
  Calendar,
  Layers,
  Award,
} from 'lucide-react';
import { StudyPlan, TimelineItem } from '../types';
import { TimelineCard } from './TimelineCard';
import { MotivationalCard } from './MotivationalCard';
import { FocusTimerModal } from './FocusTimerModal';

interface TimelineViewProps {
  plan: StudyPlan;
  onReset: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({ plan, onReset }) => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>(plan.timeline);
  const [activeTimerBlock, setActiveTimerBlock] = useState<TimelineItem | null>(null);
  const [copied, setCopied] = useState(false);

  const completedCount = timelineItems.filter((i) => i.completed).length;
  const totalCount = timelineItems.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleToggleComplete = (id: string) => {
    setTimelineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleCopyPlan = async () => {
    const textLines = [
      `📚 FriendFocus Study Plan (Powered by Gemma 4 26B A4B IT)`,
      `Total Time: ${plan.totalDurationMinutes} mins`,
      `Strategy: ${plan.studentDiagnosis}`,
      ``,
      `--- TIMELINE ---`,
      ...timelineItems.map(
        (b, idx) =>
          `${idx + 1}. [${b.timeRange || b.durationMinutes + 'm'}] ${b.title.toUpperCase()} (${b.type})\n   Action: ${b.taskDescription}${b.tip ? `\n   Tip: ${b.tip}` : ''}`
      ),
      ``,
      `Coach Note: "${plan.motivationalMessage}"`,
      plan.antiProcrastinationTip ? `Hack: ${plan.antiProcrastinationTip}` : '',
    ]
      .filter(Boolean)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textLines);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const studyBlocksCount = timelineItems.filter((i) => i.type === 'study').length;
  const breakBlocksCount = timelineItems.filter((i) => i.type === 'break').length;
  const revisionBlocksCount = timelineItems.filter((i) => i.type === 'revision').length;

  return (
    <div className="space-y-6">
      {/* Top Banner: Diagnosis & Triage Strategy */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Plan Ready • Gemma 4 26B A4B IT
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {plan.totalDurationMinutes} mins total
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Your Realistic Action Plan
            </h2>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handleCopyPlan}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Copy formatted plan"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Plan</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              type="button"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Print study plan"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print</span>
            </button>

            <button
              onClick={onReset}
              type="button"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
              <span>New Plan</span>
            </button>
          </div>
        </div>

        {/* Diagnosis text */}
        <div className="mt-4">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {plan.studentDiagnosis}
          </p>
        </div>

        {/* Stats strip & Progress bar */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap">
            <span className="inline-flex items-center gap-1 font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
              {studyBlocksCount} Study {studyBlocksCount === 1 ? 'block' : 'blocks'}
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
              {breakBlocksCount} {breakBlocksCount === 1 ? 'break' : 'breaks'}
            </span>
            {revisionBlocksCount > 0 && (
              <>
                <span>•</span>
                <span className="inline-flex items-center gap-1 font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                  {revisionBlocksCount} Final revision
                </span>
              </>
            )}
          </div>

          {/* Progress bar */}
          <div className="space-y-1 sm:text-right">
            <div className="flex items-center justify-between sm:justify-end gap-2 text-xs font-semibold text-slate-600">
              <span>Progress:</span>
              <span className="text-indigo-600 font-mono">
                {completedCount} of {totalCount} done ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {progressPercent === 100 && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-800 animate-in fade-in">
            <Award className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Incredible job! You finished every single block of your plan. Give yourself real credit!</span>
          </div>
        )}
      </div>

      {/* Timeline Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-slate-500" />
            <h3 className="font-extrabold text-slate-800 text-base">Timeline Schedule</h3>
          </div>
          <span className="text-xs text-slate-400">Click checkboxes or "Timer" to start</span>
        </div>

        <div className="mt-2">
          {timelineItems.map((item, index) => (
            <TimelineCard
              key={item.id}
              item={item}
              index={index}
              isLast={index === timelineItems.length - 1}
              onToggleComplete={handleToggleComplete}
              onStartTimer={(block) => setActiveTimerBlock(block)}
            />
          ))}
        </div>
      </div>

      {/* Motivational message card */}
      <MotivationalCard
        message={plan.motivationalMessage}
        antiProcrastinationTip={plan.antiProcrastinationTip}
      />

      {/* Bottom CTA */}
      <div className="text-center pt-2 pb-6 print:hidden">
        <button
          onClick={onReset}
          type="button"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-bold text-sm shadow-xs transition-all hover:border-slate-400 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-slate-500" />
          <span>Have another subject or time window? Create New Plan</span>
        </button>
      </div>

      {/* Interactive Focus Timer Modal */}
      {activeTimerBlock && (
        <FocusTimerModal
          block={activeTimerBlock}
          onClose={() => setActiveTimerBlock(null)}
          onCompleteBlock={(id) => handleToggleComplete(id)}
        />
      )}
    </div>
  );
};
