/* render-page.js · วาดหน้าเว็บ: แถบเมนู ส่วนหัว คลิป ขั้นตอนการจัดงาน โพสต์ ผลประเมิน บทเรียน
   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */
"use strict";

/* ---------- วาดทั้งหน้า ---------- */
function setFavicon(){var f=STATE.imgs&&STATE.imgs.favicon; if(!f||!document.head) return; var l=document.querySelector('link[rel="icon"]'); if(!l){l=document.createElement("link"); l.rel="icon"; document.head.appendChild(l);} l.href=f.src;}
function render(){
  var BASE=STATE; document.documentElement.lang=LANG==="en"?"en":"th";
  try{ STATE=VS(); renderPage(); } finally { STATE=BASE; }
}
function navLinks(){return '<a href="#steps">'+L("ขั้นตอน","Steps")+'</a><a href="#event">'+L("วันงาน","Event day")+'</a><a href="#results">'+L("ผลลัพธ์","Results")+'</a><a href="#people">'+L("ทีมงาน","Team")+'</a><a href="#docs">'+L("เอกสาร","Documents")+'</a><a href="#faq">'+L("คำถาม","FAQ")+'</a>';}
function renderPage(){
  setFavicon();
  var m=STATE.meta, M=STATE.media||{}, h=[], playing=music&&!music.paused;
  var poster=STATE.imgs[M.poster]||STATE.imgs[m.hero.img];
  h.push('<div class="shell">');
  /* แถบเมนู */
  h.push('<nav class="nav" aria-label="'+L("เมนู","Menu")+'"><span class="brand">'+(STATE.imgs.mascot?'<img src="'+STATE.imgs.mascot.src+'" alt="">':'')+'<span>AI Agent Seminar</span></span>'+
    '<span class="navlinks">'+navLinks()+'</span>'+
    '<div class="navdrop" id="navdrop">'+navLinks()+'</div>'+
    '<span class="navright"><button class="pill sm menubtn" data-act="menu" aria-expanded="false" aria-controls="navdrop">☰ '+L("เมนู","Menu")+'</button>'+
    '<button class="pill sm langbtn" data-act="lang" aria-label="'+L("Switch to English","เปลี่ยนเป็นภาษาไทย")+'" title="'+L("Switch to English","เปลี่ยนเป็นภาษาไทย")+'">'+L("EN","TH")+'</button>'+
    '<button class="pill sm themebtn" data-act="theme" aria-label="'+L("สลับโหมดสว่าง/มืด","Toggle light/dark mode")+'" title="'+L("สลับโหมดสว่าง/มืด","Toggle light/dark mode")+'">'+(isDark()?"☀":"☾")+'</button>'+
    (M.music?'<button class="pill sm" data-act="music" aria-pressed="'+playing+'">'+musicLabel(playing)+'</button>':'')+
    '<span id="tools" class="toolbar"></span><a class="pill sm dark" href="#steps">'+L("ดูไทม์ไลน์","Timeline")+' <span class="arr">→</span></a></span></nav>');
  h.push('<div id="draftbanner"></div>');
  /* ส่วนหัว: ชื่องาน + คลิปสรุป */
  var vt=(m.video||{}).title||L("คลิปสรุปงาน","Event recap clip");
  h.push('<header class="hero"><div class="hero-copy"><div class="chips"><span class="chip"><i></i>'+esc(m.chip||"")+'</span><span class="badge">'+esc(m.badge||"")+'</span></div>'+
    '<div><h1>'+titleHtml(m.title)+'</h1><p class="lede">'+esc(m.lede)+'</p></div>'+
    '<div><div class="ctas"><a class="pill dark" href="#steps">'+L("ดูขั้นตอนการจัดงาน","See how we ran it")+' <span class="arr">→</span></a><a class="pill accent" href="#results">'+L("ดูผลประเมิน","See the results")+'</a></div>'+
    '<p class="fine">*'+esc(vt+((m.video||{}).note?" · "+m.video.note:""))+'</p>'+
    (editing?'<div class="edit-row" style="margin-top:10px"><button class="btn small" data-act="edit-meta">แก้ไขข้อมูลงาน</button></div>':'')+'</div></div>');
  h.push('<div class="hero-media">'+(M.video?'<video id="herovid" autoplay muted loop playsinline preload="auto" poster="'+(poster?poster.src:"")+'" src="'+M.video+'" aria-label="'+esc(vt)+'"></video><button class="soundbtn" data-act="unmute" aria-pressed="false">'+L("🔊 เปิดเสียงคลิป","🔊 Clip sound on")+'</button>':img(m.hero.img,"",m.hero.cap))+
    '<div class="statbar">'+m.stats.slice(0,3).map(function(s){return '<div><div class="n">'+esc(s.n)+'</div><div class="l">'+esc(s.l)+'</div></div>';}).join("")+'</div></div></header>');
  /* แถบชื่อโครงงานที่เลื่อนไปเรื่อย ๆ */
  var names=STATE.projects.map(function(q){return '<span>'+esc(q.name)+'</span><span aria-hidden="true">✦</span>';}).join("");
  h.push('<section class="marquee" aria-label="'+L("โครงงานที่นำเสนอ","Projects presented")+'"><div class="lab">'+L("โครงงาน 5 เรื่องที่นำเสนอในงาน","The 5 projects presented at the seminar")+'</div><div class="mq"><div class="mq-track">'+names+'<span aria-hidden="true" style="display:contents">'+names+'</span></div></div></section>');
  /* ทำไมต้องหัวข้อนี้ */
  if(STATE.why) h.push('<section class="sec why"><div><div class="eyebrow">'+esc(STATE.why.eyebrow)+'</div><h2>'+italicLast(STATE.why.head)+'</h2></div><p>'+esc(STATE.why.text)+'</p></section>');
  /* ขั้นตอนการจัดงาน */
  var allSteps=STATE.stages.map(function(s){return {id:s.id,no:s.no,title:s.title,short:s.short||s.intro,when:s.when};});
  allSteps.push({id:"lessons",no:"05",title:L("สรุปบทเรียน","Lessons learned"),short:L("สิ่งที่พบระหว่างเตรียมงาน และสิ่งที่จะทำต่างไปในครั้งหน้า","What we ran into while preparing, and what we will do differently next time"),when:L("หลังจบงาน","After the event")});
  h.push('<section class="sec" id="steps"><div class="sec-head"><div><div class="eyebrow">'+L("ขั้นตอนการทำงาน","How we worked")+'</div><h2 class="h2">'+L('5 ขั้น ตั้งแต่<span class="it">วางแผน</span>จนสรุปบทเรียน','5 steps, from <span class="it">planning</span> to lessons learned')+'</h2>'+
    '<p class="sec-lede">'+L("ขั้นตอนจริงที่กลุ่มใช้ตลอดงานสัมมนา กดแต่ละขั้นเพื่อดูรายละเอียดและรูปจากการทำงาน","The steps our group actually followed. Open each one for details and photos from the work.")+'</p></div></div><div class="steps">'+
    allSteps.map(function(s){return '<a class="step" href="#'+s.id+'"><span class="sn">Step-'+esc(s.no)+'</span><h3>'+esc(s.title)+'</h3><p>'+esc(s.short)+'</p><span class="wk">'+esc(s.when.split(" · ")[0])+'</span></a>';}).join("")+'</div></section>');
  STATE.stages.forEach(function(s){h.push(stageHtml(s));});
  h.push(lessonsHtml());
  h.push(teamHtml());
  h.push(docsHtml());
  h.push(faqHtml());
  /* แถบปิดท้าย */
  h.push('<section class="band" aria-label="'+L("ปิดท้าย","Closing")+'">'+(STATE.imgs.mascot?'<img class="mascot" src="'+STATE.imgs.mascot.src+'" alt="">':'')+
    '<div class="eyebrow" style="color:var(--on-dark-muted)">'+L("ขอบคุณที่ติดตาม","Thanks for reading")+'</div><h2>'+L('งานสัมมนาจบแล้ว แต่<span class="it">บทเรียน</span>ยังใช้ต่อได้','The seminar is over, but the <span class="it">lessons</span> carry on')+'</h2>'+
    '<p>'+esc(m.author)+' · '+esc(m.authorRole)+'</p>'+
    (M.video?'<button class="pill" data-act="watch">'+L("▶ ดูคลิปสรุปงานพร้อมเสียง","▶ Watch the recap with sound")+'</button>':'')+
    (musicCredit()?'<p style="font-size:13px">'+esc(musicCredit())+'</p>':'')+'</section>');
  h.push(footerHtml(m));
  h.push('</div>');
  root.innerHTML=h.join("");
  root.querySelectorAll(".rows").forEach(function(r){var mn=+r.dataset.min,mx=+r.dataset.max;r.querySelectorAll(".fill").forEach(function(f){f.style.width=Math.max(0,Math.min(100,(+f.dataset.v-mn)/(mx-mn)*100))+"%";});});
}
function musicLabel(on){return on?L("❚❚ หยุดเพลง","❚❚ Pause music"):L("♪ เปิดเพลง","♪ Play music");}
function musicCredit(){var mu=STATE.meta.music||{}; if(!mu.title) return ""; return L("เพลงประกอบ: ","Music: ")+mu.title+(mu.credit?" · "+mu.credit:"");}
function titleHtml(t){var i=t.indexOf("AI Agent"); if(i<0) return esc(t); return esc(t.slice(0,i))+'<span class="it">AI Agent</span>'+esc(t.slice(i+8));}
function italicLast(t){var w=t.split(" "); if(w.length<2) return esc(t); var last=w.pop(); return esc(w.join(" "))+' <span class="it">'+esc(last)+'</span>';}
function stageHtml(s){
  var h=['<section class="stage" id="'+s.id+'"><div class="stage-top"><span class="sn">Step-'+esc(s.no)+'</span><h2>'+esc(s.title)+'</h2><div class="when">'+esc(s.when)+'</div></div>'];
  h.push('<p class="stage-intro">'+esc(s.intro)+'</p>');
  if(s.posts.length){h.push('<ol class="log">');s.posts.forEach(function(p){h.push(postHtml(s,p));});h.push('</ol>');}
  if(editing) h.push('<button class="btn add-post" data-act="add" data-stage="'+s.id+'">＋ เพิ่มโพสต์ในขั้น'+esc(s.title)+'</button>');
  if(s.results) h.push(resultsHtml());
  h.push('</section>');
  return h.join("");
}
function photoCls(k){var d=STATE.imgs[k]; if(!d) return ""; if(isDoc(k)) return "doc"; return d.w/d.h>1.45?"wide":"";}
function galCls(p,k){var c=photoCls(k); if(c!=="wide") return c; return p.photos.every(function(ph){return photoCls(ph.img)==="wide";})?"wide":"";}
function postHtml(s,p){
  var n=p.photos.length, cls=n>=3&&n%2?"gallery n3":(n===1?"gallery n1":"gallery");
  var h=['<li class="entry" id="'+esc(p.id)+'"><div class="t">'+esc(p.time)+(p.sub?'<small>'+esc(p.sub)+'</small>':'')+'</div><div class="body">'];
  h.push('<h3>'+(p.tag?'<span class="tag">'+esc(p.tag)+'</span>':'')+esc(p.title)+'</h3>'+paras(p.text));
  if(n) h.push('<div class="'+cls+'">'+p.photos.map(function(ph){return '<figure>'+img(ph.img,galCls(p,ph.img),ph.cap)+(ph.cap?'<figcaption>'+esc(ph.cap)+'</figcaption>':'')+'</figure>';}).join("")+'</div>');
  if(p.projects) h.push('<div class="rail" role="list" aria-label="'+L("โครงงานทั้ง 5 เรื่อง","All 5 projects")+'" tabindex="0">'+STATE.projects.map(function(q){return '<article class="card2" role="listitem">'+img(q.img,"",q.name)+'<div><b>'+esc(q.name)+'</b><span>'+esc(q.by)+'</span><span class="score">x̄ '+esc(q.mean)+' · S.D. '+esc(q.sd)+'</span></div></article>';}).join("")+'</div>');
  if(editing) h.push('<div class="edit-row"><button class="btn small" data-act="edit" data-stage="'+s.id+'" data-id="'+esc(p.id)+'">แก้ไขโพสต์</button></div>');
  h.push('</div></li>');
  return h.join("");
}
function bars(rows,total,min,max,label){
  var h=['<div class="rows" data-min="'+min+'" data-max="'+max+'">'];
  rows.forEach(function(r){h.push('<div class="row"><div class="lab">'+esc(r[0])+'</div><div class="track"><div class="fill" data-v="'+r[1]+'"></div></div><div class="v">'+r[1].toFixed(2)+' <small>±'+r[2].toFixed(2)+'</small></div></div>');});
  if(total) h.push('<div class="row total"><div class="lab">'+label+'</div><div class="track"><div class="fill" data-v="'+total[0]+'"></div></div><div class="v">'+total[0].toFixed(2)+' <small>±'+total[1].toFixed(2)+'</small></div></div>');
  h.push('</div><div class="axis"><span></span><div class="ticks">');
  for(var i=0;i<=5;i++){var v=min+(max-min)*i/5;h.push('<span style="left:'+(i*20)+'%">'+v.toFixed(2)+'</span>');}
  h.push('</div><span></span></div>');
  return h.join("");
}
function ul(a){return '<ul class="list">'+a.map(function(x){return '<li>'+esc(x)+'</li>';}).join("")+'</ul>';}
function resultsHtml(){
  var R=STATE.results, yrMax=Math.max.apply(null,R.years.map(function(y){return y[1];}));
  return '<div id="results" style="scroll-margin-top:90px"><div class="res">'+
    '<div class="panel" role="figure" aria-label="'+L("ความพึงพอใจต่อการเข้าร่วมสัมมนา","Satisfaction with the seminar")+'"><h3>'+L("ความพึงพอใจต่อการเข้าร่วมสัมมนา","Satisfaction with the seminar")+'</h3><div class="sub">'+L("ค่าเฉลี่ยจากคะแนนเต็ม 5 · ผู้ตอบ 57 คน · แกนเริ่มที่ 4.50 เพื่อให้เห็นความต่างระหว่างข้อ","Mean score out of 5 · 57 respondents · axis starts at 4.50 to show the differences between items")+'</div>'+bars(R.satisfaction,R.satisfactionTotal,4.5,5,L("ภาพรวม","Overall"))+'</div>'+
    '<div class="score-card"><div class="eyebrow" style="color:var(--on-dark-muted)">'+L("ความพึงพอใจโดยรวม","Overall satisfaction")+'</div><div><div class="big">'+R.satisfactionTotal[0].toFixed(2)+'<small>/ 5</small></div><div class="meter" role="img" aria-label="'+R.satisfactionTotal[0].toFixed(2)+' / 5"><span style="width:'+(R.satisfactionTotal[0]/5*100).toFixed(1)+'%"></span></div><p>'+L("จากคะแนนเต็ม 5 · ผู้ตอบ 57 คน (ร้อยละ 89.06) · ระดับมากที่สุดทุกข้อ","Out of 5 · 57 respondents (89.06%) · every item rated at the highest level")+'</p></div></div></div>'+
    (STATE.quotes&&STATE.quotes.length?'<div class="quotes">'+STATE.quotes.map(function(q){return '<figure class="quote" style="margin:0">“'+esc(q)+'”<span>'+L("ผู้เข้าร่วม · คำตอบจากแบบประเมิน","Participant · survey answer"+(LANG==="en"?" (translated)":""))+'</span></figure>';}).join("")+'</div>':'')+
    '<div class="panel" style="margin-top:14px" role="figure" aria-label="'+L("ผลการประเมินการนำเสนอโครงงาน","Project presentation scores")+'"><h3>'+L("การนำเสนอโครงงานทั้ง 5 เรื่อง","All 5 project presentations")+'</h3><div class="sub">'+L("ค่าเฉลี่ยรวม 5 ข้อของแต่ละโครงงาน · แกนเริ่มที่ 4.50","Mean of 5 items per project · axis starts at 4.50")+'</div>'+bars(R.projectsChart,R.projectsTotal,4.5,5,L("ภาพรวมโครงงาน","All projects"))+'</div>'+
    '<div class="three"><div class="panel mini"><h3>'+L("ผู้เข้าร่วมแยกตามชั้นปี","Participants by year")+'</h3><div class="rows" data-min="0" data-max="'+yrMax+'">'+R.years.map(function(y){return '<div class="row"><div class="lab">'+esc(y[0])+'</div><div class="track"><div class="fill" data-v="'+y[1]+'"></div></div><div class="v">'+y[1]+' <small>'+L("คน","people")+'</small></div></div>';}).join("")+'</div><p class="note">'+esc(R.yearsNote)+'</p></div>'+
    '<div class="panel"><h3>'+L("สิ่งที่ผู้เข้าร่วมประทับใจ","What participants liked")+'</h3>'+ul(R.liked)+'</div><div class="panel"><h3>'+L("ข้อเสนอแนะจากผู้เข้าร่วม","Participants' suggestions")+'</h3>'+ul(R.improve)+'</div></div></div>';
}
function lessonsHtml(){
  var L2=STATE.lessons, n=Math.max(L2.found.length,L2.next.length), rows=[];
  for(var i=0;i<n;i++) rows.push('<div class="cmp-row"><div class="no">'+String(i+1).padStart(2,"0")+'</div><div>'+esc(L2.found[i]||"")+'</div><div class="next">'+esc(L2.next[i]||"")+'</div></div>');
  return '<section class="sec" id="lessons"><div class="sec-head"><div><div class="eyebrow">Step-05 · '+L("สรุปบทเรียน","Lessons learned")+'</div><h2 class="h2">'+L('สิ่งที่ได้เรียนรู้จากการเป็น<span class="it">ผู้ประสานงาน</span>','What I learned as the <span class="it">coordinator</span>')+'</h2></div></div>'+
    '<div class="role">'+(STATE.imgs.mascot?'<img src="'+STATE.imgs.mascot.src+'" alt="">':'<span></span>')+'<p>'+esc(L2.role)+'</p></div>'+
    '<div class="cmp"><div class="cmp-row cmp-head"><div></div><div>'+L("สิ่งที่พบระหว่างเตรียมงาน","What we ran into")+'</div><div class="next">'+L("ครั้งหน้าจะทำ","Next time")+'</div></div>'+rows.join("")+'</div>'+
    (editing?'<div class="edit-row" style="margin-top:12px"><button class="btn small" data-act="edit-lessons">แก้ไขบทเรียน</button></div>':'')+'</section>';
}
