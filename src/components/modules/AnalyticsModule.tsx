/**
 * BLACK S.H.E.E.P. - Module 07: Analytics & Anomaly Detection
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  AlertTriangle,
  Brain,
  Flame,
} from 'lucide-react';
import { Anomaly, Experiment } from '../../types';

interface AnalyticsModuleProps {
  anomalies: Anomaly[];
  experiments: Experiment[];
  onInvestigateAnomaly: (id: string) => Promise<void>;
}

export const AnalyticsModule: React.FC<AnalyticsModuleProps> = ({
  anomalies,
  experiments,
  onInvestigateAnomaly,
}) => {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(
    anomalies[0]?.id || null
  );

  const activeAnomaly = anomalies.find((a) => a.id === selectedAnomalyId) || anomalies[0];

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 07</span>
            <span>·</span>
            <span>ANOMALY & PREDICTION DEVIATION ANALYTICS</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            BEHAVIORAL ANALYTICS
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Statistical deviation tracking, prediction accuracy evaluations, and anomaly diagnostic matrix.
          </p>
        </div>

        {/* Global Anomaly Status */}
        <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border-2 border-black text-xs font-mono-data">
          <span className="text-zinc-600 font-semibold">ANOMALY DETECTORS:</span>
          <span className="text-black font-bold">CALIBRATED</span>
          <span className="text-zinc-400">|</span>
          <span className="text-red-600 font-bold">{anomalies.length} ACTIVE ALERTS</span>
        </div>
      </div>

      {/* Top Telemetry Visual Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Prediction Accuracy */}
        <div className="p-5 rounded-xl bg-white border-2 border-black space-y-2 shadow-xs">
          <span className="text-xs font-mono-data text-zinc-600 font-bold">PREDICTION ACCURACY</span>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display text-black">71.4%</span>
            <span className="text-xs font-mono-data text-red-600 font-bold">DEVIATION: 28.6%</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-normal">
            Measured across 144 observation cycles and 3 active experiment protocols.
          </p>
        </div>

        {/* Critical Anomaly Volume */}
        <div className="p-5 rounded-xl bg-white border-2 border-black space-y-2 shadow-xs">
          <span className="text-xs font-mono-data text-zinc-600 font-bold">CRITICAL ANOMALY SIGNALS</span>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display text-red-600">
              {anomalies.filter((a) => a.anomalyScore === 'CRITICAL' || a.anomalyScore === 'HIGH').length}
            </span>
            <span className="text-xs font-mono-data text-black font-bold">ACTIVE AUDIT</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-normal">
            High priority anomalies requiring neurological memory cache and attachment auditing.
          </p>
        </div>

        {/* Decision Volatility */}
        <div className="p-5 rounded-xl bg-white border-2 border-black space-y-2 shadow-xs">
          <span className="text-xs font-mono-data text-zinc-600 font-bold">DECISION STABILITY INDEX</span>
          <div className="flex items-baseline justify-between">
            <span className="text-4xl font-display text-black">64.2%</span>
            <span className="text-xs font-mono-data text-emerald-600 font-bold">NORMAL TOLERANCE</span>
          </div>
          <p className="text-[11px] text-zinc-600 font-normal">
            Cohort baseline conformity maintains equilibrium in 5 of 6 monitored environments.
          </p>
        </div>
      </div>

      {/* Main Grid: Anomaly Alert Log & Inspection Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Anomaly Log (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-600 px-1 font-semibold">
            <span>DETECTED ANOMALIES ({anomalies.length})</span>
            <span>SORT: SEVERITY</span>
          </div>

          {anomalies.map((anom) => {
            const isSelected = activeAnomaly?.id === anom.id;
            return (
              <div
                key={anom.id}
                onClick={() => setSelectedAnomalyId(anom.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50/60 shadow-xs'
                    : 'border-black/20 bg-zinc-50 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono-data text-red-600 font-bold">
                      {anom.code}
                    </span>
                    <span className="text-xs font-mono-data text-black font-semibold">
                      {anom.subjectCode} ({anom.subjectName})
                    </span>
                  </div>
                  <span
                    className={`text-[10px] font-mono-data px-2 py-0.5 rounded font-bold ${
                      anom.anomalyScore === 'CRITICAL'
                        ? 'bg-red-600 text-white'
                        : anom.anomalyScore === 'HIGH'
                        ? 'bg-red-100 text-red-700 border border-red-300'
                        : 'bg-zinc-200 text-zinc-800'
                    }`}
                  >
                    SCORE: {anom.anomalyScore}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-black mb-1 leading-snug">{anom.title}</h3>
                <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed mb-2">
                  {anom.description}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[10px] font-mono-data text-zinc-600">
                  <span>CATEGORY: {anom.category}</span>
                  <span className="text-red-600 font-bold">STATUS: {anom.status}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Deep Anomaly Diagnostic Console (7 Cols) */}
        <div className="lg:col-span-7">
          {activeAnomaly ? (
            <div className="bg-white border-2 border-black rounded-xl p-6 space-y-5 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <Flame className="w-5 h-5 text-red-600" />
                  <h2 className="font-display text-2xl text-black tracking-wide">
                    DIAGNOSTIC CONSOLE: {activeAnomaly.code}
                  </h2>
                </div>
                <button
                  onClick={() => onInvestigateAnomaly(activeAnomaly.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors cursor-pointer"
                >
                  SET STATUS: INVESTIGATING
                </button>
              </div>

              {/* Subject & Timing Lockup */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono-data bg-zinc-50 p-3 rounded-lg border border-black/20">
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold">SUBJECT:</span>
                  <span className="text-black font-bold text-sm">
                    {activeAnomaly.subjectName} ({activeAnomaly.subjectCode})
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px] font-bold">CATEGORY:</span>
                  <span className="text-red-600 font-bold">{activeAnomaly.category}</span>
                </div>
              </div>

              {/* Historical Baseline vs Observed Signal */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20 space-y-1">
                  <span className="text-[10px] font-mono-data text-zinc-600 uppercase tracking-wider block font-bold">
                    HISTORICAL BASELINE EXPECTATION
                  </span>
                  <p className="text-xs text-black font-normal">
                    {activeAnomaly.historicalBaseline}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-red-50 border-2 border-red-600 space-y-1">
                  <span className="text-[10px] font-mono-data text-red-600 uppercase tracking-wider block font-bold">
                    ACTUAL OBSERVED SIGNAL IN SIMULATION
                  </span>
                  <p className="text-xs text-black font-bold">
                    {activeAnomaly.observedSignal}
                  </p>
                </div>
              </div>

              {/* AI Explanation / Simulation Hypothesis */}
              {activeAnomaly.aiExplanation && (
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold">
                    <Brain className="w-4 h-4 text-red-600" />
                    <span>AI SIMULATION ANOMALY INTERPRETATION</span>
                  </div>
                  <p className="text-xs text-zinc-800 font-normal leading-relaxed">
                    {activeAnomaly.aiExplanation}
                  </p>
                  <p className="text-[10px] font-mono-data text-zinc-500 pt-1 border-t border-black/10">
                    Grounded in RAG behavioral treatises (Thinking Fast/Slow & Limbic Threat Models).
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-black rounded-xl text-center p-6 bg-zinc-50">
              <AlertTriangle className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-600 font-mono-data">Select an anomaly to open diagnostic terminal</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
