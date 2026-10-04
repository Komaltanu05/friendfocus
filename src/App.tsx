import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { InputSection } from './components/InputSection';
import { TimelineView } from './components/TimelineView';
import { LoadingState } from './components/LoadingState';
import { Footer } from './components/Footer';
import { StudyPlan } from './types';
import { AlertCircle, RotateCcw, Sparkles } from 'lucide-react';

export default function App() {
  const [currentSituation, setCurrentSituation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);

  const handleCreatePlan = async (situationText: string) => {
    setCurrentSituation(situationText);
    setIsLoading(true);
    setError(null);

    try {
      // Call Netlify Function endpoint directly (with /api/ fallback)
      let response = await fetch('/.netlify/functions/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ situation: situationText }),
      });

      // Graceful fallback to /api/generate-plan if 404
      if (!response.ok && response.status === 404) {
        response = await fetch('/api/generate-plan', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ situation: situationText }),
        });
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate your study plan.');
      }

      setPlan(data);
    } catch (err: any) {
      console.error('Error in handleCreatePlan:', err);
      setError(err?.message || 'Something went wrong while contacting Gemma. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setPlan(null);
    setError(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-10">
        {/* Error notification banner */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start justify-between gap-3 shadow-xs">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Unable to create study plan</p>
                <p className="mt-0.5 text-xs text-rose-700/90">{error}</p>
              </div>
            </div>
            <button
              onClick={() => handleCreatePlan(currentSituation)}
              type="button"
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition-colors shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {/* Dynamic state content */}
        {isLoading ? (
          <LoadingState />
        ) : plan ? (
          <TimelineView plan={plan} onReset={handleReset} />
        ) : (
          <InputSection
            onSubmit={handleCreatePlan}
            isLoading={isLoading}
            initialValue={currentSituation}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}
