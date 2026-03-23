# Admin Workflow Demo Bot

เดโมบอทสำหรับโชว์ว่าเราสามารถทำระบบ workflow + review + audit log + PostgreSQL ได้จริง

## Flow ที่มีในเวอร์ชันนี้
- Donate Flow
- Whitelist Flow
- Support Flow
- Auto bootstrap / auto DB init / auto tenant setup

## Deploy บน Railway
1. อัปโค้ดขึ้น GitHub
2. สร้าง Railway project จาก repo
3. เพิ่ม PostgreSQL service
4. ใส่ Variables ตาม `.env.example`
5. Railway จะรัน `npm start` ให้เอง

## คำสั่ง setup ใน Discord
- `!setup-panel`
- `!setup-review-donate`
- `!setup-review-whitelist`
- `!setup-review-support`
- `!setup-log`
- `!setup-demo` ตั้งค่าทุกอย่างในห้องเดียวแบบเร็ว
- `!demo-panel` ส่งปุ่มเดโม

## ห้องที่แนะนำ
- `🎮・demo-panel`
- `💰・donate-review`
- `📋・whitelist-review`
- `🎫・support-review`
- `📊・audit-log`

## วิธีใช้งานเร็วสุด
1. invite bot เข้าเซิร์ฟ
2. ไปห้อง panel แล้วพิมพ์ `!setup-panel`
3. ไปห้อง donate review แล้วพิมพ์ `!setup-review-donate`
4. ไปห้อง whitelist review แล้วพิมพ์ `!setup-review-whitelist`
5. ไปห้อง support review แล้วพิมพ์ `!setup-review-support`
6. ไปห้อง log แล้วพิมพ์ `!setup-log`
7. กลับไปห้อง panel แล้วพิมพ์ `!demo-panel`

## หมายเหตุ
- ถ้าอยากเทสเร็ว ใช้ `!setup-demo` ในห้องเดียวก่อนได้
- schema ใช้ `CREATE TABLE IF NOT EXISTS` รองรับการ start ซ้ำ
