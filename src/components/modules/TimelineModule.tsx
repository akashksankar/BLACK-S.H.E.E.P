/**
 * BLACK S.H.E.E.P. - Module 08: Event-Sourced Timeline
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  Clock,
  Plus,
  Filter,
  GraduationCap,
  Users,
  Briefcase,
  FlaskConical,
  Flame,
  Activity,
  HeartHandshake,
  X,
} from 'lucide-react';
import { TimelineEvent, Subject } from '../../types';

interface TimelineModuleProps {
  events: TimelineEvent[];
  subjects: Subject[];
  onAddEvent: (eventData: any) => Promise<void>;
}

const CATEGORIES = [
  'ALL',
  'Emotional',
  'Social',
  'Academic',
  'Professional',
  'Relationship',
  'Experiment',
  'Anomaly',
  'System',
];

export const TimelineModule: React.FC<TimelineModuleProps> = ({ events, subjects, onAddEvent }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [formSubjectId, setFormSubjectId] = useState(subjects[0]?.id || '');
  const [formType, setFormType] = useState<'Social' | 'Emotional' | 'Academic' | 'Experiment' | 'Anomaly'>(
    'Social'
  );
  const [formTitle, setFormTitle] = useState('');
  const [formDetail, setFormDetail] = useState('');
  const [formLocation, setFormLocation] = useState('Campus Quadrangle');
  const [isAnomaly, setIsAnomaly] = useState(false);

  const filteredEvents = events.filter((e) => {
    if (selectedCategory === 'ALL') return true;
    return e.type.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle) return;

    await onAddEvent({
      subjectId: formSubjectId,
      type: formType,
      title: formTitle,
      detail: formDetail,
      location: formLocation,
      deviationDetected: isAnomaly,
    });

    setShowAddModal(false);
    setFormTitle('');
    setFormDetail('');
    setIsAnomaly(false);
  };

  const getEventIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'academic':
        return GraduationCap;
      case 'social':
        return Users;
      case 'relationship':
        return HeartHandshake;
      case 'professional':
        return Briefcase;
      case 'experiment':
        return FlaskConical;
      case 'anomaly':
        return Flame;
      default:
        return Activity;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 08</span>
            <span>·</span>
            <span>EVENT-SOURCED TEMPORAL CHRONOMETER</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            SUBJECT TIMELINE
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Every simulation action, interaction, exam score, and behavioral shift logged in sequential time-series.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>INJECT TIMELINE EVENT</span>
        </button>
      </div>

      {/* Category Filter Pills Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 bg-zinc-50 p-2.5 rounded-xl border-2 border-black">
        <Filter className="w-4 h-4 text-zinc-500 mr-1 shrink-0" />
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1 rounded text-xs font-mono-data whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-700 hover:text-black bg-white border border-black/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Chronological Event Stream */}
      <div className="relative pl-6 md:pl-10 space-y-6 before:content-[''] before:absolute before:left-3 md:before:left-5 before:top-2 before:bottom-2 before:w-0.5 before:bg-black">
        {filteredEvents.map((evt) => {
          const Icon = getEventIcon(evt.type);
          const isDev = evt.deviationDetected || evt.type === 'Anomaly';

          return (
            <div key={evt.id} className="relative group">
              {/* Chrono Dot / Icon */}
              <div
                className={`absolute -left-6 md:-left-10 top-1 w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDev
                    ? 'border-red-600 bg-red-600 text-white shadow-[0_0_12px_rgba(220,38,38,0.5)] animate-pulse'
                    : 'border-black bg-white text-black group-hover:border-red-600 group-hover:text-red-600'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>

              {/* Event Card */}
              <div
                className={`p-5 rounded-xl border-2 transition-all ${
                  isDev
                    ? 'border-red-600 bg-red-50/70 shadow-xs'
                    : 'border-black/20 bg-zinc-50 hover:border-black'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-data text-xs font-bold text-red-600">
                      {evt.timeFormatted}
                    </span>
                    <span className="text-zinc-400">·</span>
                    <span className="font-mono-data text-xs text-black font-bold">
                      {evt.subjectName} ({evt.subjectCode})
                    </span>
                    <span className="text-zinc-400">·</span>
                    <span className="text-[10px] font-mono-data text-zinc-600">
                      LOC: {evt.location}
                    </span>
                  </div>

                  <span
                    className={`text-[10px] font-mono-data px-2.5 py-0.5 rounded font-bold self-start sm:self-auto ${
                      isDev
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-black/30 text-black'
                    }`}
                  >
                    {evt.type.toUpperCase()}
                  </span>
                </div>

                <h3 className="font-display text-xl text-black mb-1 tracking-wide">{evt.title}</h3>
                <p className="text-xs text-zinc-700 font-normal leading-relaxed">{evt.detail}</p>

                {evt.involvedSubjects && evt.involvedSubjects.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-black/10 text-[10px] font-mono-data text-zinc-500 font-semibold">
                    <span>COHORT INVOLVED: {evt.involvedSubjects.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-2xl text-black tracking-wider">INJECT TIMELINE EVENT</h3>
              <button onClick={() => setShowAddModal(false)} className="text-zinc-500 hover:text-black cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">SUBJECT *</label>
                <select
                  value={formSubjectId}
                  onChange={(e) => setFormSubjectId(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                >
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.code} - {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">EVENT TYPE</label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as any)}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    <option value="Social">Social</option>
                    <option value="Emotional">Emotional</option>
                    <option value="Academic">Academic</option>
                    <option value="Experiment">Experiment</option>
                    <option value="Anomaly">Anomaly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">LOCATION</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">EVENT TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Encounter with Mentor at Atrium"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">EVENT DETAILS</label>
                <textarea
                  rows={2}
                  placeholder="Description of the simulated behavior or stimulus..."
                  value={formDetail}
                  onChange={(e) => setFormDetail(e.target.value)}
                  className="w-full bg-white border border-black/30 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="chkAnomaly"
                  checked={isAnomaly}
                  onChange={(e) => setIsAnomaly(e.target.checked)}
                  className="accent-red-600"
                />
                <label htmlFor="chkAnomaly" className="text-xs font-mono-data text-black font-semibold">
                  Flag as Behavioral Deviation / Anomaly
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-black/30 rounded-lg text-xs font-mono-data text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs font-mono-data cursor-pointer"
                >
                  Inject Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
