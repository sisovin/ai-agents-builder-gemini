# AI Agents Builder Platform — Gemini-Powered Productivity & Onboarding System

A starter Next.js + TypeScript project that demonstrates a secure, scalable AI Agents Builder powered by Google Gemini. It includes authentication (Google OAuth via Firebase), Firestore for persistence, Arcjet endpoint protection, Tailwind CSS styling, and both single-response and streaming integrations with the `@google/generative-ai` SDK.

This README was generated from the project brief and provides a comprehensive guide to the repository layout, installation, configuration, core files, and development workflow.

---

## Table of Contents

- Project overview
- Tech stack
- Key features
- Architecture & visual flow
- Security & streaming notes
- Files included (generated)
- Environment variables
- Local development & run
- Code references (what each file does)
- Smart Email Reply (component & usage)
- Onboarding flow (main page)
- Production & deployment notes
- Testing & troubleshooting
- Contributing
- License

---

## Project overview

The AI Agents Builder Platform is designed to let users create, run, and manage intelligent agents backed by Google Gemini. This starter app focuses on productivity modules and a simple onboarding flow, providing:

- Google OAuth sign-in via Firebase Auth
- Firestore storage for users, agents, conversations, and prompt libraries
- A protected API endpoint for agent requests (Arcjet)
- Gemini SDK integration supporting non-stream and streaming responses
- Example productivity module: Smart Email Reply
- Tailwind CSS + Next.js (App Router) + TypeScript boilerplate

I generated this README and outlined every core file and setup step. If you want, I can now generate the actual files described below (package.json, lib/agent.ts, API route, components, etc.).

---

## Tech stack

- Framework: Next.js 16 (App Router)
- Language: TypeScript
- UI library: React 19.2
- Styling: Tailwind CSS
- Backend & DB: Firebase (Firestore)
- Auth: Firebase Auth (Google OAuth)
- AI Engine: Google Gemini (`@google/generative-ai`)
- API Protection: Arcjet
- Platform: Designed for local development and deployment to Vercel / Firebase Hosting

---

## Key features

- Secure user authentication via Google OAuth (Firebase Auth)
- Agent creation + configuration stored in Firestore
- Single-response and streaming responses via Gemini SDK
- Arcjet protection on the agent API to mitigate abuse
- Productivity prompt library (example: Smart Email Reply)
- Simple onboarding flow with instant agent interaction

---

## Architecture & visual flow

Visual flow (textual):

[User] → [Next.js UI] → [Google OAuth] → [Firebase Auth] → [Arcjet Protection] → [Gemini AI Agent Logic] → [Conversation Stream + Prompts] → [Firebase Firestore DB]

Layer responsibilities:

- Frontend: Next.js + React — pages, components, streaming UI
- Auth: Firebase Auth (Google) — sign-in, session management
- Backend (server actions / API routes): Arcjet-protected endpoint(s) that call Gemini
- DB: Firestore — users, agents, conversations, prompt library
- AI: Gemini SDK for responses (non-streamed and streaming)
- Streaming: Token-by-token streaming to the client using web streams / server-sent events

---

## Security & streaming notes

- Keep `GOOGLE_GEMINI_API_KEY` and `ARCJET_KEY` secret — never commit them.
- Arcjet sits in front of crucial API routes (e.g., `/api/agent`) to throttle, validate, and block abusive traffic.
- Streaming responses from Gemini should be proxied by the server route (not called directly from the browser).
- Track prompt usage and token counts in Firestore for billing & auditing.

---

## Files included (generated)

This project skeleton includes (or should include) the following important files:

- package.json — dependencies + scripts
- tailwind.config.js — Tailwind config
- src/styles/globals.css — global Tailwind imports + base styles
- .env.local.example — environment variable template
- lib/firebase.ts — Firebase initialization (app, auth, firestore)
- lib/agent.ts — Gemini SDK wrapper: runAgent, streamAgent
- app/api/agent/route.ts — Next.js API route protected with Arcjet, uses streamAgent
- components/SmartEmailReply.tsx — React component for the Smart Email Reply module
- app/page.tsx — main onboarding page and sign-in flow (renders SmartEmailReply after login)
- README.md — you are reading it
- Other standard Next.js scaffolding (tsconfig.json, next.config.js, etc.)

---

## Environment variables

Create a `.env.local` (do not commit) using this template:

```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GOOGLE_GEMINI_API_KEY=
ARCJET_KEY=
NEXTAUTH_URL= # optional, if using NextAuth in the future
```

Notes:
- `NEXT_PUBLIC_*` vars are intentionally public for Firebase client SDK initialization.
- `GOOGLE_GEMINI_API_KEY` and `ARCJET_KEY` must remain server-only in production; do NOT expose them to client code.

---

## Local development & run

Prerequisites:
- Node.js (recommend v18+)
- pnpm / npm / yarn
- Firebase project (for Auth + Firestore)
- Arcjet account & key
- Google Gemini API access and key

Quickstart:

1. Install deps:
   - npm: `npm install`
   - or pnpm: `pnpm install`

2. Copy env file:
   - `cp .env.local.example .env.local`
   - Fill in the values from your Firebase project, Gemini, and Arcjet.

3. Run local dev server:
   - `npm run dev`
   - Open: http://localhost:3000

4. Sign in with Google on the homepage and try the Smart Email Reply.

---

## Scripts (example)

Add these to `package.json`:

- "dev": next dev
- "build": next build
- "start": next start
- "lint": eslint . --ext .ts,.tsx

---

## Code references & what each generated file does

- lib/firebase.ts
  - Initializes Firebase modular SDK (v9+).
  - Exports: `app`, `auth`, `firestore`.

- lib/agent.ts
  - Exports two async functions:
    - `runAgent(prompt: string)`: Calls Gemini for a single (non-streaming) text completion and returns the text.
    - `streamAgent(prompt: string)`: Uses Gemini Streaming API and returns an HTTP stream that's consumed by the server route. The server route converts the Gemini stream into a format the client can consume (e.g., using web streams or server-sent events).

- app/api/agent/route.ts
  - A Next.js  route (`/api/agent`) that:
    - Validates the incoming request (auth info or Firebase token).
    - Passes Arcjet middleware/validation to prevent abuse.
    - Calls `streamAgent` and forwards the stream to the requesting client.
    - Optionally logs token usage to Firestore.

- components/SmartEmailReply.tsx
  - React component with:
    - A `<textarea>` for email content.
    - A `<select>` for tone selection (Formal, Friendly, Direct).
    - A submit `<button>`.
    - On submit, builds prompt and calls `runAgent`.
    - Renders the generated reply in a <pre> block with a "Copy to clipboard" button.

- app/page.tsx
  - Main page & onboarding flow:
    - If user not signed in: show "Sign in with Google" button.
    - If signed in: show `SmartEmailReply` and other starter UI.
    - Integrates with Firebase Auth for sign-in state.

---

## Smart Email Reply — usage & prompt

Prompt template used by SmartEmailReply:

```
Act as my executive assistant. Please craft a [tone] reply to this email:
[email content]
```

Where:
- [tone] = Formal | Friendly | Direct
- [email content] = text pasted into the textarea by the user

The component calls `runAgent(prompt)` and displays the response.

---

## Streaming architecture notes

- streamAgent should consume the Gemini streaming API (token-by-token).
- The API route proxies the stream, applying Arcjet checks and optional per-user rate limits.
- The frontend can use the Fetch Streams API or EventSource to render tokens as they arrive.
- Store conversation transcripts and token counts in Firestore for billing/analytics.

---

## Production & deployment notes

- When deploying to Vercel:
  - Set server environment variables in Vercel dashboard (GOOGLE_GEMINI_API_KEY and ARCJET_KEY).
  - Ensure Arcjet middleware runs server-side and prevents direct client access to the Gemini API.

- When using Firebase Hosting / Functions:
  - Protect functions with Arcjet.
  - Keep the Gemini key in a server-only environment variable (Functions config or secret manager).

- Billing:
  - Monitor Gemini usage. Store token counts per request.
  - Use Firestore to track per-user and per-agent usage.

---

## Testing & troubleshooting

- If streaming behaves oddly, inspect the server route logs and confirm:
  - Gemini streaming connection stays open
  - Response headers and chunking are preserved
- For auth issues:
  - Validate Firebase project config in `.env.local`
  - Confirm OAuth client ID/secret and authorized redirect URIs in Google Cloud Console
- For Arcjet failures:
  - Check the ARCJET_KEY and the Arcjet dashboard to confirm the key is valid and not rate-limited

---

## Contributing

Contributions are welcome. Suggested workflow:

1. Fork the repo
2. Create a branch for your feature: `git checkout -b feat/my-feature`
3. Implement, test, and commit
4. Open a pull request with a clear description

Please avoid committing secrets.

---

## License

Add your license of choice (MIT recommended for starters). Example: `LICENSE` containing MIT license text.

---
