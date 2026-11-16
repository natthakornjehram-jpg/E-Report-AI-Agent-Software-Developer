"""
วิธีรัน (ในโฟลเดอร์ e-report):
    python tools/split_from_single_html.py <ไฟล์.html>
ตัวอย่าง:
    python tools/split_from_single_html.py "C:/สัมมานา2026/E-Report/ai-agent-seminar-journal.html"

สิ่งที่สคริปต์ทำ:
  1. ดึงรูป คลิป และเพลงที่ฝังอยู่ในไฟล์ ออกมาเป็นไฟล์จริงใน assets/
  2. เก็บเนื้อหาทั้งหมดไว้ที่ data/state.js และคำแปลอังกฤษไว้ที่ data/english.js
  3. แยก CSS ไป css/style.css
  4. แยก JavaScript ตามหน้าที่ไปไว้ใน js/
  5. ตัดระบบ "แก้ไขหน้าเว็บ" ออก เมื่อขึ้นเว็บบน GitHub เลยสามารถดูได้อย่างเดี่ยวจะไม่สามารถแก้ไขได้
  6. เปลี่ยนลิงก์พอร์ตเป็นลิงก์ของ GitHub
"""
import base64, json, os, re, sys

sys.stdout.reconfigure(encoding="utf-8")
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PORTFOLIO_URL = "https://natthakornjehram-jpg.github.io/"
EXT = {"image/webp": "webp", "image/jpeg": "jpg", "image/png": "png", "image/gif": "gif",
       "video/mp4": "mp4", "audio/mp4": "m4a", "audio/mpeg": "mp3"}


def write(rel, text):
    if rel.startswith("js/"): text = thai(text)
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(text)


def cut(js, start, end=None):
    """ตัดโค้ดตั้งแต่บรรทัดที่ขึ้นต้นด้วย start ไปจนถึงก่อน end"""
    a = js.index(start)
    b = js.index(end, a) if end else len(js)
    return js[a:b].strip("\n")


# อ่านไฟล์ต้น
if len(sys.argv) < 2:
    sys.exit(__doc__)
html = open(sys.argv[1], encoding="utf-8").read()
css = re.search(r'<style id="css">(.*?)</style>', html, re.S).group(1)
state = json.loads(re.search(r'<script id="state" type="application/json">(.*?)</script>', html, re.S).group(1))
a = html.index('<script id="app-js">') + len('<script id="app-js">')
app = html[a:html.rindex("</script>")]

# 1. รูป คลิป เพลง: ออกมาเป็นไฟล์ 
media_count = 0
def save_media(data_uri, name, folder):
    global media_count
    mime, b64 = re.match(r"data:([^;]+);base64,(.*)", data_uri, re.S).groups()
    rel = f"assets/{folder}/{name}.{EXT.get(mime, 'bin')}"
    path = os.path.join(ROOT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(base64.b64decode(b64))
    media_count += 1
    return rel

for key, im in state.get("imgs", {}).items():
    if str(im.get("src", "")).startswith("data:"):
        im["src"] = save_media(im["src"], re.sub(r"[^A-Za-z0-9_-]", "_", key), "img")
media = state.get("media", {})
for key, folder in (("video", "media"), ("music", "media")):
    if str(media.get(key, "")).startswith("data:"):
        media[key] = save_media(media[key], {"video": "recap", "music": "music"}[key], folder)

left = [m.group(0)[:40] for m in re.finditer(r'"data:[^"]{0,40}', json.dumps(state))]
if left:
    print("ยังมีไฟล์ฝังอยู่ในเนื้อหา:", left[:5])

#  2. เนื้อหา + คำแปล 
for prof in state.get("profiles", {}).values():
    if "claude.ai/artifact/" in str(prof.get("portfolio", "")) and prof is state["profiles"].get("นางสาวณฐกร เจะรัมย์"):
        prof["portfolio"] = PORTFOLIO_URL
english = state.pop("en", {})
write("data/state.js",
      "/* state.js · เนื้อหาทั้งหมดของเว็บสัมมนา (ภาษาไทย)\n"
      "   แก้ข้อความ ตัวเลข ชื่อคน ลิงก์ ได้ที่ไฟล์นี้ ไม่ต้องแตะโค้ดใน js/\n"
      "   รูปแต่ละรูปอยู่ใน imgs: { ชื่อรูป: { src: ที่อยู่ไฟล์, w: กว้าง, h: สูง } } */\n"
      "var SITE_STATE = " + json.dumps(state, ensure_ascii=False, indent=1) + ";\n")
write("data/english.js",
      "/* english.js · คำแปลภาษาอังกฤษ ใช้ตอนกดปุ่ม EN\n"
      "   รูปแบบ: \"ข้อความภาษาไทยในเนื้อหา\": \"คำแปล\"\n"
      "   ถ้าแก้ข้อความไทยใน state.js ต้องแก้ข้อความไทยตรงนี้ให้ตรงกันด้วย ไม่งั้นปุ่ม EN จะแสดงภาษาไทย */\n"
      "SITE_STATE.en = " + json.dumps(english, ensure_ascii=False, indent=1) + ";\n")

#  3. CSS 
RESET = ":root{color-scheme:light}\nbody{margin:0;font:14px system-ui,sans-serif}\nimg{max-width:100%}\n[hidden]{display:none!important}\n"
write("css/style.css",
      "/* ============================================================\n"
      "   style.css · หน้าตาทั้งหมดของเว็บสัมมนา\n"
      "   สีหลักอยู่ที่ :root (โหมดสว่าง) และ [data-theme=\"dark\"] (โหมดมืด)\n"
      "   ============================================================ */\n\n"
      "/* ---------- พื้นฐาน ---------- */\n" + RESET + "\n" + css.strip() + "\n")

#  4. JavaScript แยกตามหน้าที่ 
body = app.strip()
body = body[body.index('"use strict";') + len('"use strict";'):body.rindex("})();")]

core = "/* ---------- เครื่องมือเล็ก ๆ: กันอักขระพิเศษ แปลงข้อความเป็นย่อหน้า สร้างแท็กรูป ---------- */\n" + cut(body, "function esc(", "/* ---------- render ---------- */")
toast = re.search(r"^function toast\(.*$", body, re.M).group(0)
modal = cut(body, "function openModal(", "function field(")
page = cut(body, "/* ---------- render ---------- */", "function teamHtml(){")
team = cut(body, "function teamHtml(){", "/* ---------- footer: icon links") + "\n\n" + \
       cut(body, "/* ---------- organizer profiles", "function faqHtml(){")
sections = cut(body, "function faqHtml(){", "/* deter casual image saving") + "\n\n" + \
           cut(body, "/* ---------- footer: icon links", "/* ---------- organizer profiles")
deter = cut(body, "/* deter casual image saving", "/* ---------- owner tools")
actions = cut(body, "/* ---------- actions ---------- */", "function save(){")

page = page.replace("  renderTools(); renderSavebar(); renderDraftBanner();\n", "")
EDIT_ACTS = r'a==="(toggle|add|edit|edit-meta|edit-lessons|discard|use-draft|drop-draft|save|download)"'
actions = "\n".join(l for l in actions.split("\n") if not re.search(EDIT_ACTS, l))
actions = actions.replace('var a=b.getAttribute("data-act");\n  else if(', 'var a=b.getAttribute("data-act");\n  if(', 1)

# คอมเมนต์ในโค้ดเดิมเป็นภาษาอังกฤษ แปลเป็นไทยให้อ่านง่าย
TH = {
    "/* deter casual image saving (right-click / drag); not a hard lock */": "/* กันคนคลิกขวาหรือลากรูปไปเซฟง่าย ๆ (กันได้แค่ระดับเบื้องต้น) */",
    "/* ---------- actions ---------- */": "/* ---------- ปุ่มต่าง ๆ ในหน้า ---------- */",
    "/* ---------- theme (per viewer, remembered in this browser only) ---------- */": "/* ---------- โหมดสว่าง / มืด (จำค่าไว้ในเบราว์เซอร์ของคนดู) ---------- */",
    "/* ---------- language (TH is the source; EN comes from STATE.en, a Thai->English phrase map) ---------- */": "/* ---------- ภาษา: ต้นฉบับเป็นไทย ภาษาอังกฤษดึงจาก data/english.js ---------- */",
    "/* the view the page is drawn from: Thai state, or its English rendering (never while editing) */": "/* เนื้อหาที่ใช้วาดหน้า: ภาษาไทยตามต้นฉบับ หรือฉบับแปลอังกฤษ */",
    "/* ---------- render ---------- */": "/* ---------- วาดทั้งหน้า ---------- */",
    "/* pill nav */": "/* แถบเมนู */",
    "/* hero */": "/* ส่วนหัว: ชื่องาน + คลิปสรุป */",
    "/* marquee of projects */": "/* แถบชื่อโครงงานที่เลื่อนไปเรื่อย ๆ */",
    "/* why */": "/* ทำไมต้องหัวข้อนี้ */",
    "/* framework list */": "/* ขั้นตอนการจัดงาน */",
    "/* closing band */": "/* แถบปิดท้าย */",
    "/* ---------- footer: icon links ---------- */": "/* ---------- ท้ายหน้า (footer) ---------- */",
    "/* ---------- organizer cards: expand in place, each in its own colours (STATE.profiles[name].theme) ---------- */": "/* ---------- การ์ดออแกไนซ์: กดแล้วขยายในที่เดิม ---------- */",
    "/* speakers and helpers: square photo cards, Facebook as an icon */": "/* การ์ดวิทยากรและผู้ช่วยงาน: รูปสี่เหลี่ยม + ไอคอน Facebook */",
    "/* ---------- organizer profiles (STATE.profiles keyed by Thai name without nickname) ---------- */": "/* ---------- หน้าต่างโปรไฟล์ (ข้อมูลอยู่ใน state.js ส่วน profiles ใช้ชื่อไทยไม่มีชื่อเล่นเป็นตัวค้นหา) ---------- */",
}
def thai(js):
    for en, th in TH.items(): js = js.replace(en, th)
    return js

HEAD = "/* {name} · {what}\n   โหลดตามลำดับใน index.html: state → english → core → render-page → render-team → render-sections → actions → main */\n\"use strict\";\n\n"
write("js/core.js", HEAD.format(name="core.js", what="ค่าเริ่มต้น เครื่องมือเล็ก ๆ ที่ไฟล์อื่นใช้ร่วมกัน โหมดมืด และภาษา") +
      "var STATE = SITE_STATE;                         // เนื้อหาทั้งหมด จาก data/state.js\n"
      "var editing = false;                            // บน GitHub แก้ไขหน้าเว็บไม่ได้ ค่านี้เป็น false ตลอด\n"
      "var music = null;                               // เพลงประกอบ (สร้างตอนกดปุ่มเปิดเพลงครั้งแรก)\n"
      "var root = document.getElementById(\"root\");    // กล่องที่ทั้งหน้าเว็บถูกวาดลงไป\n\n"
      + core + "\n\n/* ---------- กล่องข้อความแจ้งเตือนเล็ก ๆ และหน้าต่างป๊อปอัป ---------- */\n" + toast + "\n" + modal + "\n")
write("js/render-page.js", HEAD.format(name="render-page.js", what="วาดหน้าเว็บ: แถบเมนู ส่วนหัว คลิป ขั้นตอนการจัดงาน โพสต์ ผลประเมิน บทเรียน") + page + "\n")
write("js/render-team.js", HEAD.format(name="render-team.js", what="วาดส่วนทีมงาน: วิทยากร การ์ดออแกไนซ์ (กดแล้วขยาย) ผู้ช่วยงาน และหน้าต่างโปรไฟล์") + team + "\n")
write("js/render-sections.js", HEAD.format(name="render-sections.js", what="วาดส่วนท้าย ๆ: คำถามที่พบบ่อย ข่าว เอกสาร และท้ายหน้า (footer)") + sections + "\n")
write("js/actions.js", HEAD.format(name="actions.js", what="สิ่งที่เกิดขึ้นเมื่อกดปุ่ม: เปิดเอกสาร ดูรูป โหมดมืด เปลี่ยนภาษา เมนูมือถือ คลิป เพลง") + deter + "\n\n" + actions + "\n")
write("js/main.js", HEAD.format(name="main.js", what="จุดเริ่มต้น: วาดหน้าเว็บครั้งแรก") + "render();\n")

#  5. index.html 
title = re.search(r"<title>(.*?)</title>", html).group(1)
fonts = re.search(r'<link rel="stylesheet" href="(https://fonts\.googleapis\.com[^"]+)">', html).group(1).replace("&", "&amp;")
favicon = state.get("imgs", {}).get("favicon", {}).get("src", "")
write("index.html", f"""<!doctype html>
<html lang="th">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>{title}</title>
<meta name="description" content="E-Report สัมมนา AI Agent กับอนาคตของ Software Developer · ทีม Organize กลุ่มที่ 1 Sigma Boys">
{f'<link rel="icon" href="{favicon}">' if favicon else ''}
<link rel="stylesheet" href="{fonts}">
<link rel="stylesheet" href="css/style.css">
</head>
<body>
<!-- ทั้งหน้าเว็บถูกวาดลงในกล่องนี้ด้วย JavaScript (ดู js/render-*.js) -->
<div id="root"></div>

<!-- เนื้อหา: แก้ข้อความได้ที่ data/ -->
<script src="data/state.js"></script>
<script src="data/english.js"></script>
<!-- โค้ด: เรียงตามลำดับนี้เท่านั้น -->
<script src="js/core.js"></script>
<script src="js/render-page.js"></script>
<script src="js/render-team.js"></script>
<script src="js/render-sections.js"></script>
<script src="js/actions.js"></script>
<script src="js/main.js"></script>
</body>
</html>
""")
print(f"เสร็จแล้ว: ดึงไฟล์รูป/คลิป/เพลงออกมา {media_count} ไฟล์")
