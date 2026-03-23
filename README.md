# Admin Workflow Demo Bot

บอทเดโมสำหรับโชว์ลูกค้าว่าเราทำระบบ workflow + DB + auto setup ได้จริง โดยเวอร์ชันนี้โฟกัส 2 flow หลักคือ Donate Review และ Whitelist Review พร้อม setup command แยกห้องได้

## สิ่งที่มีในชุดนี้
- Auto bootstrap ตอน `npm start`
- สร้างตาราง DB เอง
- Healthcheck เอง
- Auto register guild เป็น tenant
- Seed module / config เริ่มต้นให้เอง
- Demo panel
- Donate flow
- Whitelist flow
- Approve / Reject review flow
- Audit log ลง DB + ส่งเข้า Discord channel
- Setup command แยก panel / review / log

## ใช้งานแบบเร็วสุด
1. คัดลอก `.env.example` เป็น `.env`
2. ใส่ `DISCORD_TOKEN` และ `DATABASE_URL`
3. รัน `npm install`
4. รัน `npm start`
5. เชิญบอทเข้าเซิร์ฟเวอร์
6. พิมพ์คำสั่งตั้งค่าตามห้องที่ต้องการ
7. ไปห้อง panel แล้วพิมพ์ `!demo-panel`

> ถ้าตั้ง channel id ใน env ไว้แล้ว ระบบจะ seed ค่าให้ guild ใหม่อัตโนมัติ

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
### Donate
1. ผู้เล่นกดปุ่ม `Donate Flow`
2. Modal เด้งให้กรอกข้อมูล
3. ระบบบันทึกลง PostgreSQL
4. ระบบส่ง embed ไปห้อง review
5. แอดมินกด Approve / Reject
6. ระบบอัปเดต DB + ส่ง log

### Whitelist
1. ผู้เล่นกดปุ่ม `Whitelist Flow`
2. Modal เด้งให้กรอกข้อมูล
3. ระบบบันทึกลง PostgreSQL
4. ระบบส่ง embed ไปห้อง review
5. แอดมินกด Approve / Reject
6. ระบบอัปเดต DB + ส่ง log

## คำสั่งใน Discord
- `!setup-panel` → ตั้งห้องปัจจุบันเป็นห้อง panel
- `!setup-review-donate` → ตั้งห้องปัจจุบันเป็นห้องรีวิว Donate
- `!setup-review-whitelist` → ตั้งห้องปัจจุบันเป็นห้องรีวิว Whitelist
- `!setup-log` → ตั้งห้องปัจจุบันเป็นห้อง audit log
- `!setup-demo` → ตั้งทุกอย่างในห้องเดียวแบบเร็วสุด
- `!demo-panel` → ส่ง panel ปุ่ม Donate + Whitelist

## ไอเดียต่อยอดรอบถัดไป
- เพิ่ม Support Flow
- เพิ่ม Claim Flow
- แยก role permission
- ทำ slash commands แทน message commands
- ทำ dashboard / license / multi-module เต็มรูปแบบ
