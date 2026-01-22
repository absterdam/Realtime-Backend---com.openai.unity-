# Realtime Backend

This backend mints ephemeral Realtime client secrets and proxies image generation so the Unity sample never sees the parent API key.

## Setup

1) Copy `.env.example` to `.env` and set `OPENAI_API_KEY`.
2) Install dependencies: `npm install`
3) Start the server: `npm start`

The server listens on `http://localhost:3000` by default (override with `PORT`).

## Endpoints

- `GET /health`
- `POST /realtime/client-secret`
  - Body: `{ "session": { ... }, "expires_after_seconds": 600 }` or `{ "expires_after": { "anchor": "created_at", "seconds": 600 }, "session": { ... } }`
  - Returns the OpenAI client secret response.
- `POST /images/generations`
  - Proxies the OpenAI Images API and forces `response_format` to `b64_json`.