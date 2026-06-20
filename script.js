/* ===================== panel toggle ===================== */
const panel = document.getElementById('panel');
document.getElementById('notesBtn').addEventListener('click', ()=> panel.classList.add('open'));
document.getElementById('closePanel').addEventListener('click', ()=> panel.classList.remove('open'));

/* ===================== counters (stored in this browser) ===================== */
const GLOBAL_KEY = 'mc_global';
const MY_KEY = 'mc_mine';
const globalEl = document.getElementById('globalCount');
const myEl = document.getElementById('myClicks');

let globalCount = parseInt(localStorage.getItem(GLOBAL_KEY) || '0', 10);
let myClicks = parseInt(localStorage.getItem(MY_KEY) || '0', 10);
globalEl.textContent = globalCount;
myEl.textContent = myClicks;

function bump(){
  globalCount += 1; myClicks += 1;
  localStorage.setItem(GLOBAL_KEY, String(globalCount));
  localStorage.setItem(MY_KEY, String(myClicks));
  globalEl.textContent = globalCount;
  myEl.textContent = myClicks;
}
/* Note: this is per-browser, not a real shared global counter.
   A real one needs a small backend (e.g. Cloudflare Worker + KV). */

/* ===================== synthesized nature ambience ===================== */
let audioCtx=null, ambience=null, playing=false;

function noiseBuffer(ctx, seconds){
  const size = ctx.sampleRate*seconds;
  const buf = ctx.createBuffer(1, size, ctx.sampleRate);
  const data = buf.getChannelData(0);
  let last=0;
  for(let i=0;i<size;i++){
    const w = Math.random()*2-1;
    last = (last + 0.02*w)/1.02;
    data[i] = last*3.5;
  }
  return buf;
}

function startAmbience(){
  audioCtx = audioCtx || new (window.AudioContext||window.webkitAudioContext)();
  const ctx = audioCtx;
  const master = ctx.createGain();
  master.gain.value = 0;
  master.connect(ctx.destination);
  master.gain.linearRampToValueAtTime(0.5, ctx.currentTime+1.2);

  const water = ctx.createBufferSource();
  water.buffer = noiseBuffer(ctx,4); water.loop=true;
  const waterF = ctx.createBiquadFilter(); waterF.type='bandpass'; waterF.frequency.value=900; waterF.Q.value=.6;
  const waterG = ctx.createGain(); waterG.gain.value=.65;
  water.connect(waterF).connect(waterG).connect(master); water.start();

  const wind = ctx.createBufferSource();
  wind.buffer = noiseBuffer(ctx,5); wind.loop=true;
  const windF = ctx.createBiquadFilter(); windF.type='lowpass'; windF.frequency.value=380;
  const windG = ctx.createGain(); windG.gain.value=.22;
  wind.connect(windF).connect(windG).connect(master); wind.start();
  const lfo = ctx.createOscillator(); lfo.frequency.value=.08;
  const lfoG = ctx.createGain(); lfoG.gain.value=.18;
  lfo.connect(lfoG).connect(windG.gain); lfo.start();

  ambience = {master, water, wind, lfo};
}
function stopAmbience(){
  if(!audioCtx||!ambience) return;
  const {master,water,wind,lfo} = ambience;
  master.gain.linearRampToValueAtTime(0, audioCtx.currentTime+0.6);
  setTimeout(()=>{ try{water.stop();wind.stop();lfo.stop();}catch(e){} }, 700);
  ambience=null;
}

/* ===================== click handling ===================== */
const frame = document.getElementById('noteFrame');
frame.addEventListener('click', ()=>{
  bump();
  playing = !playing;
  frame.classList.toggle('playing', playing);
  if(playing){ startAmbience(); } else { stopAmbience(); }
});
document.getElementById('clickBtn').addEventListener('click', ()=> frame.click());

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
