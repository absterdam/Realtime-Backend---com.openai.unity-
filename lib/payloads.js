"use strict";

function coercePositiveInteger(value) {
  if (value === null || value === undefined) {
    return null;
  }

  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) {
    return null;
  }

  return Math.floor(number);
}

function buildClientSecretPayload(body) {
  const payload = {};

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return payload;
  }

  if (body.session && typeof body.session === "object") {
    payload.session = body.session;
  }

  if (body.expires_after && typeof body.expires_after === "object") {
    payload.expires_after = body.expires_after;
  } else {
    const seconds = coercePositiveInteger(body.expires_after_seconds);
    if (seconds !== null) {
      payload.expires_after = {
        anchor: "created_at",
        seconds
      };
    }
  }

  return payload;
}

function buildImageGenerationPayload(body) {
  const payload = body && typeof body === "object" && !Array.isArray(body) ? { ...body } : {};
  payload.response_format = "b64_json";
  return payload;
}

module.exports = {
  buildClientSecretPayload,
  buildImageGenerationPayload
};