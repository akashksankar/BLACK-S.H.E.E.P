# BLACK S.H.E.E.P. — Local Knowledge Base Repository
`/knowledge_base/`

This local directory is the authoritative source for literature, behavioral textbooks, clinical reference guides, and research PDFs/docs used by the BLACK S.H.E.E.P. RAG ingestion and retrieval engine.

## Directory Structure:
```
/knowledge_base/
├── README.md                              <- Ingestion protocol & instructions
├── docs/                                  <- Extracted & cleaned reference manuscripts
│   ├── 01_thinking_fast_and_slow.md
│   ├── 02_dictionary_of_body_language.md
│   ├── 03_dsm5_icd11_behavioral_reference.md
│   ├── 04_in_sheeps_clothing.md
│   ├── 05_the_prince.md
│   ├── 06_snakes_in_suits.md
│   ├── 07_the_gaslight_effect.md
│   └── 08_the_asshole_survival_guide.md
└── pdfs/                                  <- Place raw PDF manuscripts & research documents here
```

## Adding New Books & PDFs:
1. Drop your PDF or Markdown file directly into `/knowledge_base/pdfs/` or `/knowledge_base/docs/`.
2. Open the **RAG Knowledge Module (06)** in the BLACK S.H.E.E.P. workstation.
3. Click **"Scan & Ingest Local Folder"** to chunk and vectorize the new document into the semantic search engine.
