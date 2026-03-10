---
title: "Portfolio v2: Next.js + Static Markdown"
description: "Website portfolio terbaru yang dibangun menggunakan Next.js App Router dan berbasis Markdown murni tanpa database."
year: 2026
category: "WEB"
techStack: "Next.js, TailwindCSS, Markdown"
githubUrl: "https://github.com/kamal/porto-v2"
demoUrl: "https://porto-kamal.vercel.app"
coverUrl: "/uploads/cover-porto-v2.png"
createdAt: "2026-03-09T10:00:00Z"
updatedAt: "2026-03-09T10:00:00Z"
---

# 🚀 Portfolio v2: Next.js + Static Markdown

Ini adalah v2 dari website personal dan dokumentasi portfolio saya. Awalnya, website ini dikembangkan menggunakan **Next.js 14**, dilengkapi dengan ORM **Prisma**, dan terkoneksi ke database **MySQL** untuk menyimpan seluruh data proyek.

Namun, untuk kebutuhan sebuah *portfolio website* pribadi, memelihara sebuah server database (MySQL/PostgreSQL) terasa kurang efisien dan membuang *resources* server. Oleh karena itu, saya melakukan **rombak total arsitektur (Refactoring)**.

## 💡 Motivasi Pembaruan

Tujuan utama dari versi kedua ini adalah **Kesederhanaan, Kecepatan, dan Skalabilitas Tanpa Backend**. 

Seluruh data dari database lama diekstrak dan dikonversi menjadi barisan file teks statis berformat **Markdown (`.md`)**. Dengan pendekatan ini, keseluruhan website bisa di-*build* menjadi HTML murni yang super ringan tanpa harus terus-menerus menghubungi server database.

## ✨ Fitur Utama & Keunggulan

1. **Statically Generated (SSG) Sempurna**
   Memanfaatkan kekuatan *Next.js App Router*, semua halaman `.md` di-*render* ketika proses *build* (`npm run build`). Website langsung disajikan secara instan dalam hitungan milidetik.
   
2. **Mudah Dirawat (Markdown Powered)**
   Tidak ada lagi *form* admin yang rentan atau *query* SQL yang rumit. Untuk menambah project baru atau CTF *writeup*, saya hanya perlu membuat file `.md` baru di folder `content/projects/`, push ke GitHub, dan *Voila!* otomatis ter-publish.
   
3. **Typographical Beauty**
   Ditenagai oleh plugin `@tailwindcss/typography` dan kombinasi *plugin remark/rehype* (`react-markdown`, `remark-gfm`, `rehype-highlight`), penulisan kode atau tutorial di dalam markdown akan memiliki *syntax highlighting* selayaknya IDE modern dan ter-styling sangat indah.
   
4. **Sistem Kategori Kustom dengan *Client Component***
   Melakukan sistem *filter* proyek (Web, Cyber, AI, Game, dll) tidak membuyarkan status statis website karena dieksekusi murni di sisi kline (Browser) menggunakan React Hooks + URL Params.

## 🛠️ Tech Stack di Balik Layar

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS v4 + Framer Motion
- **Content Parser**: Gray-matter, React-Markdown, Rehype, Remark
- **Hosting**: Vercel / GitHub Pages / Static Hosting

Proyek ini tidak hanya murni tentang desain, melainkan sebuah eksperimen mendalam dalam memahami **Static Site Generation**, **Client vs Server Components**, dan optimalisasi web semaksimal mungkin.
