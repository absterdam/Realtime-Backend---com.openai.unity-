"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { buildClientSecretPayload, buildImageGenerationPayload } = require("../lib/payloads");

test("buildClientSecretPayload maps expires_after_seconds", () => {
  const payload = buildClientSecretPayload({
    session: { type: "realtime" },
    expires_after_seconds: 600
  });

  assert.deepEqual(payload, {
    session: { type: "realtime" },
    expires_after: { anchor: "created_at", seconds: 600 }
  });
});

test("buildClientSecretPayload prefers expires_after object", () => {
  const payload = buildClientSecretPayload({
    expires_after: { anchor: "created_at", seconds: 120 },
    expires_after_seconds: 999
  });

  assert.deepEqual(payload, {
    expires_after: { anchor: "created_at", seconds: 120 }
  });
});

test("buildImageGenerationPayload forces b64_json", () => {
  const payload = buildImageGenerationPayload({
    prompt: "A lighthouse in fog",
    response_format: "url"
  });

  assert.equal(payload.prompt, "A lighthouse in fog");
  assert.equal(payload.response_format, "b64_json");
});