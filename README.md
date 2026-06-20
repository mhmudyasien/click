# Mahmoud's Clicker

## Files
- `index.html` — the page
- `style.css` — styling
- `script.js` — interactivity (eye-tracking character, guestbook)
- `assets/forest.jpg` — background

## Run it
Double-click `index.html`, or from this folder run:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Deploy for free
Drag this folder into Netlify or Vercel, or push it to a GitHub repo and
turn on GitHub Pages.

## What's on the page
- A small animated paper character (pure SVG + CSS) that breathes gently,
  waves with one hand, points with its pencil hand toward "Click", and its
  eyes follow your cursor (tracked in `script.js`).
- The "Click" label and the 📝 button below it.
- Clicking 📝 opens the right-hand panel where a visitor can leave their
  name and a note. Notes are stored in **localStorage**, so each visitor
  only sees their own browser's notes — not a shared guestbook across
  everyone. A real shared version needs a small backend (e.g. a Cloudflare
  Worker + KV, or Firebase).

## Customize
- Character colors/shape: edit the SVG paths inside `index.html` under
  `<div class="character">`.
- Animation speed/angles: `style.css`, the `@keyframes wave`, `point`, and
  `breathe` rules.
- Contact email: in `index.html`.
