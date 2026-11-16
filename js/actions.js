/* actions.js  สิ่งที่เกิดขึ้นเมื่อกดปุ่ม -> เปิดเอกสาร ดูรูป โหมดมืด เปลี่ยนภาษา เมนูมือถือ คลิป เพลง
   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */
"use strict";

/* กันคนคลิกขวาหรือลากรูปไปเซฟง่าย ๆ (กันได้แค่ระดับเบื้องต้น) */
document.addEventListener("contextmenu",function(e){if(e.target&&e.target.tagName==="IMG") e.preventDefault();});
document.addEventListener("dragstart",function(e){if(e.target&&e.target.tagName==="IMG") e.preventDefault();});

/*  ปุ่มต่าง ๆ ในหน้า  */
document.addEventListener("click",function(e){
  var b=e.target.closest&&e.target.closest("[data-doc]"); if(!b) return;
  var d=(VS().docs||[])[+b.getAttribute("data-doc")]; if(!d) return;
  var m=openModal('<h2>'+esc(d.title)+'</h2><p class="note" style="margin:0">'+esc(d.note)+(d.total>d.pages.length?L(' · แสดง '+d.pages.length+' จาก '+d.total+' หน้า',' · showing '+d.pages.length+' of '+d.total+' pages'):'')+'</p><div class="docview">'+d.pages.map(function(k,n){var p=STATE.imgs[k]; return p?'<img src="'+p.src+'" alt="'+esc(d.title)+' หน้า '+(n+1)+'">':'';}).join("")+'</div><div class="actions"><div></div><div><button class="btn" id="doc-close">'+L("ปิดเอกสาร","Close")+'</button></div></div>');
  m.querySelector("#doc-close").onclick=function(){m.remove();};
});
document.addEventListener("click",function(e){
  var im=e.target.closest&&e.target.closest(".gallery img"); if(!im) return;
  var cap=im.closest("figure"); cap=cap&&cap.querySelector("figcaption");
  var m=openModal('<div class="lightbox"><img src="'+im.src+'" alt="'+esc(im.alt)+'"></div>'+(cap?'<p class="note" style="margin:0">'+esc(cap.textContent)+'</p>':'')+'<div class="actions"><div></div><div><button class="btn" id="lb-close">'+L("ปิดรูป","Close")+'</button></div></div>');
  m.querySelector("#lb-close").onclick=function(){m.remove();};
});

document.addEventListener("click",function(e){
  var b=e.target.closest("[data-act]"); if(!b) return;
  var a=b.getAttribute("data-act");
  if(a==="theme") setTheme(isDark()?"light":"dark");
  else if(a==="lang") setLang(LANG==="en"?"th":"en");
  else if(a==="menu"){var nv=b.closest(".nav"); var o=nv.classList.toggle("open"); b.setAttribute("aria-expanded",String(o));}
  else if(a==="unmute"){var hv=document.getElementById("herovid"); if(hv){hv.muted=!hv.muted; if(!hv.muted){if(music&&!music.paused) music.pause(); hv.currentTime=0; hv.play().catch(function(){});} b.textContent=hv.muted?L("🔊 เปิดเสียงคลิป","🔊 Clip sound on"):L("🔇 ปิดเสียงคลิป","🔇 Clip sound off"); b.setAttribute("aria-pressed",String(!hv.muted));}}
  else if(a==="inline-play"){
    if(music&&!music.paused) music.pause();
    var bg=root.querySelector("video.bg"); if(bg) bg.pause();
    var v=document.createElement("video"); v.controls=true; v.autoplay=true; v.playsInline=true; v.src=STATE.media.video;
    v.setAttribute("aria-label",(STATE.meta.video||{}).title||"คลิปสรุปงาน");
    b.replaceWith(v); v.focus(); v.play().catch(function(){});
    v.addEventListener("ended",function(){if(bg) bg.play().catch(function(){});});
  }
  else if(a==="watch"){
    if(music&&!music.paused){music.pause();}
    var vm=openModal('<div class="video-modal"><video controls autoplay playsinline src="'+STATE.media.video+'"></video></div>'+(musicCredit()?'<p class="note" style="margin-top:0">'+esc(musicCredit())+'</p>':'')+'<div class="actions"><div></div><div><button class="btn" id="v-close">ปิดคลิป</button></div></div>');
    var bgv=document.getElementById("herovid"); if(bgv) bgv.pause();
    function closeV(){vm.remove(); if(bgv) bgv.play().catch(function(){});}
    vm.querySelector("#v-close").onclick=closeV; vm.addEventListener("click",function(ev){if(ev.target===vm) closeV();});
  }
  else if(a==="music"){
    if(!music){music=new Audio(STATE.media.music);music.loop=true;music.volume=.5;}
    if(music.paused){var v=document.getElementById("herovid"); if(v){v.muted=true; var sb=root.querySelector("[data-act=unmute]"); if(sb) sb.textContent=L("🔊 เปิดเสียงคลิป","🔊 Clip sound on");} music.play().catch(function(){toast("เบราว์เซอร์นี้เล่นเพลงไม่ได้");});} else music.pause();
    var mb=root.querySelector("[data-act=music]"); if(mb){var on=!music.paused; mb.textContent=musicLabel(on); mb.setAttribute("aria-pressed",on);}
    if(musicCredit()&&!music.paused) toast(musicCredit());
  }
});
