/**
 * BLACK S.H.E.E.P. - Multi-Stage AI Thinking & Synthesis Indicator
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState, useEffect } from 'react';
import { Brain, Cpu, Database, Eye, GitFork, Sparkles, CheckCircle2 } from 'lucide-react';

interface AIThinkingIndicatorProps {
  statusMessage?: string;
  isCompleted?: boolean;
}

const STAGES = [
  { id: 1, label: 'BEHAVIORAL CONTEXT', detail: 'Ingesting subject baseline and recent event telemetry', icon: Eye },
  { id: 2, label: 'RETRIEVING KNOWLEDGE', detail: 'Querying vector index across Kahneman, Navarro, & reference layers', icon: Database },
  { id: 3, label: 'MATCHING PATTERNS', detail: 'Correlating nonverbal signals and conformity divergence', icon: Cpu },
  { id: 4, label: 'ANALYZING HISTORY', detail: 'Cross-referencing 143 observation cycles and relationship trust scores', icon: Brain },
  { id: 5, label: 'GENERATING HYPOTHESIS', detail: 'Synthesizing simulation-level causality parameters with Gemini', icon: GitFork },
  { id: 6, label: 'FORMING EXPERIMENT', detail: 'Structuring test variables, observation window, & success criteria', icon: Sparkles },
];

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ statusMessage, isCompleted }) => {
  const [activeStage, setActiveStage] = useState<number>(1);

  useEffect(() => {
    if (isCompleted) {
      setActiveStage(6);
      return;
    }

    const interval = setInterval(() => {
      setActiveStage((prev) => (prev < 6 ? prev + 1 : 1));
    }, 1100);

    return () => clearInterval(interval);
  }, [isCompleted]);

  return (
    <div className="border-2 border-black bg-white p-5 rounded-xl shadow-sm">
      <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
          <span className="font-display text-lg tracking-wider text-black">
            AI BEHAVIORAL COGNITION PIPELINE
          </span>
        </div>
        <span className="text-xs font-mono-data text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
          MODEL: GEMINI-3.8-FLASH // TOP-K SEMANTIC EMBEDDING
        </span>
      </div>

      {statusMessage && (
        <p className="text-xs text-zinc-700 font-mono-data mb-3 italic">
          {statusMessage}
        </p>
      )}

      {/* Progression Track */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-2 pt-1">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const isActive = activeStage === stage.id;
          const isDone = activeStage > stage.id || isCompleted;

          return (
            <div
              key={stage.id}
              className={`p-2.5 rounded-lg border-2 transition-all duration-300 flex flex-col justify-between ${
                isActive
                  ? 'border-red-600 bg-red-50/80 shadow-xs'
                  : isDone
                  ? 'border-black bg-zinc-50'
                  : 'border-zinc-200 bg-white opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono-data text-zinc-500 font-bold">0{stage.id}</span>
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                ) : (
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isActive ? 'text-red-600 animate-bounce' : 'text-zinc-400'
                    }`}
                  />
                )}
              </div>
              <div>
                <p
                  className={`text-[11px] font-bold tracking-wide ${
                    isActive ? 'text-red-700' : isDone ? 'text-black' : 'text-zinc-500'
                  }`}
                >
                  {stage.label}
                </p>
                <p className="text-[9px] text-zinc-600 leading-tight mt-1 line-clamp-2">
                  {stage.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
