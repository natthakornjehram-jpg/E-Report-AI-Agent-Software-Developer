"""เปิดเว็บสัมมนาในเครื่องแล้วกดทดสอบ ก่อน push ขึ้น GitHub

เช็ก: มี error ใน JavaScript ไหม
      รูป/คลิป/เพลงโหลดครบไหม 
      ปุ่ม EN / โหมดมืด
      การ์ดออแกไนซ์ 
      เปิดเอกสาร 
      มือถือล้นจอไหม
วิธีรัน (ในโฟลเดอร์ e-report):  python tools/check_site.py
"""
import functools, http.server, os, sys, threading
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding="utf-8")  # ให้พิมพ์ภาษาไทยในหน้าต่างคำสั่งได้

def open_browser(p):
    """ใช้ Edge หรือ Chrome ที่มีในเครื่อง ถ้าไม่มีค่อยใช้ Chromium ของ Playwright"""
    for channel in ("msedge", "chrome", None):
        try: return p.chromium.launch(channel=channel) if channel else p.chromium.launch()
        except Exception: pass
    raise SystemExit("ไม่พบเบราว์เซอร์ ลองรัน: playwright install chromium")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *args): pass

server = http.server.ThreadingHTTPServer(("127.0.0.1", 8795), functools.partial(Quiet, directory=ROOT))
threading.Thread(target=server.serve_forever, daemon=True).start()
URL = "http://127.0.0.1:8795/"
problems = []

with sync_playwright() as p:
    browser = open_browser(p)
    page = browser.new_page(viewport={"width": 1280, "height": 860})
    page.on("pageerror", lambda e: problems.append("JS error: " + str(e)))
    page.on("response", lambda r: r.status >= 400 and problems.append(f"โหลดไม่ได้ ({r.status}): {r.url}"))
    page.goto(URL); page.wait_for_timeout(2500)

    # รูปทุกรูปในหน้าต้องโหลดได้ (เลื่อนลงให้รูป lazy โหลดก่อน)
    page.evaluate("window.scrollTo(0, document.body.scrollHeight)"); page.wait_for_timeout(1500)
    broken = page.evaluate("[...document.images].filter(i => i.complete && i.naturalWidth === 0).map(i => i.src)")
    problems += ["รูปเสีย: " + s for s in broken]

    page.click("[data-act=lang]"); page.wait_for_timeout(300)
    if "en" != page.evaluate("document.documentElement.lang"): problems.append("กด EN แล้วภาษาไม่เปลี่ยน")
    page.click("[data-act=lang]")
    page.click("[data-act=theme]")
    page.click("[data-act=theme]")

    cards = page.locator("[data-org]")
    if cards.count() > 1:
        cards.nth(1).click(); page.wait_for_timeout(400)
    page.locator("[data-doc]").first.click(); page.wait_for_timeout(300)
    if not page.is_visible(".modal .docview"): problems.append("กดเอกสารแล้วไม่มีหน้าต่างขึ้น")

    phone = browser.new_page(viewport={"width": 390, "height": 844})
    phone.goto(URL); phone.wait_for_timeout(2000)
    if phone.evaluate("document.documentElement.scrollWidth > innerWidth"): problems.append("มือถือ: หน้าเว็บกว้างเกินจอ")
    browser.close()
server.shutdown()

print("\n".join(problems) if problems else "ผ่านทุกข้อ")
