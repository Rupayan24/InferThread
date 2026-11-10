```markdown
# InferThread

<p align="center">
  <img src="./Frontend/src/assets/blacklogo.png" alt="InferThread Logo" width="90" />
</p>

<p align="center">
  <strong>Low-latency, model-agnostic chat platform featuring persistent thread state management, code syntax highlighting, and fast Groq LPU inference.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.x-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node" />
  <img src="https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Inference-Groq%20LPU-F55036?style=flat-square" alt="Groq" />
  <img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=flat-square" alt="License" />
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

```

---

## 📁 Repository Structure

```text
InferThread/
├── Backend/
│   ├── models/
│   │   ├── Thread.js          # Thread parent schema and timestamps
│   │   └── Message.js         # Message child schema with sender enum (user/assistant)
│   ├── routes/
│   │   └── chat.js            # Thread CRUD and chat message handling
│   ├── utils/
│   │   └── openai.js          # Groq SDK initialization and completion logic
│   ├── server.js              # Express app bootstrap, CORS, and MongoDB connection
│   └── package.json
│
├── Frontend/
│   ├── public/                # Static icons and assets
│   ├── src/
│   │   ├── assets/            # Project logos and media
│   │   ├── App.jsx            # Core layout wrapper
│   │   ├── ChatWindow.jsx     # Message list, auto-scroller, and input box
│   │   ├── Sidebar.jsx        # Thread navigation and session controls
│   │   ├── MyContext.jsx      # Centralized React state store
│   │   └── main.jsx           # React DOM root entry
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore                 # Root-level ignore rule file (.env, node_modules)
└── README.md

```

---

## 🔌 API Reference

### Threads

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/threads` | Fetches all persisted conversation threads sorted by timestamp. |
| `POST` | `/api/threads` | Initializes a new conversation thread. |
| `DELETE` | `/api/threads/:id` | Deletes a thread and cascades deletion of its associated messages. |

### Messaging & Completions

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/chat/:threadId` | Retrieves chronological message history for a specific thread. |
| `POST` | `/api/chat` | Dispatches user prompt to Groq, persists context, returns response. |

#### Request Payload (`POST /api/chat`)

```json
{
  "threadId": "6730a84e9d1234567890abcd",
  "message": "Explain the difference between process and thread in operating systems."
}

```

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18 or higher)
* npm (v9 or higher)
* MongoDB Atlas account and cluster connection URI
* Groq Cloud API Key ([Groq Console](https://console.groq.com/))

### 1. Clone the Repository

```bash
git clone [https://github.com/Rupayan24/InferThread.git](https://github.com/Rupayan24/InferThread.git)
cd InferThread

```

### 2. Configure Environment Variables

Create a `.env` file in the `Backend/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
GROQ_API_KEY=your_groq_api_key

```

### 3. Backend Installation & Startup

```bash
cd Backend
npm install
npm run dev

```

Backend runs on `http://localhost:5000`.

### 4. Frontend Installation & Startup

In a separate terminal window:

```bash
cd Frontend
npm install
npm run dev

```

Frontend runs on `http://localhost:5173`.

---

## 🛡️ Security & Hygiene

* **Zero Secret Commits:** Pre-configured root `.gitignore` excludes all `.env` files, build output folders (`dist/`), and dependencies (`node_modules/`).
* **Input Sanitization:** Disallows malformed payloads prior to LLM completion execution.
* **CORS Restricted Access:** Secures backend API routes to authorized local and production origins.

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Rupayan Ghosh**

* GitHub: [@Rupayan24](https://www.google.com/search?q=https://github.com/Rupayan24)
* LinkedIn: [linkedin.com/in/rupayan-ghosh](https://www.linkedin.com/in/rupayan-ghosh)

```

```
