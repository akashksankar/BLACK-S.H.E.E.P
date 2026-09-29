/**
 * BLACK S.H.E.E.P. - Main Application Controller
 * Strategic Humanoid Experiment and Evaluation Protocol
 */

import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingAuth } from './components/auth/LandingAuth';
import { Shell, ActiveModule } from './components/layout/Shell';
import { OverviewModule } from './components/modules/OverviewModule';
import { CasesModule } from './components/modules/CasesModule';
import { SubjectsModule } from './components/modules/SubjectsModule';
import { ExperimentsModule } from './components/modules/ExperimentsModule';
import { BehaviorLabModule } from './components/modules/BehaviorLabModule';
import { RAGKnowledgeModule } from './components/modules/RAGKnowledgeModule';
import { AnalyticsModule } from './components/modules/AnalyticsModule';
import { TimelineModule } from './components/modules/TimelineModule';
import { ReportsModule } from './components/modules/ReportsModule';
import { SystemModule } from './components/modules/SystemModule';
import { AIThinkingIndicator } from './components/common/AIThinkingIndicator';
import { api } from './services/api';
import {
  ResearchCase,
  Subject,
  Experiment,
  Anomaly,
  Hypothesis,
  TimelineEvent,
  RAGDocument,
} from './types';
import { X, Sparkles, Brain, CheckCircle2 } from 'lucide-react';

const WorkstationApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  const [activeModule, setActiveModule] = useState<ActiveModule>('overview');
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);

  // Core research state
  const [cases, setCases] = useState<ResearchCase[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [hypotheses, setHypotheses] = useState<Hypothesis[]>([]);
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  const [ragDocs, setRagDocs] = useState<RAGDocument[]>([]);

  // AI Behavior Audit Modal State
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [analysisSubjectId, setAnalysisSubjectId] = useState<string>('');
  const [analysisEventDesc, setAnalysisEventDesc] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Load initial research data when authenticated
  const loadData = async () => {
    try {
      const [casesRes, subjectsRes, expRes, anomRes, hypRes, timeRes, ragRes] = await Promise.all([
        api.getCases(),
        api.getSubjects(),
        api.getExperiments(),
        api.getAnomalies(),
        api.getHypotheses(),
        api.getTimeline(),
        api.getRAGStatus(),
      ]);

      setCases(casesRes || []);
      setSubjects(subjectsRes || []);
      setExperiments(expRes || []);
      setAnomalies(anomRes || []);
      setHypotheses(hypRes || []);
      setTimeline(timeRes || []);
      if (ragRes?.documents) setRagDocs(ragRes.documents);
    } catch (err) {
      console.error('[Error loading workstation data]', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Loading state during auth resolution
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-black">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
          <span className="font-mono-data text-xs text-black font-bold">
            AUTHENTICATING RESEARCH WORKSTATION...
          </span>
        </div>
      </div>
    );
  }

  // Unauthenticated users are strictly locked at the landing/auth portal
  if (!isAuthenticated) {
    return <LandingAuth />;
  }

  // Action handlers
  const handleCreateCase = async (caseData: any) => {
    const created = await api.createCase(caseData);
    setCases((prev) => [created, ...prev]);
    setSelectedCaseId(created.id);
  };

  const handleCreateSubject = async (subjectData: any) => {
    const created = await api.createSubject(subjectData);
    setSubjects((prev) => [...prev, created]);
    setSelectedSubjectId(created.id);
  };

  const handleCreateExperiment = async (expData: any) => {
    const created = await api.createExperiment(expData);
    setExperiments((prev) => [created, ...prev]);
  };

  const handleExecuteExperiment = async (id: string) => {
    const updated = await api.executeExperiment(id);
    setExperiments((prev) => prev.map((e) => (e.id === id ? updated : e)));
    // Refresh timeline to reflect new execution stimulus
    const timeRes = await api.getTimeline();
    setTimeline(timeRes || []);
  };

  const handleRecordOutcome = async (id: string, outcomeData: any) => {
    const updated = await api.recordExperimentOutcome(id, outcomeData);
    setExperiments((prev) => prev.map((e) => (e.id === id ? updated : e)));
    // Refresh anomalies in case a high deviation generated a new anomaly
    const anomRes = await api.getAnomalies();
    setAnomalies(anomRes || []);
  };

  const handleQueryRAG = async (query: string, limit?: number) => {
    return await api.queryRAG(query, limit);
  };

  const handleGenerateScenario = async (params: any) => {
    return await api.generateScenario(params);
  };

  const handleAddTimelineEvent = async (eventData: any) => {
    const created = await api.addTimelineEvent(eventData);
    setTimeline((prev) => [created, ...prev]);
  };

  const handleInvestigateAnomaly = async (id: string) => {
    const updated = await api.investigateAnomaly(id);
    setAnomalies((prev) => prev.map((a) => (a.id === id ? updated : a)));
  };

  const handleTriggerAnalysis = async (subjectId: string, eventDesc: string) => {
    setAnalysisSubjectId(subjectId);
    setAnalysisEventDesc(eventDesc);
    setShowAnalysisModal(true);
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const res = await api.analyzeBehavior(subjectId, eventDesc);
      setAnalysisResult(res);
    } catch (err: any) {
      console.warn('[Analysis error]', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Shell
      activeModule={activeModule}
      onSelectModule={(mod) => {
        setActiveModule(mod);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      {activeModule === 'overview' && (
        <OverviewModule
          cases={cases}
          subjects={subjects}
          experiments={experiments}
          anomalies={anomalies}
          onNavigate={(mod) => setActiveModule(mod)}
          onSelectCase={(id) => {
            setSelectedCaseId(id);
            setActiveModule('cases');
          }}
          onSelectSubject={(id) => {
            setSelectedSubjectId(id);
            setActiveModule('subjects');
          }}
        />
      )}

      {activeModule === 'cases' && (
        <CasesModule
          cases={cases}
          subjects={subjects}
          onCreateCase={handleCreateCase}
          onSelectCaseDetail={(id) => setSelectedCaseId(id)}
          selectedCaseId={selectedCaseId}
        />
      )}

      {activeModule === 'subjects' && (
        <SubjectsModule
          subjects={subjects}
          selectedSubjectId={selectedSubjectId}
          onSelectSubject={(id) => setSelectedSubjectId(id)}
          onCreateSubject={handleCreateSubject}
          onTriggerAnalysis={handleTriggerAnalysis}
        />
      )}

      {activeModule === 'experiments' && (
        <ExperimentsModule
          experiments={experiments}
          cases={cases}
          subjects={subjects}
          onCreateExperiment={handleCreateExperiment}
          onExecuteExperiment={handleExecuteExperiment}
          onRecordOutcome={handleRecordOutcome}
          onGenerateAIScenario={handleGenerateScenario}
        />
      )}

      {activeModule === 'behavior_lab' && <BehaviorLabModule subjects={subjects} />}

      {activeModule === 'rag_knowledge' && (
        <RAGKnowledgeModule documents={ragDocs} onQueryRAG={handleQueryRAG} />
      )}

      {activeModule === 'analytics' && (
        <AnalyticsModule
          anomalies={anomalies}
          experiments={experiments}
          onInvestigateAnomaly={handleInvestigateAnomaly}
        />
      )}

      {activeModule === 'timeline' && (
        <TimelineModule
          events={timeline}
          subjects={subjects}
          onAddEvent={handleAddTimelineEvent}
        />
      )}

      {activeModule === 'reports' && (
        <ReportsModule
          cases={cases}
          subjects={subjects}
          experiments={experiments}
          anomalies={anomalies}
          hypotheses={hypotheses}
        />
      )}

      {activeModule === 'system' && <SystemModule />}

      {/* Global AI Behavior Audit Modal */}
      {showAnalysisModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-2xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-red-600" />
                <h3 className="font-display text-2xl text-black tracking-wider">
                  AI BEHAVIORAL DIAGNOSTIC AUDIT
                </h3>
              </div>
              <button
                onClick={() => setShowAnalysisModal(false)}
                className="text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isAnalyzing && (
              <AIThinkingIndicator statusMessage="Processing subject behavior telemetry through RAG and Gemini..." />
            )}

            {analysisResult && (
              <div className="space-y-4 text-xs font-mono-data">
                {/* Observation & Context */}
                <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/20 space-y-1">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold">OBSERVED BEHAVIOR</span>
                  <p className="text-black text-sm font-sans font-bold">
                    {analysisResult.observation}
                  </p>
                  <p className="text-zinc-700 font-normal pt-1">{analysisResult.context}</p>
                </div>

                {/* Pattern & Hypothesis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-white border-2 border-black space-y-1">
                    <span className="text-[10px] text-red-600 block uppercase font-bold">IDENTIFIED PATTERN</span>
                    <p className="text-black font-sans font-medium">{analysisResult.pattern}</p>
                  </div>
                  <div className="p-3.5 rounded-xl bg-white border-2 border-black space-y-1">
                    <span className="text-[10px] text-red-600 block uppercase font-bold">SIMULATION HYPOTHESIS</span>
                    <p className="text-black font-sans font-medium">{analysisResult.hypothesis}</p>
                  </div>
                </div>

                {/* Evidence & Contradictions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/20 space-y-1">
                    <span className="text-[10px] text-emerald-700 block uppercase font-bold">SUPPORTING EVIDENCE</span>
                    <ul className="space-y-1 text-zinc-800 text-[11px]">
                      {analysisResult.evidence?.map((e: string, i: number) => (
                        <li key={i}>+ {e}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-3.5 rounded-xl bg-zinc-50 border border-black/20 space-y-1">
                    <span className="text-[10px] text-red-700 block uppercase font-bold">CONTRADICTORY EVIDENCE</span>
                    <ul className="space-y-1 text-zinc-800 text-[11px]">
                      {analysisResult.contradictoryEvidence?.map((e: string, i: number) => (
                        <li key={i}>- {e}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Grounded RAG References */}
                {analysisResult.ragReferences && (
                  <div className="p-3.5 rounded-xl bg-red-50 border-2 border-red-600 space-y-2">
                    <span className="text-[10px] text-red-700 block uppercase font-bold">
                      GROUNDED RAG REFERENCES
                    </span>
                    {analysisResult.ragReferences.map((ref: any, i: number) => (
                      <div key={i} className="text-[11px]">
                        <span className="text-red-700 font-bold">{ref.source}:</span>{' '}
                        <span className="text-black font-semibold">{ref.concept}</span> —{' '}
                        <span className="text-zinc-700 italic">{ref.relevance}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prediction & Confidence */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border-2 border-black text-xs">
                  <div>
                    <span className="text-zinc-500 block text-[10px] font-bold">FUTURE BEHAVIORAL PREDICTION</span>
                    <span className="text-black font-medium">{analysisResult.prediction}</span>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    <span className="text-zinc-500 block text-[10px] font-bold">CONFIDENCE</span>
                    <span className="text-red-600 font-bold text-sm">
                      {Math.round((analysisResult.simulationConfidence || 0.8) * 100)}%
                    </span>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setShowAnalysisModal(false)}
                    className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-bold font-mono-data cursor-pointer"
                  >
                    Close Audit
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Shell>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <WorkstationApp />
    </AuthProvider>
  );
}
