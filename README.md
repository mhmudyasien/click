# Mahmoud's Clicker

## Files
- `index.html` — the page
- `style.css` — styling
- `script.js` — interactivity (sound, counters, guestbook)
- `assets/note.jpg` — your handwritten note image

## Run it
Double-click `index.html`, or from this folder run:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Deploy for free
Drag this folder into Netlify or Vercel, or push it to a GitHub repo and
turn on GitHub Pages.

## Customize
- Title / email: edit `index.html`.
- Colors: top of `style.css`.
- Sound: it's not an audio file — it's generated live in `script.js`
  (Web Audio API: filtered noise for water/wind + tiny oscillator chirps
  for birds). Tweak the gain values in `startAmbience()` to change volume.

## Note on the counters and guestbook
"Global Clicks" and the guestbook notes are currently stored in
**localStorage**, meaning each visitor only sees their own browser's data —
not a real shared counter/guestbook across everyone, like the original site
has. A real shared version needs a small backend (e.g. a Cloudflare Worker
+ KV, or Firebase) to hold one shared number/list. Happy to add that next
if you want it for real.
