// Native features when running inside the iOS app (Capacitor). On the web, everything here is a safe no-op.
import { Capacitor, registerPlugin } from "./vendor/capacitor.js";

export const NATIVE = Capacitor.isNativePlatform();
const plugin = (name) => (NATIVE ? registerPlugin(name) : null);
const Notes = plugin("LocalNotifications");
const Haptics = plugin("Haptics");
const StatusBar = plugin("StatusBar");
const Prefs = plugin("Preferences");
const App = plugin("App");

export function initNative(onResume) {
  if (!NATIVE) return;
  StatusBar.setStyle({ style: "DARK" }).catch(() => {});
  App.addListener("appStateChange", ({ isActive }) => { if (isActive) onResume(); }).catch(() => {});
}

/* Haptics: light tap for correct, error buzz for wrong, success for lesson complete. */
export function haptic(kind = "light") {
  if (Haptics) {
    const p = kind === "success" ? Haptics.notification({ type: "SUCCESS" }) : kind === "error" ? Haptics.notification({ type: "ERROR" }) : Haptics.impact({ style: "LIGHT" });
    p.catch(() => {});
  } else {
    try { navigator.vibrate && navigator.vibrate(kind === "error" ? [30, 40, 30] : 12); } catch {}
  }
}

/* Durable backup of progress in iOS UserDefaults (survives web storage being cleared, included in device backups). */
export function backup(json) { if (Prefs) Prefs.set({ key: "scroll-state", value: json }).catch(() => {}); }
export async function restore() {
  if (!Prefs) return null;
  try { return (await Prefs.get({ key: "scroll-state" })).value || null; } catch { return null; }
}

/* Daily reminders */
export async function remindersAllowed() {
  if (!Notes) return false;
  try { return (await Notes.checkPermissions()).display === "granted"; } catch { return false; }
}
export async function askForReminders() {
  if (!Notes) return false;
  try { return (await Notes.requestPermissions()).display === "granted"; } catch { return false; }
}
// Schedules the next 14 daily reminders. Skips today if a lesson is already done.
export async function scheduleReminders({ on, time, doneToday, streak, verses }) {
  if (!Notes) return;
  try {
    const pending = await Notes.getPending();
    if (pending.notifications.length) await Notes.cancel({ notifications: pending.notifications.map((n) => ({ id: n.id })) });
    if (!on || !(await remindersAllowed())) return;
    const [hh, mm] = time.split(":").map(Number);
    const list = [];
    for (let d = 0; d < 14; d++) {
      const at = new Date(); at.setDate(at.getDate() + d); at.setHours(hh, mm, 0, 0);
      if (at <= new Date() || (d === 0 && doneToday)) continue;
      const v = verses[(at.getDate() + d) % verses.length];
      const title = d <= 1 && streak > 1 ? `Keep your ${streak}-day streak going` : "Time for today's lesson";
      list.push({ id: 1000 + d, title, body: `"${v.text}" ${v.ref}`, schedule: { at, allowWhileIdle: true } });
    }
    if (list.length) await Notes.schedule({ notifications: list });
  } catch {}
}
