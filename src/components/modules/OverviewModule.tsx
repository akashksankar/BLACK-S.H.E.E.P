/**
 * BLACK S.H.E.E.P. - Module 01: Overview
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React from 'react';
import {
  FolderKanban,
  Users,
  FlaskConical,
  AlertTriangle,
  BrainCircuit,
  Database,
  ArrowUpRight,
  Activity,
  Flame,
} from 'lucide-react';
import { ResearchCase, Subject, Experiment, Anomaly } from '../../types';

interface OverviewModuleProps {
  cases: ResearchCase[];
  subjects: Subject[];
  experiments: Experiment[];
  anomalies: Anomaly[];
  onNavigate: (module: any) => void;
  onSelectCase: (caseId: string) => void;
  onSelectSubject: (subId: string) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({
  cases,
  subjects,
  experiments,
  anomalies,
  onNavigate,
  onSelectCase,
  onSelectSubject,
}) => {
  const activeCases = cases.filter((c) => c.status === 'ACTIVE').length;
  const runningExperiments = experiments.filter(
    (e) => e.status === 'RUNNING' || e.status === 'OBSERVING'
  ).length;
  const highAnomalies = anomalies.filter(
    (a) => a.anomalyScore === 'HIGH' || a.anomalyScore === 'CRITICAL'
  ).length;

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 01</span>
            <span>·</span>
            <span>CENTRAL RESEARCH TELEMETRY</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            SYNTHETIC CIVILIZATION OVERVIEW
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Real-time status of monitored humanoid subjects, active experimental trials, and behavioral deviations.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('experiments')}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>DEPLOY EXPERIMENT</span>
          </button>
          <button
            onClick={() => onNavigate('rag_knowledge')}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-1.5 border border-black cursor-pointer shadow-sm"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-red-400" />
            <span>KNOWLEDGE BASE & RAG</span>
          </button>
        </div>
      </div>

      {/* Primary Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Metric 1: Active Cases */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">ACTIVE CASES</span>
            <FolderKanban className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-black tracking-wider">{activeCases}</p>
          <p className="text-[10px] font-mono-data text-zinc-600 mt-1">
            {cases.length} Total Registered
          </p>
        </div>

        {/* Metric 2: Monitored Subjects */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">HUMANOIDS</span>
            <Users className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-black tracking-wider">{subjects.length}</p>
          <p className="text-[10px] font-mono-data text-red-600 font-semibold mt-1">
            100% Neural Telemetry Live
          </p>
        </div>

        {/* Metric 3: Running Trials */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">RUNNING TRIALS</span>
            <FlaskConical className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-black tracking-wider">{runningExperiments}</p>
          <p className="text-[10px] font-mono-data text-zinc-600 mt-1">
            {experiments.length} Total Built
          </p>
        </div>

        {/* Metric 4: High Anomalies */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">ANOMALIES</span>
            <AlertTriangle className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-red-600 tracking-wider">{anomalies.length}</p>
          <p className="text-[10px] font-mono-data text-red-600 font-bold mt-1">
            {highAnomalies} Critical Priority
          </p>
        </div>

        {/* Metric 5: RAG Vector Engine */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">RAG INDEXED</span>
            <Database className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-black tracking-wider">998</p>
          <p className="text-[10px] font-mono-data text-zinc-600 mt-1">
            8 Treatises + Local Folder
          </p>
        </div>

        {/* Metric 6: Simulation Cycle */}
        <div className="bg-white border-2 border-black p-4 rounded-xl shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between text-zinc-500 mb-2">
            <span className="text-[10px] font-mono-data uppercase tracking-wider font-bold text-black">EPOCH</span>
            <Activity className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-4xl font-display text-black tracking-wider">#144</p>
          <p className="text-[10px] font-mono-data text-zinc-600 mt-1">
            Clock: T+14:22:00
          </p>
        </div>
      </div>

      {/* Anomaly Alert Banner */}
      {anomalies.length > 0 && (
        <div className="bg-red-50 border-2 border-red-600 p-4 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded bg-red-600 text-white shadow-xs">
              <Flame className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-xl text-black tracking-wide">
                  CRITICAL BEHAVIORAL ANOMALY: {anomalies[0].code}
                </span>
                <span className="text-[10px] font-mono-data bg-red-600 text-white font-bold px-2 py-0.5 rounded">
                  SCORE: {anomalies[0].anomalyScore}
                </span>
              </div>
              <p className="text-xs text-zinc-800 mt-0.5">
                Subject {anomalies[0].subjectName} ({anomalies[0].subjectCode}) — {anomalies[0].title}. Baseline conflict avoidance broken.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('analytics')}
            className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide whitespace-nowrap cursor-pointer"
          >
            INVESTIGATE DEVIATION
          </button>
        </div>
      )}

      {/* Two-Column Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Cases & Monitored Subjects (2 Cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Active Cases Section */}
          <div className="bg-white border-2 border-black rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-red-600" />
                <h2 className="font-display text-2xl text-black tracking-wider">ACTIVE RESEARCH CASES</h2>
              </div>
              <button
                onClick={() => onNavigate('cases')}
                className="text-xs font-mono-data text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>VIEW ALL CASES</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {cases.slice(0, 2).map((c) => (
                <div
                  key={c.id}
                  onClick={() => onSelectCase(c.id)}
                  className="p-4 rounded-lg border-2 border-black/20 bg-zinc-50 hover:border-black transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono-data text-red-600 font-bold">{c.code}</span>
                    <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white border border-black font-bold text-black">
                      {c.status}
                    </span>
                  </div>
                  <h3 className="font-display text-xl text-black group-hover:text-red-600 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-zinc-700 mt-1 line-clamp-2">{c.objective}</p>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-black/10 text-[11px] font-mono-data text-zinc-600 font-medium">
                    <span>ENV: {c.environment}</span>
                    <span>SUBJECTS: {c.assignedSubjectIds.length}</span>
                    <span className="text-red-600 font-bold">ANOMALIES: {c.anomalyCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Subjects Live Telemetry Summary */}
          <div className="bg-white border-2 border-black rounded-xl p-5 shadow-xs">
            <div className="flex items-center justify-between border-b border-black/10 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-red-600" />
                <h2 className="font-display text-2xl text-black tracking-wider">MONITORED SUBJECT DOSSIERS</h2>
              </div>
              <button
                onClick={() => onNavigate('subjects')}
                className="text-xs font-mono-data text-red-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>OPEN DOSSIERS</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {subjects.slice(0, 3).map((sub) => (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className="p-3.5 rounded-lg border-2 border-black/20 bg-zinc-50 hover:border-black transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    <img
                      src={sub.avatarUrl}
                      alt={sub.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded object-cover border-2 border-black"
                    />
                    <div>
                      <span className="text-[10px] font-mono-data text-red-600 font-bold">{sub.code}</span>
                      <h4 className="font-display text-lg text-black">{sub.name}</h4>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-[11px] font-mono-data">
                    <div className="flex justify-between text-zinc-600 font-medium">
                      <span>Stress</span>
                      <span className="text-black font-bold">{sub.emotionalState.stress}%</span>
                    </div>
                    <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-red-600 h-full"
                        style={{ width: `${sub.emotionalState.stress}%` }}
                      />
                    </div>

                    <div className="flex justify-between text-zinc-600 font-medium pt-1">
                      <span>Conformity</span>
                      <span className="text-black font-bold">
                        {sub.behavioralDimensions.find((b) => b.name === 'Conformity')?.value || 60}%
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Experiment Spotlight & Local Knowledge Base (1 Col) */}
        <div className="space-y-6">
          {/* Active Experiment Spotlight */}
          <div className="bg-white border-2 border-black rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3 mb-4">
              <FlaskConical className="w-5 h-5 text-red-600" />
              <h2 className="font-display text-2xl text-black tracking-wider">LATEST TRIAL</h2>
            </div>

            {experiments[0] && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-data text-red-600 font-bold">{experiments[0].code}</span>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-red-50 text-red-700 font-bold border border-red-200">
                    {experiments[0].status}
                  </span>
                </div>

                <h3 className="font-display text-xl text-black">{experiments[0].title}</h3>
                <p className="text-xs text-zinc-700">{experiments[0].objective}</p>

                {/* Prediction vs Actual Box */}
                {experiments[0].actualOutcome && (
                  <div className="p-3 rounded-lg bg-zinc-50 border border-black/20 space-y-2 text-xs font-mono-data">
                    <div className="text-zinc-600">
                      <span className="text-black font-bold">PREDICTED:</span>{' '}
                      {experiments[0].prediction?.predictedOutcome}
                    </div>
                    <div className="text-zinc-900">
                      <span className="text-red-600 font-bold">ACTUAL:</span>{' '}
                      {experiments[0].actualOutcome.observedBehavior}
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-black/10 text-[10px] font-bold">
                      <span className="text-red-600">DEVIATION: HIGH</span>
                      <span className="text-black">ERROR: 68%</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => onNavigate('experiments')}
                  className="w-full mt-2 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors text-center cursor-pointer"
                >
                  OPEN EXPERIMENT LAB
                </button>
              </div>
            )}
          </div>

          {/* Local Knowledge Base Folder Spotlight */}
          <div className="bg-white border-2 border-black rounded-xl p-5 shadow-xs">
            <div className="flex items-center gap-2 border-b border-black/10 pb-3 mb-3">
              <Database className="w-5 h-5 text-red-600" />
              <h2 className="font-display text-2xl text-black tracking-wider">LOCAL KNOWLEDGE REPOSITORY</h2>
            </div>
            <p className="text-xs text-zinc-700 font-normal leading-relaxed mb-3">
              Mounted at <code className="bg-zinc-100 text-red-600 px-1 py-0.5 rounded font-mono-data font-bold">/knowledge_base/</code>. Place PDFs and docs directly in the repository for semantic retrieval.
            </p>
            <div className="space-y-1.5 text-xs font-mono-data text-zinc-700">
              <div className="flex justify-between py-1 border-b border-black/10">
                <span className="font-medium">/knowledge_base/docs/</span>
                <span className="text-red-600 font-bold">8 MANUSCRIPTS</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/10">
                <span className="font-medium">/knowledge_base/pdfs/</span>
                <span className="text-black font-bold">READY</span>
              </div>
            </div>
            <button
              onClick={() => onNavigate('rag_knowledge')}
              className="w-full mt-3 py-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-mono-data font-bold transition-colors cursor-pointer"
            >
              BROWSE KNOWLEDGE REPOSITORY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
