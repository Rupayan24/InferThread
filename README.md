# InferThread

<p align="center">
  <img src="./Frontend/src/assets/blacklogo.png" alt="InferThread Logo" width="90" />
</p>

<p align="center">
  <strong>Low-latency, model-agnostic chat platform featuring persistent thread state management, code syntax highlighting, and fast Groq LPU inference.</strong>
</p>

<p align="center">
  <img src="[https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black](https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black)" alt="React" />
  <img src="[https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white](https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white)" alt="Node" />
  <img src="[https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)" alt="MongoDB" />
  <img src="[https://img.shields.io/badge/Inference-Groq%20LPU-F55036?style=flat-square](https://img.shields.io/badge/Inference-Groq%20LPU-F55036?style=flat-square)" alt="Groq" />
  <img src="[https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white](https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white)" alt="Vite" />
  <img src="[https://img.shields.io/badge/License-MIT-blue?style=flat-square](https://img.shields.io/badge/License-MIT-blue?style=flat-square)" alt="License" />
</p>

---

## 📌 Executive Summary

**InferThread** is a full-stack, model-agnostic conversational platform engineered to address interface latency and conversational context persistence. By pairing **Groq Language Processing Unit (LPU)** hardware inference with an isolated **multi-session thread state model**, InferThread achieves sub-second token generation while cleanly segregating chat sessions and tracking conversation history in MongoDB Atlas.

---

## ⚡ Core Features

- **High-Throughput LPU Inference:** Integrates the Groq SDK to dispatch prompt completions to open-weights models (Meta Llama 3 / Qwen) with minimal first-token latency.
- **Persistent Thread Isolation:** Full CRUD state lifecycle for conversation sessions. Threads maintain isolated historical contexts, preventing prompt bleeding across chats.
- **Dynamic Syntax Highlighting & Markdown:** Renders code blocks and structured Markdown in real time using `react-markdown` and `rehype-highlight`.
- **Centralized Session Context:** React Context API store (`MyContext.jsx`) managing active thread selection, optimistic message updates, auto-scrolling, and responsive UI drawers.
- **Decoupled Client-Server Architecture:** Modular REST endpoints separating conversation state management from the AI completion pipeline.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** React 18, Vite
- **Markdown & Code Highlighting:** `react-markdown`, `rehype-highlight`
- **Session Utilities:** `uuid` (UUIDv4)
- **Styling:** Modular CSS3 with dark mode theme

### Backend
- **Runtime & Server:** Node.js, Express.js
- **Database & ODM:** MongoDB Atlas, Mongoose
- **AI Inference Engine:** Groq Cloud SDK (`groq-sdk`)
- **Environment Management:** `dotenv`, `cors`

---

## 🏗️ System Architecture & Data Flow

```text
┌────────────────┐          POST /api/chat/message          ┌─────────────────┐
│                │ ───────────────────────────────────────> │                 │
│  React Client  │                                          │ Express Backend │
│  (InferThread) │ <─────────────────────────────────────── │                 │
└───────┬────────┘           JSON Context Response          └────┬─────────┬──┘
        │                                                        │         │
        │ Thread CRUD & Context State              DB Operations │         │ Groq Inference API
        │                                                        ▼         ▼
┌───────┴────────┐                                        ┌──────────┐ ┌───────────────┐
│ React Context  │                                        │ MongoDB  │ │   Groq LPU    │
│  (State Store) │                                        │  Atlas   │ │ (Llama 3/LLMs)│
└────────────────┘                                        └──────────┘ └───────────────┘
