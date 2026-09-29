/**
 * BLACK S.H.E.E.P. - Module 05: Behavior Lab
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  Activity,
  Sliders,
  Eye,
  Info,
} from 'lucide-react';
import { Subject } from '../../types';

interface BehaviorLabModuleProps {
  subjects: Subject[];
}

export const BehaviorLabModule: React.FC<BehaviorLabModuleProps> = ({ subjects }) => {
  const [selectedSubId, setSelectedSubId] = useState<string>(subjects[0]?.id || '');
  const activeSubject = subjects.find((s) => s.id === selectedSubId) || subjects[0];

  const [socialPressureMultiplier, setSocialPressureMultiplier] = useState(1.2);
  const [egoDepletionFactor, setEgoDepletionFactor] = useState(1.4);

  const baseRebellion = activeSubject?.riskIndicators?.rebellionProbability || 45;
  const simulatedRebellion = Math.min(
    95,
    Math.round(baseRebellion * (socialPressureMultiplier * 0.6 + egoDepletionFactor * 0.4))
  );

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 05</span>
            <span>·</span>
            <span>BEHAVIORAL DYNAMICS & SIGNAL LAB</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            BEHAVIOR LAB
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Calibrate 15 simulation dimensions, track nonverbal micro-signals, and simulate sensitivity shifts.
          </p>
        </div>

        {/* Humanoid Selector */}
        <div className="flex items-center gap-2 bg-zinc-50 p-1.5 rounded-xl border border-black/20">
          <span className="text-xs font-mono-data text-black font-bold px-2">SUBJECT:</span>
          {subjects.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedSubId(s.id)}
              className={`px-3 py-1 rounded text-xs font-mono-data transition-colors cursor-pointer ${
                selectedSubId === s.id
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-zinc-700 hover:text-black hover:bg-zinc-200'
              }`}
            >
              {s.code} ({s.name})
            </button>
          ))}
        </div>
      </div>

      {/* Non-Diagnostic Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-red-50 border-2 border-red-600 flex items-start gap-3 shadow-xs">
        <Info className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-900 leading-relaxed">
          <span className="font-bold text-black">SIMULATION VARIABLE CLASSIFICATION:</span> The 15
          behavioral dimensions and nonverbal indicators are simulation variables and inferred behavioral-model
          parameters. They do NOT represent scientifically validated medical or psychological diagnostic criteria.
        </div>
      </div>

      {/* Grid: 15 Dimensions + Sensitivity Tuning */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 15 Behavioral Dimensions Grid (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-data text-black font-bold border-b border-black/10 pb-2">
            <span>15 CORE SIMULATION DIMENSIONS — {activeSubject?.name.toUpperCase()} ({activeSubject?.code})</span>
            <span className="text-red-600">CONFIDENCE: &gt;80%</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {activeSubject?.behavioralDimensions.map((dim, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-zinc-50 border border-black/20 space-y-2 hover:border-black transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-black tracking-wide">{dim.name}</span>
                  <div className="flex items-center gap-1.5 font-mono-data text-xs">
                    <span className="text-red-600 font-bold">{dim.value}%</span>
                    <span
                      className={`text-[10px] font-bold ${
                        dim.delta > 0
                          ? 'text-red-600'
                          : dim.delta < 0
                          ? 'text-emerald-600'
                          : 'text-zinc-400'
                      }`}
                    >
                      ({dim.delta > 0 ? `+${dim.delta}%` : `${dim.delta}%`})
                    </span>
                  </div>
                </div>

                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-red-600 h-full"
                    style={{ width: `${dim.value}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono-data text-zinc-500">
                  <span>Confidence: {dim.confidence}%</span>
                  <span className="truncate max-w-[150px]">Ref: {dim.inferredFrom}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Sensitivity Tuning & Nonverbal Matrix (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Dynamic Sensitivity Tuner */}
          <div className="p-5 rounded-xl border-2 border-black bg-white space-y-4 shadow-xs">
            <div className="flex items-center gap-2 border-b border-black/10 pb-2 text-xs font-mono-data text-black font-bold">
              <Sliders className="w-4 h-4 text-red-600" />
              <span>SENSITIVITY & DEVIATION PROJECTION</span>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-mono-data text-zinc-800 mb-1 font-semibold">
                  <span>Social Pressure Multiplier</span>
                  <span className="text-red-600 font-bold">{socialPressureMultiplier}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={socialPressureMultiplier}
                  onChange={(e) => setSocialPressureMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono-data text-zinc-800 mb-1 font-semibold">
                  <span>Cognitive Ego Depletion</span>
                  <span className="text-red-600 font-bold">{egoDepletionFactor}x</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={egoDepletionFactor}
                  onChange={(e) => setEgoDepletionFactor(parseFloat(e.target.value))}
                  className="w-full accent-red-600"
                />
              </div>
            </div>

            {/* Inferred Output */}
            <div className="p-4 rounded-xl bg-red-50 border-2 border-red-600 space-y-1.5 font-mono-data text-xs">
              <span className="text-zinc-600 block text-[10px] font-bold">PROJECTED REBELLION PROBABILITY:</span>
              <div className="flex items-baseline justify-between">
                <span className="text-3xl font-bold text-black">{simulatedRebellion}%</span>
                <span className="text-xs text-red-600 font-bold">
                  Base: {baseRebellion}% ({simulatedRebellion > baseRebellion ? `+${simulatedRebellion - baseRebellion}%` : '0%'})
                </span>
              </div>
              <p className="text-[10px] text-zinc-700 italic pt-1 border-t border-red-200">
                At this depletion level, Kahneman System 1 defaults override habitual conflict-avoidance.
              </p>
            </div>
          </div>

          {/* Observed Body Language Signals */}
          <div className="p-5 rounded-xl border-2 border-black bg-white space-y-3 shadow-xs">
            <div className="flex items-center gap-2 border-b border-black/10 pb-2 text-xs font-mono-data text-black font-bold">
              <Eye className="w-4 h-4 text-red-600" />
              <span>NONVERBAL SIGNALS TRACKER</span>
            </div>

            <div className="space-y-2.5">
              {activeSubject?.bodyLanguageSignals.map((sig) => (
                <div key={sig.id} className="p-3.5 rounded-lg bg-zinc-50 border border-black/20 space-y-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-black">{sig.signal}</span>
                    <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white border border-red-600 text-red-600 font-bold">
                      {sig.frequency}
                    </span>
                  </div>
                  <p className="text-zinc-700 text-[11px]">{sig.context}</p>
                  <p className="text-[10px] font-mono-data text-zinc-500 pt-1 border-t border-black/10">
                    Ref: <span className="text-red-600 font-semibold">{sig.referenceSource}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
