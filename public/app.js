import{UNITS,BOOKS,VERSES,CHAPS,CH,TOTAL_CH,STORIES,PEOPLE,IDEAS,ALL_BS,clean,chName,spec,nextId,norm}from"./content.js";
const PATHS=[
{k:"story",name:"The Big Story",pre:"bs-",n:()=>ALL_BS.length,desc:"Start here. The whole Bible from Genesis to Revelation, in order, in 18 lessons."},
{k:"books",name:"Book by Book",pre:"bk-",n:()=>66,desc:"One overview lesson for every book: who wrote it, what happens, and why it matters."},
{k:"chapters",name:"Chapter by Chapter",pre:"ch-",n:()=>TOTAL_CH,desc:"Every chapter of every book. 1,189 lessons. Pick a book and go."},
{k:"stories",name:"Famous Stories",pre:"st-",n:()=>STORIES.length,desc:"The stories everyone references, explained."},
{k:"people",name:"People",pre:"pp-",n:()=>PEOPLE.length,desc:"Who's who, from Adam to Paul."},
{k:"ideas",name:"Big Ideas",pre:"id-",n:()=>IDEAS.length,desc:"The concepts behind it all: covenant, grace, messiah, and more."}];


/* helpers */
const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const lsGet=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
const lsSet=(k,v)=>{try{localStorage.setItem(k,typeof v==="string"?v:JSON.stringify(v))}catch(e){}};
const bg=ref=>"https://www.biblegateway.com/passage/?search="+encodeURIComponent(ref)+"&version=NLT";
const ICON={star:'<svg viewBox="0 0 24 24"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 21l1.6-7L2 9.2l7.1-.6z"/></svg>',check:'<svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg>',lock:'<svg viewBox="0 0 24 24"><path d="M12 2a5 5 0 0 1 5 5v3h1a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h1V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v3h6V7a3 3 0 0 0-3-3z"/></svg>',book:'<svg viewBox="0 0 24 24"><path d="M4 4h6a3 3 0 0 1 2 1 3 3 0 0 1 2-1h6v15h-6a2 2 0 0 0-2 2 2 2 0 0 0-2-2H4z"/></svg>',user:'<svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-5 0-9 2.5-9 6v2h18v-2c0-3.5-4-6-9-6z"/></svg>',bulb:'<svg viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2zM9 20h6v2H9z"/></svg>'};

/* state */
const KEY="scroll-bible-v1";
let S={done:{},xp:0,streak:0,last:null,path:"story",book:0,planStart:null};
try{const r=lsGet(KEY);if(r)S=Object.assign(S,JSON.parse(r))}catch(e){}
const localDay=d=>{d=new Date(d);d.setMinutes(d.getMinutes()-d.getTimezoneOffset());return d.toISOString().slice(0,10)};
const today=()=>localDay(new Date());
const dayDiff=(a,b)=>Math.round((new Date(b)-new Date(a))/864e5);
function liveStreak(){if(!S.last)return 0;return dayDiff(S.last,today())<=1?S.streak:0}
const countPre=p=>Object.keys(S.done).filter(k=>k.startsWith(p)).length;

/* backend: Cloudflare functions in /functions/api */
const PASS_KEY="scroll-pass";
const pass=()=>lsGet(PASS_KEY)||"";
async function api(path,opts={}){
  let r;try{r=await fetch(path,{...opts,headers:{"Content-Type":"application/json","X-Passcode":pass(),...(opts.headers||{})}})}catch(e){throw{code:"offline"}}
  if(r.status===401)throw{code:"locked"};
  if(r.status===429)throw{code:"rate_limited"};
  if(!r.ok)throw{code:"server",status:r.status};
  return r.json();
}
function merge(d){if(!d)return;Object.assign(S.done,d.done||{});S.xp=Math.max(S.xp,d.xp||0);if((d.last||"")>(S.last||"")){S.last=d.last;S.streak=d.streak||0}else if(d.last&&d.last===S.last)S.streak=Math.max(S.streak,d.streak||0);if(!S.planStart&&d.planStart)S.planStart=d.planStart}
let pullP=Promise.resolve();
function pull(){pullP=(async()=>{if(!pass())return;try{const d=await api("/api/progress");if(d&&d.progress){merge(d.progress);lsSet(KEY,S);rerender()}}catch(e){}})();return pullP}
let pushT;
function save(){lsSet(KEY,S);clearTimeout(pushT);pushT=setTimeout(async()=>{await pullP;if(!pass())return;try{await api("/api/progress",{method:"PUT",body:JSON.stringify({done:S.done,xp:S.xp,streak:S.streak,last:S.last,planStart:S.planStart||null})})}catch(e){}},1200)}

const inflight={};
function getLesson(id){
  const s=spec(id);if(s.fixed)return Promise.resolve({cards:s.fixed.cards,q:s.fixed.q,ai:false});
  const ck="scroll-L-"+id;
  try{const r=lsGet(ck);if(r){const L=norm(JSON.parse(r));if(L)return Promise.resolve(L)}}catch(e){}
  if(inflight[id])return inflight[id];
  inflight[id]=(async()=>{
    const d=await api("/api/lesson?id="+encodeURIComponent(id));
    const L=norm(d&&d.lesson);if(!L)throw{code:"server"};
    lsSet(ck,L);return L;
  })();
  inflight[id].finally(()=>{delete inflight[id]}).catch(()=>{});
  return inflight[id];
}

/* plan */
const dayCh=d=>CH.slice(Math.floor(d*TOTAL_CH/365),Math.floor((d+1)*TOTAL_CH/365));
const chId=([b,c])=>"ch-"+b+"-"+c;
function planDay(){return Math.min(364,Math.max(0,dayDiff(S.planStart,today())))}
function rangeLabel(chs){const parts=[];chs.forEach(([b,c])=>{const last=parts[parts.length-1];if(last&&last.b===b&&last.e===c-1)last.e=c;else parts.push({b,s:c,e:c})});return parts.map(p=>chName(p.b)+" "+(p.s===p.e?p.s:p.s+"-"+p.e)).join(", ")}
const dayDone=d=>dayCh(d).filter(x=>S.done[chId(x)]).length;

/* rendering */
let TAB="learn",planPick=null,libFilter="All",libQ="";
function header(){$("#streak").textContent=liveStreak();$("#xp").textContent=S.xp}
function rerender(){header();if($("#lesson").hidden)render()}
function render(){document.querySelectorAll(".tabs button").forEach(b=>b.setAttribute("aria-selected",b.dataset.tab===TAB));({learn:renderLearn,plan:renderPlan,library:renderBooks,me:renderMe})[TAB]()}
function tab(t){TAB=t;render();window.scrollTo(0,0)}
document.querySelectorAll(".tabs button").forEach(b=>b.onclick=()=>tab(b.dataset.tab));

function zig(items,offStart){
  const off=[0,52,0,-52];
  return `<div class="path">${items.map((it,i)=>{const done=S.done[it.id];const cls=(done?"done":it.locked?"locked":"")+(it.current?" current":"");return `<button class="node ${cls}" data-id="${it.id}" ${it.locked?'data-locked="1"':""} style="transform:translateX(${off[(i+(offStart||0))%4]}px)" aria-label="${esc(it.label)}${done?", completed":it.locked?", locked":""}"><span class="dot">${done?ICON.check:it.locked?ICON.lock:(it.icon||ICON.star)}</span><span class="lbl">${esc(it.label)}</span></button>`}).join("")}</div>`;
}
function grouped(list,pre,icon){
  const groups=[];list.forEach((x,i)=>{const g=groups[groups.length-1];if(!g||g.name!==x[0])groups.push({name:x[0],items:[]});groups[groups.length-1].items.push({id:pre+i,label:x[1],icon})});
  const nx=list.findIndex((_,i)=>!S.done[pre+i]);if(nx>=0)groups.forEach(g=>g.items.forEach(it=>{if(it.id===pre+nx)it.current=true}));
  return groups.map((g,gi)=>`<section class="group"><div class="group-h">${esc(g.name)}<span>${g.items.filter(it=>S.done[it.id]).length}/${g.items.length}</span></div>${zig(g.items,gi)}</section>`).join("");
}
function todayInfo(){
  if(S.planStart){const d=planDay(),chs=dayCh(d),nx=chs.find(x=>!S.done[chId(x)]);return{eyebrow:"Bible in a Year · Day "+(d+1),title:rangeLabel(chs),sub:nx?dayDone(d)+" of "+chs.length+" chapters done today":"Today's reading is done",id:nx?chId(nx):null,btn:dayDone(d)?"Continue":"Start"}}
  const nx=ALL_BS.find(x=>!S.done[x]);
  if(nx){const s=spec(nx);return{eyebrow:"Next lesson",title:s.title,sub:s.group+" · The Big Story",id:nx,btn:countPre("bs-")?"Continue":"Start"}}
  return{eyebrow:"Keep going",title:"Read the whole Bible",sub:"Start the Bible in a Year plan on the Daily tab.",id:null}
}
function renderLearn(){
  const t=todayInfo(),doneToday=S.last===today(),C=2*Math.PI*22;
  const v=VERSES[Math.floor(Date.now()/864e5)%VERSES.length];
  const P=PATHS.find(p=>p.k===S.path)||PATHS[0];
  let h=`<section class="today"><div style="min-width:0"><div class="eyebrow">${esc(t.eyebrow)}</div><h2>${esc(t.title)}</h2><p>${esc(t.sub)}</p></div>
  <svg class="ring" viewBox="0 0 56 56" role="img" aria-label="${doneToday?"Daily goal met":"Daily goal not met yet"}"><circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" stroke-opacity=".25" stroke-width="6"/><circle cx="28" cy="28" r="22" fill="none" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${doneToday?0:C}" transform="rotate(-90 28 28)"/></svg>
  ${t.id?`<button data-id="${t.id}" style="grid-column:1/-1">${t.btn}</button>`:`<button data-tab-go="plan" style="grid-column:1/-1">Open Daily</button>`}</section>
  <div class="verse"><div class="ref">VERSE OF THE DAY · ${v[0]}</div><p>${v[1]}</p></div>
  <div class="paths" role="group" aria-label="Choose a path">${PATHS.map(p=>{const n=p.n(),d=countPre(p.pre);return `<button class="pcard" data-path="${p.k}" aria-pressed="${p.k===P.k}"><b>${p.name}</b><small>${d.toLocaleString()} / ${n.toLocaleString()}</small><span class="pbar"><i style="width:${d/n*100}%"></i></span></button>`}).join("")}</div>
  <h2 class="ptitle">${P.name}</h2><p class="pdesc">${P.desc}</p>`;
  if(P.k==="story"){
    UNITS.forEach((u,ui)=>{const items=u.lessons.map((l,li)=>{const id="bs-"+ui+"-"+li,i=ALL_BS.indexOf(id);return{id,label:l.t,locked:i>0&&!S.done[ALL_BS[i-1]]&&!S.done[id],current:ALL_BS.find(x=>!S.done[x])===id}});h+=`<section class="group"><div class="group-h">${u.t}<span>${u.ref}</span></div><p class="unit-sub">${u.sub}</p>${zig(items,ui)}</section>`});
  }else if(P.k==="books"){
    h+=grouped(BOOKS.map((b,i)=>[(i<39?"Old Testament: ":"New Testament: ")+b[0],b[1]]),"bk-",ICON.book);
  }else if(P.k==="chapters"){
    const b=S.book,n=CHAPS[b],nx=[...Array(n)].findIndex((_,i)=>!S.done["ch-"+b+"-"+(i+1)]);
    h+=`<div class="row"><button class="btn" id="prevBook" aria-label="Previous book" ${b===0?"disabled":""}>‹</button><select class="sel" id="bookSel" aria-label="Book">${BOOKS.map((B,i)=>{const d=countPre("ch-"+i+"-");return `<option value="${i}" ${i===b?"selected":""}>${B[1]}  (${d}/${CHAPS[i]})</option>`}).join("")}</select><button class="btn" id="nextBook" aria-label="Next book" ${b===65?"disabled":""}>›</button></div>
    <div class="bookmeta"><b>${BOOKS[b][1]}</b><p>${BOOKS[b][2]} ${n} chapter${n>1?"s":""}.</p><div class="row" style="margin-top:4px"><button class="btn primary" data-id="${nx>=0?"ch-"+b+"-"+(nx+1):"ch-"+b+"-1"}">${nx>=0?(nx?"Continue: ":"Start: ")+chName(b)+" "+(nx+1):"Review chapter 1"}</button><button class="btn" data-id="bk-${b}">${S.done["bk-"+b]?"Overview ✓":"Book overview"}</button></div></div>
    <div class="chgrid">${[...Array(n)].map((_,i)=>{const id="ch-"+b+"-"+(i+1);return `<button class="ch ${S.done[id]?"done":i===nx?"next":""}" data-id="${id}" aria-label="${chName(b)} ${i+1}${S.done[id]?", completed":""}">${i+1}</button>`}).join("")}</div>`;
  }else if(P.k==="stories")h+=grouped(STORIES,"st-",ICON.star);
  else if(P.k==="people")h+=grouped(PEOPLE,"pp-",ICON.user);
  else if(P.k==="ideas")h+=grouped(IDEAS,"id-",ICON.bulb);
  $("#view").innerHTML=h;
  const bs=$("#bookSel");if(bs){bs.onchange=()=>{S.book=+bs.value;save();renderLearn()};$("#prevBook").onclick=()=>{S.book--;save();renderLearn()};$("#nextBook").onclick=()=>{S.book++;save();renderLearn()}}
}

function renderPlan(){
  if(!S.planStart){
    $("#view").innerHTML=`<section class="intro"><div class="kind">Daily</div><h2>Read the whole Bible in a year</h2><p>365 days, Genesis 1 to Revelation 22. Three or four chapters a day. Each chapter is a short lesson with a quiz, plus a link to read the full text.</p><p>Day 1 is ${rangeLabel(dayCh(0))}.</p><button class="go" id="startPlan">Start today</button></section>`;
    $("#startPlan").onclick=()=>{S.planStart=today();save();renderPlan()};return;
  }
  const now=planDay(),d=planPick==null?now:planPick,chs=dayCh(d);
  const planDone=CH.filter(x=>S.done[chId(x)]).length;
  const behind=[...Array(now)].map((_,i)=>i).filter(i=>dayDone(i)<dayCh(i).length).length;
  let h=`<div class="plan-head"><div class="kind">Bible in a Year</div><h2>Day ${d+1}${d===now?"":(d<now?" (past)":" (ahead)")}</h2><p>${planDone} of ${TOTAL_CH.toLocaleString()} chapters done${behind?" · "+behind+" earlier day"+(behind>1?"s":"")+" unfinished":""}</p></div>
  <div class="daylist">${chs.map(x=>{const id=chId(x),ref=BOOKS[x[0]][1]+" "+x[1];return `<div class="dayitem ${S.done[id]?"done":""}"><span class="st">${S.done[id]?ICON.check:""}</span><div style="min-width:0"><b>${chName(x[0])} ${x[1]}</b><a href="${bg(ref)}" target="_blank" rel="noopener">Read full text ↗</a></div><button class="btn ${S.done[id]?"":"primary"}" data-id="${id}">${S.done[id]?"Review":"Lesson"}</button></div>`}).join("")}</div>
  <div class="row">${d!==now?`<button class="btn" id="toToday">Back to today</button>`:""}</div>
  <section class="group"><div class="group-h">All 365 days<span>${[...Array(365)].filter((_,i)=>dayDone(i)===dayCh(i).length).length} complete</span></div>
  <div class="heat">${[...Array(365)].map((_,i)=>{const dd=dayDone(i),n=dayCh(i).length;return `<button class="${dd===n?"full":dd?"part":""} ${i===now?"now":""} ${i===d?"picked":""}" data-day="${i}" aria-label="Day ${i+1}: ${rangeLabel(dayCh(i))}, ${dd} of ${n} done" title="Day ${i+1}: ${rangeLabel(dayCh(i))}"></button>`}).join("")}</div>
  <div class="legend"><span><i style="background:var(--gold)"></i>Done</span><span><i style="background:color-mix(in srgb,var(--gold) 40%,var(--line))"></i>Started</span><span><i style="box-shadow:inset 0 0 0 2px var(--accent)"></i>Today</span></div></section>
  <button class="reset" id="restartPlan">Restart plan from today</button>`;
  $("#view").innerHTML=h;
  $("#view").querySelectorAll("[data-day]").forEach(b=>b.onclick=()=>{planPick=+b.dataset.day;renderPlan()});
  const tt=$("#toToday");if(tt)tt.onclick=()=>{planPick=null;renderPlan()};
  let armed=false;$("#restartPlan").onclick=e=>{if(!armed){armed=true;e.target.textContent="Tap again to restart at Day 1 (lesson progress is kept)";return}S.planStart=today();planPick=null;save();renderPlan()};
}

function renderBooks(){
  const groups={};BOOKS.forEach((b,i)=>{const t=i<39?"Old":"New";if(libFilter!=="All"&&libFilter!==t)return;if(libQ&&!(b[1]+" "+b[2]).toLowerCase().includes(libQ))return;const k=t+"|"+b[0];(groups[k]=groups[k]||[]).push(i)});
  let h=`<div class="lib-top">${["All","Old","New"].map(f=>`<button class="chip" data-f="${f}" aria-pressed="${f===libFilter}">${f==="All"?"All 66":f+" Testament"}</button>`).join("")}</div>
  <input class="search" id="q" type="search" placeholder="Search books or topics" value="${esc(libQ)}" aria-label="Search books">`;
  const keys=Object.keys(groups);
  if(!keys.length)h+=`<p style="color:var(--muted);margin-top:24px">No books match "${esc(libQ)}".</p>`;
  keys.forEach(k=>{const[t,s]=k.split("|");h+=`<section class="section"><h4><span>${s}</span><span>${t} Testament · ${groups[k].length}</span></h4><div class="books">${groups[k].map(i=>{const b=BOOKS[i],d=countPre("ch-"+i+"-");return `<button class="book bookrow" data-book="${i}"><span class="n">${i+1}</span><b>${b[1]}</b><span>${b[2]} <span style="font-family:var(--mono);font-size:12px">${d}/${CHAPS[i]} ch</span></span><span class="mini"><i style="width:${d/CHAPS[i]*100}%"></i></span></button>`}).join("")}</div></section>`});
  $("#view").innerHTML=h;
  $("#view").querySelectorAll(".chip").forEach(c=>c.onclick=()=>{libFilter=c.dataset.f;renderBooks()});
  $("#view").querySelectorAll("[data-book]").forEach(c=>c.onclick=()=>{S.book=+c.dataset.book;S.path="chapters";save();tab("learn")});
  const q=$("#q");q.oninput=()=>{libQ=q.value.toLowerCase();const pos=q.selectionStart;renderBooks();const n=$("#q");n.focus();n.setSelectionRange(pos,pos)};
}

function renderMe(){
  const total=Object.keys(S.done).length,chd=countPre("ch-");
  const booksTouched=BOOKS.filter((_,i)=>countPre("ch-"+i+"-")>0).length;
  const booksFull=BOOKS.filter((_,i)=>countPre("ch-"+i+"-")===CHAPS[i]).length;
  const otCh=CH.filter(x=>x[0]<39&&S.done[chId(x)]).length,ntCh=chd-otCh;
  let h=`<div class="tiles"><div class="tile"><small>Total XP</small><b>${S.xp.toLocaleString()}</b></div><div class="tile"><small>Day streak</small><b>${liveStreak()}</b></div><div class="tile"><small>Lessons done</small><b>${total.toLocaleString()}</b></div><div class="tile"><small>Books finished</small><b>${booksFull}/66</b></div></div>
  <section class="group"><div class="group-h">Whole Bible<span>${chd}/${TOTAL_CH} chapters</span></div><div class="bars">
  ${[["Old Testament",otCh,929],["New Testament",ntCh,260],["Books started",booksTouched,66]].map(([l,d,n])=>`<div class="barrow">${l}<span>${d}/${n}</span><span class="pbar"><i style="width:${d/n*100}%"></i></span></div>`).join("")}</div></section>
  <section class="group"><div class="group-h">Paths<span>${PATHS.length}</span></div><div class="bars">
  ${PATHS.map(p=>{const d=countPre(p.pre),n=p.n();return `<div class="barrow">${p.name}<span>${d}/${n.toLocaleString()}</span><span class="pbar"><i style="width:${d/n*100}%"></i></span></div>`}).join("")}</div></section>
  <section class="group"><div class="group-h">Sync<span>${pass()?"On":"Off"}</span></div>
  <p class="note">${pass()?"Your passcode is set on this device. Progress syncs between your phone and computer, and new lessons can be written.":"Enter your passcode to sync progress across devices and unlock writing new lessons."}</p>
  <form class="row" id="passForm"><input class="sel" id="passSet" type="password" placeholder="${pass()?"Change passcode":"Passcode"}" aria-label="Passcode" autocomplete="current-password"><button class="btn primary" type="submit">Save</button>${pass()?`<button class="btn" type="button" id="passClear">Sign out</button>`:""}</form></section>
  <button class="reset" id="reset">Reset all progress</button>`;
  $("#view").innerHTML=h;
  $("#passForm").onsubmit=e=>{e.preventDefault();const v=$("#passSet").value.trim();if(!v)return;lsSet(PASS_KEY,v);pull().then(()=>{save();renderMe()})};
  const pc=$("#passClear");if(pc)pc.onclick=()=>{try{localStorage.removeItem(PASS_KEY)}catch(e){}renderMe()};
  let armed=false;$("#reset").onclick=e=>{if(!armed){armed=true;e.target.textContent="Tap again to erase all progress";return}S={done:{},xp:0,streak:0,last:null,path:"story",book:0,planStart:null};save();rerender()};
}

/* global clicks */
$("#view").addEventListener("click",e=>{
  const p=e.target.closest("[data-path]");if(p){S.path=p.dataset.path;save();renderLearn();const t=$(".ptitle");if(t)t.scrollIntoView({block:"start",behavior:"smooth"});return}
  const g=e.target.closest("[data-tab-go]");if(g){tab(g.dataset.tabGo);return}
  const n=e.target.closest("[data-id]");if(n&&!n.dataset.locked)startLesson(n.dataset.id);
});

/* lesson engine */
let L=null,chat=[];
function shuffleQ(q){const idx=q[1].map((_,i)=>i).sort(()=>Math.random()-.5);return{q:q[0],opts:idx.map(i=>q[1][i]),ans:idx.indexOf(q[2]),why:q[3]}}
function showLoading(s){
  $("#lbody").innerHTML=`<div class="loading"><div class="spin" aria-hidden="true"></div><div class="kind">${esc(s.group)}</div><div class="card-h" style="margin:0">${esc(s.title)}</div><p>Writing this lesson. It takes a few seconds the first time, then it's saved.</p></div>`;
  $("#foot").hidden=true;$("#askOpen").hidden=true;$("#progbar").style.width="0";
}
function showError(s,err){
  const code=err&&err.code;
  const msg=code==="locked"?"This lesson hasn't been written yet. Enter your passcode to unlock lesson writing on this device.":code==="offline"?"You're offline and this lesson isn't saved on this device yet. Connect and try again.":code==="rate_limited"?"Too many requests. Wait a minute and try again.":"Something went wrong writing this lesson. Try again.";
  $("#lbody").innerHTML=`<div class="loading"><div class="kind">${esc(s.title)}</div><p>${msg}</p>${code==="locked"?`<input class="search" id="passIn" type="password" placeholder="Passcode" aria-label="Passcode" style="max-width:280px" autocomplete="current-password">`:""}</div>`;
  if(code==="locked"){const pi=$("#passIn");pi.focus();pi.onkeydown=e=>{if(e.key==="Enter")$("#go").click()}}
  const foot=$("#foot");foot.hidden=false;foot.className="foot";$("#fb").hidden=true;
  const go=$("#go");go.disabled=false;go.textContent=code==="locked"?"Unlock":"Try again";go.onclick=()=>{const pi=$("#passIn");if(pi&&pi.value.trim()){lsSet(PASS_KEY,pi.value.trim());pull();save()}startLesson(s.id)};
  const alt=$("#alt");alt.hidden=false;alt.textContent="Back";alt.onclick=close;
}
async function startLesson(id){
  const s=spec(id);if(!s)return;
  $("#lesson").hidden=false;document.body.style.overflow="hidden";$("#sheet").hidden=true;$("#alt").hidden=true;chat=[];$("#thread").innerHTML="";
  L={id,s,loading:true};showLoading(s);
  let les;try{les=await getLesson(id)}catch(err){if(L&&L.id===id)showError(s,err);return}
  if(!L||L.id!==id)return;
  const steps=[...les.cards.map(c=>({type:"card",c})),...les.q.map(q=>({type:"q",...shuffleQ(q)}))];
  L={id,s,les,steps,pos:0,sel:null,checked:false,correct:0};
  $("#foot").hidden=false;$("#askOpen").hidden=false;drawStep();
  const nx=nextId(id);if(nx&&les.ai)getLesson(nx).catch(()=>{});
}
function drawStep(){
  const st=L.steps[L.pos],foot=$("#foot"),fb=$("#fb"),go=$("#go");
  foot.className="foot";fb.hidden=true;L.sel=null;L.checked=false;$("#alt").hidden=true;
  $("#progbar").style.width=(L.pos/L.steps.length*100)+"%";
  const body=$("#lbody"),ai=L.les.ai,T=x=>ai?esc(x):x;
  if(st.type==="card"){
    const n=L.les.cards.length,k=L.pos+1;
    body.innerHTML=`<div class="kind">${esc(L.s.group)} · Read ${k} of ${n}</div><h2 class="card-h">${T(st.c.h)}</h2><div class="card-b">${st.c.b.map(p=>`<p>${T(p)}</p>`).join("")}${st.c.ref?`<span class="card-ref">${T(st.c.ref)}</span>`:""}</div>${k===1&&L.s.ref?`<a class="readlink" href="${bg(L.s.ref)}" target="_blank" rel="noopener">Read ${esc(L.s.ref)} ↗</a>`:""}`;
    go.disabled=false;go.textContent="Continue";go.onclick=advance;
  }else{
    body.innerHTML=`<div class="kind">${st.retry?"Try again":"Question"}</div><h2 class="card-h">${T(st.q)}</h2><div class="opts">${st.opts.map((o,j)=>`<button class="opt" data-j="${j}" aria-pressed="false">${T(o)}</button>`).join("")}</div>`;
    go.disabled=true;go.textContent="Check";
    body.querySelectorAll(".opt").forEach(b=>b.onclick=()=>pick(+b.dataset.j));
    go.onclick=()=>{if(!L.checked)check();else advance()};
  }
  $("#lscroll").scrollTop=0;
}
function pick(j){if(!L||L.checked||!L.steps||L.steps[L.pos].type!=="q")return;const os=$("#lbody").querySelectorAll(".opt");if(!os[j])return;os.forEach(x=>x.setAttribute("aria-pressed","false"));os[j].setAttribute("aria-pressed","true");L.sel=j;$("#go").disabled=false}
function check(){
  const st=L.steps[L.pos];L.checked=true;const ok=L.sel===st.ans,T=x=>L.les.ai?esc(x):x;
  $("#lbody").querySelectorAll(".opt").forEach((b,j)=>{b.disabled=true;if(j===st.ans)b.classList.add("right");else if(j===L.sel)b.classList.add("wrong")});
  if(ok){if(!st.retry)L.correct++}else L.steps.push({...st,retry:true});
  $("#foot").className="foot "+(ok?"good":"bad");
  const fb=$("#fb");fb.hidden=false;fb.innerHTML=`<strong>${ok?"Correct":"Answer: "+T(st.opts[st.ans])}</strong><span>${T(st.why)}</span>`;
  $("#go").textContent="Continue";
}
function advance(){L.pos++;if(L.pos>=L.steps.length)finish();else drawStep()}
function finish(){
  const first=!S.done[L.id],total=L.les.q.length,gain=first?10+L.correct*5:5;
  S.xp+=gain;S.done[L.id]=true;
  const t=today();if(S.last!==t){S.streak=S.last&&dayDiff(S.last,t)===1?S.streak+1:1;S.last=t}
  save();header();
  $("#progbar").style.width="100%";
  const nx=nextId(L.id);
  $("#lbody").innerHTML=`<div class="done-screen"><div class="kind">Lesson complete</div><div class="big">${esc(L.s.title)}</div><p style="color:var(--muted)">${L.correct===total?"Perfect run.":"Missed ones came back until you got them."}</p>
  <div class="tiles"><div class="tile"><small>XP earned</small><b>+${gain}</b></div><div class="tile"><small>First try</small><b>${L.correct}/${total}</b></div><div class="tile"><small>Day streak</small><b>${S.streak}</b></div><div class="tile"><small>Chapters read</small><b>${countPre("ch-")}/${TOTAL_CH}</b></div></div></div>`;
  $("#foot").className="foot";$("#fb").hidden=true;
  const go=$("#go"),alt=$("#alt");go.disabled=false;
  if(nx){go.textContent="Next: "+spec(nx).title;go.onclick=()=>startLesson(nx);alt.hidden=false;alt.textContent="Back to path";alt.onclick=close}
  else{go.textContent="Back to path";go.onclick=close;alt.hidden=true}
}
function close(){$("#lesson").hidden=true;$("#sheet").hidden=true;document.body.style.overflow="";L=null;render()}
$("#quit").onclick=close;

/* ask */
$("#askOpen").onclick=()=>{$("#sheet").hidden=false;$("#askInput").focus()};
$("#askClose").onclick=()=>{$("#sheet").hidden=true};
$("#askForm").onsubmit=async e=>{
  e.preventDefault();const inp=$("#askInput"),q=inp.value.trim();if(!q||!L||!L.les)return;
  inp.value="";const th=$("#thread");
  const me=document.createElement("div");me.className="msg me";me.textContent=q;th.append(me);
  const ai=document.createElement("div");ai.className="msg ai";ai.textContent="Thinking...";th.append(ai);th.scrollTop=th.scrollHeight;
  chat.push({role:"user",content:q});
  $("#askSend").disabled=true;
  try{
    const r=await api("/api/ask",{method:"POST",body:JSON.stringify({id:L.id,messages:chat.slice(-12)})});
    ai.textContent=clean(r.text);chat.push({role:"assistant",content:r.text});
  }catch(err){chat.pop();ai.textContent=err&&err.code==="locked"?"Questions need your passcode. Add it on the Progress tab.":err&&err.code==="offline"?"You're offline. Connect and try again.":err&&err.code==="rate_limited"?"Too many questions at once. Try again in a minute.":"Couldn't get an answer. Try again."}
  $("#askSend").disabled=false;th.scrollTop=th.scrollHeight;
};
$("#askInput").addEventListener("keydown",e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();$("#askForm").requestSubmit()}});

document.addEventListener("keydown",e=>{
  if(!L||$("#lesson").hidden||!$("#sheet").hidden)return;
  if(e.key==="Escape")close();
  else if(/^[1-4]$/.test(e.key))pick(+e.key-1);
  else if(e.key==="Enter"&&!$("#go").disabled&&document.activeElement.tagName!=="BUTTON"&&!$("#foot").hidden)$("#go").click();
});

header();render();pull();
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("/sw.js").catch(()=>{}));
