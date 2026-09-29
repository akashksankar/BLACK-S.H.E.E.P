/**
 * BLACK S.H.E.E.P. - Centralized API Service
 */

const API_BASE = '/api';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('bs_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok || data.success === false) {
    const errorMsg = data.error?.message || `HTTP ${res.status}: Request failed`;
    throw new Error(errorMsg);
  }
  return data.data;
}

export const api = {
  // Authentication
  async login(identity: string, password?: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identity, password }),
    });
    return handleResponse<{ token: string; user: any }>(res);
  },

  async getSession() {
    const res = await fetch(`${API_BASE}/auth/session`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ user: any }>(res);
  },

  async logout() {
    const res = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<{ message: string }>(res);
  },

  // Cases
  async getCases() {
    const res = await fetch(`${API_BASE}/cases`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async createCase(caseData: any) {
    const res = await fetch(`${API_BASE}/cases`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(caseData),
    });
    return handleResponse<any>(res);
  },

  async deleteCase(id: string) {
    const res = await fetch(`${API_BASE}/cases/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async clearCases() {
    const res = await fetch(`${API_BASE}/cases/clear`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async getCaseById(id: string) {
    const res = await fetch(`${API_BASE}/cases/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  // Subjects
  async getSubjects() {
    const res = await fetch(`${API_BASE}/subjects`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async createSubject(subjectData: any) {
    const res = await fetch(`${API_BASE}/subjects`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(subjectData),
    });
    return handleResponse<any>(res);
  },

  async deleteSubject(id: string) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async clearSubjects() {
    const res = await fetch(`${API_BASE}/subjects/clear`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async getDatabaseStatus() {
    const res = await fetch(`${API_BASE}/database/status`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async getSubjectById(id: string) {
    const res = await fetch(`${API_BASE}/subjects/${id}`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async logSubjectObservation(subjectId: string, note: string, runAnalysis = true) {
    const res = await fetch(`${API_BASE}/subjects/${subjectId}/observe`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ note, runAnalysis }),
    });
    return handleResponse<{ subject: any; observation: any; analysis: any }>(res);
  },

  // Experiments
  async getExperiments() {
    const res = await fetch(`${API_BASE}/experiments`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async createExperiment(data: any) {
    const res = await fetch(`${API_BASE}/experiments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  async executeExperiment(id: string) {
    const res = await fetch(`${API_BASE}/experiments/${id}/execute`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  async recordExperimentOutcome(id: string, outcomeData: any) {
    const res = await fetch(`${API_BASE}/experiments/${id}/record-outcome`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(outcomeData),
    });
    return handleResponse<any>(res);
  },

  // RAG Knowledge Base
  async getRAGStatus() {
    const res = await fetch(`${API_BASE}/rag/status`, { headers: getAuthHeaders() });
    return handleResponse<any>(res);
  },

  async getLocalKnowledgeFiles() {
    const res = await fetch(`${API_BASE}/rag/local-files`, { headers: getAuthHeaders() });
    return handleResponse<{ folderPath: string; files: any[]; totalFiles: number }>(res);
  },

  async getFileContent(folder: 'docs' | 'pdfs', filename: string) {
    const res = await fetch(`${API_BASE}/rag/file-content?folder=${encodeURIComponent(folder)}&filename=${encodeURIComponent(filename)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<{ filename: string; folder: string; path: string; content: string }>(res);
  },

  async uploadLocalDoc(docData: { title: string; author?: string; domain?: string; content: string; filename?: string }) {
    const res = await fetch(`${API_BASE}/rag/upload-doc`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(docData),
    });
    return handleResponse<any>(res);
  },

  async queryRAG(query: string, limit = 3) {
    const res = await fetch(`${API_BASE}/rag/query`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query, limit }),
    });
    return handleResponse<any>(res);
  },

  // AI Behavioral Analysis
  async analyzeBehavior(subjectId: string, eventDescription: string, contextNotes?: string) {
    const res = await fetch(`${API_BASE}/ai/analyze-behavior`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ subjectId, eventDescription, contextNotes }),
    });
    return handleResponse<any>(res);
  },

  async analyzeHumanoidMind(params: { subjectId?: string; subjectData?: any; observationText: string }) {
    const res = await fetch(`${API_BASE}/ai/analyze-humanoid-mind`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return handleResponse<any>(res);
  },

  async generateScenario(params: { caseId?: string; subjectIds?: string[]; targetVariable?: string; environment?: string }) {
    const res = await fetch(`${API_BASE}/ai/generate-scenario`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return handleResponse<any>(res);
  },

  // Timeline
  async getTimeline() {
    const res = await fetch(`${API_BASE}/timeline`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async addTimelineEvent(data: any) {
    const res = await fetch(`${API_BASE}/timeline`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // Anomalies
  async getAnomalies() {
    const res = await fetch(`${API_BASE}/anomalies`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async investigateAnomaly(id: string) {
    const res = await fetch(`${API_BASE}/anomalies/${id}/investigate`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },

  // Hypotheses
  async getHypotheses() {
    const res = await fetch(`${API_BASE}/hypotheses`, { headers: getAuthHeaders() });
    return handleResponse<any[]>(res);
  },

  async createHypothesis(data: any) {
    const res = await fetch(`${API_BASE}/hypotheses`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<any>(res);
  },

  // System & Game API Test
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    return res.json();
  },

  async injectGameEvent(eventData: any) {
    const res = await fetch(`${API_BASE}/game/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(eventData),
    });
    return handleResponse<any>(res);
  },

  async triggerGameExperiment(experimentId: string) {
    const res = await fetch(`${API_BASE}/game/experiments/${experimentId}/trigger`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
    return handleResponse<any>(res);
  },
};
