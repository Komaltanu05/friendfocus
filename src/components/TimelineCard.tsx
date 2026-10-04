import React from 'react';
import {
  BookOpen,
  Coffee,
  CheckCircle2,
  Sparkles,
  Play,
  Lightbulb,
  Check,
} from 'lucide-react';
import { TimelineItem } from '../types';

interface TimelineCardProps {
  item: TimelineItem;
  index: number;
  isLast: boolean;
  onToggleComplete: (id: string) => void;
  onStartTimer: (item: TimelineItem) => void;
}

export const TimelineCard: React.FC<TimelineCardProps> = ({
  item,
  index,
  isLast,
  onToggleComplete,
  onStartTimer,
}) => {
  const isCompleted = !!item.completed;

  // Visual theming based on block type
  const config = {
    study: {
      tag: 'Study Block',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      dotBg: 'bg-indigo-600 ring-indigo-100',
      borderAccent: 'border-l-indigo-500',
      icon: <BookOpen className="w-4 h-4 text-indigo-600" />,
      cardBg: isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200/90',
    },
    break: {
      tag: 'Restorative Break',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      dotBg: 'bg-emerald-500 ring-emerald-100',
      borderAccent: 'border-l-emerald-400',
      icon: <Coffee className="w-4 h-4 text-emerald-600" />,
      cardBg: isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200/90',
    },
    revision: {
      tag: 'Final Active Recall',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200/80',
      dotBg: 'bg-amber-500 ring-amber-100',
      borderAccent: 'border-l-amber-500',
      icon: <CheckCircle2 className="w-4 h-4 text-amber-600" />,
      cardBg: isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200/90',
    },
  }[item.type];

  return (
    <div className="relative pl-6 sm:pl-8 pb-6 group">
      {/* Vertical timeline line */}
      {!isLast && (
        <div
          className={`absolute left-[11px] sm:left-[15px] top-6 bottom-0 w-0.5 ${
            isCompleted ? 'bg-emerald-300' : 'bg-slate-200'
          } transition-colors`}
        />
      )}

      {/* Timeline Node Dot */}
      <div
        className={`absolute left-0 sm:left-1 top-4 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
          isCompleted
            ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
            : `${config.dotBg} text-white ring-4`
        }`}
      >
        {isCompleted ? (
          <Check className="w-3.5 h-3.5 stroke-[3]" />
        ) : (
          <span className="text-[10px] font-bold">{index + 1}</span>
        )}
      </div>

      {/* Main Card */}
      <div
        className={`rounded-2xl p-5 border border-l-4 ${config.borderAccent} ${config.cardBg} shadow-xs hover:shadow-md transition-all duration-200`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
          {/* Tag & Type badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${config.badgeBg}`}
            >
              {config.icon}
              <span>{config.tag}</span>
            </span>

            <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {item.timeRange || `${item.durationMinutes} min`}
            </span>

            <span className="text-xs text-slate-400 font-medium">
              ({item.durationMinutes} mins)
            </span>
          </div>

          {/* Quick Actions (Check & Timer) */}
          <div className="flex items-center gap-2 self-end sm:self-auto">
            <button
              onClick={() => onStartTimer(item)}
              type="button"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 border border-slate-200/80 transition-colors"
              title="Start timer for this block"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Timer</span>
            </button>

            <button
              onClick={() => onToggleComplete(item.id)}
              type="button"
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                isCompleted
                  ? 'bg-emerald-100/80 text-emerald-800 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-600 border-slate-300'
              }`}
              title={isCompleted ? 'Mark incomplete' : 'Mark finished'}
            >
              <Check className={`w-3.5 h-3.5 ${isCompleted ? 'stroke-[2.5]' : ''}`} />
              <span>{isCompleted ? 'Done' : 'Mark Done'}</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <h3
          className={`font-bold text-base text-slate-900 mb-1.5 ${
            isCompleted ? 'line-through text-slate-400' : ''
          }`}
        >
          {item.title}
        </h3>

        {/* Task Description */}
        <p
          className={`text-sm leading-relaxed ${
            isCompleted ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {item.taskDescription}
        </p>

        {/* Tactical Tip (if available) */}
        {item.tip && !isCompleted && (
          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-2 text-xs text-slate-500 bg-slate-50/70 p-2.5 rounded-xl">
            <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-700 font-semibold">Pro tip: </strong>
              <span>{item.tip}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
