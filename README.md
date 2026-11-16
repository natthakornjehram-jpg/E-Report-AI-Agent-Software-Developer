# AI Agent Seminar E-Report

E-Report การทำหน้าที่ผู้ประสานงานทีม Organize กลุ่มที่ 1 (Sigma Boys)
สัมมนาวิชาการ "AI Agent กับอนาคตของ Software Developer"

เว็บ: https://natthakornjehram-jpg.github.io/E-Report-AI-Agent-Software-Developer/

## หน้าเว็บนี้ทำงานยังไง

`index.html` มีแค่กล่องว่าง `<div id="root">` กับรายชื่อสคริปต์
ตอนเปิดหน้า JavaScript อ่านเนื้อหาจาก `data/state.js` แล้ววาดทั้งหน้าลงในกล่องนั้น
ปุ่ม EN สลับไปใช้คำแปลจาก `data/english.js` แล้ววาดหน้าใหม่

## ไฟล์ในโปรเจกต์

```
e-report/
├─ index.html              กล่องว่าง + ลำดับการโหลดสคริปต์
├─ css/
│  └─ style.css            หน้าตาทั้งหมด
├─ data/                   เนื้อหา (แก้ข้อความที่นี่ ไม่ต้องแตะโค้ด)
│  ├─ state.js             ข้อความ ตัวเลข ขั้นตอน โพสต์ ผลประเมิน ทีมงาน เอกสาร ข่าว ลิงก์
│  └─ english.js           คำแปลอังกฤษ จับคู่ "ข้อความไทย": "English"
├─ js/                     โค้ด แยกตามหน้าที่ (โหลดตามลำดับนี้)
│  ├─ core.js              เครื่องมือที่ทุกไฟล์ใช้ร่วม โหมดมืด ภาษา หน้าต่างป๊อปอัป
│  ├─ render-page.js       วาดแถบเมนู ส่วนหัว คลิป ขั้นตอน โพสต์ ผลประเมิน บทเรียน
│  ├─ render-team.js       วาดวิทยากร การ์ดออแกไนซ์ ผู้ช่วยงาน หน้าต่างโปรไฟล์
│  ├─ render-sections.js   วาดคำถามที่พบบ่อย ข่าว เอกสาร ท้ายหน้า
│  ├─ actions.js           สิ่งที่เกิดเมื่อกดปุ่ม: เปิดเอกสาร ดูรูป เปลี่ยนภาษา คลิป เพลง
│  └─ main.js              เริ่มวาดหน้า
├─ assets/
│  ├─ img/                 รูปทั้งหมด (ชื่อไฟล์ตรงกับชื่อรูปใน state.js)
│  └─ media/               คลิปสรุปงาน (recap.mp4) และเพลง (music.m4a)
└─ tools/                  สคริปต์ Python ช่วยงาน (ไม่ได้ขึ้นเว็บ)
   ├─ split_from_single_html.py   แยกไฟล์ HTML ไฟล์เดียวจาก claude.ai ออกเป็นโฟลเดอร์นี้
   └─ check_site.py               เปิดเว็บในเครื่องแล้วกดทดสอบ
```

## อยากแก้อะไร ไปที่ไฟล์ไหน

| อยากแก้ | ไฟล์ |
|---|---|
| ข้อความ ตัวเลข ชื่อคน ลิงก์ | `data/state.js` |
| คำแปลภาษาอังกฤษ | `data/english.js` (ข้อความไทยฝั่งซ้ายต้องตรงกับใน `state.js`) |
| สี ขนาด ระยะห่าง | `css/style.css` |
| ลำดับหรือหน้าตาของแต่ละส่วน | `js/render-*.js` |
| รูป | วางไฟล์ใหม่ใน `assets/img/` แล้วแก้ `src` ใน `state.js` |

## แก้บน claude.ai แล้วอยากอัปเดตเว็บนี้

เว็บบน claude.ai เป็นไฟล์ HTML ไฟล์เดียว มีปุ่มแก้ไขหน้าเว็บ ส่วนเว็บบน GitHub เป็นแบบดูอย่างเดียว
ถ้าแก้บน claude.ai แล้ว ให้ดาวน์โหลดไฟล์ HTML มา แล้วรัน

```bash
python tools/split_from_single_html.py "ที่อยู่ไฟล์.html"
python tools/check_site.py
git add -A
git commit -m "อัปเดตจาก claude.ai"
git push
```

## ดูในเครื่องก่อนขึ้นเว็บ

```bash
python -m http.server 8000
```

แล้วเปิด http://localhost:8000

---

© 2026 ณฐกร เจะรัมย์ · สงวนลิขสิทธิ์
