// GET /api/lesson?id=ch-0-1
// Returns a saved lesson, or writes it once with Claude and saves it to KV.
import { buildPrompt, norm } from "../../public/content.js";
import { json, authed, validSpec, askClaude, parseJSON, fail, HttpError } from "../../lib/server.js";

export async function onRequestGet({ request, env }) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    const s = validSpec(id);
    if (!s) return json({ error: "unknown lesson" }, 400);
    if (s.fixed) return json({ lesson: { cards: s.fixed.cards, q: s.fixed.q, ai: false } });
    if (!env.LESSONS) throw new HttpError(500, "LESSONS KV binding is missing");

    const cached = await env.LESSONS.get("L:" + id, "json");
    if (cached) return json({ lesson: cached });
    if (!authed(request, env)) return json({ error: "locked" }, 401);

    let lesson = null;
    for (let attempt = 0; attempt < 2 && !lesson; attempt++) {
      const text = await askClaude(env, {
        messages: [{ role: "user", content: buildPrompt(s) }],
        max_tokens: 3000,
      });
      lesson = norm(parseJSON(text));
    }
    if (!lesson) throw new HttpError(502, "Claude's reply was not a usable lesson");
    lesson.at = Date.now();
    await env.LESSONS.put("L:" + id, JSON.stringify(lesson));
    return json({ lesson });
  } catch (e) {
    return fail(e);
  }
}
