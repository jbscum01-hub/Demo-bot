# Admin Workflow Demo Bot

บอทเดโมสำหรับโชว์ลูกค้าว่าเราทำระบบ workflow + DB + auto setup ได้จริง โดยเวอร์ชันนี้โฟกัส Donate Review Flow และรองรับการ bootstrap อัตโนมัติบน Railway

## สิ่งที่มีในชุดนี้
- Auto bootstrap ตอน `npm start`
- สร้างตาราง DB เอง
- Healthcheck เอง
- Auto register guild เป็น tenant
- Seed module / config เริ่มต้นให้เอง
- Demo panel
- Donate flow
- Approve / Reject review flow
- Audit log ลง DB + ส่งเข้า Discord channel

## ใช้งานแบบเร็วสุด
1. คัดลอก `.env.example` เป็น `.env`
2. ใส่ `DISCORD_TOKEN` และ `DATABASE_URL`
3. รัน `npm install`
4. รัน `npm start`
5. เชิญบอทเข้าเซิร์ฟเวอร์
6. ในห้องที่อยากใช้เป็น review/log พิมพ์ `!setup-demo`
7. ในห้องที่อยากโชว์ปุ่ม พิมพ์ `!demo-panel`

> ถ้าตั้ง `DONATE_REVIEW_CHANNEL_ID` และ `AUDIT_LOG_CHANNEL_ID` ใน env ไว้แล้ว ระบบจะ seed ค่าให้ guild ใหม่อัตโนมัติ

## คำสั่งสำคัญ
```bash
npm install
npm start
```

คำสั่งเสริมสำหรับ debug เท่านั้น
```bash
npm run db:init
npm run doctor
```

## Flow ที่ได้
1. ผู้เล่นกดปุ่ม `Donate Flow`
2. Modal เด้งให้กรอกข้อมูล
3. ระบบบันทึกลง PostgreSQL
4. ระบบส่ง embed ไปห้อง review
5. แอดมินกด Approve / Reject
6. ระบบอัปเดต DB + ส่ง log

## คำสั่งใน Discord
- `!setup-demo` → ตั้งห้องปัจจุบันให้เป็น review + audit log ของ demo
- `!demo-panel` → ส่ง panel ปุ่ม Donate Flow

## ไอเดียต่อยอดรอบถัดไป
- เพิ่ม Support Flow
- เพิ่ม Whitelist Flow
- เพิ่ม Claim Flow
- แยก role permission
- เพิ่ม setup command แบบเลือก review/log คนละห้อง
- ทำ dashboard / license / multi-module เต็มรูปแบบ
