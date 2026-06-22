import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";

/* ===================== Firebase setup ===================== */
const firebaseConfig = {
  apiKey: "AIzaSyC-JctYF9iPL7GNgEu16uMGnKHaOTe_BFc",
  authDomain: "mahmouds-clicker.firebaseapp.com",
  projectId: "mahmouds-clicker",
  storageBucket: "mahmouds-clicker.firebasestorage.app",
  messagingSenderId: "91857131511",
  appId: "1:91857131511:web:ea7d5c1867f979238d80f2",
  measurementId: "G-3X95LBX3PQ"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const notesCol = collection(db, "notes");

/* ===================== panel toggle ===================== */
const panel = document.getElementById('panel');
document.getElementById('notesBtn').addEventListener('click', ()=> panel.classList.add('open'));
document.getElementById('closePanel').addEventListener('click', ()=> panel.classList.remove('open'));

/* ===================== guestbook (shared, via Firestore) ===================== */
const entriesEl = document.getElementById('entries');

function esc(s){
  const d = document.createElement('div');
  d.textContent = s;
  return d.innerHTML;
}

const notesQuery = query(notesCol, orderBy("when", "desc"));

onSnapshot(notesQuery, (snapshot) => {
  entriesEl.innerHTML = '';
  if (snapshot.empty) {
    entriesEl.innerHTML = '<div class="empty">No notes yet.</div>';
    return;
  }
  snapshot.forEach((doc) => {
    const n = doc.data();
    const when = n.when && n.when.toDate ? n.when.toDate().toLocaleString('en-US') : '';
    const div = document.createElement('div');
    div.className = 'entry';
    div.innerHTML = `<div class="who">${esc(n.who || 'someone')}</div>
                      <div class="msg">${esc(n.msg)}</div>
                      <div class="when">${when}</div>`;
    entriesEl.appendChild(div);
  });
}, (err) => {
  entriesEl.innerHTML = '<div class="empty">Could not load notes right now.</div>';
  console.error(err);
});

document.getElementById('submitNote').addEventListener('click', async () => {
  const whoInput = document.getElementById('who');
  const msgInput = document.getElementById('msg');
  const who = whoInput.value.trim();
  const msg = msgInput.value.trim();
  if (!msg) return;

  const btn = document.getElementById('submitNote');
  btn.disabled = true;
  try {
    await addDoc(notesCol, { who, msg, when: serverTimestamp() });
    whoInput.value = '';
    msgInput.value = '';
  } catch (e) {
    console.error(e);
    alert('Could not submit your note, please try again.');
  } finally {
    btn.disabled = false;
  }
});
