# Mahmoud's Clicker

## Files
- `index.html` — the page
- `style.css` — styling
- `script.js` — interactivity (panel toggle + shared guestbook via Firebase)
- `assets/forest.jpg` — background

## Run it
Because `script.js` is now an ES module that talks to Firestore, just
double-clicking `index.html` may not work in every browser. Safest is to
run a local server from this folder:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Deploy
Push this folder to GitHub and turn on GitHub Pages (or drag it into
Netlify/Vercel). No build step needed — the Firebase SDK is loaded
straight from Google's CDN inside `script.js`.

## The guestbook is now real and shared 🎉
Notes are stored in **Firestore** (project `mahmouds-clicker`), so every
visitor who opens the link sees the same notes, live — no more
"only my friend can see his own note."

## Important: security rules expire in 30 days
You created the database in **test mode**, which lets anyone read/write
with no restrictions — great for getting started, but those rules
automatically lock everything (deny all) after 30 days.

Before that happens, go to:
**Firebase console → Firestore → Rules tab**, and replace the rules with
something like:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /notes/{noteId} {
      allow read: if true;
      allow create: if request.resource.data.msg is string
                    && request.resource.data.msg.size() < 500;
      allow update, delete: if false;
    }
  }
}
```

This keeps the guestbook public and writable by anyone (so visitors can
still leave notes), but blocks edits/deletes of other people's notes and
caps note length — a bit safer than full test-mode access, and it won't
expire.

## Customize
- Contact email / labels: `index.html`.
- Colors: `style.css`.
- Firebase config: top of `script.js`, inside `firebaseConfig`.
