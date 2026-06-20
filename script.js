/* ===================== panel toggle ===================== */
const panel = document.getElementById('panel');
document.getElementById('notesBtn').addEventListener('click', ()=> panel.classList.add('open'));
document.getElementById('closePanel').addEventListener('click', ()=> panel.classList.remove('open'));

/* ===================== guestbook ===================== */
const NOTES_KEY='mc_notes';
const entriesEl=document.getElementById('entries');
function loadNotes(){ try{return JSON.parse(localStorage.getItem(NOTES_KEY)||'[]');}catch(e){return [];} }
function saveNotes(n){ localStorage.setItem(NOTES_KEY, JSON.stringify(n)); }
function esc(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }
function renderNotes(){
  const notes=loadNotes();
  entriesEl.innerHTML='';
  if(notes.length===0){ entriesEl.innerHTML='<div class="empty">No notes yet.</div>'; return; }
  notes.slice().reverse().forEach(n=>{
    const div=document.createElement('div');
    div.className='entry';
    div.innerHTML=`<div class="who">${esc(n.who||'someone')}</div><div class="msg">${esc(n.msg)}</div><div class="when">${n.when}</div>`;
    entriesEl.appendChild(div);
  });
}
document.getElementById('submitNote').addEventListener('click', ()=>{
  const who=document.getElementById('who').value.trim();
  const msg=document.getElementById('msg').value.trim();
  if(!msg) return;
  const notes=loadNotes();
  notes.push({who,msg,when:new Date().toLocaleString('en-US')});
  saveNotes(notes);
  document.getElementById('who').value='';
  document.getElementById('msg').value='';
  renderNotes();
});
renderNotes();
