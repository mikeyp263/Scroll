# Scroll

Learn the Bible a few minutes a day, Duolingo-style. Every verse in the app is real Scripture from the Berean Standard Bible.

## What's inside

- **Five learning paths**, each with units, lessons, and a trophy review at the end of every unit:
  - **The Journey** (start here): meet Jesus, understand the gospel, then walk through God's whole story from Genesis to Revelation
  - **Old Testament**: the Law, history, wisdom books, and the prophets
  - **New Testament**: Acts, the letters, and Revelation
  - **The Gospels**: the life of Jesus in order
  - **Famous Stories**: Noah, David and Goliath, Daniel, Zacchaeus, and more
- **Lessons** mix short teaching, reading the verse, fill-in-the-blank, "where is this verse?", word ordering, and questions. Missed answers come back at the end.
- **Saved verses**: tap the heart on any verse. Add a personal note, search, copy, and practice them to memorize.
- **Bible reader**: the complete BSB, all 66 books. Tap verses to save or copy them.
- **XP, daily goal, streaks**, a weekly chart, and sound effects.
- Installable to the home screen and works offline for anything you've opened.

Progress and saved verses are stored on the device (no account needed).

## Project layout

- `public/` is the whole app (plain HTML, CSS, JS, no build step to run it).
  - `content.js` is generated: all sections, lessons, and verse text.
  - `bible/0.json` to `bible/65.json` are the books of the Bible for the reader.
- `build/curriculum/*.py` is where lessons are written. One file per section.
- `build/build.py` turns the curriculum + the BSB text into `public/content.js` and `public/bible/`.

## Editing lessons

1. Edit a file in `build/curriculum/`. Each lesson is: title, verse references, teaching text (paragraphs split with `|`), and questions (correct answer first; the app shuffles them).
2. Download the BSB once: `curl -o /tmp/BSB.json https://raw.githubusercontent.com/scrollmapper/bible_databases/master/formats/json/BSB.json`
3. Run `python3 build/build.py /tmp/BSB.json`. It pulls the exact verse text and fails loudly on any bad reference.
4. Bump `CACHE` in `public/sw.js` so installed copies update.

## iPhone app

The iOS app is a Capacitor wrapper around `public/` with native daily reminders, haptics, and on-device backup.
See **[store/SUBMIT.md](store/SUBMIT.md)** for running it in Xcode and submitting, and **[store/LISTING.md](store/LISTING.md)** for the App Store copy. Screenshots are in `store/screenshots/`.

## Web (GitHub Pages)

Every push to `main` deploys `public/` to https://mikeyp263.github.io/Scroll/ (see `.github/workflows/pages.yml`).

## Deploy elsewhere (Cloudflare Pages)

Workers & Pages → Create → Pages → Connect to Git → this repo. Framework preset **None**, build command **empty**, output directory **`public`**. That's it: no keys, secrets, or storage needed.

## Add to home screen

- iPhone: open the site in Safari → Share → Add to Home Screen.
- Android: open in Chrome → menu → Install app.

Scripture quotations are from the Berean Standard Bible (BSB), public domain.
