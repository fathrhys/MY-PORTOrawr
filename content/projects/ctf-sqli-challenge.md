---
title: "Web Exploitation: SQLi Challenge"
description: "Penyelesaian untuk tantangan Web CTF tingkat nasional tentang SQL Injection dan By-pass Authentication."
year: 2026
category: "CTF"
techStack: "PHP, SQL Injection, Python"
githubUrl: "https://github.com/kamal/ctf-web"
demoUrl: ""
coverUrl: ""
createdAt: "2026-03-10T10:00:00Z"
updatedAt: "2026-03-10T10:00:00Z"
---

# Web Exploitation: SQLi Challenge

Pada kompetisi CTF kali ini, terdapat sebuah challenge web sederhana yang mengimplementasikan login form. Setelah melakukan pengecekan pada source code, ditemukan celah **SQL Injection** pada parameter username.

## Langkah Penyelesaian

1. Pertama, kita coba memasukkan payload standar:
   \`\`\`sql
   ' OR 1=1 --
   \`\`\`
2. Ternyata sistem melakukan filter terhadap karakter spasi. Kita bisa menggunakan `/**/` sebagai bypass:
   \`\`\`sql
   '/**/OR/**/1=1/**/--
   \`\`\`
3. Berhasil login sebagai admin dan mendapatkan flag!

**Flag:** `CTF{sqli_byp4ss_m4st3r}`
