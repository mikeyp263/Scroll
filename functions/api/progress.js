// GET /api/progress  -> { progress }
// PUT /api/progress  { done, xp, streak, last, planStart }
// Single-user sync so the phone and computer share progress.
import { json, authed, fail, HttpError } from "../../lib/server.js";

export async function onRequestGet({ request, env }) {
  try {
    if (!authed(request, env)) return json({ error: "locked" }, 401);
    if (!env.LESSONS) throw new HttpError(500, "LESSONS KV binding is missing");
    return json({ progress: await env.LESSONS.get("progress", "json") });
  } catch (e) {
    return fail(e);
  }
}

export async function onRequestPut({ request, env }) {
  try {
    if (!authed(request, env)) return json({ error: "locked" }, 401);
    if (!env.LESSONS) throw new HttpError(500, "LESSONS KV binding is missing");
    const b = await request.json().catch(() => null);
    if (!b || typeof b.done !== "object") return json({ error: "bad progress" }, 400);
    const progress = {
      done: Object.fromEntries(Object.keys(b.done).filter((k) => /^[a-z]{2}-\d+(-\d+)?$/.test(k)).map((k) => [k, true])),
      xp: Number(b.xp) || 0,
      streak: Number(b.streak) || 0,
      last: typeof b.last === "string" ? b.last.slice(0, 10) : null,
      planStart: typeof b.planStart === "string" ? b.planStart.slice(0, 10) : null,
    };
    await env.LESSONS.put("progress", JSON.stringify(progress));
    return json({ ok: true });
  } catch (e) {
    return fail(e);
  }
}
