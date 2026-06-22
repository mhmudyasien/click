import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
  getStorage, ref, uploadBytes, getDownloadURL
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-storage.js";

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
const storage = getStorage(app);
const notesCol = collection(db, "notes");
const galleryCol = collection(db, "gallery");

/* ===================== panel toggles ===================== */
const panel = document.getElementById('panel');
const galleryPanel = document.getElementById('galleryPanel');

document.getElementById('notesBtn').addEventListener('click', ()=>{
  galleryPanel.classList.remove('open');
  panel.classList.add('open');
});
document.getElementById('closePanel').addEventListener('click', ()=> panel.classList.remove('open'));

document.getElementById('galleryBtn').addEventListener('click', ()=>{
  panel.classList.remove('open');
  galleryPanel.classList.add('open');
});
document.getElementById('closeGallery').addEventListener('click', ()=> galleryPanel.classList.remove('open'));

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

/* ===================== gallery (shared, via Storage + Firestore) ===================== */
const galleryGrid = document.getElementById('galleryGrid');
const uploadStatus = document.getElementById('uploadStatus');
const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5MB cap

const galleryQuery = query(galleryCol, orderBy("when", "desc"));

onSnapshot(galleryQuery, (snapshot) => {
  galleryGrid.innerHTML = '';
  if (snapshot.empty) {
    galleryGrid.innerHTML = '<div class="empty">No art yet — be the first!</div>';
    return;
  }
  snapshot.forEach((doc) => {
    const g = doc.data();
    const item = document.createElement('a');
    item.className = 'gallery-item';
    item.href = g.url;
    item.target = '_blank';
    item.rel = 'noopener';
    item.innerHTML = `<img src="${g.url}" alt="art" loading="lazy">
                       <div class="who">${esc(g.who || 'someone')}</div>`;
    galleryGrid.appendChild(item);
  });
}, (err) => {
  galleryGrid.innerHTML = '<div class="empty">Could not load the gallery right now.</div>';
  console.error(err);
});

document.getElementById('uploadArt').addEventListener('click', async () => {
  const whoInput = document.getElementById('artWho');
  const fileInput = document.getElementById('artFile');
  const who = whoInput.value.trim();
  const file = fileInput.files[0];

  if (!file) { uploadStatus.textContent = 'Choose an image first.'; return; }
  if (!file.type.startsWith('image/')) { uploadStatus.textContent = 'Only image files are allowed.'; return; }
  if (file.size > MAX_FILE_BYTES) { uploadStatus.textContent = 'Image is too big (max 5MB).'; return; }

  const btn = document.getElementById('uploadArt');
  btn.disabled = true;
  uploadStatus.textContent = 'Uploading...';
  try {
    const path = `gallery/${Date.now()}-${file.name}`;
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    await addDoc(galleryCol, { who, url, when: serverTimestamp() });
    whoInput.value = '';
    fileInput.value = '';
    uploadStatus.textContent = 'Uploaded! 🎉';
  } catch (e) {
    console.error(e);
    uploadStatus.textContent = 'Upload failed, please try again.';
  } finally {
    btn.disabled = false;
  }
});
