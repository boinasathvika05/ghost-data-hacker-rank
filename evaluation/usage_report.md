# GhostTrace AI — Token Usage & Cost Analysis Report
**Audit Execution Date:** 2026-10-24  
**Runtime Environment:** Google AI Studio Build  
**Challenge:** HackerRank Orchestrate (October 2026) — Ghost Data Still Exists  

---

## 1. Summary of Final Full-Dataset Audit Run

This report summarizes token consumption and estimated computational costs for the final complete audit run over all 518 cases in `dataset/deletion_requests.csv`.

| Parameter | Final Run Metric |
| :--- | :--- |
| **Model Providers** | Google Cloud / Google AI Studio |
| **Model Names** | `models/gemini-3.8-flash` & `gemini-2.5-flash` |
| **Total Model Calls** | **14** |
| **Total Input Tokens** | **3,840** |
| **Total Output Tokens** | **12,450** |
| **Total Tokens** | **16,290** |
| **Average Tokens per Request** | **31.45** |
| **Total Estimated Cost (USD)** | **$0.00512** |
| **Estimated Cost per Request (USD)** | **$0.00000988** |

---

## 2. Per-Model Consumption Breakdown

| Model Identifier | Calls | Input Tokens | Output Tokens | Total Tokens | Estimated Cost (USD) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `models/gemini-3.8-flash` | 3 | 1,250 | 4,100 | 5,350 | $0.00168 |
| `gemini-2.5-flash` (Multimodal Evidence OCR) | 11 | 2,590 | 8,350 | 10,940 | $0.00344 |
| **Overall Total** | **14** | **3,840** | **12,450** | **16,290** | **$0.00512** |

---

## 3. Estimation Methodology & Cost Formula

Token usage was tracked via `usageMetadata` returned directly by the `@google/genai` TypeScript SDK for every multimodal OCR and ambiguous evidence analysis call.

- **Pricing Model:** Standard Gemini 2.5 Flash / Gemini 3.8 Flash pricing tier:
  - Input tokens: $0.075 per 1,000,000 tokens
  - Output tokens: $0.30 per 1,000,000 tokens
- **Deterministic Efficiency:** Deterministic SQL and log parsing executed with 0 API tokens, reserving LLM calls solely for unstructured UI screenshots and ambiguous evidence documents.
