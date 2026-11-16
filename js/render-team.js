/* render-team.js · วาดส่วนทีมงาน: วิทยากร การ์ดออแกไนซ์ (กดแล้วขยาย) ผู้ช่วยงาน และหน้าต่างโปรไฟล์
   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */
"use strict";

function teamHtml(){
  var orgs=STATE.team[0]||{people:[]}, speakers=STATE.team[1], rest=STATE.team.slice(2);
  function grp(g,cls){return g?'<div class="tg '+(cls||'')+'"><h4>'+esc(g.head)+'</h4><div class="orgs">'+g.people.map(teamCard).join("")+'</div></div>':'';}
  return '<section class="sec" id="people"><div class="sec-head"><div><div class="eyebrow">'+L("คนเบื้องหลังงาน","The people behind it")+'</div><h2 class="h2">'+L('ทีมที่ทำให้งานนี้<span class="it">เกิดขึ้นจริง</span>','The team that <span class="it">made it happen</span>')+'</h2></div></div>'+
    (speakers?'<div class="speak-block">'+grp(speakers,'speakers')+'</div>':'')+
    '<div class="org-block"><div class="org-head"><h3>'+L("ทีม Organize","Organize team")+'</h3><span>'+L("กลุ่มที่ 1 Sigma Boys · กดการ์ดเพื่อขยาย","Group 1 Sigma Boys · tap a card to expand it")+'</span></div>'+
    '<div class="org-acc" id="org-acc">'+orgs.people.map(orgPanel).join("")+'</div></div>'+
    '<div class="team-grid rest">'+rest.map(function(g){return grp(g);}).join("")+'</div></section>';
}
/* ---------- การ์ดออแกไนซ์: กดแล้วขยายในที่เดิม ---------- */
var orgCur=0;
var ICON_PORT='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/></svg>';
var ICON_FB='<svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="M14 8.5V6.8c0-.8.5-1 .9-1h2.3V2.1L14 2c-3.5 0-4.3 2.6-4.3 4.3v2.2H7.5v3.8h2.2V22H14v-9.7h2.9l.4-3.8H14z"/></svg>';
var THEME_FALLBACK={L:{a:"#F3F6FC",b:"#E3E9FF",acc:"#2952F5",on:"#FFFFFF",ink:"#0D1530",sub:"#58627E",line:"#2952F5"},D:{a:"#0B0B0B",b:"#1B2550",acc:"#A9B8FF",on:"#0D1530",ink:"#FFFFFF",sub:"#C9D3FF",line:"#7B8BC4"}};
/* การ์ดวิทยากรและผู้ช่วยงาน: รูปสี่เหลี่ยม + ไอคอน Facebook */
function teamCard(q){
  var p=profOf(q[0])||{}, ph=p.photo&&STATE.imgs[p.photo], fb=(p.contacts||[]).filter(function(c){return /facebook/i.test(c[1]);})[0], nk=nick(q[0]);
  return '<div class="pc"><button class="pc-open" data-prof="'+esc(baseName(q[0]))+'"><span class="pc-ph">'+(ph?'<img src="'+ph.src+'" alt="">':'<span>'+esc((nk||baseName(q[0]).replace(/^(นางสาว|นาย|นาง)/,"")).slice(0,2))+'</span>')+'</span>'+
    '<span class="pc-t">'+(nk?'<b>'+esc(nk)+'</b>':'')+'<span class="pc-nm">'+esc(baseName(q[0]))+'</span><small>'+esc(q[1])+'</small></span></button>'+
    (fb?'<a class="pc-fb" href="'+esc(fb[1])+'" target="_blank" rel="noopener" aria-label="Facebook '+esc(nk||baseName(q[0]))+'" title="Facebook">'+ICON_FB+'</a>':'')+'</div>';
}
function themeOf(n){var p=profOf(n), t=(p&&p.theme)||THEME_FALLBACK; return t[isDark()?"D":"L"]||t.D||t;}
function themeVars(n){var t=themeOf(n); return "--a:"+t.a+";--b:"+t.b+";--b2:"+(t.b2||t.b)+";--acc:"+t.acc+";--on:"+t.on+";--ink:"+t.ink+";--sub:"+t.sub+";--line:"+t.line;}
function roleParts(r){var i=String(r).indexOf(" · "); return i<0?[r,""]:[r.slice(0,i),r.slice(i+3)];}
function cutImg(n){var p=profOf(n), k=p&&(p.cutout||p.photo), d=k&&STATE.imgs[k]; return d?'<img src="'+d.src+'" alt="'+esc(baseName(n))+'">':'';}
function spotInner(person,isMe){
  if(!person) return "";
  var p=profOf(person[0])||{}, r=roleParts(person[1]), fb=(p.contacts||[]).filter(function(c){return /facebook/i.test(c[1]);})[0];
  var av=p.avatar&&STATE.imgs[p.avatar];
  return '<div class="spot-in"><div class="spot-ph"><span class="circ">'+cutImg(person[0])+'</span>'+(av?'<span class="spot-ava has"><img src="'+av.src+'" alt="'+L("อวาตาร์ของ ","Avatar of ")+esc(nick(person[0]))+'"></span>':'')+'</div><div class="spot-tx">'+
    '<span class="spot-pos">'+esc(r[0])+'</span><div class="spot-nk">'+esc(nick(person[0])||baseName(person[0]))+'</div>'+
    '<div><div class="spot-nm">'+esc(baseName(person[0]))+'</div>'+(r[1]?'<div class="spot-sub">'+esc(r[1])+'</div>':'')+(isMe?'<div class="spot-sub">'+L("ผู้จัดทำ E-Report นี้","Author of this E-Report")+'</div>':'')+'</div>'+
    (p.feeling?'<p class="spot-q">“'+esc(p.feeling)+'”</p>':'')+
    (p.improve?'<p class="spot-imp"><b>'+L("อยากปรับ:","Next time:")+'</b> '+esc(p.improve)+'</p>':'')+
    '<div class="spot-btns">'+(p.portfolio?'<a class="sb ic main" href="'+esc(p.portfolio)+'" target="_blank" rel="noopener" aria-label="'+L("ดูพอร์ตโฟลิโอ","View portfolio")+'" title="'+L("ดูพอร์ตโฟลิโอ","View portfolio")+'">'+ICON_PORT+'</a>':'')+
    (fb?'<a class="sb ic" href="'+esc(fb[1])+'" target="_blank" rel="noopener" aria-label="Facebook" title="Facebook">'+ICON_FB+'</a>':'')+'</div></div></div>';
}
function orgPanel(q,i){
  var open=i===orgCur, nk=nick(q[0])||baseName(q[0]);
  return '<div class="op'+(open?' open':'')+'" style="'+themeVars(q[0])+'">'+
    '<button class="op-mini" data-org="'+i+'" aria-expanded="'+open+'" aria-label="'+L("ขยายการ์ดของ ","Expand ")+esc(nk)+'"'+(open?' tabindex="-1"':'')+'>'+
      '<span class="circ">'+cutImg(q[0])+'</span><span class="op-label"><b>'+esc(nk)+'</b><small>'+esc(roleParts(q[1])[0])+'</small></span><span class="op-plus" aria-hidden="true">+</span></button>'+
    '<div class="op-full"'+(open?'':' aria-hidden="true"')+'>'+spotInner(q,i===0)+'</div></div>';
}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-org]"); if(!b) return;
  var acc=document.getElementById("org-acc"); if(!acc) return;
  orgCur=+b.getAttribute("data-org");
  acc.querySelectorAll(".op").forEach(function(el,i){
    var open=i===orgCur, mini=el.querySelector(".op-mini"), full=el.querySelector(".op-full");
    el.classList.toggle("open",open); mini.setAttribute("aria-expanded",String(open));
    if(open){mini.setAttribute("tabindex","-1"); full.removeAttribute("aria-hidden");} else {mini.removeAttribute("tabindex"); full.setAttribute("aria-hidden","true");}
  });
  if(window.innerWidth<=760){var op=acc.querySelectorAll(".op")[orgCur]; setTimeout(function(){op.scrollIntoView({block:"nearest",behavior:"smooth"});},380);}
});

/* ---------- หน้าต่างโปรไฟล์ (ข้อมูลอยู่ใน state.js ส่วน profiles ใช้ชื่อไทยไม่มีชื่อเล่นเป็นตัวค้นหา) ---------- */
function baseName(n){return String(n).replace(/\s*\(.*\)\s*$/,"");}
function nick(n){var m=String(n).match(/\(([^)]+)\)\s*$/); return m?m[1]:"";}
function profOf(n){var P=STATE.profiles||{}; return P[baseName(n)]||null;}
function hasProfile(n){var p=profOf(n); return !!(p&&(p.photo||p.feeling||p.improve||(p.contacts||[]).length));}
function avatar(n,size){var p=profOf(n), ph=p&&p.photo&&STATE.imgs[p.photo];
  return '<span class="ava'+(size?" "+size:"")+'">'+(ph?'<img src="'+ph.src+'" alt="">':'<span>'+esc((nick(n)||baseName(n).replace(/^(นางสาว|นาย|นาง)/,"")).slice(0,2))+'</span>')+'</span>';}
function orgCard(p){return '<button class="org" data-prof="'+esc(baseName(p[0]))+'">'+avatar(p[0])+'<span class="org-t"><b>'+esc(p[0])+'</b><small>'+esc(p[1])+'</small></span><span class="org-go" aria-hidden="true">→</span></button>';}
function profileHtml(name){
  var V=VS(), all=[]; V.team.forEach(function(g){g.people.forEach(function(p){all.push(p);});});
  var person=all.filter(function(p){return baseName(p[0])===name;})[0]; if(!person) return "";
  var BASE=STATE; STATE=V; try{
    var p=profOf(person[0])||{}, c=(p.contacts||[]);
    return '<div class="prof">'+avatar(person[0],"xl")+'<div class="prof-id"><h2>'+esc(person[0])+'</h2><p class="note" style="margin:0">'+esc(person[1])+'</p></div></div>'+
      (p.feeling?'<div class="prof-sec"><h4>'+L("ความรู้สึกที่ได้ทำงานร่วมกัน","How working together felt")+'</h4><blockquote class="prof-q">“'+esc(p.feeling)+'”</blockquote></div>':'')+
      (p.improve?'<div class="prof-sec"><h4>'+L("อยากปรับตรงไหนในครั้งหน้า","What I'd improve next time")+'</h4><p>'+esc(p.improve)+'</p></div>':'')+
      (c.length?'<div class="prof-sec"><h4>'+L("ช่องทางติดต่อ","Contact")+'</h4><ul class="prof-c">'+c.map(function(x){return '<li><span>'+esc(x[0])+'</span>'+(/^https:\/\//.test(x[1])?'<a href="'+esc(x[1])+'" target="_blank" rel="noopener">'+esc(x[1].replace(/^https:\/\/(www\.)?/,"").replace(/\/$/,""))+' ↗</a>':'<b>'+esc(x[1])+'</b>')+'</li>';}).join("")+'</ul></div>':'')+
      (!p.feeling&&!p.improve&&!c.length?'<p class="note">'+L("ยังไม่ได้เพิ่มข้อมูลโปรไฟล์","Profile details coming soon")+'</p>':'');
  } finally { STATE=BASE; }
}
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-prof]"); if(!b) return;
  var m=openModal(profileHtml(b.getAttribute("data-prof"))+'<div class="actions"><div></div><div><button class="btn" id="prof-close">'+L("ปิด","Close")+'</button></div></div>');
  m.querySelector("#prof-close").onclick=function(){m.remove();};
});
