// POST /api/ask  { id, messages: [{role, content}] }
// Answers a question about the lesson the learner is on.
import { json, authed, validSpec, askClaude, fail } from "../../lib/server.js";

const strip = (s) => String(s).replace(/<[^>]+>/g, "");

export async function onRequestPost({ request, env }) {
  try {
    if (!authed(request, env)) return json({ error: "locked" }, 401);
    const body = await request.json().catch(() => ({}));
    const s = validSpec(body.id);
    if (!s) return json({ error: "unknown lesson" }, 400);

    const messages = (Array.isArray(body.messages) ? body.messages : [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string" && m.content.trim())
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));
    while (messages.length && messages[0].role !== "user") messages.shift();
    if (!messages.length || messages[messages.length - 1].role !== "user") return json({ error: "no question" }, 400);

    const lesson = s.fixed || (env.LESSONS && (await env.LESSONS.get("L:" + body.id, "json")));
    const ctx = lesson ? lesson.cards.map((c) => strip(c.h + ": " + c.b.join(" "))).join("\n") : "";

    const system = `You are a patient, neutral Bible tutor inside a learning app called Scroll. The learner is on the lesson "${s.title}" (${s.group}).${ctx ? " The lesson says:\n" + ctx : ""}

Answer the learner's questions in plain language in under 150 words. Cite chapter and verse where useful. Where Jewish, Catholic, Orthodox, Protestant, or academic readers differ, say so briefly without picking a side. Plain text only: no markdown, no em dashes.`;

    const text = await askClaude(env, { system, messages, max_tokens: 700 });
    return json({ text });
  } catch (e) {
    return fail(e);
  }
}
