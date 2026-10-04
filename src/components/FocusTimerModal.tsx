import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, X, Bell, CheckCircle2, Clock } from 'lucide-react';
import { TimelineItem } from '../types';
import { playChime } from '../utils/sound';

interface FocusTimerModalProps {
  block: TimelineItem;
  onClose: () => void;
  onCompleteBlock?: (id: string) => void;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  block,
  onClose,
  onCompleteBlock,
}) => {
  const totalSeconds = (block.durationMinutes || 25) * 60;
  const [secondsLeft, setSecondsLeft] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: any = null;

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            setIsActive(false);
            setIsFinished(true);
            playChime();
            if (onCompleteBlock) onCompleteBlock(block.id);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, secondsLeft, block.id, onCompleteBlock]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const progressPercent = ((totalSeconds - secondsLeft) / totalSeconds) * 100;

  const handleReset = () => {
    setIsActive(false);
    setSecondsLeft(totalSeconds);
    setIsFinished(false);
  };

  const getThemeColor = () => {
    switch (block.type) {
      case 'break':
        return 'emerald';
      case 'revision':
        return 'amber';
      case 'study':
      default:
        return 'indigo';
    }
  };

  const color = getThemeColor();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center relative overflow-hidden animate-in fade-in zoom-in-95">
        {/* Top bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
            <Clock className="w-3.5 h-3.5" />
            <span>Focus Companion</span>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Block info */}
        <div className="mt-4 mb-2">
          <span
            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
              color === 'emerald'
                ? 'bg-emerald-100 text-emerald-800'
                : color === 'amber'
                ? 'bg-amber-100 text-amber-800'
                : 'bg-indigo-100 text-indigo-800'
            }`}
          >
            {block.type} • {block.durationMinutes}m
          </span>
          <h3 className="font-extrabold text-slate-800 text-lg line-clamp-1">{block.title}</h3>
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 px-2">{block.taskDescription}</p>
        </div>

        {/* Big Circular / Timer Display */}
        <div className="my-6 flex flex-col items-center justify-center">
          <div className="text-5xl font-extrabold font-mono tracking-tight text-slate-900 mb-2">
            {formattedTime}
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden mt-2">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                color === 'emerald'
                  ? 'bg-emerald-500'
                  : color === 'amber'
                  ? 'bg-amber-500'
                  : 'bg-indigo-600'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isFinished ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-4 text-emerald-800 text-xs font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>Well done! Block completed. Take a moment to acknowledge your win.</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400 mb-4 flex items-center justify-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-slate-400" />
            <span>Gentle chime will play when time is up</span>
          </div>
        )}

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={handleReset}
            type="button"
            className="p-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Reset timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsActive(!isActive)}
            type="button"
            className={`px-6 py-3 rounded-2xl font-bold text-white flex items-center gap-2 transition-all shadow-md active:scale-95 ${
              isActive
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                : color === 'emerald'
                ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>{secondsLeft === totalSeconds ? 'Start' : 'Resume'}</span>
              </>
            )}
          </button>

          {onCompleteBlock && (
            <button
              onClick={() => {
                onCompleteBlock(block.id);
                onClose();
              }}
              type="button"
              className="p-3 rounded-2xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-colors"
              title="Mark completed"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
