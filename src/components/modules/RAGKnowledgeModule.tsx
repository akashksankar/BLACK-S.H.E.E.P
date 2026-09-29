/**
 * BLACK S.H.E.E.P. - Module 06: RAG Knowledge Base
 * Redesigned with White Base + Black Typography + Scientific Red Accents
 * Integrates local /knowledge_base/ folder scanner, PDF vault, and document reader
 */

import React, { useState, useEffect } from 'react';
import {
  Search,
  Brain,
  Sparkles,
  FolderOpen,
  FileText,
  Upload,
  RefreshCw,
  Plus,
  CheckCircle2,
  Eye,
  X,
  FileCode,
  Copy,
  Check,
  Download,
} from 'lucide-react';
import { RAGDocument, RAGQueryResult } from '../../types';
import { AIThinkingIndicator } from '../common/AIThinkingIndicator';
import { api } from '../../services/api';

interface RAGKnowledgeModuleProps {
  documents: RAGDocument[];
  onQueryRAG: (query: string, limit?: number) => Promise<RAGQueryResult>;
}

export const RAGKnowledgeModule: React.FC<RAGKnowledgeModuleProps> = ({ documents, onQueryRAG }) => {
  const [query, setQuery] = useState(
    'Subject recently experienced social rejection and is avoiding confrontation. What behavioral concepts may be relevant?'
  );
  const [isQuerying, setIsQuerying] = useState(false);
  const [queryResult, setQueryResult] = useState<RAGQueryResult | null>(null);

  // Local Knowledge Base Folder State
  const [localFiles, setLocalFiles] = useState<any[]>([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [selectedFolderFilter, setSelectedFolderFilter] = useState<'ALL' | 'docs' | 'pdfs'>('ALL');

  // Modal: Add Document
  const [showAddDocModal, setShowAddDocModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocAuthor, setNewDocAuthor] = useState('');
  const [newDocDomain, setNewDocDomain] = useState('Cognitive Psychology');
  const [newDocContent, setNewDocContent] = useState('');
  const [targetFolder, setTargetFolder] = useState<'docs' | 'pdfs'>('docs');
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  // Modal: Read Document Content
  const [viewingFile, setViewingFile] = useState<any | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [loadingFileContent, setLoadingFileContent] = useState<boolean>(false);
  const [copiedExcerpt, setCopiedExcerpt] = useState<boolean>(false);

  const fetchLocalFiles = async () => {
    setLoadingFiles(true);
    try {
      const data = await api.getLocalKnowledgeFiles();
      setLocalFiles(data?.files || []);
    } catch (err) {
      console.error('[Failed to fetch local files]', err);
    } finally {
      setLoadingFiles(false);
    }
  };

  useEffect(() => {
    fetchLocalFiles();
  }, []);

  const handleOpenFile = async (file: any) => {
    setViewingFile(file);
    setLoadingFileContent(true);
    setCopiedExcerpt(false);
    try {
      const res = await api.getFileContent(file.folder, file.name);
      setFileContent(res?.content || 'No text content available.');
    } catch (err: any) {
      setFileContent(`[Error opening document: ${err?.message || 'File read error'}]`);
    } finally {
      setLoadingFileContent(false);
    }
  };

  const handleCopyFileContent = () => {
    if (!fileContent) return;
    navigator.clipboard.writeText(fileContent);
    setCopiedExcerpt(true);
    setTimeout(() => setCopiedExcerpt(false), 2000);
  };

  const handleUseFileAsQuery = () => {
    if (!viewingFile) return;
    const prompt = `Based on the treatise "${viewingFile.title || viewingFile.name}", what are the observable indicators and mitigation strategies for subjects undergoing conformity stress?`;
    setQuery(prompt);
    setViewingFile(null);
    // Scroll smoothly to query terminal
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!newDocTitle) {
      setNewDocTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setNewDocContent(text || '');
    };
    reader.readAsText(file);
  };

  const handleRunQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsQuerying(true);
    try {
      const res = await onQueryRAG(query, 3);
      setQueryResult(res);
    } finally {
      setIsQuerying(false);
    }
  };

  const handleAddLocalDoc = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocTitle || !newDocContent) return;

    try {
      const ext = targetFolder === 'pdfs' ? '.txt' : '.md';
      const safeFilename = `${newDocTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')}${ext}`;
      const res = await api.uploadLocalDoc({
        title: newDocTitle,
        author: newDocAuthor,
        domain: newDocDomain,
        content: newDocContent,
        filename: safeFilename,
      });

      setUploadMessage(res.message);
      setShowAddDocModal(false);
      setNewDocTitle('');
      setNewDocAuthor('');
      setNewDocContent('');
      fetchLocalFiles();
    } catch (err: any) {
      alert(err?.message || 'Upload failed');
    }
  };

  const filteredLocalFiles = localFiles.filter((f) => {
    if (selectedFolderFilter === 'ALL') return true;
    return f.folder === selectedFolderFilter;
  });

  return (
    <div className="space-y-6">
      {/* Module Title Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b-2 border-black gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono-data text-red-600 font-bold mb-1">
            <span>MODULE 06</span>
            <span>·</span>
            <span>BEHAVIORAL RAG RETRIEVAL ENGINE</span>
          </div>
          <h1 className="font-display text-4xl text-black tracking-wider">
            RAG KNOWLEDGE BASE
          </h1>
          <p className="text-xs text-zinc-600 font-mono-data mt-0.5">
            Vectorized behavioral science treatises and local manuscript repository at{' '}
            <code className="text-red-600 font-bold bg-red-50 px-1 py-0.5 rounded border border-red-200">
              /knowledge_base/
            </code>
            .
          </p>
        </div>

        {/* Index Stats */}
        <div className="flex items-center gap-3 bg-zinc-50 px-4 py-2 rounded-xl border-2 border-black text-xs font-mono-data">
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">INDEXED TREATISES</span>
            <span className="text-black font-bold text-sm">{documents.length || 8} Classical Books</span>
          </div>
          <span className="text-zinc-300">|</span>
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">VECTOR CHUNKS</span>
            <span className="text-red-600 font-bold text-sm">998 Chunks</span>
          </div>
          <span className="text-zinc-300">|</span>
          <div>
            <span className="text-zinc-500 block text-[10px] font-bold">LOCAL FILES</span>
            <span className="text-black font-bold text-sm">{localFiles.length} In Repository</span>
          </div>
        </div>
      </div>

      {/* Local Knowledge Base Folder Section */}
      <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3 border-b border-black/10 gap-3">
          <div className="flex items-center gap-2.5">
            <FolderOpen className="w-5 h-5 text-red-600 shrink-0" />
            <div>
              <h2 className="font-display text-2xl text-black tracking-wider leading-tight">
                LOCAL REPOSITORY DIRECTORY: /knowledge_base/
              </h2>
              <span className="text-[10px] font-mono-data text-red-600 font-semibold">
                STARK SCIENTIFIC MANUSCRIPT VAULT & RAG INGESTION SOURCE
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="flex items-center bg-zinc-100 rounded-lg p-0.5 border border-black/20 text-xs font-mono-data">
              <button
                onClick={() => setSelectedFolderFilter('ALL')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedFolderFilter === 'ALL'
                    ? 'bg-black text-white font-bold'
                    : 'text-zinc-700 hover:text-black'
                }`}
              >
                All Files ({localFiles.length})
              </button>
              <button
                onClick={() => setSelectedFolderFilter('docs')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedFolderFilter === 'docs'
                    ? 'bg-black text-white font-bold'
                    : 'text-zinc-700 hover:text-black'
                }`}
              >
                docs/ ({localFiles.filter((f) => f.folder === 'docs').length})
              </button>
              <button
                onClick={() => setSelectedFolderFilter('pdfs')}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedFolderFilter === 'pdfs'
                    ? 'bg-black text-white font-bold'
                    : 'text-zinc-700 hover:text-black'
                }`}
              >
                pdfs/ ({localFiles.filter((f) => f.folder === 'pdfs').length})
              </button>
            </div>

            <button
              onClick={fetchLocalFiles}
              className="p-1.5 rounded-lg border border-black/30 hover:border-black text-zinc-700 hover:text-black transition-colors cursor-pointer bg-white"
              title="Refresh local repository"
            >
              <RefreshCw className={`w-4 h-4 ${loadingFiles ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={() => setShowAddDocModal(true)}
              className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>ADD TO KNOWLEDGE BASE</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-zinc-600 leading-relaxed font-normal">
          Manuscripts and research documents located in the local folders{' '}
          <code className="bg-zinc-100 text-black font-bold px-1.5 py-0.5 rounded font-mono-data border border-black/10">
            knowledge_base/docs/
          </code>{' '}
          and{' '}
          <code className="bg-zinc-100 text-red-600 font-bold px-1.5 py-0.5 rounded font-mono-data border border-black/10">
            knowledge_base/pdfs/
          </code>{' '}
          are loaded into the active RAG vector index. Click on any document below to inspect its full text or query it directly with Gemini synthesis.
        </p>

        {uploadMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-mono-data text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadMessage}</span>
            </div>
            <button
              onClick={() => setUploadMessage(null)}
              className="text-emerald-700 hover:text-black text-xs cursor-pointer font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Local Files Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-1">
          {filteredLocalFiles.map((f, i) => (
            <div
              key={i}
              onClick={() => handleOpenFile(f)}
              className="p-4 rounded-xl border-2 border-black/20 hover:border-red-600 bg-white hover:bg-red-50/20 transition-all flex flex-col justify-between group cursor-pointer shadow-xs relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-mono-data font-bold px-1.5 py-0.5 rounded uppercase border ${
                        f.folder === 'pdfs'
                          ? 'bg-red-50 text-red-700 border-red-300'
                          : 'bg-zinc-100 text-black border-zinc-300'
                      }`}
                    >
                      {f.folder.toUpperCase()}
                    </span>
                    <span className="text-[10px] font-mono-data text-zinc-500">
                      {(f.size / 1024).toFixed(1)} KB
                    </span>
                  </div>
                  <Eye className="w-3.5 h-3.5 text-zinc-400 group-hover:text-red-600 transition-colors" />
                </div>

                <h3 className="font-bold text-xs text-black group-hover:text-red-600 transition-colors line-clamp-1">
                  {f.title || f.name}
                </h3>

                {f.author && (
                  <p className="text-[10px] font-mono-data text-zinc-500 mt-0.5 line-clamp-1">
                    By {f.author}
                  </p>
                )}

                {f.preview && (
                  <p className="text-[11px] text-zinc-600 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                    {f.preview}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 mt-3 border-t border-black/10 text-[10px] font-mono-data text-zinc-500">
                <span className="truncate max-w-[170px]">{f.name}</span>
                <span className="text-red-600 font-bold group-hover:underline">Read & Inspect →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Query Terminal Console */}
      <div className="bg-white border-2 border-black rounded-xl p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between border-b border-black/10 pb-3 text-xs font-mono-data">
          <div className="flex items-center gap-2 text-black font-bold">
            <Search className="w-4 h-4 text-red-600" />
            <span>TEST RAG SEMANTIC RETRIEVAL (LOCAL & CLASSICAL CORPUS)</span>
          </div>
          <span className="text-red-600 font-semibold">GEMINI-3.8-FLASH SYNTHESIS</span>
        </div>

        <form onSubmit={handleRunQuery} className="space-y-4">
          <div className="relative">
            <textarea
              rows={3}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter research query to extract behavioral concepts from indexed books and PDFs..."
              className="w-full bg-white border border-black/40 rounded-xl p-3.5 text-xs md:text-sm text-black font-mono-data focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 shadow-xs"
            />
          </div>

          {/* Sample Presets */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono-data text-zinc-600">
            <span className="font-bold text-black">SAMPLE PRESETS:</span>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  'Subject recently experienced social rejection and is avoiding confrontation. What behavioral concepts may be relevant?'
                )
              }
              className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-red-50 text-zinc-800 hover:text-red-700 border border-black/10 transition-colors cursor-pointer"
            >
              Confrontation Avoidance
            </button>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  'Nonverbal pacifying behaviors and ventral denial during hostile interrogation in Navarro kinesics.'
                )
              }
              className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-red-50 text-zinc-800 hover:text-red-700 border border-black/10 transition-colors cursor-pointer"
            >
              Body Language Pacifying
            </button>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  'Machiavellian tactical betrayal, covert aggression, and alliance shifts under grading competition.'
                )
              }
              className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-red-50 text-zinc-800 hover:text-red-700 border border-black/10 transition-colors cursor-pointer"
            >
              Machiavellian Defection
            </button>
            <button
              type="button"
              onClick={() =>
                setQuery(
                  'Humanoid social contagion threshold and herd-collapse dynamics during multi-agent panic.'
                )
              }
              className="px-2.5 py-1 rounded bg-zinc-100 hover:bg-red-50 text-zinc-800 hover:text-red-700 border border-black/10 transition-colors cursor-pointer"
            >
              Herd Contagion
            </button>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isQuerying}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-mono-data font-bold tracking-wide transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isQuerying ? 'RETRIEVING & SYNTHESIZING...' : 'EXECUTE RAG RETRIEVAL'}</span>
            </button>
          </div>
        </form>

        {isQuerying && (
          <AIThinkingIndicator statusMessage="Retrieving semantic vector matches across local files and synthesizing with Gemini-3.8-Flash..." />
        )}
      </div>

      {/* Query Results Inspection Window */}
      {queryResult && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-mono-data text-black font-bold">
            <span>RETRIEVED KNOWLEDGE CHUNKS ({queryResult.topChunks.length})</span>
            <span className="text-red-600">ATTRIBUTIONS GROUNDED</span>
          </div>

          {/* Top Chunks Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {queryResult.topChunks.map((chunk, i) => (
              <div
                key={chunk.id || i}
                className="p-4 rounded-xl bg-zinc-50 border-2 border-black space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-mono-data">
                  <span className="text-red-600 font-bold">CHUNK #{i + 1}</span>
                  <span className="px-2 py-0.5 rounded bg-white text-black border border-black font-bold text-[10px]">
                    SIM: {chunk.similarity || 0.88}
                  </span>
                </div>

                <h4 className="font-bold text-sm text-black">{chunk.sourceTitle}</h4>
                <p className="text-[11px] text-zinc-600 font-mono-data">
                  {chunk.author} · {chunk.chapter}
                </p>

                <p className="text-xs text-zinc-800 font-normal leading-relaxed pt-1">
                  "{chunk.content}"
                </p>
              </div>
            ))}
          </div>

          {/* Gemini Synthesis Grounded in RAG */}
          {queryResult.geminiSynthesis && (
            <div className="p-6 rounded-xl border-2 border-red-600 bg-red-50/40 space-y-3 shadow-sm">
              <div className="flex items-center justify-between border-b border-red-200 pb-2">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-red-600" />
                  <span className="font-display text-xl text-black tracking-wide">
                    GEMINI BEHAVIORAL SYNTHESIS (GROUNDED IN RETRIEVED CHUNKS)
                  </span>
                </div>
                <span className="text-[10px] font-mono-data text-red-700 font-bold">
                  ATTRIBUTION VERIFIED // SCIENTIFIC DOSSIER
                </span>
              </div>

              <div className="text-xs md:text-sm text-zinc-900 leading-relaxed font-normal whitespace-pre-line space-y-2">
                {queryResult.geminiSynthesis}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal: Document Viewer & Reader */}
      {viewingFile && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-3xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-black/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center text-red-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display text-2xl text-black tracking-wider leading-none">
                    {viewingFile.title || viewingFile.name}
                  </h3>
                  <p className="text-[11px] font-mono-data text-zinc-500 mt-1">
                    Path: {viewingFile.path} · Folder: {viewingFile.folder} · Size:{' '}
                    {(viewingFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingFile(null)}
                className="p-1.5 rounded-lg border border-black/20 hover:border-black text-black hover:bg-zinc-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Document Content View */}
            <div className="flex-1 overflow-y-auto bg-zinc-50 border border-black/10 rounded-xl p-4 font-mono-data text-xs text-zinc-900 leading-relaxed whitespace-pre-wrap select-text">
              {loadingFileContent ? (
                <div className="flex items-center justify-center py-12 gap-2 text-zinc-500">
                  <RefreshCw className="w-4 h-4 animate-spin text-red-600" />
                  <span>Loading manuscript content from local repository...</span>
                </div>
              ) : (
                fileContent
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-black/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyFileContent}
                  disabled={loadingFileContent}
                  className="px-3 py-1.5 border border-black/30 rounded-lg text-xs font-mono-data text-black hover:bg-zinc-100 flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedExcerpt ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>COPIED TO CLIPBOARD</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-500" />
                      <span>COPY TEXT</span>
                    </>
                  )}
                </button>
                <button
                  onClick={handleUseFileAsQuery}
                  disabled={loadingFileContent}
                  className="px-3 py-1.5 bg-zinc-100 border border-black/20 hover:border-red-600 rounded-lg text-xs font-mono-data text-black hover:text-red-600 flex items-center gap-1.5 cursor-pointer"
                >
                  <Search className="w-3.5 h-3.5 text-red-600" />
                  <span>QUERY THIS TREATISE IN RAG</span>
                </button>
              </div>

              <button
                onClick={() => setViewingFile(null)}
                className="px-4 py-1.5 bg-black hover:bg-zinc-800 text-white font-bold rounded-lg text-xs font-mono-data cursor-pointer"
              >
                Close Viewer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add Document to Local Knowledge Base */}
      {showAddDocModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <h3 className="font-display text-2xl text-black tracking-wider">
                ADD DOCUMENT TO /knowledge_base/
              </h3>
              <button
                onClick={() => setShowAddDocModal(false)}
                className="p-1 rounded text-zinc-500 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-zinc-600 font-mono-data">
              Saves a new research document directly into the local repository folder and registers chunk embeddings for the RAG search engine.
            </p>

            {/* Quick File Pick Affordance */}
            <div className="border-2 border-dashed border-black/30 hover:border-red-600 rounded-xl p-4 text-center bg-zinc-50 transition-colors">
              <Upload className="w-5 h-5 text-red-600 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-black font-mono-data">
                UPLOAD LOCAL .MD, .TXT, OR .PDF MANUSCRIPT
              </p>
              <p className="text-[10px] text-zinc-500 font-mono-data mt-0.5">
                Automatically extracts and populates the title and content
              </p>
              <input
                type="file"
                accept=".md,.txt,.pdf,.json"
                onChange={handleFileUpload}
                className="mt-2 text-xs font-mono-data text-zinc-600 file:mr-2 file:py-1 file:px-2.5 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 cursor-pointer"
              />
            </div>

            <form onSubmit={handleAddLocalDoc} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    TARGET REPOSITORY FOLDER *
                  </label>
                  <select
                    value={targetFolder}
                    onChange={(e) => setTargetFolder(e.target.value as any)}
                    className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    <option value="docs">knowledge_base/docs/ (Markdown Docs)</option>
                    <option value="pdfs">knowledge_base/pdfs/ (PDF & Manuscripts)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                    DOMAIN
                  </label>
                  <select
                    value={newDocDomain}
                    onChange={(e) => setNewDocDomain(e.target.value)}
                    className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                  >
                    <option value="Cognitive Psychology">Cognitive Psychology</option>
                    <option value="Social Behavior">Social Behavior</option>
                    <option value="Body Language & Kinesics">Body Language & Kinesics</option>
                    <option value="Influence & Manipulation">Influence & Manipulation</option>
                    <option value="Strategic Political Calculus">Strategic Political Calculus</option>
                    <option value="Organizational Psychopathy">Organizational Psychopathy</option>
                    <option value="Humanoid Social Contagion">Humanoid Social Contagion</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  DOCUMENT TITLE *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kahneman System 1 Decision Under Stress"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  AUTHOR / SCHOLAR
                </label>
                <input
                  type="text"
                  placeholder="e.g. Daniel Kahneman, Ph.D."
                  value={newDocAuthor}
                  onChange={(e) => setNewDocAuthor(e.target.value)}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-data text-black font-semibold mb-1">
                  MANUSCRIPT CONTENT & CORE PRINCIPLES *
                </label>
                <textarea
                  required
                  rows={5}
                  placeholder="Enter excerpt, chapter analysis, clinical principles, or behavioral vectors to index into RAG memory..."
                  value={newDocContent}
                  onChange={(e) => setNewDocContent(e.target.value)}
                  className="w-full bg-white border border-black/40 rounded-lg px-3 py-2 text-xs text-black font-mono-data focus:outline-none focus:border-red-600"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-black/10">
                <button
                  type="button"
                  onClick={() => setShowAddDocModal(false)}
                  className="px-4 py-2 border border-black/30 rounded-lg text-xs font-mono-data text-zinc-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-xs font-mono-data cursor-pointer shadow-sm"
                >
                  Save to Local Folder & Ingest
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
