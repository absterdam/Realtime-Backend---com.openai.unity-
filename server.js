"use strict";

require("dotenv").config();

const express = require("express");
const { buildClientSecretPayload, buildImageGenerationPayload } = require("./lib/payloads");

const app = express();
const port = Number.parseInt(process.env.PORT || "3000", 10);
const openAiBaseUrl = "https://api.openai.com/v1";

app.use(express.json({ limit: "1mb" }));

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.post("/realtime/client-secret", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY in .env." });
    return;
  }

  const payload = buildClientSecretPayload(req.body);

  try {
    const response = await fetch(`${openAiBaseUrl}/realtime/client_secrets`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const bodyText = await response.text();
    res.status(response.status);
    res.set("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(bodyText);
  } catch (error) {
    res.status(502).json({ error: error.message || "Failed to reach OpenAI." });
  }
});

app.post("/images/generations", async (req, res) => {
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    res.status(500).json({ error: "Missing OPENAI_API_KEY in .env." });
    return;
  }

  const payload = buildImageGenerationPayload(req.body);

  try {
    const response = await fetch(`${openAiBaseUrl}/images/generations`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const bodyText = await response.text();
    res.status(response.status);
    res.set("Content-Type", response.headers.get("content-type") || "application/json");
    res.send(bodyText);
  } catch (error) {
    res.status(502).json({ error: error.message || "Failed to reach OpenAI." });
  }
});

app.listen(port, () => {
  console.log(`Realtime backend listening on http://localhost:${port}`);
});
