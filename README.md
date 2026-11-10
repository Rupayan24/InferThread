# InferThread

**Low-latency, model-agnostic chat platform with persistent thread state management, code syntax highlighting, and fast Groq LPU inference.**

InferThread is a full-stack AI chat application built with React, Express, MongoDB, and Groq's OpenAI-compatible chat completions API. It provides a clean chat interface, saves conversations as threads, renders assistant responses as Markdown, and highlights code blocks.

> **Current provider implementation:** the backend currently calls Groq's OpenAI-compatible API. The provider integration is isolated in `Backend/utils/openai.js`; using another provider requires adapting that integration. `GROQ_MODEL` selects the Groq model.

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Tech stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Running the application](#running-the-application)
- [API](#api)
- [Project structure](#project-structure)
- [Scripts](#scripts)
- [Troubleshooting](#troubleshooting)
- [Limitations and security](#limitations-and-security)
- [Contributing](#contributing)
- [License](#license)

## Features

- Start conversations and browse saved threads.
- Persist thread titles, messages, and timestamps in MongoDB.
- Generate assistant replies through Groq's chat completions API.
- Configure the Groq model with an environment variable.
- Render assistant messages as Markdown with highlighted code blocks.
- Show a loading indicator while a reply is being generated.
- Display chat request errors in the interface.

## How it works

1. The React frontend sends the current message and a thread ID to the Express API.
2. The backend creates or finds the corresponding MongoDB thread.
3. The backend sends the current user message to Groq and receives a reply.
4. The user message and assistant reply are saved to the thread.
5. The frontend displays the reply and refreshes the thread history.

**Context note:** although messages are persisted, the current Groq request sends only the latest user message—not the full thread history. As a result, the model does not currently have earlier messages as conversational context.

## Tech stack

| Area | Technologies |
| --- | --- |
| Frontend | React, Vite, `react-markdown`, `rehype-highlight` |
| Backend | Node.js, Express |
| Database | MongoDB with Mongoose |
| Inference | Groq OpenAI-compatible chat completions API |

## Prerequisites

- Node.js and npm (use a current Node.js LTS release).
- A MongoDB instance, local or hosted, and its connection URI.
- A Groq API key.

## Getting started

Clone the repository and install frontend and backend dependencies:

```bash
git clone https://github.com/Rupayan24/InferThread.git
cd InferThread

cd Backend
npm install

cd ../Frontend
npm install
```

Create `Backend/.env` with the configuration described below. Keep this file private; it is ignored by Git.

## Configuration

Create `Backend/.env`:

```dotenv
PORT=8080
MONGODB_URI=mongodb://127.0.0.1:27017/inferthread
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=qwen/qwen3.8-27b
```

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Backend HTTP port. Defaults to `8080`. |
| `MONGODB_URI` | Yes | MongoDB connection string. |
| `GROQ_API_KEY` | Yes | API key used to authenticate requests to Groq. |
| `GROQ_MODEL` | No | Groq model ID. Defaults to `qwen/qwen3.8-27b` in the current backend. |

The backend loads `.env` automatically. Do not commit API keys, database credentials, or other secrets.

## Running the application

Start the backend in one terminal:

```bash
cd Backend
npm run dev
```

Start the frontend in a second terminal:

```bash
cd Frontend
npm run dev
```

Open the local URL printed by Vite (typically `http://localhost:5173`). The frontend currently calls the backend at `http://localhost:8080`; set `PORT` to `8080` or update the frontend API URLs if you use a different backend address.

For a frontend production build:

```bash
cd Frontend
npm run build
```

Vite writes the production assets to `Frontend/dist`. The frontend and backend are separate applications and must each be deployed/configured for your hosting environment.

## API

The backend mounts its routes under `/api`. JSON request and response bodies are shown below.

### `POST /api/chat`

Send a message and thread ID. The backend creates the thread if it does not exist.

Request:

```json
{
  "threadId": "thread-unique-id",
  "message": "Explain a JavaScript promise."
}
```

Success response (`200`):

```json
{
  "reply": "A Promise represents the eventual completion or failure of an asynchronous operation..."
}
```

Missing fields return `400`; inference, database, or other server failures return `500`.

### `GET /api/thread`

Returns all saved threads, ordered by most recently updated. Each result includes its thread ID and title, along with MongoDB document fields.

### `GET /api/thread/:threadId`

Returns the saved messages for a thread. Returns `404` if the thread does not exist.

### `DELETE /api/thread/:threadId`

Deletes a thread. Returns `404` if it does not exist.

### `POST /api/test`

Creates and returns a test thread. This development endpoint writes to the configured MongoDB database.

## Project structure

```text
InferThread/
├── Backend/
│   ├── models/          # Mongoose thread and message schemas
│   ├── routes/          # Express API routes
│   ├── utils/           # Groq inference integration
│   ├── server.js        # Express app and MongoDB connection
│   └── package.json
├── Frontend/
│   ├── public/          # Static public assets
│   ├── src/             # React app, chat UI, styles, and context
│   ├── index.html
│   └── package.json
└── README.md
```

## Scripts

Run commands from the relevant application directory.

### Backend (`Backend/`)

| Command | Description |
| --- | --- |
| `npm start` | Start the Express server with Node.js. |
| `npm run dev` | Start the server with Nodemon during development. |

### Frontend (`Frontend/`)

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build in `dist/`. |
| `npm run preview` | Preview the production build locally. |
| `npm run lint` | Run ESLint on the frontend project. |

## Troubleshooting

- **MongoDB connection failure:** confirm MongoDB is running and `MONGODB_URI` is correct. The backend logs connection failures in its terminal.
- **Missing Groq key:** set `GROQ_API_KEY` in `Backend/.env`, then restart the backend.
- **Groq authentication or model error:** verify that the key is active and that `GROQ_MODEL` names a model available to your Groq account.
- **Frontend cannot reach the API:** ensure the backend is listening on port `8080`. The frontend currently uses `http://localhost:8080` directly.
- **No assistant reply:** check the backend terminal for Groq or database errors; the chat UI displays request failures when it receives an error response.
- **Thread history is empty or unavailable:** verify MongoDB connectivity and check that the backend can read and write the configured database.

## Limitations and security

- The current inference request includes only the latest user message, not previous thread messages.
- Authentication, user accounts, and per-user thread access controls are not implemented. Do not expose this instance publicly with sensitive data.
- The frontend API address is currently hard-coded to `http://localhost:8080`; deployment to another host requires configuring the frontend to use the deployed API URL.
- Configure appropriate CORS restrictions, request limits, authentication, and secret management before deploying to production.
- Messages are stored in the configured MongoDB database. Treat them as user data and secure, retain, or delete them according to your requirements.

## Contributing

Issues and pull requests are welcome. For changes, please:

1. Keep frontend and backend responsibilities clearly separated.
2. Avoid committing `.env` files, API keys, or database credentials.
3. Run the relevant frontend build and lint checks before opening a pull request.
4. Describe behavior changes and any new configuration in your pull request.

## License

No license file is currently included in this repository. Until a license is added, assume that standard copyright restrictions apply; contact the repository owner for permission to reuse or distribute the project.
