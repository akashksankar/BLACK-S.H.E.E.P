/**
 * BLACK S.H.E.E.P. - Application Navigation & Shell
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  FlaskConical,
  Activity,
  BookOpen,
  BarChart3,
  Clock,
  FileText,
  Settings,
  LogOut,
  RefreshCw,
  Menu,
  X,
  User,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthorizedBetaUser } from '../../types';

export type ActiveModule =
  | 'overview'
  | 'cases'
  | 'subjects'
  | 'experiments'
  | 'behavior_lab'
  | 'rag_knowledge'
  | 'analytics'
  | 'timeline'
  | 'reports'
  | 'system';

interface ShellProps {
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  children: React.ReactNode;
}

const NAV_ITEMS: Array<{ id: ActiveModule; index: string; label: string; icon: React.ElementType }> = [
  { id: 'overview', index: '01', label: 'OVERVIEW', icon: LayoutDashboard },
  { id: 'cases', index: '02', label: 'CASES', icon: FolderKanban },
  { id: 'subjects', index: '03', label: 'SUBJECTS', icon: Users },
  { id: 'experiments', index: '04', label: 'EXPERIMENTS', icon: FlaskConical },
  { id: 'behavior_lab', index: '05', label: 'BEHAVIOR LAB', icon: Activity },
  { id: 'rag_knowledge', index: '06', label: 'RAG KNOWLEDGE', icon: BookOpen },
  { id: 'analytics', index: '07', label: 'ANALYTICS', icon: BarChart3 },
  { id: 'timeline', index: '08', label: 'TIMELINE', icon: Clock },
  { id: 'reports', index: '09', label: 'REPORTS', icon: FileText },
  { id: 'system', index: '10', label: 'SYSTEM', icon: Settings },
];

export const Shell: React.FC<ShellProps> = ({ activeModule, onSelectModule, children }) => {
  const { user, logout, switchUser } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSwitchResearcher = () => {
    const next: AuthorizedBetaUser = user?.name === 'Akash Sankar' ? 'Alfa' : 'Akash Sankar';
    switchUser(next);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col selection:bg-red-600 selection:text-white">
      {/* Top Telemetry Status Ribbon */}
      <div className="w-full bg-zinc-950 text-white px-4 md:px-6 py-1.5 flex items-center justify-between text-[11px] font-mono-data">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-zinc-200 font-semibold">SIMULATION ENGINE: ONLINE</span>
          </div>
          <span className="hidden sm:inline text-zinc-600">|</span>
          <span className="hidden sm:inline text-zinc-300">CYCLE #144 (EPOCH 4)</span>
          <span className="hidden md:inline text-zinc-600">|</span>
          <span className="hidden md:inline text-zinc-300">PROTOCOL: S.H.E.E.P. v0.1-BETA</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-red-400 font-semibold">CLEARANCE: LEVEL-5</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-300">STATION BS-01</span>
        </div>
      </div>

      {/* Main Top Bar */}
      <header className="sticky top-0 z-30 w-full bg-white/95 backdrop-blur-md border-b-2 border-black px-4 md:px-6 py-3 flex items-center justify-between shadow-xs">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onSelectModule('overview')}
            className="flex items-center gap-2.5 text-left focus:outline-none cursor-pointer"
          >
            <div className="w-8 h-8 rounded bg-red-600 flex items-center justify-center font-display text-lg font-bold text-white shadow-sm">
              BS
            </div>
            <div>
              <span className="font-display text-2xl tracking-wider text-black hover:text-red-600 transition-colors leading-none block">
                BLACK S.H.E.E.P.
              </span>
              <span className="text-[9px] font-mono-data tracking-widest text-red-600 uppercase block font-bold">
                RESEARCH WORKSTATION
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`px-2.5 py-1.5 rounded text-xs font-mono-data tracking-wide transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-xs'
                    : 'text-zinc-700 hover:text-black hover:bg-zinc-100 font-medium'
                }`}
              >
                <span className={`text-[10px] ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                  {item.index}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Active Researcher Badge, Switcher & Logout */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Researcher Profile Pill */}
          <div className="flex items-center gap-2 bg-zinc-50 border border-black/20 rounded-md px-2.5 py-1 shadow-xs">
            <User className="w-3.5 h-3.5 text-red-600" />
            <div className="text-left hidden sm:block">
              <p className="text-xs font-bold text-black leading-tight">
                {user?.name}
              </p>
              <p className="text-[10px] text-red-600 font-mono-data leading-tight font-semibold">
                {user?.role}
              </p>
            </div>
            {/* Quick Persona Switcher */}
            <button
              onClick={handleSwitchResearcher}
              title={`Switch to ${user?.name === 'Akash Sankar' ? 'Alfa' : 'Akash Sankar'}`}
              className="p-1 hover:bg-red-100 rounded text-zinc-600 hover:text-red-600 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3 text-red-600" />
            </button>
          </div>

          {/* Logout */}
          <button
            onClick={() => logout()}
            title="Terminate Research Session"
            className="p-1.5 rounded border border-black/20 hover:border-red-600 hover:bg-red-50 text-zinc-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 rounded border border-black/20 text-black hover:bg-zinc-100 cursor-pointer"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Sub-navigation bar for laptop/tablet viewports */}
      <div className="hidden md:flex xl:hidden w-full bg-zinc-50 border-b border-black/10 px-4 py-2 overflow-x-auto gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive = activeModule === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectModule(item.id)}
              className={`px-2.5 py-1 rounded text-xs font-mono-data whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                isActive ? 'bg-red-600 text-white font-bold' : 'text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span className="text-[10px] text-zinc-500">{item.index}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-b-2 border-black p-4 space-y-1 shadow-lg">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectModule(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full px-3 py-2 rounded text-xs font-mono-data flex items-center gap-3 cursor-pointer ${
                  isActive ? 'bg-red-600 text-white font-bold' : 'text-zinc-800 hover:bg-zinc-100'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.index}.</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Workspace Content Stage */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-white">
        {children}
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-black/10 px-6 py-3 flex flex-col sm:flex-row items-center justify-between text-xs font-mono-data text-zinc-500">
        <div>
          <span className="text-black font-semibold">BLACK S.H.E.E.P. PROTOCOL</span>
          <span className="mx-2">·</span>
          <span>BETA v0.1</span>
          <span className="mx-2">·</span>
          <span>AUTHORIZED RESEARCH PERSONNEL ONLY</span>
        </div>
        <div className="mt-2 sm:mt-0 text-zinc-600">
          OPERATING IN COMPANION RESEARCH WORKSTATION MODE
        </div>
      </footer>
    </div>
  );
};
