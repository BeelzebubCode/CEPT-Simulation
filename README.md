<div align="center">

# 🎓 CEPT Exam Simulation

**Computer-Based English Proficiency Test — Chulalongkorn University**

[![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://prisma.io)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?logo=vercel)](https://cept-exam.vercel.app)

ระบบจำลองข้อสอบ CEPT แบบ Adaptive CAT พร้อม Practice Mode และ Admin Panel ครบวงจร

**[🚀 ทดลองใช้งาน →](https://cept-exam.vercel.app)**

</div>

---

## ✨ Features

| Feature | รายละเอียด |
|---|---|
| 🎯 **Exam Mode (CAT)** | ข้อสอบปรับระดับอัตโนมัติด้วย Item Response Theory (IRT) |
| 📚 **Practice Mode** | ฝึกทำแยกรายหมวด พร้อม feedback ทันที |
| 🔊 **Text-to-Speech** | ระบบเสียงสำหรับ Listening section (Web Speech API) |
| 📊 **CEFR Scoring** | คะแนน 0–50 พร้อมระดับ A1–C2 |
| 🛡️ **Admin Panel** | จัดการข้อสอบ — เพิ่ม/แก้ไข/ลบ พร้อม image upload |
| 📱 **Mobile Responsive** | รองรับทุกขนาดหน้าจอ |
| 🔒 **Secure** | HMAC session auth, CSP headers, input validation ครบ |

---

## 📋 หมวดข้อสอบ

```
CEPT Exam  (50 คะแนน · 30 นาที)
├── Listening Part 1   — Text-based conversations        (42 ข้อ)
├── Listening Part 2   — Image-based listening           (29 ข้อ)
├── Reading: Signs     — Signs & notices                 (40 ข้อ)
├── Reading: Fill-in   — Fill in the blank (partial credit) (27 ข้อ)
└── Reading: Comprehension — Reading passages            (30 ข้อ)
                                              รวม 168 ข้อ
```

---

## 🏗️ Tech Stack

```
Frontend    Next.js 16 (App Router · Turbopack) + React 19
Database    PostgreSQL via Supabase (connection pooling)
ORM         Prisma 6
Auth        HMAC-SHA256 session cookie (ไม่ใช้ library)
Hosting     Vercel (serverless)
Security    CSP · X-Frame-Options · magic-byte upload validation
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (หรือ [Supabase](https://supabase.com) account)

### 1. Clone & Install

```bash
git clone https://github.com/BeelzebubCode/CEPT-Simulation.git
cd CEPT-Simulation
npm install
```

### 2. Environment Variables

สร้างไฟล์ `.env` ที่ root:

```env
# Supabase — Transaction Pooler (สำหรับ app)
DATABASE_URL="postgresql://postgres.[project-id]:[password]@aws-1-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase — Direct connection (สำหรับ migrate เท่านั้น)
DIRECT_URL="postgresql://postgres.[project-id]:[password]@aws-1-[region].pooler.supabase.com:5432/postgres"

# Admin credentials
ADMIN_PASSWORD="your-strong-password"
SESSION_SECRET="your-64-char-random-hex-string"
```

> **หาค่าเหล่านี้ได้ที่:** Supabase Dashboard → Connect → ORM → Prisma

### 3. Database Setup

```bash
# Apply schema migrations
npx prisma migrate deploy

# Seed ข้อมูลตัวอย่าง (168 ข้อ)
npx prisma db seed
```

### 4. Run Development Server

```bash
npm run dev
# เปิด http://localhost:3000
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── exam/page.tsx         # Adaptive exam (CAT)
│   ├── practice/page.tsx     # Practice mode
│   ├── results/page.tsx      # Score & CEFR results
│   ├── admin/                # Admin panel (protected)
│   │   ├── login/page.tsx
│   │   ├── page.tsx          # Dashboard
│   │   └── sections/[id]/    # Section editor
│   └── api/
│       ├── adaptive/         # CAT engine
│       ├── exam/             # Practice data
│       ├── sections/         # Section CRUD
│       ├── questions/        # Question CRUD
│       ├── upload/           # Image upload
│       └── admin/            # Auth (login/logout)
├── lib/
│   ├── prisma.ts             # Prisma singleton
│   └── auth.ts               # HMAC session helpers
└── proxy.ts                  # Route protection middleware
prisma/
├── schema.prisma
├── migrations/
├── seed.ts
└── data/                     # Seed question data
```

---

## 🔐 Security

- **Authentication** — HMAC-SHA256 signed cookie, HttpOnly, SameSite=Strict, หมดอายุ 8 ชั่วโมง
- **Authorization** — ทุก write API ตรวจ session ก่อน (401 ถ้าไม่ผ่าน)
- **Input Validation** — Whitelist fields ทุก endpoint ป้องกัน mass assignment
- **Upload** — ตรวจ magic bytes จริง (JPEG/PNG/GIF/WebP), จำกัด 5 MB, path traversal guard
- **XSS** — React JSX escape by default + Content-Security-Policy header
- **SQLi** — Prisma parameterized queries ตลอด ไม่มี raw SQL
- **Clickjacking** — `X-Frame-Options: DENY`

---

## 📊 Scoring System

| ข้อปกติ | Fill-in-the-Blank |
|---|---|
| ถูก = **1 คะแนน** | แต่ละ blank = **1/N คะแนน** |
| ผิด = **0 คะแนน** | รวมทั้งข้อ = **1 คะแนน** |

**CEFR Mapping (จาก 50 คะแนน)**

| คะแนน | ระดับ |
|---|---|
| 45–50 | C2 |
| 38–44 | C1 |
| 30–37 | B2 |
| 22–29 | B1 |
| 14–21 | A2 |
| 7–13 | A1 |
| 0–6 | Below A1 |

---

## 🛠️ Admin Panel

เข้าได้ที่ `/admin/login` — ต้องใช้ `ADMIN_PASSWORD` จาก `.env`

สามารถ:
- ดู dashboard สรุปจำนวนข้อ
- แก้ไข Section settings (ชื่อ, เวลา, คำอธิบาย)
- เพิ่ม/แก้ไข/ลบ Question และ Choice
- Upload รูปภาพสำหรับ question และ choice
- รองรับ Listening (TTS), Image, Fill-in-the-Blank, Comprehension

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/BeelzebubCode">
        <img src="https://github.com/BeelzebubCode.png" width="100px;" alt="Beelzebub"/><br />
        <sub><b>Beelzebub</b></sub>
      </a><br />
      <sub>BeelzebubCode</sub>
    </td>
     <td align="center">
      <a href="https://claude.ai/code">
        <img src="https://avatars.githubusercontent.com/u/76263028" width="100px;" alt="Claude Code"/><br />
        <sub><b>Claude Code</b></sub>
      </a><br />
      <sub>AI Pair Programmer</sub>
    </td>
  </tr>
</table>

---

## 🤝 Contributing

Pull requests ยินดีต้อนรับครับ สำหรับ major changes กรุณาเปิด issue ก่อนเพื่อหารือ
