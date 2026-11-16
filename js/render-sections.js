/* render-sections.js · วาดส่วนท้าย ๆ: คำถามที่พบบ่อย ข่าว เอกสาร และท้ายหน้า (footer)
   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */
"use strict";

function faqHtml(){
  if(!STATE.faq||!STATE.faq.length) return "";
  return '<section class="sec" id="faq"><div class="sec-head"><div><div class="eyebrow">'+L("คำถามที่พบบ่อย","FAQ")+'</div><h2 class="h2">'+L('ตอบให้<span class="it">ตรง</span>ประเด็น','Straight <span class="it">answers</span>')+'</h2></div></div><div class="faq">'+
    STATE.faq.map(function(q,i){return '<details'+(i===0?' open':'')+'><summary>'+esc(q[0])+'</summary><p>'+esc(q[1])+'</p></details>';}).join("")+'</div></section>';
}
function newsHtml(){
  var N=STATE.news||[], groups=[];
  N.forEach(function(n){var g=n.group||L("ข่าวประชาสัมพันธ์","News coverage"), x=groups.filter(function(y){return y.name===g;})[0]; if(!x){x={name:g,items:[]};groups.push(x);} x.items.push(n);});
  return groups.map(function(g){return '<h3 class="docs-g">'+esc(g.name)+'</h3><div class="newslinks">'+g.items.map(function(n){return '<a class="newslink" href="'+esc(n.url)+'" target="_blank" rel="noopener"><span class="nl-t">'+esc(n.title)+'</span><span class="nl-s">'+esc(n.source)+' · '+esc(n.site||L("เปิดลิงก์","Open link"))+' ↗</span></a>';}).join("")+'</div>';}).join("");
}
function docsCards(){
  var D=STATE.docs||[], groups=[];
  D.forEach(function(d,i){var g=groups.filter(function(x){return x.name===d.group;})[0]; if(!g){g={name:d.group,items:[]};groups.push(g);} g.items.push(i);});
  return groups.map(function(g){return '<h3 class="docs-g">'+esc(g.name)+'</h3><div class="docs">'+g.items.map(function(i){var d=D[i], p=STATE.imgs[d.pages[0]];
    return '<button class="doc" data-doc="'+i+'">'+(p?'<img src="'+p.src+'" alt="'+L("หน้าแรกของ ","First page of ")+esc(d.title)+'" loading="lazy">':'')+'<span class="dt">'+esc(d.title)+'</span><span class="dn">'+esc(d.note)+' · '+d.pages.length+' '+L("หน้า",d.pages.length>1?"pages":"page")+'</span></button>';}).join("")+'</div>';}).join("");
}
function docsHtml(){
  if(!(STATE.docs||[]).length&&!(STATE.news||[]).length) return "";
  return '<section class="sec" id="docs"><div class="sec-head"><div><div class="eyebrow">'+L("เอกสารประกอบการจัดงาน","Event documents")+'</div><h2 class="h2">'+L('สำเนาตัวอย่างเอกสารที่<span class="it">เขียนขึ้นจริง</span>ระหว่างเตรียมงาน ','Documents we <span class="it">actually wrote</span> while preparing')+'</h2><p class="sec-lede">'+L("หนังสือเชิญ กำหนดการ และแบบฟอร์มลงทะเบียนที่ทีม Organize จัดทำและใช้จริงในงานนี้ กดที่เอกสารเพื่อดูทุกหน้า เบอร์โทรและอีเมลส่วนตัวในเอกสารถูกปิดไว้","Invitation letters, schedules and registration forms the Organize team made and used for this event. Open a document to see every page. The documents themselves are in Thai, and personal phone numbers and e-mail addresses are hidden.")+'</p></div></div>'+docsCards()+newsHtml()+'</section>';
}

document.addEventListener("click",function(e){var a=e.target.closest&&e.target.closest(".navdrop a"); if(!a) return; var nv=a.closest(".nav"); if(nv) nv.classList.remove("open"); var mb=document.querySelector("[data-act=menu]"); if(mb) mb.setAttribute("aria-expanded","false");});

/* ---------- ท้ายหน้า (footer) ---------- */
function fIco(d){return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+d+'</svg>';}
var FI={
  steps:'<path d="M9 6h11M9 12h11M9 18h11"/><circle cx="4.5" cy="6" r="1"/><circle cx="4.5" cy="12" r="1"/><circle cx="4.5" cy="18" r="1"/>',
  event:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  results:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  people:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.6-3.4 3.3-5.5 6.5-5.5s5.9 2.1 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c1.9.8 3.1 2.6 3.5 5.2"/>',
  docs:'<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
  faq:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9.2a2.6 2.6 0 0 1 5 .9c0 1.7-2.5 2.3-2.5 3.9M12 17h.01"/>',
  game:'<rect x="2" y="7" width="20" height="11" rx="5"/><path d="M7 10.5v4M5 12.5h4M15.5 12h.01M18 14h.01"/>',
  form:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3"/>',
  eval:'<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z"/>',
  port:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
  top:'<path d="M12 19V5M5 12l7-7 7 7"/>'};
function footerHtml(m){
  var me=profOf(m.author)||{}, fb=(me.contacts||[]).filter(function(c){return /facebook/i.test(c[1]);})[0];
  var news=STATE.news||[]; function nu(re){var n=news.filter(function(x){return re.test(x.url||"");})[0]; return n&&n.url;}
  var bg=m.hero&&STATE.imgs[m.hero.img];
  function col(h,links){links=links.filter(function(x){return x[0];}); return links.length?'<div class="foot-col"><div class="foot-h">'+h+'</div><ul>'+links.map(function(x){var ext=/^https?:/.test(x[0]); return '<li><a href="'+esc(x[0])+'"'+(ext?' target="_blank" rel="noopener"':'')+'>'+esc(x[1])+'</a></li>';}).join("")+'</ul></div>':'';}
  function ic(href,ico,label,attr){return href?'<a class="fs" href="'+esc(href)+'" '+(attr||'target="_blank" rel="noopener"')+' aria-label="'+esc(label)+'" title="'+esc(label)+'">'+ico+'</a>':'';}
  var top=L("กลับขึ้นด้านบน","Back to top");
  return '<footer class="foot">'+(bg?'<img class="foot-bg" src="'+bg.src+'" alt="">':'')+'<div class="foot-in"><div class="foot-grid">'+
    '<div class="foot-col foot-id"><div class="foot-h">AI Agent Seminar</div><p>'+L("E-Report ของ มาย ผู้ประสานงานทีม Organize กลุ่มที่ 1 Sigma Boys","E-Report by May, coordinator of the Organize team, Group 1 Sigma Boys")+'</p><p>'+L("16 ก.ย. 2569 · อาคาร 26 มรภ.เพชรบุรี","16 Sep 2026 · Building 26, PBRU")+'</p></div>'+
    col(L("เรื่องราวของงาน","The story"),[["#steps",L("ขั้นตอนการจัดงาน","How we ran it")],["#event",L("วันจัดงาน","Event day")],["#results",L("ผลการประเมิน","Results")]])+
    col(L("ข้อมูลเพิ่มเติม","More"),[["#people",L("ทีมงาน","Team")],["#docs",L("เอกสารประกอบ","Documents")],["#faq",L("คำถามที่พบบ่อย","FAQ")]])+
    col(L("ระบบที่ใช้ในงาน","Event links"),[[nu(/escape-fox/),L("เกม Escape Fox หนีหมาป่า","Escape Fox game")],[nu(/F7wKNYqdKrCKf12J7/),L("แบบฟอร์มลงทะเบียน","Registration form")],[nu(/aczeHCHrpVhEK2Ae6/),L("แบบประเมินการจัดกิจกรรม","Evaluation form")]])+
    '<div class="foot-col"><div class="foot-h">'+L("ติดต่อ","Contact")+'</div><ul>'+(me.portfolio?'<li><a href="'+esc(me.portfolio)+'" target="_blank" rel="noopener">'+L("พอร์ตโฟลิโอของมาย","May\'s portfolio")+'</a></li>':'')+'</ul>'+
      '<div class="foot-soc">'+ic(fb&&fb[1],ICON_FB,"Facebook")+ic(me.portfolio,fIco(FI.port),L("พอร์ตโฟลิโอของมาย","May's portfolio"))+ic("#",fIco(FI.top),top,'data-act="totop"')+'</div></div>'+
    '</div><div class="foot-bar"><span>© '+L("2569","2026")+' '+esc(m.author)+' · '+L("สงวนลิขสิทธิ์","All rights reserved")+'</span><span>'+L("รายวิชาสัมมนาวิทยาการคอมพิวเตอร์ · คณะเทคโนโลยีสารสนเทศ มรภ.เพชรบุรี","Computer Science Seminar course · Faculty of IT, Phetchaburi Rajabhat University")+'</span></div>'+
    '<p class="copyright foot-legal">'+L('ห้ามคัดลอก ดัดแปลง เผยแพร่ซ้ำ หรือนำเนื้อหา ภาพ คลิป และการออกแบบหน้าเว็บนี้ไปใช้โดยไม่ได้รับอนุญาต · ภาพและเอกสารมาจากการทำงานของกลุ่มที่ 1 และกลุ่มที่ 3 ใช้เพื่อการศึกษาในรายวิชาเท่านั้น',
      'The text, photos, clip and design of this page may not be copied, adapted, republished or reused without permission · Photos and documents come from the work of Group 1 and Group 3 and are used for this course only')+'</p></div></footer>';
}
document.addEventListener("click",function(e){var t=e.target.closest&&e.target.closest("[data-act=totop]"); if(!t) return; e.preventDefault(); window.scrollTo({top:0,behavior:"smooth"});});
