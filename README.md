# BLACK S.H.E.E.P.
### Strategic Humanoid Experiment and Evaluation Protocol (v0.1 BETA)

BLACK S.H.E.E.P. is the external scientific and behavioral research companion workstation for a synthetic humanoid civilization simulation. Monitored humanoids live continuous routines, attend classes, work jobs, cultivate relationships, experience simulated emotions, and form cognitive memories.

BLACK S.H.E.E.P. provides researchers with tools to:
**OBSERVE → PROFILE → ANALYZE → FORM HYPOTHESES → DESIGN EXPERIMENTS → TRIGGER EVENTS → COMPARE PREDICTION VS ACTUAL → DETECT ANOMALIES → UPDATE SUBJECT DOSSIER.**

---

## 1. Beta Access Restriction & Authorized Personas
Access is strictly restricted to two authorized beta identities with equal system capabilities and controls:
- **Akash Sankar** — System Architect (`omega-protocol-01`)
- **Alfa** — Psychological Advisor (`psyche-eval-02`)

Unauthenticated visitors are locked at the cinematic authentication terminal with zero access to research cases, telemetry, analytics, or subject profiles.

---

## 2. Visual Identity & Color System
The workstation embodies a classified, cinematic behavioral laboratory interface:
- **Fiery Amber (`#D94824`)**: Primary interaction energy, active trials, and critical anomaly alerts.
- **Deep Obsidian (`#130C08`)**: Matte dark canvas and base structural panels.
- **Golden Haze (`#F2A65A`)**: Analytical highlights, vector similarity metrics, and telemetry indicators.
- **Shadow Earth (`#4A2018`)**: Secondary structural framing and hairline dividers.
- **Stark White (`#FFFFFF`)**: High-contrast typographic headings.

---

## 3. Workstation Modules
1. **01 OVERVIEW**: Real-time simulation epoch (#144), active cases, monitored subjects, running trials, and anomaly alert banner.
2. **02 CASES**: Case management, research questions, experimental variable targets, and case dossiers.
3. **03 SUBJECTS**: Detailed profiles (Arjun HX-071, Rahul HX-024, Maya HX-091, Dev HX-113, Sara HX-204), 15 simulation dimensions, dynamic emotional radar, and social network ties.
4. **04 EXPERIMENTS**: Scientific trial builder (Social Pressure, Authority, Isolation, Uncertainty, Reward), trigger injection, and Prediction vs Actual comparison.
5. **05 BEHAVIOR LAB**: Calibration of 15 simulation dimensions, nonverbal body language signal matrix (Navarro & Simon references), and sensitivity projection simulator.
6. **06 RAG KNOWLEDGE**: Vector retrieval over 8 seminal texts (Thinking Fast and Slow, Dictionary of Body Language, DSM Reference Layer, In Sheep's Clothing, The Prince, Snakes in Suits, The Gaslight Effect, The Asshole Survival Guide) with Gemini synthesis.
7. **07 ANALYTICS**: Anomaly detection breakdown, prediction accuracy tracking, and diagnostic terminal.
8. **08 TIMELINE**: Event-sourced chronometer tracking routine events, social encounters, and behavioral deviations.
9. **09 REPORTS**: Classified research dossier generator with export and print capabilities.
10. **10 SYSTEM**: System health telemetry, vector engine status, and Game Engine Webhook Injector (`POST /api/game/events`).

---

## 4. Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS v4, Motion (Framer Motion).
- **Backend**: Express + Node.js (with `server.ts` entry point), `@google/genai` TypeScript SDK (model `gemini-3.8-flash`).
- **Knowledge Engine**: In-memory vector matcher with semantic cosine ranking across 998 curated domain chunks.
- **Game Engine Webhook**: Dedicated `/api/game/events` REST contract for future external simulation engines.

---

## 5. Local Setup
```bash
# Install dependencies
npm install

# Start development workstation
npm run dev

# Compile production bundle
npm run build
```
