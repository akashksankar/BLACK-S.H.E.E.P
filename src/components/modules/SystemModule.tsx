/**
 * BLACK S.H.E.E.P. - Module 10: System Telemetry & Game API Integration
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState, useEffect } from 'react';
import {
  Server,
  Database,
  Brain,
  Wifi,
  Activity,
  Send,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export const SystemModule: React.FC = () => {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState<any>(null);
  const [isLoadingHealth, setIsLoadingHealth] = useState(true);

  // Game API Webhook Test State
  const [targetSubjectCode, setTargetSubjectCode] = useState('HX-071');
  const [gameEventType, setGameEventType] = useState('SOCIAL_INTERACTION');
  const [gameEventTitle, setGameEventTitle] = useState('Spontaneous Atrium Confrontation');
  const [gameEventNotes, setGameEventNotes] = useState('Rahul challenged Arjun over exam scoring accuracy in public courtyard.');
  const [stressDelta, setStressDelta] = useState(12);
  const [isInjecting, setIsInjecting] = useState(false);
  const [injectionResponse, setInjectionResponse] = useState<any>(null);

  const fetchHealth = async () => {
    setIsLoadingHealth(true);
    try {
      const data = await api.getHealth();
      setHealthData(data);
    } catch {
      setHealthData({ status: 'degraded', api: 'ONLINE', gemini: 'STANDBY', rag: 'INDEXED' });
    } finally {
      setIsLoadingHealth(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const handleInjectGameEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsInjecting(true);
    setInjectionResponse(null);

    try {
      const payload = {
        subject_id: targetSubjectCode,
        event_type: gameEventType,
        timestamp: new Date().toISOString(),
        payload: {
          title: gameEventTitle,
          location: 'Library Courtyard',
          notes: gameEventNotes,
          anomaly: false,
          emotionalDeltas: {
            stress: Number(stressDelta),
            anxiety: Math.round(Number(stressDelta) * 0.8),
          },
        },
      };

      const res = await api.injectGameEvent(payload);
      setInjectionResponse(res);
    } catch (err: any) {
      setInjectionResponse({ error: err?.message || 'Injection failed' });
    } finally {
      setIsInjecting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 10</span>
            <span>·</span>
            <span>SYSTEM HEALTH & SIMULATION HARNESS</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            SYSTEM TELEMETRY
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Operational status of research workstation components and external open-world game API webhook contract.
          </p>
        </div>

        <button
          onClick={fetchHealth}
          className="px-4 py-2 bg-black hover:bg-zinc-800 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Activity className="w-3.5 h-3.5 text-red-400" />
          <span>REFRESH HEALTH METRICS</span>
        </button>
      </div>

      {/* Infrastructure Telemetry Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Metric 1: Frontend Client */}
        <div className="p-4 rounded-xl bg-white border-2 border-black space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-500 font-bold">
            <span>FRONTEND CLIENT</span>
            <Wifi className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-display text-black tracking-wide">ONLINE (PORT 3000)</p>
          <p className="text-[10px] font-mono-data text-emerald-600 font-semibold">React SPA on Vite</p>
        </div>

        {/* Metric 2: Express Server */}
        <div className="p-4 rounded-xl bg-white border-2 border-black space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-500 font-bold">
            <span>EXPRESS API LAYER</span>
            <Server className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-display text-black tracking-wide">ONLINE</p>
          <p className="text-[10px] font-mono-data text-emerald-600 font-semibold">Rest API v0.1</p>
        </div>

        {/* Metric 3: Gemini AI SDK */}
        <div className="p-4 rounded-xl bg-white border-2 border-black space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-500 font-bold">
            <span>GEMINI AI SDK</span>
            <Brain className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-display text-red-600 tracking-wide font-bold">
            {healthData?.gemini === 'CONNECTED' ? 'CONNECTED' : 'STANDBY'}
          </p>
          <p className="text-[10px] font-mono-data text-zinc-600">
            Model: gemini-3.8-flash
          </p>
        </div>

        {/* Metric 4: RAG Vector Store */}
        <div className="p-4 rounded-xl bg-white border-2 border-black space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-500 font-bold">
            <span>RAG VECTOR ENGINE</span>
            <Database className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-display text-black tracking-wide">INDEXED</p>
          <p className="text-[10px] font-mono-data text-red-600 font-bold">
            998 Chunks + /knowledge_base/
          </p>
        </div>
      </div>

      {/* Current Researcher Identity & Clearance */}
      <div className="p-5 rounded-xl border-2 border-black bg-zinc-50 space-y-3 shadow-xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-2 text-xs font-mono-data">
          <span className="text-black font-bold">AUTHENTICATED BETA RESEARCHER SESSION</span>
          <span className="text-red-600 font-bold">EQUAL ARCHITECT CLEARANCE</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono-data">
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">ACTIVE RESEARCHER:</span>
            <span className="text-black font-bold text-sm">{user?.name}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">ROLE:</span>
            <span className="text-red-600 font-bold text-sm">{user?.role}</span>
          </div>
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">CLEARANCE LEVEL:</span>
            <span className="text-emerald-700 font-bold text-sm">LEVEL-5 SCIENTIFIC PROTOCOL</span>
          </div>
        </div>
      </div>

      {/* Game API Integration Test Harness */}
      <div className="p-6 rounded-2xl border-2 border-black bg-white space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-black/10 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-red-600" />
            <h2 className="font-display text-2xl text-black tracking-wider">
              GAME ENGINE SIMULATION WEBHOOK INJECTOR
            </h2>
          </div>
          <span className="text-xs font-mono-data text-red-600 font-bold">
            POST /api/game/events
          </span>
        </div>

        <p className="text-xs text-zinc-700 leading-relaxed font-normal">
          The fictional humanoid open-world simulation communicates with BLACK S.H.E.E.P. via clean REST API contracts.
          Test webhook ingestion below to verify that simulated encounters mutate subject timelines and emotional states in real-time.
        </p>

        <form onSubmit={handleInjectGameEvent} className="space-y-4 pt-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                TARGET HUMANOID
              </label>
              <select
                value={targetSubjectCode}
                onChange={(e) => setTargetSubjectCode(e.target.value)}
                className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
              >
                <option value="HX-071">HX-071 (Arjun)</option>
                <option value="HX-024">HX-024 (Rahul)</option>
                <option value="HX-091">HX-091 (Maya)</option>
                <option value="HX-113">HX-113 (Dev)</option>
                <option value="HX-204">HX-204 (Sara)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                EVENT TYPE
              </label>
              <select
                value={gameEventType}
                onChange={(e) => setGameEventType(e.target.value)}
                className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
              >
                <option value="SOCIAL_INTERACTION">SOCIAL_INTERACTION</option>
                <option value="EMOTION_UPDATE">EMOTION_UPDATE</option>
                <option value="EXPERIMENT_TRIGGER">EXPERIMENT_TRIGGER</option>
                <option value="ANOMALY_EVENT">ANOMALY_EVENT</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                INJECT STRESS DELTA (%)
              </label>
              <input
                type="number"
                value={stressDelta}
                onChange={(e) => setStressDelta(Number(e.target.value))}
                className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono-data text-black font-semibold mb-1">
              EVENT SUMMARY *
            </label>
            <input
              type="text"
              required
              value={gameEventTitle}
              onChange={(e) => setGameEventTitle(e.target.value)}
              className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
            />
          </div>

          <div>
            <label className="block text-xs font-mono-data text-black font-semibold mb-1">
              PAYLOAD NOTES
            </label>
            <textarea
              rows={2}
              value={gameEventNotes}
              onChange={(e) => setGameEventNotes(e.target.value)}
              className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono-data text-zinc-500">
              Payload formatted as JSON and dispatched to simulation ingress route.
            </span>
            <button
              type="submit"
              disabled={isInjecting}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isInjecting ? 'INJECTING STIMULUS...' : 'INJECT GAME EVENT'}</span>
            </button>
          </div>
        </form>

        {/* Webhook Response Log */}
        {injectionResponse && (
          <div className="p-4 rounded-xl bg-zinc-50 border-2 border-black space-y-2 font-mono-data text-xs shadow-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              <span>WEBHOOK ACKNOWLEDGED BY COMPANION INGRESS</span>
            </div>
            <pre className="text-[11px] text-black overflow-x-auto bg-white p-3 rounded-lg border border-black/20">
              {JSON.stringify(injectionResponse, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
