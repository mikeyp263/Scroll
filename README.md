# Scroll

Learn the whole Bible, Duolingo-style. Six paths (The Big Story, Book by Book, all 1,189 chapters, Famous Stories, People, Big Ideas), a Bible in a Year plan, quizzes, XP, streaks, and an Ask button inside every lesson.

Installable on your phone's home screen and usable offline for any lesson you've already opened.

## How it works

- `public/` is the app: plain HTML, CSS, and JS. No build step.
- `public/content.js` holds all the lesson lists and the hand-written Big Story lessons. Shared by the app and the backend.
- `functions/api/` is the backend (Cloudflare Pages Functions):
  - `lesson.js` returns a saved lesson, or writes it once with Claude and saves it to KV. Every lesson is generated at most once.
  - `ask.js` answers questions about the current lesson.
  - `progress.js` syncs progress between devices.
- `lib/server.js` has the shared backend helpers.

Writing lessons, asking questions, and syncing need the passcode (`APP_PASSCODE`). Reading a lesson that's already been written doesn't.

## Deploy on Cloudflare Pages

1. Workers & Pages → Create → Pages → Connect to Git → pick this repo.
2. Build settings: Framework preset **None**, build command **empty**, build output directory **`public`**.
3. Workers & Pages → KV → create a namespace called `scroll-lessons`.
4. In the Pages project → Settings → Bindings → add a **KV namespace** binding: variable name `LESSONS`, namespace `scroll-lessons`.
5. Settings → Variables and Secrets → add (as **Secret**):
   - `ANTHROPIC_API_KEY`: from console.anthropic.com
   - `APP_PASSCODE`: anything you'll remember
   - Optional `MODEL` (plain text): defaults to `claude-sonnet-5-5`
6. Redeploy so the bindings take effect.
7. Open the site, go to **Progress**, enter the passcode.

## Add to home screen

- iPhone: open the site in Safari → Share → Add to Home Screen.
- Android: open in Chrome → menu → Install app.

## Cost

Each new lesson is one Claude call, roughly 1 to 3 cents. Generating every lesson in the app (about 1,400) would be roughly $20 to $40 total, once. Questions are well under a cent each.

## Updating the app

When you change files in `public/`, bump `CACHE` in `public/sw.js` (for example `scroll-v2`) so installed copies pick up the update.
