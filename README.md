# Admin Workflow Demo Bot

บอทตัวอย่างสำหรับโชว์ลูกค้าว่าเราทำระบบ workflow + DB + review flow ได้จริง

## สิ่งที่มีในชุดนี้
- Core interaction routing
- Demo panel
- Donate flow
- PostgreSQL integration
- Approve / Reject review flow
- Audit log ลง DB + ส่งเข้า Discord channel

## วิธีใช้งาน
1. คัดลอก `.env.example` เป็น `.env`
2. กรอกค่าต่าง ๆ ให้ครบ
3. ติดตั้ง package
4. รันสร้างตาราง
5. เปิดบอท
6. พิมพ์ `!demo-panel` ในห้องที่ต้องการให้บอทส่ง panel

## คำสั่ง
```bash
npm install
npm run db:init
npm run doctor
npm start
```

## Flow ที่ได้
1. ผู้เล่นกดปุ่ม `Donate Flow`
2. Modal เด้งให้กรอกข้อมูล
3. ระบบบันทึกลง PostgreSQL
4. ระบบส่ง embed ไปห้อง review
5. แอดมินกด Approve / Reject
6. ระบบอัปเดต DB + ส่ง log

## ไอเดียต่อยอดรอบถัดไป
- เพิ่ม Support Flow
- เพิ่ม Whitelist Flow
- เพิ่ม Claim Flow
- แยก role permission
- ทำ schema แบบ multi-tenant เต็มรูปแบบ
- ทำ panel deploy command
