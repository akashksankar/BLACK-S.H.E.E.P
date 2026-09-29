# BLACK S.H.E.E.P. — API Specification

### Authentication
- `POST /api/auth/login`: Validates identity against authorized profiles (`Akash Sankar` or `Alfa`). Issues session token.
- `GET /api/auth/session`: Validates bearer token and returns active session data.
- `POST /api/auth/logout`: Revokes session token.

### Cases
- `GET /api/cases`: Retrieves registered research cases.
- `POST /api/cases`: Registers a new behavioral research case.
- `GET /api/cases/:id`: Retrieves detailed case dossier.

### Subjects
- `GET /api/subjects`: Retrieves all monitored synthetic humanoids.
- `POST /api/subjects`: Registers a new humanoid subject profile.
- `GET /api/subjects/:id`: Retrieves individual profile with 15 behavioral dimensions and emotional state.

### Experiments
- `GET /api/experiments`: Lists all designed experimental protocols.
- `POST /api/experiments`: Creates a new experiment protocol with variables and trigger.
- `POST /api/experiments/:id/execute`: Advances experiment through execution lifecycle (`READY` -> `DEPLOYED` -> `RUNNING`).
- `POST /api/experiments/:id/record-outcome`: Records actual subject response and evaluates prediction deviation score.

### RAG & AI
- `GET /api/rag/status`: Reports indexed treatise status and chunk counts.
- `POST /api/rag/query`: Performs semantic search over indexed literature and synthesizes findings with Gemini (`gemini-3.8-flash`).
- `POST /api/ai/analyze-behavior`: Produces structured behavioral analysis (Observation, Context, Pattern, Hypothesis, Evidence, Contradiction, Prediction, Confidence).
- `POST /api/ai/generate-scenario`: Generates scientific scenario branches and observation criteria.

### Game Engine Integration
- `POST /api/game/events`: Webhook receiver for open-world simulation events (`SOCIAL_INTERACTION`, `EMOTION_UPDATE`).
- `POST /api/game/experiments/:id/trigger`: Dispatches stimulus triggers directly to synthetic simulation.
