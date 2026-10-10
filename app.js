/* Calmora: static front-end demo. No real authentication or AI service is connected. */
(() => {
  "use strict";
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
  const STORE = {
    moods: "calmora_moods_v1", journal: "calmora_journal_v1",
    profile: "calmora_profile_v1", prefs: "calmora_prefs_v1"
  };
  const moods = [
    {id:"very-low",label:"Very low",face:"☁",value:1},
    {id:"low",label:"Low",face:"◔",value:2},
    {id:"okay",label:"Okay",face:"◑",value:3},
    {id:"good",label:"Good",face:"◕",value:4},
    {id:"very-good",label:"Very good",face:"☀",value:5}
  ];
  const safeRead = (key, fallback=[]) => {
    try { const value=JSON.parse(localStorage.getItem(key)); return value ?? fallback; }
    catch { return fallback; }
  };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { toast("This browser could not save the demo data."); return false; } };
  const getMoods = () => { const x=safeRead(STORE.moods,[]); return Array.isArray(x)?x:[]; };
  const getJournal = () => { const x=safeRead(STORE.journal,[]); return Array.isArray(x)?x:[]; };
  const profile = () => { const p=safeRead(STORE.profile,{name:"Alex",email:"alex@example.com"}); return p && typeof p==="object"?p:{name:"Alex",email:"alex@example.com"}; };
  const prefs = () => { const p=safeRead(STORE.prefs,{dark:false,notifications:false}); return p && typeof p==="object"?p:{dark:false,notifications:false}; };
  const dateLabel = (d=new Date()) => d.toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric"});
  const shortDate = d => new Date(d).toLocaleDateString(undefined,{month:"short",day:"numeric"});
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  function toast(message) {
    const region=$("#toast-region"); if(!region) return;
    const el=document.createElement("div"); el.className="toast-message"; el.textContent=message; region.append(el);
    window.setTimeout(()=>el.remove(),3200);
  }
  function navLink(href,label,icon,active) { return `<a class="side-link ${active===href?"active":""}" href="${href}"><i class="bi ${icon}" aria-hidden="true"></i>${label}</a>`; }
  function header() {
    const landing = location.hash==="" || location.hash==="#home";
    $("#site-header").innerHTML = `<div class="nav-shell">
      <a class="brand" href="#home" aria-label="Calmora home"><span class="brand-mark"><i class="bi bi-flower1"></i></span>calmora</a>
      <nav id="main-nav" class="nav-links" aria-label="Main navigation">
        <a href="#home" class="${landing?"active":""}">Home</a><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#about">About</a>
      </nav>
      <div class="nav-actions"><a class="sign-in" href="#signin">Sign in</a><a class="btn-primary-soft btn-small" href="#dashboard">Start your journey <i class="bi bi-arrow-up-right"></i></a><button class="menu-toggle" id="menu-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Open navigation"><i class="bi bi-list"></i></button></div>
    </div>`;
    $("#menu-toggle")?.addEventListener("click", e=>{
      const nav=$("#main-nav"), open=nav.classList.toggle("open");
      e.currentTarget.setAttribute("aria-expanded",String(open)); e.currentTarget.setAttribute("aria-label",open?"Close navigation":"Open navigation");
    });
  }
  function footer() {
    $("#site-footer").innerHTML = `<div class="footer-inner"><a class="brand" href="#home"><span class="brand-mark"><i class="bi bi-flower1"></i></span>calmora</a><span>© ${new Date().getFullYear()} Calmora · A gentle demo for everyday reflection.</span><div class="footer-links"><a href="#settings">Privacy & settings</a><a href="#activities">Wellness studio</a><a href="#about">About</a></div></div>`;
  }
  function landing() {
    $("#main").innerHTML = `
      <section class="hero" id="home"><div class="hero-copy"><span class="eyebrow">Your space to reset</span><h1>Make space for<br>how you feel.</h1><p>A gentler way to check in with your emotions, make sense of your day, and find small moments of calm — at your own pace.</p><div class="hero-buttons"><a class="btn-primary-soft" href="#dashboard">Start your journey <i class="bi bi-arrow-up-right"></i></a><a class="btn-outline-soft" href="#features">Explore features</a></div><div class="hero-note"><i class="bi bi-shield-check"></i><span>A thoughtful demo space. Your wellbeing, your pace.</span></div></div>
      <div class="hero-art" aria-label="Illustration of Calmora mood check-in and breathing exercise"><div class="orbit"></div><div class="preview-card"><div class="preview-top"><div><span class="mini-label">YOUR DAILY CHECK-IN</span><h3 class="mb-0 mt-1">How are you today?</h3></div><i class="bi bi-three-dots" aria-hidden="true"></i></div><div class="mood-options"><span class="mood-dot">☁</span><span class="mood-dot">◔</span><span class="mood-dot">◑</span><span class="mood-dot selected">◕</span><span class="mood-dot">☀</span></div><div class="d-flex justify-content-between mb-2"><span class="mini-label">Your weekly rhythm</span><strong style="font-size:.78rem">A little more aware</strong></div><div class="progress-track"><div class="progress-fill"></div></div><div class="breath-preview"><div class="breath-orb"></div><div><strong class="d-block">A moment to breathe</strong><span class="mini-label">A 2-minute reset</span></div><i class="bi bi-arrow-up-right ms-auto"></i></div></div><div class="float-note"><i class="bi bi-stars me-2"></i>Small steps count.</div></div></section>
      <section class="section philosophy" id="about"><div class="section-inner philosophy-grid"><div><span class="eyebrow">A softer approach</span><div class="quote-mark">“</div></div><div><p class="philosophy-copy">You don’t have to have everything figured out to begin understanding yourself.</p><p class="mb-0">Calmora is a calm, judgement-free place to pause, notice what’s happening inside, and choose one small next step.</p></div></div></section>
      <section class="section" id="features"><div class="section-inner"><div class="section-heading"><span class="eyebrow">Made for real life</span><h2>Care for your inner world,<br>one small moment at a time.</h2><p>Simple tools that help you build a little more awareness into your everyday routine.</p></div><div class="feature-grid">
      <article class="feature-card"><div class="feature-icon"><i class="bi bi-cloud-sun"></i></div><h3>Check in with yourself</h3><p>Capture how you feel in a few taps, then reflect on patterns over time without labels or judgement.</p></article>
      <article class="feature-card"><div class="feature-icon"><i class="bi bi-journal-text"></i></div><h3>Make room to reflect</h3><p>Use gentle prompts to get thoughts out of your head and onto a page, just for you.</p></article>
      <article class="feature-card"><div class="feature-icon"><i class="bi bi-wind"></i></div><h3>Find a small reset</h3><p>Try breathing, grounding, or a mindful pause whenever your day feels a little too full.</p></article></div></div></section>
      <section class="section pt-0" id="how-it-works"><div class="section-inner"><div class="section-heading"><span class="eyebrow">Your daily reset</span><h2>Three gentle steps.<br>No perfect routine required.</h2></div><div class="steps-grid"><article class="step"><span class="step-number">01 / NOTICE</span><h3>Pause for a check-in</h3><p>Give yourself a moment to name what you’re feeling, without needing to change it.</p></article><article class="step"><span class="step-number">02 / REFLECT</span><h3>Explore what’s on your mind</h3><p>Write a few lines, spot a pattern, or simply let a thought land somewhere.</p></article><article class="step"><span class="step-number">03 / RESET</span><h3>Choose one small action</h3><p>Take a breath, use your senses, or set an intention for the next part of your day.</p></article></div></div></section>
      <section class="section pt-0"><div class="section-inner mood-band"><div><span class="eyebrow">Your feelings, over time</span><h2 class="mt-3">Notice the rhythm,<br>not a score.</h2><p class="mt-3">A simple weekly view helps you look back with curiosity. Feelings can change, and that’s part of being human.</p><a class="btn-outline-soft mt-2" href="#mood">Explore mood tracking <i class="bi bi-arrow-up-right"></i></a></div><div><div class="d-flex justify-content-between align-items-center"><strong>This week, in a glance</strong><span class="mini-label">Sample view</span></div><div class="week-bars"><div class="week-bar" style="height:35%"></div><div class="week-bar" style="height:52%"></div><div class="week-bar" style="height:43%"></div><div class="week-bar" style="height:70%"></div><div class="week-bar" style="height:61%"></div><div class="week-bar" style="height:82%"></div><div class="week-bar" style="height:67%"></div></div><div class="week-days"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></div></div></section>
      <section class="section pt-0"><div class="section-inner privacy-panel"><div class="privacy-icon"><i class="bi bi-lock"></i></div><div><h3 class="mb-1">Honest about your privacy.</h3><p class="mb-0">This portfolio demo stores sample entries in your browser. Local storage is not encrypted, so don’t add sensitive personal details.</p></div><a class="btn-outline-soft" href="#settings">Privacy & settings</a></div></section>
      <section class="section pt-0"><div class="cta-panel"><span class="eyebrow" style="color:#d6e1d2">A moment for you</span><h2 class="mt-3">You can start exactly where you are.</h2><p>No streaks to maintain, no version of yourself to become. Just a little space to check in.</p><a class="btn-primary-soft" href="#dashboard">Enter Calmora <i class="bi bi-arrow-up-right"></i></a></div></section>
      <section class="container pb-5"><p class="form-note text-center">Calmora is a wellness demo, not a medical service or substitute for professional care.</p></section>`;
  }
  function sidebar(active) {
    return `<aside class="sidebar" aria-label="Application navigation"><div class="sidebar-label">Your space</div>${navLink("#dashboard","Dashboard","bi-grid",active)}${navLink("#mood","Mood tracker","bi-cloud-sun",active)}${navLink("#journal","Journal","bi-journal-text",active)}${navLink("#activities","Wellness studio","bi-wind",active)}${navLink("#companion","AI companion demo","bi-chat-heart",active)}<div class="sidebar-label mt-3">Personal</div>${navLink("#settings","Settings","bi-sliders",active)}</aside>`;
  }
  function shell(active,title,subtitle,body) {
    $("#main").innerHTML=`<div class="app-shell"><div class="app-topline"><div><span class="eyebrow">Your calm space</span><h1>${title}</h1><p>${subtitle}</p></div><a class="btn-outline-soft btn-small" href="#settings"><i class="bi bi-gear"></i> Settings</a></div><div class="app-layout">${sidebar(active)}<div class="content-stack">${body}</div></div></div>`;
  }
  function moodButtons(selected="") {
    return `<div class="mood-select" role="group" aria-label="Choose a mood">${moods.map(m=>`<button type="button" class="mood-choice" data-mood="${m.id}" aria-pressed="${selected===m.id}"><span class="face" aria-hidden="true">${m.face}</span><span>${m.label}</span></button>`).join("")}</div>`;
  }
  function moodChart(entries) {
    const days=[]; const today=new Date();
    for(let i=6;i>=0;i--){const d=new Date(today);d.setDate(today.getDate()-i);const key=d.toDateString();const found=entries.filter(e=>new Date(e.date).toDateString()===key).slice(-1)[0];days.push({label:d.toLocaleDateString(undefined,{weekday:"short"}),value:found?.value||0});}
    return `<div class="bar-chart" role="img" aria-label="Mood history for the last seven days. Missing days have no bar.">${days.map(d=>`<div class="chart-column"><div class="chart-bar ${d.value<=2?"low":d.value===3?"mid":""}" style="height:${d.value?d.value*17:4}px;opacity:${d.value?1:.25}"></div><small>${d.label}</small></div>`).join("")}</div><p class="form-note mt-2 mb-0">A reflection aid, not a clinical assessment. Empty days mean no entry was saved.</p>`;
  }
  function dashboard() {
    const name=profile().name||"friend", entries=getMoods(), journal=getJournal();
    const latest=entries[entries.length-1];
    shell("#dashboard","A little space for you, "+esc(name)+".",dateLabel()+ " · There’s no right way to feel today.",`
      <section class="panel welcome-panel"><span class="eyebrow">Your daily check-in</span><h2 class="mt-2">How are you feeling today?</h2><p>Choose what feels closest. You can always add a little context.</p><form id="dash-mood-form">${moodButtons()}<label class="form-label" for="dash-note">Anything you’d like to note? <span class="form-note">(optional)</span></label><textarea id="dash-note" class="form-control mb-3" rows="2" maxlength="500" placeholder="A thought, a moment, or just a word…"></textarea><button class="btn-primary-soft" type="submit">Save check-in <i class="bi bi-arrow-right"></i></button></form></section>
      <div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Your weekly rhythm</h2><p>Notice, without judging.</p></div><a href="#mood" class="btn-quiet btn-small">View all</a></div>${moodChart(entries)}</section><section class="panel"><div class="panel-head"><div><h2>A moment to breathe</h2><p>Give your attention a gentle anchor.</p></div><i class="bi bi-wind fs-4"></i></div><div class="breath-preview mb-3"><div class="breath-orb"></div><div><strong class="d-block">Guided breathing</strong><span class="mini-label">A short, steady pause</span></div></div><a href="#activities" class="btn-outline-soft btn-small">Open wellness studio <i class="bi bi-arrow-up-right"></i></a></section></div>
      <div class="grid-2"><section class="panel"><div class="panel-head"><div><h2>Recent reflections</h2><p>Your journal, at a glance.</p></div><a href="#journal" class="btn-quiet btn-small">Open journal</a></div>${journal.length?journal.slice(-2).reverse().map(e=>`<div class="entry-row"><div><strong>${esc(e.title||"A little reflection")}</strong><div class="entry-meta">${shortDate(e.date)}</div><p>${esc(e.body.slice(0,100))}${e.body.length>100?"…":""}</p></div></div>`).join(""):`<div class="empty-state"><i class="bi bi-journal-plus"></i><p>Your first reflection can start whenever you’re ready.</p></div>`}</section><section class="panel"><h2>Small things to try</h2><p>Pick one that fits the moment you’re in.</p><div class="entry-row"><div><strong>Look around slowly</strong><p>Name three things you can see.</p></div><i class="bi bi-eye"></i></div><div class="entry-row"><div><strong>Stretch your shoulders</strong><p>Unclench, move gently, and pause.</p></div><i class="bi bi-sun"></i></div><div class="entry-row"><div><strong>Write one honest sentence</strong><p>It doesn’t need to sound perfect.</p></div><i class="bi bi-pencil"></i></div></section></div>`);
    bindMoodForm("#dash-mood-form", "#dash-note", true);
  }
  let selectedMood="";
  function bindMoodButtons(root=document) {
    $$(".mood-choice",root).forEach(btn=>btn.addEventListener("click",()=>{
      const group=btn.closest(".mood-select"); $$(".mood-choice",group).forEach(b=>b.setAttribute("aria-pressed","false"));
      btn.setAttribute("aria-pressed","true"); selectedMood=btn.dataset.mood;
    }));
  }
  function bindMoodForm(formSelector,noteSelector,goDashboard=false) {
    const form=$(formSelector); if(!form)return; selectedMood="";
    bindMoodButtons(form);
    form.addEventListener("submit",e=>{
      e.preventDefault(); if(!selectedMood){toast("Choose the mood that feels closest first.");return;}
      const m=moods.find(x=>x.id===selectedMood), note=$(noteSelector)?.value.trim()||"";
      const entries=getMoods(); entries.push({id:crypto.randomUUID?.()||String(Date.now()),mood:m.id,label:m.label,value:m.value,note,date:new Date().toISOString()});
      if(safeWrite(STORE.moods,entries)){toast("Your check-in was saved."); location.hash=goDashboard?"#dashboard":"#mood";}
    });
  }
  function moodPage() {
    const entries=getMoods().slice().reverse();
    shell("#mood","Mood tracker","A small record of how things feel, over time.",`
      <section class="panel"><span class="eyebrow">Right now</span><h2 class="mt-2">What’s closest to how you feel?</h2><p>There’s no good or bad answer. Choose the option that feels most true for you.</p><form id="mood-form">${moodButtons()}<label class="form-label" for="mood-note">Optional reflection</label><textarea id="mood-note" class="form-control mb-3" rows="3" maxlength="500" placeholder="What might be contributing to this feeling?"></textarea><button class="btn-primary-soft" type="submit">Save mood entry</button></form></section>
      <section class="panel"><div class="panel-head"><div><h2>Your last seven days</h2><p>Only days with entries show a value.</p></div><span class="badge rounded-pill text-bg-light">Demo data</span></div>${moodChart(getMoods())}</section>
      <section class="panel"><div class="panel-head"><div><h2>Recent entries</h2><p>${entries.length} ${entries.length===1?"entry":"entries"} saved in this browser.</p></div><button class="btn-outline-soft btn-small" id="clear-moods">Clear entries</button></div><div id="mood-entries">${entries.length?entries.map(e=>`<div class="entry-row"><div><strong>${esc(moods.find(m=>m.id===e.mood)?.face||"◑")} ${esc(e.label)}</strong><div class="entry-meta">${new Date(e.date).toLocaleString()}</div>${e.note?`<p>${esc(e.note)}</p>`:""}</div><div class="entry-actions"><button class="icon-button delete-mood" data-id="${esc(e.id)}" aria-label="Delete mood entry" title="Delete entry"><i class="bi bi-trash"></i></button></div></div>`).join(""):`<div class="empty-state"><i class="bi bi-cloud-sun"></i><p>No entries yet. Your check-in will appear here.</p></div>`}</div></section>
      <p class="form-note">Mood values are personal reflections only. They do not diagnose or measure a health condition.</p>`);
    bindMoodForm("#mood-form","#mood-note");
    $("#clear-moods").addEventListener("click",()=>{if(confirm("Delete all saved mood entries from this browser?")){safeWrite(STORE.moods,[]);toast("Mood entries cleared.");render();}});
    $$(".delete-mood").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this mood entry?")){safeWrite(STORE.moods,getMoods().filter(e=>e.id!==b.dataset.id));toast("Entry deleted.");render();}}));
  }
  function journalPage(editId=null) {
    const all=getJournal(), editing=all.find(e=>e.id===editId);
    shell("#journal",editing?"Edit a reflection":"Your journal","A private-to-this-browser space to let your thoughts land.",`
      <section class="panel"><div class="panel-head"><div><h2>${editing?"Make an edit":"What’s on your mind?"}</h2><p>${dateLabel()}</p></div><i class="bi bi-journal-text fs-4"></i></div><form id="journal-form"><input type="hidden" id="journal-id" value="${esc(editing?.id||"")}"><label class="form-label" for="journal-title">Title <span class="form-note">(optional)</span></label><input id="journal-title" class="form-control mb-3" maxlength="90" value="${esc(editing?.title||"")}" placeholder="A thought to come back to"><label class="form-label" for="journal-body">Your reflection</label><textarea id="journal-body" class="form-control" rows="6" maxlength="5000" required placeholder="Start wherever you are…">${esc(editing?.body||"")}</textarea><div class="d-flex justify-content-between align-items-center gap-3 mt-2 mb-3"><span class="form-note"><span id="char-count">${(editing?.body||"").length}</span>/5000 characters</span><span class="form-note">It doesn’t need to be perfect.</span></div><div class="d-flex gap-2 flex-wrap"><button class="btn-primary-soft" type="submit">${editing?"Save changes":"Save reflection"}</button>${editing?`<a class="btn-outline-soft" href="#journal">Cancel edit</a>`:"<button class=\\"btn-outline-soft\\" type=\\"button\\" id=\\"insert-prompt\\">Use a prompt</button>"}</div></form></section>
      <section class="panel"><div class="panel-head"><div><h2>Past reflections</h2><p>Search by title or words in your entry.</p></div><span class="form-note">${all.length} saved</span></div><input id="journal-search" class="form-control mb-3" type="search" placeholder="Search your journal…" aria-label="Search journal entries"><div id="journal-list">${journalList(all)}</div></section>
      <div class="notice"><i class="bi bi-lock me-2"></i><strong>Privacy note:</strong> Entries are stored in browser localStorage, which is not encrypted. Avoid sensitive personal information. You can delete all local demo data in Settings.</div>`);
    const body=$("#journal-body"), count=$("#char-count");
    body.addEventListener("input",()=>count.textContent=body.value.length);
    $("#journal-form").addEventListener("submit",e=>{
      e.preventDefault(); const text=body.value.trim(); if(!text){body.focus();toast("Add a few words before saving.");return;}
      const id=$("#journal-id").value, current=getJournal(), now=new Date().toISOString();
      if(id){const i=current.findIndex(x=>x.id===id);if(i>=0)current[i]={...current[i],title:$("#journal-title").value.trim(),body:text,updated:now};}
      else current.push({id:crypto.randomUUID?.()||String(Date.now()),title:$("#journal-title").value.trim(),body:text,date:now,updated:now});
      if(safeWrite(STORE.journal,current)){toast(id?"Reflection updated.":"Reflection saved.");location.hash="#journal";}
    });
    $("#journal-search").addEventListener("input",e=>{
      const q=e.target.value.toLowerCase(); const found=getJournal().filter(x=>(x.title+" "+x.body).toLowerCase().includes(q)); $("#journal-list").innerHTML=journalList(found);
      bindJournalActions();
    });
    $("#insert-prompt")?.addEventListener("click",()=>{body.value="Right now, I’m noticing…\n\nOne thing I need today is…";count.textContent=body.value.length;body.focus();});
    bindJournalActions();
  }
  function journalList(items) {
    if(!items.length)return `<div class="empty-state"><i class="bi bi-journal-plus"></i><p>No reflections found. Your words will appear here after you save.</p></div>`;
    return items.slice().reverse().map(e=>`<div class="entry-row"><div><strong>${esc(e.title||"A little reflection")}</strong><div class="entry-meta">${new Date(e.date).toLocaleString()}${e.updated&&e.updated!==e.date?" · edited":""}</div><p>${esc(e.body.length>240?e.body.slice(0,240)+"…":e.body)}</p></div><div class="entry-actions"><button class="icon-button edit-journal" data-id="${esc(e.id)}" aria-label="Edit reflection"><i class="bi bi-pencil"></i></button><button class="icon-button delete-journal" data-id="${esc(e.id)}" aria-label="Delete reflection"><i class="bi bi-trash"></i></button></div></div>`).join("");
  }
  function bindJournalActions() {
    $$(".edit-journal").forEach(b=>b.addEventListener("click",()=>journalPage(b.dataset.id)));
    $$(".delete-journal").forEach(b=>b.addEventListener("click",()=>{if(confirm("Delete this reflection? This cannot be undone.")){safeWrite(STORE.journal,getJournal().filter(e=>e.id!==b.dataset.id));toast("Reflection deleted.");journalPage();}}));
  }
  function activitiesPage() {
    shell("#activities","Wellness studio","Small, approachable exercises. Choose what feels useful today.",`
      <div class="grid-2"><article class="activity-card"><div class="feature-icon"><i class="bi bi-wind"></i></div><h3>Guided breathing</h3><p>Follow a gentle inhale, pause, and exhale rhythm. You can stop whenever you like.</p><a href="#activities/breathe" class="btn-outline-soft btn-small">Start breathing <i class="bi bi-arrow-right"></i></a></article><article class="activity-card"><div class="feature-icon"><i class="bi bi-eye"></i></div><h3>Five-senses grounding</h3><p>Bring your attention to what is around you, one sense at a time.</p><button class="btn-outline-soft btn-small" id="grounding-start">Begin grounding</button></article><article class="activity-card"><div class="feature-icon"><i class="bi bi-cup-hot"></i></div><h3>A mindful minute</h3><p>Give one ordinary moment your full attention, without needing to multitask.</p><button class="btn-outline-soft btn-small" id="mindful-start">Try a mindful minute</button></article><article class="activity-card"><div class="feature-icon"><i class="bi bi-pencil-square"></i></div><h3>Gentle reflection</h3><p>Use a small question to begin writing without pressure.</p><button class="btn-outline-soft btn-small" id="reflection-start">Get a prompt</button></article></div>
      <section class="panel" id="activity-detail"><div class="empty-state"><i class="bi bi-flower1"></i><p>Choose an activity above to begin.</p></div></section>`);
    $("#grounding-start").addEventListener("click",()=>showActivity("grounding"));
    $("#mindful-start").addEventListener("click",()=>showActivity("mindful"));
    $("#reflection-start").addEventListener("click",()=>showActivity("reflection"));
    if(location.hash==="#activities/breathe")showActivity("breathing");
  }
  let breathTimer=null, breathRunning=false, breathStart=0, breathElapsed=0, breathPhase=0;
  const phases=[{name:"Breathe in",seconds:4,cls:"inhale"},{name:"Hold gently",seconds:2,cls:"hold"},{name:"Breathe out",seconds:6,cls:"exhale"}];
  function stopBreath(){if(breathTimer)clearInterval(breathTimer);breathTimer=null;breathRunning=false;}
  function showActivity(type) {
    const detail=$("#activity-detail"); if(!detail)return;
    if(type==="breathing"){
      stopBreath();breathElapsed=0;breathPhase=0;
      detail.innerHTML=`<div class="panel-head"><div><span class="eyebrow">Guided practice</span><h2 class="mt-2">Let your breath find its rhythm.</h2><p>Follow the circle at a comfortable pace. You can pause or stop at any time.</p></div></div><div class="breathing-stage"><div><div id="breath-orb" class="breathing-orb"></div><div id="breath-phase" class="phase-label">Ready when you are</div><p id="breath-time" class="mb-0 mt-1">00:00</p></div></div><div class="d-flex gap-2 flex-wrap mt-3"><button id="breath-start" class="btn-primary-soft">Start</button><button id="breath-pause" class="btn-outline-soft" disabled>Pause</button><button id="breath-reset" class="btn-quiet">Reset</button></div><p class="form-note mt-3 mb-0">Keep breathing naturally. Skip or stop if this exercise feels uncomfortable.</p>`;
      $("#breath-start").addEventListener("click",startBreath);
      $("#breath-pause").addEventListener("click",pauseBreath);
      $("#breath-reset").addEventListener("click",()=>{stopBreath();breathElapsed=0;breathPhase=0;$("#breath-orb").className="breathing-orb";$("#breath-phase").textContent="Ready when you are";$("#breath-time").textContent="00:00";$("#breath-start").disabled=false;$("#breath-pause").disabled=true;$("#breath-pause").textContent="Pause";});
    } else if(type==="grounding"){
      detail.innerHTML=`<span class="eyebrow">Five-senses grounding</span><h2 class="mt-2">Gently come back to your surroundings.</h2><p>Move through the prompts at your own pace. You do not need to get every answer.</p><div class="content-stack mt-4">${[["5","things you can see","Notice shapes, colours, light, or small details."],["4","things you can feel","Notice the chair beneath you or your feet on the floor."],["3","things you can hear","Listen for nearby and distant sounds."],["2","things you can smell","Notice any scent around you, or simply the air."],["1","thing you can taste","Notice a taste, or take a comfortable sip of water."]].map((x,i)=>`<label class="entry-row"><div><strong>${x[0]} · ${x[1]}</strong><p>${x[2]}</p></div><input type="checkbox" aria-label="Complete ${x[1]}" class="form-check-input grounding-check"></label>`).join("")}</div><button class="btn-outline-soft mt-3" id="grounding-reset">Reset checklist</button>`;
      $("#grounding-reset").addEventListener("click",()=>$$(".grounding-check",detail).forEach(c=>c.checked=false));
    } else if(type==="mindful"){
      detail.innerHTML=`<span class="eyebrow">Mindful minute</span><h2 class="mt-2">One minute, one thing.</h2><p>Choose an ordinary thing to focus on — your tea, a sound, the feeling of your feet on the floor. Let your attention rest there.</p><div class="stat-card mt-3"><strong id="mindful-clock">01:00</strong><span>Take the minute at your own pace.</span></div><div class="d-flex gap-2 mt-3"><button class="btn-primary-soft" id="mindful-start-timer">Start minute</button><button class="btn-outline-soft" id="mindful-reset">Reset</button></div><p id="mindful-message" class="mt-3 mb-0" aria-live="polite"></p>`;
      let left=60, timer=null;
      $("#mindful-start-timer").addEventListener("click",()=>{if(timer)return;$("#mindful-start-timer").disabled=true;timer=setInterval(()=>{left--;$("#mindful-clock").textContent=`00:${String(left).padStart(2,"0")}`;if(left<=0){clearInterval(timer);timer=null;$("#mindful-message").textContent="You made a little room to pause. Well done.";$("#mindful-start-timer").disabled=false;$("#mindful-start-timer").textContent="Start again";}},1000);});
      $("#mindful-reset").addEventListener("click",()=>{if(timer)clearInterval(timer);timer=null;left=60;$("#mindful-clock").textContent="01:00";$("#mindful-message").textContent="";$("#mindful-start-timer").disabled=false;});
    } else {
      detail.innerHTML=`<span class="eyebrow">A gentle prompt</span><h2 class="mt-2">What do you need a little more of today?</h2><p>There is no perfect answer. Give yourself a few quiet seconds, then write whatever comes up.</p><a class="btn-primary-soft mt-2" href="#journal">Write in your journal <i class="bi bi-arrow-up-right"></i></a>`;
    }
  }
  function updateBreath() {
    const elapsed=Math.floor((Date.now()-breathStart)/1000)+breathElapsed;
    const cycle=elapsed%12; let sum=0, idx=0;
    for(let i=0;i<phases.length;i++){sum+=phases[i].seconds;if(cycle<sum){idx=i;break;}}
    const within=cycle-(sum-phases[idx].seconds);
    breathPhase=idx;
    $("#breath-orb").className="breathing-orb "+phases[idx].cls;
    $("#breath-phase").textContent=phases[idx].name;
    $("#breath-time").textContent=`${String(Math.floor(elapsed/60)).padStart(2,"0")}:${String(elapsed%60).padStart(2,"0")} · ${phases[idx].seconds-within}s`;
  }
  function startBreath(){if(breathRunning)return;breathRunning=true;breathStart=Date.now();$("#breath-start").disabled=true;$("#breath-pause").disabled=false;$("#breath-pause").textContent="Pause";updateBreath();breathTimer=setInterval(updateBreath,250);}
  function pauseBreath(){if(breathRunning){breathElapsed+=Math.floor((Date.now()-breathStart)/1000);stopBreath();$("#breath-start").disabled=false;$("#breath-start").textContent="Resume";$("#breath-pause").textContent="Paused";}else if(breathElapsed){startBreath();}}
  function companionPage() {
    shell("#companion","A listening space","A simulated companion for gentle reflection — not a real AI service.",`
      <section class="panel"><div class="d-flex align-items-center gap-3 mb-3"><div class="feature-icon mb-0"><i class="bi bi-chat-heart"></i></div><div><h2 class="mb-1">Hello, I’m here to listen.</h2><p class="mb-0">You can share a thought or choose a starter below.</p></div></div><div class="starter-row">${["I feel a little overwhelmed","Help me reflect on today","Suggest a small reset"].map(s=>`<button class="starter" type="button">${s}</button>`).join("")}</div><div id="chat-window" class="chat-window" role="log" aria-live="polite"><div class="chat-message bot">Welcome. You don’t need to explain everything perfectly. What’s on your mind today?</div></div><div class="chat-compose"><input id="chat-input" class="form-control" maxlength="500" placeholder="Write a message…" aria-label="Message to demo companion"><button id="chat-send" class="btn-primary-soft" type="button">Send <i class="bi bi-arrow-up"></i></button></div><div class="d-flex justify-content-between align-items-center gap-2 mt-3"><p class="form-note mb-0">Demo responses are predefined and may not fit every situation.</p><button id="chat-clear" class="btn-quiet btn-small">Clear chat</button></div></section>
      <div class="notice"><i class="bi bi-info-circle me-2"></i>Calmora is a wellness companion demo, not a substitute for qualified professional care. It cannot monitor risk or contact emergency services.</div>`);
    const win=$("#chat-window"), input=$("#chat-input");
    const send=()=>{const msg=input.value.trim();if(!msg)return;appendMessage(msg,"user");input.value="";const typing=document.createElement("div");typing.className="chat-message bot";typing.textContent="Thinking of a gentle response…";typing.id="typing";win.append(typing);win.scrollTop=win.scrollHeight;setTimeout(()=>{typing.remove();appendMessage(companionReply(msg),"bot");},650);};
    $("#chat-send").addEventListener("click",send);input.addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();send();}});
    $$(".starter").forEach(b=>b.addEventListener("click",()=>{input.value=b.textContent;send();}));
    $("#chat-clear").addEventListener("click",()=>{win.innerHTML="";appendMessage("Chat cleared. We can begin again whenever you’re ready.","bot");});
    function appendMessage(msg,who){const el=document.createElement("div");el.className="chat-message "+who;el.textContent=msg;win.append(el);win.scrollTop=win.scrollHeight;}
  }
  function companionReply(message) {
    const s=message.toLowerCase();
    if(/kill myself|hurt myself|self.harm|end my life|suicid|don't want to live|do not want to live/.test(s))
      return "I’m really sorry things feel this hard. This demo can’t provide emergency support. Please reach out to a trusted person who can stay with you, and contact local emergency services if you may be in immediate danger. You deserve real support right now.";
    if(/overwhelm|stress|anxious|anxiety|panic|too much/.test(s))return "That sounds like a lot to hold at once. If it feels okay, try making the next step smaller: relax your shoulders, notice one thing around you, and choose just one thing that needs your attention. Would a short breathing pause help?";
    if(/sad|lonely|low|down|upset|cry/.test(s))return "Thank you for putting that feeling into words. You don’t have to force yourself to feel differently right away. Is there someone kind you could connect with, or one small comforting thing you can do for yourself?";
    if(/today|reflect|day/.test(s))return "Let’s reflect gently: what was one moment that took energy today, and one moment — however small — that gave a little back?";
    if(/breath|reset|calm/.test(s))return "A small reset might be enough for this moment. Let your breath stay comfortable, notice your feet on the floor, and look around slowly. You can also open the Wellness Studio for a guided breathing exercise.";
    return "I’m listening. It may help to start with one small piece: what feels most important about this for you right now? You can take your time.";
  }
  function settingsPage() {
    const p=profile(), pref=prefs();
    shell("#settings","Settings & preferences","Manage this demo experience and the data stored in this browser.",`
      <section class="panel"><span class="eyebrow">Your profile</span><h2 class="mt-2">A few details</h2><form id="profile-form" class="mt-3"><label class="form-label" for="profile-name">Display name</label><input id="profile-name" class="form-control mb-3" maxlength="60" value="${esc(p.name||"Alex")}" required><label class="form-label" for="profile-email">Demo email</label><input id="profile-email" class="form-control mb-3" type="email" value="${esc(p.email||"")}" placeholder="you@example.com"><p class="form-note">This is only a local demo profile; no account is created.</p><button class="btn-primary-soft" type="submit">Save profile</button></form></section>
      <section class="panel"><span class="eyebrow">Your experience</span><h2 class="mt-2">Preferences</h2><div class="settings-row"><div><strong>Dark theme</strong><p class="mb-0">Change the appearance of this demo.</p></div><button class="toggle" id="theme-toggle" aria-pressed="${pref.dark}" aria-label="Toggle dark theme"></button></div><div class="settings-row"><div><strong>Notifications</strong><p class="mb-0">Demo preference only. No notifications are sent.</p></div><button class="toggle" id="notifications-toggle" aria-pressed="${pref.notifications}" aria-label="Toggle demo notification preference"></button></div></section>
      <section class="panel"><span class="eyebrow">Your data</span><h2 class="mt-2">Export or clear</h2><p>Export your local demo entries as JSON, or remove them from this browser.</p><div class="d-flex gap-2 flex-wrap"><button id="export-data" class="btn-outline-soft"><i class="bi bi-download"></i> Export demo data</button><button id="clear-data" class="btn-primary-soft" style="background:#8b5146;border-color:#8b5146"><i class="bi bi-trash"></i> Clear all local data</button></div><p class="form-note mt-3 mb-0">Local storage is not encrypted. Avoid storing sensitive personal information in this demo.</p></section>
      <section class="panel"><h2>About Calmora</h2><p class="mb-2">Calmora is a portfolio demonstration of a wellness companion interface. Mood tracking, journal storage, profile details, preferences, and chat replies are local/demo features.</p><p class="mb-0">It is not a medical service, does not diagnose conditions, and does not replace advice from a qualified professional.</p></section>`);
    $("#profile-form").addEventListener("submit",e=>{e.preventDefault();safeWrite(STORE.profile,{name:$("#profile-name").value.trim()||"friend",email:$("#profile-email").value.trim()});toast("Profile updated.");});
    $("#theme-toggle").addEventListener("click",()=>{const next={...prefs(),dark:!prefs().dark};safeWrite(STORE.prefs,next);applyTheme();$("#theme-toggle").setAttribute("aria-pressed",String(next.dark));toast(next.dark?"Dark theme enabled.":"Light theme enabled.");});
    $("#notifications-toggle").addEventListener("click",()=>{const next={...prefs(),notifications:!prefs().notifications};safeWrite(STORE.prefs,next);$("#notifications-toggle").setAttribute("aria-pressed",String(next.notifications));toast("Demo preference updated. No notifications will be sent.");});
    $("#export-data").addEventListener("click",()=>{const data={exportedAt:new Date().toISOString(),profile:profile(),preferences:prefs(),moods:getMoods(),journal:getJournal()};const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download="calmora-demo-data.json";a.click();URL.revokeObjectURL(url);toast("Your JSON export is ready.");});
    $("#clear-data").addEventListener("click",()=>{if(confirm("Delete all Calmora demo data, including mood entries, journal entries, profile, and preferences? This cannot be undone.")){Object.values(STORE).forEach(k=>localStorage.removeItem(k));document.body.classList.remove("dark");toast("Local demo data cleared.");render();}});
  }
  function signinPage() {
    $("#main").innerHTML=`<div class="auth-wrap"><div class="auth-card"><section class="auth-art"><a class="brand" href="#home"><span class="brand-mark"><i class="bi bi-flower1"></i></span>calmora</a><div><span class="eyebrow">A little room to breathe</span><h2 class="mt-3">Come as you are.<br>Begin from here.</h2><p class="mt-3">A gentle space for everyday reflection, at your own pace.</p></div><p class="form-note mb-0">Demo only · No account service connected</p></section><section class="auth-form"><span class="eyebrow">Welcome to your space</span><h2 class="mt-2">Let’s begin gently.</h2><div class="auth-tabs" role="tablist" aria-label="Sign in or register"><button class="active" id="tab-signin" role="tab" aria-selected="true">Sign in</button><button id="tab-register" role="tab" aria-selected="false">Register</button></div><form id="auth-form" novalidate><div id="name-field" hidden><label class="form-label" for="auth-name">Your name</label><input id="auth-name" class="form-control mb-3" maxlength="60" autocomplete="name"></div><label class="form-label" for="auth-email">Email address</label><input id="auth-email" class="form-control mb-3" type="email" autocomplete="email" required><label class="form-label" for="auth-password">Password</label><div class="input-group mb-2"><input id="auth-password" class="form-control" type="password" autocomplete="current-password" required minlength="4"><button class="btn-outline-soft" type="button" id="password-toggle" aria-label="Show password"><i class="bi bi-eye"></i></button></div><div id="auth-error" class="text-danger small mb-3" role="alert"></div><button class="btn-primary-soft w-100" id="auth-submit" type="submit">Sign in <i class="bi bi-arrow-right"></i></button></form><div class="text-center my-3"><span class="form-note">or</span></div><button class="btn-outline-soft w-100" id="demo-entry"><i class="bi bi-stars"></i> Continue with demo</button><p class="form-note mt-3 mb-0">Do not enter a real password. This form never transmits or stores passwords. It only demonstrates the interface.</p></section></div></div>`;
    let mode="signin";
    const setMode=m=>{mode=m;$("#tab-signin").classList.toggle("active",m==="signin");$("#tab-register").classList.toggle("active",m==="register");$("#tab-signin").setAttribute("aria-selected",String(m==="signin"));$("#tab-register").setAttribute("aria-selected",String(m==="register"));$("#name-field").hidden=m!=="register";$("#auth-name").required=m==="register";$("#auth-password").autocomplete=m==="register"?"new-password":"current-password";$("#auth-submit").innerHTML=(m==="register"?"Create demo profile":"Sign in")+' <i class="bi bi-arrow-right"></i>';$("#auth-error").textContent="";};
    $("#tab-signin").addEventListener("click",()=>setMode("signin"));$("#tab-register").addEventListener("click",()=>setMode("register"));
    $("#password-toggle").addEventListener("click",()=>{const f=$("#auth-password"),show=f.type==="password";f.type=show?"text":"password";$("#password-toggle").innerHTML=`<i class="bi bi-eye${show?"-slash":""}"></i>`;$("#password-toggle").setAttribute("aria-label",show?"Hide password":"Show password");});
    $("#auth-form").addEventListener("submit",e=>{e.preventDefault();const email=$("#auth-email").value.trim(),pw=$("#auth-password").value,name=$("#auth-name").value.trim();$("#auth-error").textContent="";if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ $("#auth-error").textContent="Enter a valid email address for this demo.";return;}if(pw.length<4){$("#auth-error").textContent="Use at least 4 characters to preview this form.";return;}if(mode==="register"&&!name){$("#auth-error").textContent="Please enter a display name.";return;}$("#auth-submit").disabled=true;$("#auth-submit").textContent="Opening your space…";setTimeout(()=>{safeWrite(STORE.profile,{name:name||email.split("@")[0],email});$("#auth-password").value="";$("#auth-submit").disabled=false;toast("Demo entry successful. No password was saved.");location.hash="#dashboard";},500);});
    $("#demo-entry").addEventListener("click",()=>{safeWrite(STORE.profile,{name:profile().name||"Alex",email:profile().email||"alex@example.com"});location.hash="#dashboard";});
  }
  function applyTheme(){document.body.classList.toggle("dark",!!prefs().dark);}
  function render() {
    stopBreath();applyTheme();header();footer();
    const route=location.hash||"#home";
    if(route.startsWith("#signin")||route.startsWith("#register"))signinPage();
    else if(route==="#dashboard")dashboard();
    else if(route==="#mood")moodPage();
    else if(route==="#journal")journalPage();
    else if(route.startsWith("#activities"))activitiesPage();
    else if(route==="#companion")companionPage();
    else if(route==="#settings")settingsPage();
    else landing();
    window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});
  }
  window.addEventListener("hashchange",render);
  render();
})();