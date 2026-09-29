/**
 * BLACK S.H.E.E.P. - Landing & Authentication Portal
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Key, ArrowRight, UserCheck, AlertTriangle, Terminal, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { AuthorizedBetaUser } from '../../types';

export const LandingAuth: React.FC = () => {
  const { login, error, clearError } = useAuth();

  const [selectedIdentity, setSelectedIdentity] = useState<AuthorizedBetaUser>('Akash Sankar');
  const [password, setPassword] = useState<string>('omega-protocol-01');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [initStage, setInitStage] = useState<string | null>(null);

  const handleIdentitySelect = (identity: AuthorizedBetaUser) => {
    setSelectedIdentity(identity);
    clearError();
    if (identity === 'Akash Sankar') {
      setPassword('omega-protocol-01');
    } else {
      setPassword('psyche-eval-02');
    }
  };

  const handleAuthenticate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    setInitStage('VALIDATING BIOMETRIC CRYPT-HASH...');
    await new Promise((r) => setTimeout(r, 400));

    setInitStage('VERIFYING LEVEL-5 CLEARANCE CERTIFICATE...');
    await new Promise((r) => setTimeout(r, 400));

    setInitStage('ESTABLISHING SECURE SIMULATION TELEMETRY STREAM...');
    await new Promise((r) => setTimeout(r, 400));

    setInitStage('SYNCHRONIZING RAG VECTOR REPOSITORY...');
    await new Promise((r) => setTimeout(r, 350));

    try {
      await login(selectedIdentity, password);
    } catch {
      setIsAuthenticating(false);
      setInitStage(null);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-white text-black flex flex-col justify-between overflow-hidden selection:bg-red-600 selection:text-white">
      {/* Light Scientific Grid Background */}
      <div className="absolute inset-0 pointer-events-none bg-grid-pattern-light opacity-70" />
      <div className="absolute top-0 inset-x-0 h-1 bg-red-600" />

      {/* Top Telemetry Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between border-b border-black/10 bg-white/90 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping" />
          <span className="font-mono-data text-xs tracking-wider text-black font-semibold">
            STATION ID: BS-OBS-01 // BETA STAGE
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono-data">
          <span className="text-zinc-600 hidden sm:inline">AUTHORIZED BETA IDENTITIES ONLY</span>
          <span className="text-red-600 border border-red-600/40 bg-red-50 px-2 py-0.5 rounded text-[11px] font-bold">
            CLEARANCE: LEVEL-5
          </span>
        </div>
      </header>

      {/* Main Terminal Focus */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 max-w-4xl mx-auto w-full">
        {/* Brand Lockup */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 mb-2 px-3 py-1 rounded bg-black text-white border border-black shadow-sm">
            <Shield className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[11px] font-mono-data tracking-widest uppercase">
              BETA RESEARCH PROTOCOL v0.1
            </span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl tracking-widest text-black drop-shadow-sm">
            BLACK S.H.E.E.P.
          </h1>

          <p className="font-display text-xl md:text-2xl text-red-600 tracking-wider mt-1">
            STRATEGIC HUMANOID EXPERIMENT AND EVALUATION PROTOCOL
          </p>

          <p className="text-sm md:text-base text-zinc-600 max-w-xl mx-auto mt-2 font-normal leading-relaxed">
            Behavioral observation, experimentation and anomaly analysis for synthetic human systems.
          </p>
        </motion.div>

        {/* Authentication Console (Clean White Card with Crisp Black Borders) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="w-full max-w-md bg-white border-2 border-black rounded-xl p-6 md:p-8 shadow-[0_12px_36px_rgba(0,0,0,0.08)] relative"
        >
          {/* Scientific Corner Accents */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-red-600" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-red-600" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-red-600" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-red-600" />

          <div className="flex items-center justify-between mb-5 border-b border-black/10 pb-3">
            <span className="text-xs font-mono-data tracking-wider text-black font-semibold">
              SELECT AUTHORIZED PROFILE
            </span>
            <span className="text-[10px] font-mono-data text-red-600 font-bold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
              2 ACCOUNTS RESTRICTED
            </span>
          </div>

          {/* Dual Identity Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {/* Identity 01: Akash Sankar */}
            <button
              type="button"
              onClick={() => handleIdentitySelect('Akash Sankar')}
              disabled={isAuthenticating}
              className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                selectedIdentity === 'Akash Sankar'
                  ? 'border-red-600 bg-red-50/70 shadow-sm'
                  : 'border-black/20 bg-zinc-50 hover:border-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono-data text-zinc-500">USER 01</span>
                {selectedIdentity === 'Akash Sankar' && (
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                )}
              </div>
              <p className="font-semibold text-sm text-black">Akash Sankar</p>
              <p className="text-[11px] text-red-600 font-mono-data font-medium mt-0.5">
                System Architect
              </p>
            </button>

            {/* Identity 02: Alfa */}
            <button
              type="button"
              onClick={() => handleIdentitySelect('Alfa')}
              disabled={isAuthenticating}
              className={`p-3.5 rounded-lg border-2 text-left transition-all ${
                selectedIdentity === 'Alfa'
                  ? 'border-red-600 bg-red-50/70 shadow-sm'
                  : 'border-black/20 bg-zinc-50 hover:border-black'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono-data text-zinc-500">USER 02</span>
                {selectedIdentity === 'Alfa' && (
                  <UserCheck className="w-3.5 h-3.5 text-red-600" />
                )}
              </div>
              <p className="font-semibold text-sm text-black">Alfa</p>
              <p className="text-[11px] text-red-600 font-mono-data font-medium mt-0.5">
                Psychological Advisor
              </p>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleAuthenticate} className="space-y-4">
            <div>
              <label className="block text-xs font-mono-data text-black mb-1.5 flex items-center justify-between">
                <span className="font-semibold">SECURITY CLEARANCE KEY</span>
                <span className="text-[10px] text-zinc-500">SHA-256 VERIFIED</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isAuthenticating}
                  placeholder="Enter cryptographic key..."
                  className="w-full bg-white border border-black/30 rounded-lg px-3.5 py-2.5 text-sm text-black font-mono-data focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600"
                />
                <Key className="w-4 h-4 text-zinc-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
              </div>
              <p className="text-[10px] text-zinc-500 font-mono-data mt-1">
                Authorized Key for {selectedIdentity}: <span className="text-red-600 font-semibold">{selectedIdentity === 'Akash Sankar' ? 'omega-protocol-01' : 'psyche-eval-02'}</span>
              </p>
            </div>

            {error && (
              <div className="p-2.5 rounded bg-red-50 border border-red-300 text-xs text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {isAuthenticating ? (
              <div className="p-3.5 rounded-lg border border-red-600 bg-red-50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-semibold">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  <span>INITIALIZING WORKSTATION...</span>
                </div>
                <p className="text-[11px] font-mono-data text-black animate-pulse font-medium">
                  {initStage || 'AUTHENTICATING...'}
                </p>
                <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-red-600 h-full w-full animate-[progress_1.5s_ease-in-out_infinite]" />
                </div>
              </div>
            ) : (
              <button
                type="submit"
                className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-display text-lg tracking-wider rounded-lg transition-all shadow-[0_4px_14px_rgba(220,38,38,0.35)] flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <span>ENTER RESEARCH WORKSTATION</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Equal Permissions Notice */}
          <div className="mt-5 pt-4 border-t border-black/10 text-center">
            <p className="text-[11px] text-zinc-500 font-mono-data">
              EQUAL CLEARANCE: System Architect and Psychological Advisor possess identical controls and system capabilities.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full px-6 py-4 flex flex-col md:flex-row items-center justify-between border-t border-black/10 text-xs text-zinc-500 font-mono-data bg-white">
        <div>
          <span className="text-black font-semibold">AUTHORIZED RESEARCH PERSONNEL ONLY</span>
          <span className="mx-2">·</span>
          <span>CLASSIFIED SIMULATION WORKSTATION</span>
        </div>
        <div className="mt-2 md:mt-0 text-zinc-600">
          COMPANION ENGINE // S.H.E.E.P. PROTOCOL
        </div>
      </footer>
    </div>
  );
};
