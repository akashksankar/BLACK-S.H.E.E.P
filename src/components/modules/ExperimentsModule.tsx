/**
 * BLACK S.H.E.E.P. - Module 04: Experiment Builder & Execution Engine
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  FlaskConical,
  Plus,
  Play,
  CheckCircle,
  Sparkles,
  X,
} from 'lucide-react';
import { Experiment, ResearchCase, Subject } from '../../types';
import { AIThinkingIndicator } from '../common/AIThinkingIndicator';

interface ExperimentsModuleProps {
  experiments: Experiment[];
  cases: ResearchCase[];
  subjects: Subject[];
  onCreateExperiment: (data: any) => Promise<void>;
  onExecuteExperiment: (id: string) => Promise<void>;
  onRecordOutcome: (id: string, outcomeData: any) => Promise<void>;
  onGenerateAIScenario: (params: any) => Promise<any>;
}

export const ExperimentsModule: React.FC<ExperimentsModuleProps> = ({
  experiments,
  cases,
  subjects,
  onCreateExperiment,
  onExecuteExperiment,
  onRecordOutcome,
  onGenerateAIScenario,
}) => {
  const [selectedExpId, setSelectedExpId] = useState<string | null>(experiments[0]?.id || null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showOutcomeModal, setShowOutcomeModal] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);

  // Outcome recording state
  const [observedBehavior, setObservedBehavior] = useState('');
  const [deviationScore, setDeviationScore] = useState<'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL'>('HIGH');
  const [predictionError, setPredictionError] = useState(65);

  // New Experiment Form State
  const [formCaseId, setFormCaseId] = useState(cases[0]?.id || '');
  const [formTitle, setFormTitle] = useState('');
  const [formObjective, setFormObjective] = useState('');
  const [formEnvironment, setFormEnvironment] = useState('College Cafeteria');
  const [formTrigger, setFormTrigger] = useState('');
  const [formExpectedBehavior, setFormExpectedBehavior] = useState('');
  const [formScenario, setFormScenario] = useState('');
  const [formWindow, setFormWindow] = useState('30 minutes');
  const [formCriteria, setFormCriteria] = useState('Acoustic tremor & eye aversion measured');
  const [formVariables, setFormVariables] = useState({
    socialPressure: 75,
    emotionalPressure: 70,
    authorityPresence: 40,
    uncertainty: 60,
    isolation: 50,
    rewardIncentive: 45,
  });

  const activeExp = experiments.find((e) => e.id === selectedExpId) || experiments[0];

  const handleGenerateScenarioAI = async () => {
    setIsGeneratingScenario(true);
    try {
      const generated = await onGenerateAIScenario({
        caseId: formCaseId,
        targetVariable: 'Peer Conformity vs Loyalty',
        environment: formEnvironment,
      });

      if (generated) {
        if (!formTitle && generated.scenarioTitle) setFormTitle(generated.scenarioTitle);
        if (generated.narrative) setFormScenario(generated.narrative);
        if (generated.triggerEvent) setFormTrigger(generated.triggerEvent);
        if (generated.recommendedWindow) setFormWindow(generated.recommendedWindow);
        if (generated.observationCriteria) setFormCriteria(generated.observationCriteria.join(', '));
      }
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formObjective || !formTrigger) return;

    await onCreateExperiment({
      caseId: formCaseId,
      title: formTitle,
      objective: formObjective,
      environment: formEnvironment,
      trigger: formTrigger,
      expectedBehavior: formExpectedBehavior,
      scenario: formScenario,
      observationWindow: formWindow,
      successCriteria: formCriteria,
      variables: formVariables,
      subjectIds: ['sub_hx071', 'sub_hx024'],
    });

    setShowCreateModal(false);
    setFormTitle('');
    setFormObjective('');
    setFormTrigger('');
    setFormScenario('');
  };

  const handleRecordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeExp) return;

    await onRecordOutcome(activeExp.id, {
      observedBehavior,
      deviationScore,
      predictionErrorPct: predictionError,
      actualNotes: 'Recorded by researcher from observation console.',
    });

    setShowOutcomeModal(false);
    setObservedBehavior('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 04</span>
            <span>·</span>
            <span>BEHAVIORAL EXPERIMENTATION SUITE</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            EXPERIMENT BUILDER
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Configure scientific stimuli, inject game-world triggers, formulate predictions, and record deviation outcomes.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>NEW EXPERIMENT PROTOCOL</span>
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Experiments Roster (4 Cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-600 px-1 font-semibold">
            <span>EXPERIMENT PROTOCOLS ({experiments.length})</span>
            <span>LIFECYCLE</span>
          </div>

          {experiments.map((exp) => {
            const isSelected = activeExp?.id === exp.id;
            return (
              <div
                key={exp.id}
                onClick={() => setSelectedExpId(exp.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50/60 shadow-xs'
                    : 'border-black/20 bg-zinc-50 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-mono-data text-red-600 font-bold">{exp.code}</span>
                  <span
                    className={`text-[10px] font-mono-data px-2 py-0.5 rounded font-bold ${
                      exp.status === 'RUNNING'
                        ? 'bg-red-600 text-white animate-pulse'
                        : exp.status === 'COMPLETED'
                        ? 'bg-black text-white'
                        : 'bg-white border border-black/30 text-black'
                    }`}
                  >
                    {exp.status}
                  </span>
                </div>

                <h3 className="font-display text-xl text-black mb-1 leading-snug">{exp.title}</h3>
                <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed mb-3">
                  {exp.objective}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-black/10 text-[11px] font-mono-data text-zinc-600 font-medium">
                  <span>ENV: {exp.environment}</span>
                  <span>WINDOW: {exp.observationWindow}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Active Experiment Console (8 Cols) */}
        <div className="lg:col-span-8">
          {activeExp ? (
            <div className="bg-white border-2 border-black rounded-xl p-6 space-y-6 shadow-xs">
              {/* Header with Execution Controls */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-black/10 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded bg-red-600 text-white text-xs font-mono-data font-bold">
                      {activeExp.code}
                    </span>
                    <span className="text-xs font-mono-data text-zinc-600">
                      CASE: <span className="text-black font-bold">{activeExp.caseName || 'COLLEGE SOCIAL PRESSURE'}</span>
                    </span>
                  </div>
                  <h2 className="font-display text-3xl text-black tracking-wide">
                    {activeExp.title}
                  </h2>
                </div>

                {/* Lifecycle Step Actions */}
                <div className="flex items-center gap-2">
                  {activeExp.status !== 'COMPLETED' && (
                    <button
                      onClick={() => onExecuteExperiment(activeExp.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>
                        {activeExp.status === 'READY' || activeExp.status === 'DRAFT'
                          ? 'DEPLOY STIMULUS'
                          : activeExp.status === 'DEPLOYED'
                          ? 'ACTIVATE RUNNING'
                          : 'CYCLE OBSERVATION'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => setShowOutcomeModal(true)}
                    className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-red-400" />
                    <span>RECORD ACTUAL OUTCOME</span>
                  </button>
                </div>
              </div>

              {/* Protocol Spec Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20 space-y-2">
                  <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block">
                    SCENARIO SETUP & NARRATIVE
                  </span>
                  <p className="text-xs text-black leading-relaxed font-normal">
                    {activeExp.scenario || activeExp.objective}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20 space-y-2">
                  <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block">
                    STIMULUS TRIGGER INJECTION
                  </span>
                  <p className="text-xs text-black leading-relaxed font-mono-data font-semibold">
                    "{activeExp.trigger}"
                  </p>
                  <p className="text-[11px] text-zinc-600 font-mono-data pt-1 border-t border-black/10">
                    Observation Window: {activeExp.observationWindow}
                  </p>
                </div>
              </div>

              {/* Experimental Variables Matrix */}
              <div className="space-y-3">
                <span className="text-xs font-mono-data text-black font-bold block">
                  CALIBRATED EXPERIMENT VARIABLES
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Object.entries(activeExp.variables).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-lg bg-zinc-50 border border-black/20">
                      <div className="flex justify-between text-[11px] font-mono-data text-zinc-700 mb-1 font-medium">
                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-red-600 font-bold">{val}%</span>
                      </div>
                      <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-red-600 h-full" style={{ width: `${val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Prediction vs Actual Box */}
              <div className="p-5 rounded-xl border-2 border-black bg-white space-y-4 shadow-xs">
                <div className="flex items-center justify-between border-b border-black/10 pb-2">
                  <span className="text-xs font-mono-data text-black font-bold uppercase tracking-wider">
                    PREDICTION VS ACTUAL BEHAVIOR COMPARISON
                  </span>
                  {activeExp.actualOutcome && (
                    <span className="text-xs font-mono-data px-2.5 py-0.5 rounded bg-red-600 text-white font-bold">
                      DEVIATION: {activeExp.actualOutcome.deviationScore}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Hypothesis / Prediction */}
                  <div className="space-y-1.5 text-xs font-mono-data">
                    <span className="text-zinc-600 font-bold block">PRIOR FORMULATED PREDICTION:</span>
                    <p className="text-black bg-zinc-50 p-3 rounded-lg border border-black/20 font-medium">
                      {activeExp.prediction?.predictedOutcome ||
                        activeExp.expectedBehavior ||
                        'Subject will default to historical baseline.'}
                    </p>
                    {activeExp.prediction?.rationale && (
                      <p className="text-[11px] text-zinc-600 italic">
                        Rationale: {activeExp.prediction.rationale}
                      </p>
                    )}
                  </div>

                  {/* Actual Recorded Behavior */}
                  <div className="space-y-1.5 text-xs font-mono-data">
                    <span className="text-zinc-600 font-bold block">ACTUAL OBSERVED RESPONSE:</span>
                    {activeExp.actualOutcome ? (
                      <div className="bg-red-50 p-3 rounded-lg border-2 border-red-600 space-y-2">
                        <p className="text-black font-bold">
                          {activeExp.actualOutcome.observedBehavior}
                        </p>
                        <div className="flex items-center justify-between text-[11px] text-zinc-700 pt-1 border-t border-red-200">
                          <span className="font-bold text-red-600">Error: {activeExp.actualOutcome.predictionErrorPct}%</span>
                          <span className="text-black">
                            Logged: {new Date(activeExp.actualOutcome.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 rounded-lg border-2 border-dashed border-zinc-300 text-center text-zinc-500 bg-zinc-50">
                        Awaiting execution outcome recording. Click "Record Actual Outcome" after observation window concludes.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-black rounded-xl text-center p-6 bg-zinc-50">
              <FlaskConical className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-600 font-mono-data">Select an experiment to open workbench</p>
            </div>
          )}
        </div>
      </div>

      {/* Record Actual Outcome Modal */}
      {showOutcomeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-2xl text-black tracking-wider">
                RECORD ACTUAL BEHAVIORAL OUTCOME
              </h3>
              <button onClick={() => setShowOutcomeModal(false)} className="text-zinc-500 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  OBSERVED SUBJECT BEHAVIOR *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Detail exact verbal, nonverbal, and physical actions exhibited during the observation window..."
                  value={observedBehavior}
                  onChange={(e) => setObservedBehavior(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    BEHAVIORAL DEVIATION
                  </label>
                  <select
                    value={deviationScore}
                    onChange={(e) => setDeviationScore(e.target.value as any)}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    <option value="LOW">LOW (Matches Baseline)</option>
                    <option value="MODERATE">MODERATE (Subtle Drift)</option>
                    <option value="HIGH">HIGH (Overt Deviation)</option>
                    <option value="CRITICAL">CRITICAL (System Inconsistency)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    PREDICTION ERROR %
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={predictionError}
                    onChange={(e) => setPredictionError(Number(e.target.value))}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowOutcomeModal(false)}
                  className="px-4 py-2 border border-black/30 rounded-lg text-xs font-mono-data text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs font-mono-data cursor-pointer"
                >
                  Commit Outcome
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Experiment Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-2xl text-black tracking-wider">
                DESIGN EXPERIMENTAL PROTOCOL
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* AI Scenario Generator Button */}
            <div className="p-3.5 rounded-xl bg-zinc-50 border-2 border-black flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-black">AI Scenario Generator</p>
                <p className="text-[11px] text-zinc-600 font-mono-data">
                  Generate realistic behavioral branches grounded in RAG domain sources.
                </p>
              </div>
              <button
                type="button"
                onClick={handleGenerateScenarioAI}
                disabled={isGeneratingScenario}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-data font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isGeneratingScenario ? 'Synthesizing...' : 'Generate with Gemini'}</span>
              </button>
            </div>

            {isGeneratingScenario && (
              <AIThinkingIndicator statusMessage="Generating scenario with Gemini model gemini-3.8-flash..." />
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    TARGET CASE *
                  </label>
                  <select
                    value={formCaseId}
                    onChange={(e) => setFormCaseId(e.target.value)}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    ENVIRONMENT *
                  </label>
                  <input
                    type="text"
                    required
                    value={formEnvironment}
                    onChange={(e) => setFormEnvironment(e.target.value)}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  TRIAL TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Authority Command Dilemma under Peer Scrutiny"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  SCIENTIFIC OBJECTIVE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="What is this trial measuring?"
                  value={formObjective}
                  onChange={(e) => setFormObjective(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  STIMULUS TRIGGER EVENT *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="The concrete in-game event that launches the observation window..."
                  value={formTrigger}
                  onChange={(e) => setFormTrigger(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  EXPECTED BEHAVIOR / PRIOR HYPOTHESIS
                </label>
                <textarea
                  rows={2}
                  placeholder="What is the predicted subject action based on historical baselines?"
                  value={formExpectedBehavior}
                  onChange={(e) => setFormExpectedBehavior(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-black/30 rounded-lg text-xs font-mono-data text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs font-mono-data cursor-pointer"
                >
                  Create Protocol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
