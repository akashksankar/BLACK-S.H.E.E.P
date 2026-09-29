# BLACK S.H.E.E.P. — Architectural Specification

## Architecture Overview
```
+--------------------------------------------------------------+
|                     BLACK S.H.E.E.P. UI                      |
| (10 Modules: Overview, Cases, Subjects, Experiments, RAG...) |
+--------------------------------------------------------------+
                                |
                                v
+--------------------------------------------------------------+
|               Client API Layer (src/services/api.ts)         |
|         Bearer Token Session Header + Request Resilience     |
+--------------------------------------------------------------+
                                |
                                v
+--------------------------------------------------------------+
|                Express API Server (server.ts)                |
|  - Dual-Identity Authentication Validator (Akash & Alfa)     |
|  - Behavioral State Store & Event Ingress                    |
|  - Semantic Vector Store (8 Indexed Literature Treatises)    |
|  - Game Simulation Webhook Router (/api/game/events)         |
+--------------------------------------------------------------+
                 |                             |
                 v                             v
+-------------------------------+ +----------------------------+
|        @google/genai SDK      | |  Game Engine Integration   |
|   Model: gemini-3.8-flash     | | (External Synthetic World) |
+-------------------------------+ +----------------------------+
```

## Architectural Decoupling Rules
1. **Separation of Concerns**: UI components never make direct external model calls; all intelligence generation routes through server-side endpoints (`/api/ai/analyze-behavior`, `/api/ai/generate-scenario`).
2. **Deterministic Simulation Fallback**: If Gemini or external network is degraded, the system degrades gracefully into deterministic heuristics without crashing or breaking the research UI.
3. **Event-Sourced Telemetry**: All major actions produce an immutable event in the subject's timeline, laying the foundation for bi-directional game engine communication.
