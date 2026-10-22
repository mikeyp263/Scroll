// Shared helpers for the Cloudflare Pages Functions in /functions/api.
import { spec, CHAPS, STORIES, PEOPLE, IDEAS, UNITS } from "../public/content.js";

export const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });

// Lesson generation, questions, and progress sync all require the passcode
// you set as APP_PASSCODE in Cloudflare. Reading an already-written lesson does not.
export const authed = (request, env) =>
  !!env.APP_PASSCODE && request.headers.get("X-Passcode") === env.APP_PASSCODE;

// Only ids the app can actually produce are accepted, so nobody can make the
// backend write (and pay for) arbitrary lessons.
export function validSpec(id) {
  const m = /^(bs|bk|ch|st|pp|id)-(\d{1,3})(?:-(\d{1,3}))?$/.exec(id || "");
  if (!m) return null;
  const [, k, a0, b0] = m, a = +a0, b = b0 == null ? null : +b0;
  const ok =
    (k === "bs" && b != null && UNITS[a] && UNITS[a].lessons[b]) ||
    (k === "bk" && b == null && a < 66) ||
    (k === "ch" && b != null && a < 66 && b >= 1 && b <= CHAPS[a]) ||
    (k === "st" && b == null && a < STORIES.length) ||
    (k === "pp" && b == null && a < PEOPLE.length) ||
    (k === "id" && b == null && a < IDEAS.length);
  return ok ? spec(id) : null;
}

export class HttpError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export async function askClaude(env, { system, messages, max_tokens }) {
  if (!env.ANTHROPIC_API_KEY) throw new HttpError(500, "ANTHROPIC_API_KEY is not set");
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": env.ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: env.MODEL || "claude-sonnet-5-5",
      max_tokens,
      ...(system ? { system } : {}),
      messages,
    }),
  });
  if (r.status === 429 || r.status === 529) throw new HttpError(429, "Anthropic is rate limiting or overloaded");
  if (!r.ok) throw new HttpError(502, "Anthropic error " + r.status + ": " + (await r.text()).slice(0, 300));
  const d = await r.json();
  return (d.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");
}

// Tolerant JSON reading: whole reply, a fenced block, or first { to last }.
export function parseJSON(text) {
  try { return JSON.parse(text); } catch {}
  const f = /```(?:json)?\s*([\s\S]*?)```/.exec(text);
  if (f) { try { return JSON.parse(f[1]); } catch {} }
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a >= 0 && b > a) { try { return JSON.parse(text.slice(a, b + 1)); } catch {} }
  return null;
}

export const fail = (e) =>
  e instanceof HttpError ? json({ error: e.message }, e.status) : json({ error: String(e && e.message || e) }, 500);
