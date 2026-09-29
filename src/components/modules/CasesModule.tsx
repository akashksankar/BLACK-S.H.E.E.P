/**
 * BLACK S.H.E.E.P. - Module 02: Cases
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Users,
  FlaskConical,
  X,
  ArrowRight,
} from 'lucide-react';
import { ResearchCase, Subject } from '../../types';

interface CasesModuleProps {
  cases: ResearchCase[];
  subjects: Subject[];
  onCreateCase: (caseData: any) => Promise<void>;
  onSelectCaseDetail: (caseId: string) => void;
  selectedCaseId?: string | null;
}

const ENVIRONMENTS = [
  'College',
  'Workplace',
  'Family',
  'Neighborhood',
  'Public Space',
  'Social Event',
  'Online Environment',
  'Controlled Laboratory',
  'Custom',
];

export const CasesModule: React.FC<CasesModuleProps> = ({
  cases,
  subjects,
  onCreateCase,
  onSelectCaseDetail,
  selectedCaseId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEnv, setSelectedEnv] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Case Form State
  const [formData, setFormData] = useState({
    name: '',
    environment: 'College',
    objective: '',
    description: '',
    researchQuestion: '',
    initialHypothesis: '',
    variablesStr: 'Social Pressure, Emotional Reactivity, Authority Presence',
    tagsStr: 'Conformity, Simulation Trial, Peer Stress',
  });

  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.objective.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEnv = selectedEnv === 'ALL' || c.environment === selectedEnv;
    return matchesSearch && matchesEnv;
  });

  const activeCase = cases.find((c) => c.id === selectedCaseId) || cases[0];

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.objective) return;

    setIsSubmitting(true);
    try {
      await onCreateCase({
        name: formData.name,
        environment: formData.environment,
        objective: formData.objective,
        description: formData.description,
        researchQuestion: formData.researchQuestion,
        initialHypothesis: formData.initialHypothesis,
        variables: formData.variablesStr.split(',').map((s) => s.trim()).filter(Boolean),
        tags: formData.tagsStr.split(',').map((s) => s.trim()).filter(Boolean),
        assignedSubjectIds: ['sub_hx071', 'sub_hx024'],
      });
      setShowCreateModal(false);
      setFormData({
        name: '',
        environment: 'College',
        objective: '',
        description: '',
        researchQuestion: '',
        initialHypothesis: '',
        variablesStr: 'Social Pressure, Emotional Reactivity, Authority Presence',
        tagsStr: 'Conformity, Simulation Trial, Peer Stress',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 02</span>
            <span>·</span>
            <span>BEHAVIORAL CASE PORTFOLIO</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            RESEARCH CASES
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            The central unit of synthetic behavioral research. Each case targets specific variables across open-world environments.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>CREATE NEW CASE</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between bg-zinc-50 p-3 rounded-xl border-2 border-black">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search cases by code, title, or objective..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-black/30 rounded-lg pl-9 pr-3.5 py-1.5 text-xs text-black placeholder:text-zinc-400 font-mono-data focus:outline-none focus:border-red-600"
          />
        </div>

        {/* Environment Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setSelectedEnv('ALL')}
            className={`px-3 py-1 rounded text-[11px] font-mono-data whitespace-nowrap transition-colors cursor-pointer ${
              selectedEnv === 'ALL'
                ? 'bg-black text-white font-bold'
                : 'text-zinc-700 hover:text-black bg-white border border-black/20'
            }`}
          >
            All Environments
          </button>
          {['College', 'Workplace', 'Public Space'].map((env) => (
            <button
              key={env}
              onClick={() => setSelectedEnv(env)}
              className={`px-3 py-1 rounded text-[11px] font-mono-data whitespace-nowrap transition-colors cursor-pointer ${
                selectedEnv === env
                  ? 'bg-red-600 text-white font-bold'
                  : 'text-zinc-700 hover:text-black bg-white border border-black/20'
              }`}
            >
              {env}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Cases Listing (1 Col) */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-mono-data text-zinc-600 px-1 font-semibold">
            <span>REGISTERED CASES ({filteredCases.length})</span>
            <span>SORT: RECENT</span>
          </div>

          {filteredCases.map((c) => {
            const isSelected = activeCase?.id === c.id;
            return (
              <div
                key={c.id}
                onClick={() => onSelectCaseDetail(c.id)}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-600 bg-red-50/60 shadow-xs'
                    : 'border-black/20 bg-zinc-50 hover:border-black'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono-data text-red-600 font-bold">{c.code}</span>
                  <span className="text-[10px] font-mono-data px-2 py-0.5 rounded bg-white border border-black font-semibold text-black">
                    {c.environment}
                  </span>
                </div>

                <h3 className="font-display text-xl text-black tracking-wide mb-1 leading-snug">
                  {c.name}
                </h3>
                <p className="text-xs text-zinc-700 line-clamp-2 leading-relaxed mb-3">
                  {c.objective}
                </p>

                <div className="flex items-center justify-between pt-2.5 border-t border-black/10 text-[11px] font-mono-data text-zinc-600 font-medium">
                  <span>SUBJECTS: {c.assignedSubjectIds.length}</span>
                  <span>TRIALS: {c.experimentCount}</span>
                  <span className="text-red-600 font-bold">ANOMALIES: {c.anomalyCount}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Case Deep Dossier (2 Cols) */}
        <div className="lg:col-span-2">
          {activeCase ? (
            <div className="bg-white border-2 border-black rounded-xl p-6 space-y-6 shadow-xs">
              {/* Header */}
              <div className="border-b border-black/10 pb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-xs px-2.5 py-0.5 rounded bg-red-600 text-white font-bold">
                      {activeCase.code}
                    </span>
                    <span className="font-mono-data text-xs text-zinc-600">
                      ENV: <span className="text-black font-bold">{activeCase.environment}</span>
                    </span>
                  </div>
                  <span className="text-xs font-mono-data text-black border border-black font-bold px-2.5 py-0.5 rounded bg-zinc-100">
                    STATUS: {activeCase.status}
                  </span>
                </div>

                <h2 className="font-display text-3xl text-black tracking-wider">
                  {activeCase.name}
                </h2>
                <p className="text-xs text-zinc-500 font-mono-data mt-1">
                  LAST UPDATED: {new Date(activeCase.updatedAt).toLocaleDateString()} · REGISTERED: {new Date(activeCase.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Research Question & Objective */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20">
                  <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block mb-1">
                    PRIMARY RESEARCH QUESTION
                  </span>
                  <p className="text-xs text-black leading-relaxed font-normal">
                    "{activeCase.researchQuestion || activeCase.objective}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-zinc-50 border border-black/20">
                  <span className="text-[10px] font-mono-data text-red-600 font-bold uppercase tracking-wider block mb-1">
                    WORKING SIMULATION HYPOTHESIS
                  </span>
                  <p className="text-xs text-black leading-relaxed font-normal">
                    "{activeCase.initialHypothesis || 'Testing subject behavioral adherence threshold under stress.'}"
                  </p>
                </div>
              </div>

              {/* Target Variables */}
              <div className="space-y-3">
                <span className="text-xs font-mono-data text-black font-bold block">
                  ACTIVE EXPERIMENTAL VARIABLES
                </span>
                <div className="flex flex-wrap gap-2">
                  {activeCase.variables.map((v, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded text-xs font-mono-data bg-white border border-red-600 text-red-700 font-semibold"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>

              {/* Assigned Humanoids */}
              <div className="space-y-3 pt-2">
                <span className="text-xs font-mono-data text-black font-bold block">
                  ASSIGNED SUBJECTS ({activeCase.assignedSubjectIds.length})
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {subjects
                    .filter((s) => activeCase.assignedSubjectIds.includes(s.id))
                    .map((s) => (
                      <div
                        key={s.id}
                        className="p-3 rounded-lg border-2 border-black/20 bg-zinc-50 flex items-center gap-3"
                      >
                        <img
                          src={s.avatarUrl}
                          alt={s.name}
                          referrerPolicy="no-referrer"
                          className="w-10 h-10 rounded object-cover border-2 border-black"
                        />
                        <div>
                          <span className="text-[10px] font-mono-data text-red-600 font-bold">{s.code}</span>
                          <p className="text-xs font-bold text-black">{s.name}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Tags */}
              <div className="pt-3 border-t border-black/10 flex items-center gap-2 text-xs font-mono-data text-zinc-600">
                <span className="font-bold text-black">TAGS:</span>
                {activeCase.tags.map((t, i) => (
                  <span key={i} className="text-red-600 font-semibold">
                    #{t} {i < activeCase.tags.length - 1 && '·'}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center border-2 border-black rounded-xl text-center p-6 bg-zinc-50">
              <FolderKanban className="w-8 h-8 text-zinc-400 mb-2" />
              <p className="text-sm text-zinc-600 font-mono-data">Select a case to inspect dossier details</p>
            </div>
          )}
        </div>
      </div>

      {/* Create New Case Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-2">
                <FolderKanban className="w-5 h-5 text-red-600" />
                <h3 className="font-display text-2xl text-black tracking-wider">CREATE RESEARCH CASE</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  CASE NAME *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. COLLEGE SOCIAL PRESSURE DYNAMICS"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-sm text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    ENVIRONMENT *
                  </label>
                  <select
                    value={formData.environment}
                    onChange={(e) => setFormData({ ...formData, environment: e.target.value })}
                    className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    {ENVIRONMENTS.map((env) => (
                      <option key={env} value={env}>
                        {env}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    RESEARCH TAGS
                  </label>
                  <input
                    type="text"
                    value={formData.tagsStr}
                    onChange={(e) => setFormData({ ...formData, tagsStr: e.target.value })}
                    className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  RESEARCH OBJECTIVE *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="What core behavioral phenomena is this case evaluating?"
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  RESEARCH QUESTION
                </label>
                <input
                  type="text"
                  placeholder="e.g. Under what threshold does subject conformity break down?"
                  value={formData.researchQuestion}
                  onChange={(e) => setFormData({ ...formData, researchQuestion: e.target.value })}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  INITIAL WORKING HYPOTHESIS
                </label>
                <textarea
                  rows={2}
                  placeholder="Predicted behavioral outcomes before trial execution..."
                  value={formData.initialHypothesis}
                  onChange={(e) => setFormData({ ...formData, initialHypothesis: e.target.value })}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-black/30 rounded-lg text-xs font-mono-data text-zinc-700 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors cursor-pointer"
                >
                  {isSubmitting ? 'Registering...' : 'Register Case'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
