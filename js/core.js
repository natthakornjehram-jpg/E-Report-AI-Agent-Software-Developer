/* core.js · ค่าเริ่มต้น เครื่องมือเล็ก ๆ ที่ไฟล์อื่นใช้ร่วมกัน โหมดมืด และภาษา
   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */
"use strict";

var STATE = SITE_STATE;                         // เนื้อหาทั้งหมด จาก data/state.js
var editing = false;                            // บน GitHub แก้ไขหน้าเว็บไม่ได้ ค่านี้เป็น false ตลอด
var music = null;                               // เพลงประกอบ (สร้างตอนกดปุ่มเปิดเพลงครั้งแรก)
var root = document.getElementById("root");    // กล่องที่ทั้งหน้าเว็บถูกวาดลงไป

/* ---------- เครื่องมือเล็ก ๆ: กันอักขระพิเศษ แปลงข้อความเป็นย่อหน้า สร้างแท็กรูป ---------- */
function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c];});}
function paras(t){return String(t||"").split(/\n\s*\n/).filter(function(x){return x.trim();}).map(function(x){return "<p>"+esc(x.trim()).replace(/\n/g,"<br>")+"</p>";}).join("");}
function img(key, cls, alt){var d=STATE.imgs[key]; if(!d) return ""; return '<img src="'+d.src+'" width="'+d.w+'" height="'+d.h+'" alt="'+esc(alt||"")+'" loading="lazy"'+(cls?' class="'+cls+'"':"")+'>';}
function isDoc(key){var d=STATE.imgs[key]; return d && d.h > d.w*1.15 && (key==="letter"||key==="regform"||d.doc);}
function uid(){return "u"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}

/* ---------- โหมดสว่าง / มืด (จำค่าไว้ในเบราว์เซอร์ของคนดู) ---------- */
function isDark(){var a=document.documentElement.getAttribute("data-theme"); if(a) return a==="dark"; return !!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches);}
function setTheme(v){document.documentElement.setAttribute("data-theme",v); try{localStorage.setItem("er-theme",v);}catch(e){}
  var b=document.querySelector("[data-act=theme]"); if(b) b.textContent=v==="dark"?"☀":"☾"; if(typeof render==="function"&&window.root) render();}
(function(){try{var v=localStorage.getItem("er-theme"); if(v==="dark"||v==="light") document.documentElement.setAttribute("data-theme",v);}catch(e){}})();
try{matchMedia("(prefers-color-scheme: dark)").addEventListener("change",function(){if(!document.documentElement.getAttribute("data-theme")&&window.root) render();});}catch(e){}
/* ---------- ภาษา: ต้นฉบับเป็นไทย ภาษาอังกฤษดึงจาก data/english.js ---------- */
var LANG="th";
(function(){try{var v=localStorage.getItem("er-lang"); if(v==="en"||v==="th") LANG=v;}catch(e){}})();
function L(th,en){return LANG==="en"?en:th;}
function setLang(v){LANG=v; try{localStorage.setItem("er-lang",v);}catch(e){} render();}
var TX_SKIP={imgs:1,media:1,en:1,src:1,url:1,img:1,id:1,pages:1};
function tx(o){
  var D=STATE.en||{};
  if(typeof o==="string") return Object.prototype.hasOwnProperty.call(D,o)?D[o]:o;
  if(Array.isArray(o)) return o.map(tx);
  if(o&&typeof o==="object"){var r={}; Object.keys(o).forEach(function(k){r[k]=TX_SKIP[k]?o[k]:tx(o[k]);}); return r;}
  return o;
}
/* เนื้อหาที่ใช้วาดหน้า: ภาษาไทยตามต้นฉบับ หรือฉบับแปลอังกฤษ */
function VS(){return (LANG==="en"&&!editing)?tx(STATE):STATE;}

/* ---------- กล่องข้อความแจ้งเตือนเล็ก ๆ และหน้าต่างป๊อปอัป ---------- */
function toast(msg){var t=document.createElement("div");t.className="toast";t.setAttribute("role","status");t.textContent=msg;document.body.appendChild(t);setTimeout(function(){t.remove();},3600);}
function openModal(html,onMount){
  var m=document.createElement("div"); m.className="modal"; m.innerHTML='<div class="dialog" role="dialog" aria-modal="true">'+html+'</div>';
  document.body.appendChild(m); m.addEventListener("click",function(e){if(e.target===m) m.remove();});
  var first=m.querySelector("input,textarea,button"); if(first) first.focus();
  if(onMount) onMount(m); return m;
}
