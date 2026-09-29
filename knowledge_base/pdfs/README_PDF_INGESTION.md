# PDF Knowledge Base Ingestion Vault
`/knowledge_base/pdfs/`

This folder is configured for storing raw PDF research manuscripts, psychological assessment reports, clinical trial printouts, and scientific papers.

## Supported PDF Documents:
1. `humanoid_behavioral_benchmarks_2026.pdf` — Baseline evaluation metrics for synthetic agents under social duress.
2. `kinesic_stress_manifestations_vol4.pdf` — High-speed video analysis of pupil dilation, suprasternal notch touching, and micro-expressions.
3. `agent_sociometry_field_notes.pdf` — Longitudinal network analysis of peer influence and loyalty breakdowns.

## How to Add New PDFs:
1. Place any `.pdf` or `.docx` file into this directory: `/knowledge_base/pdfs/`.
2. In the BLACK S.H.E.E.P. interface, navigate to **Module 06: RAG Knowledge Base**.
3. Use the **Upload & Ingest Document** panel or click **"Scan & Synchronize Local Folder"**.
4. The backend server extracts the text, creates semantic chunk embeddings, and integrates them into the RAG vector index alongside Kahneman, Navarro, and DSM-5 references.
