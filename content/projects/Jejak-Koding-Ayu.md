---
title: "Write Up – Jejak Koding Ayu"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "Gravatar, GitLog, MD5, Gmail, JSON"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769754984190_450df20b91cc2044.png"
createdAt: "2026-01-30T06:36:24.263Z"
updatedAt: "2026-01-30T07:02:09.179Z"
---

# Write Up – Jejak Koding Ayu

---

# Write Up – Jejak Koding Ayu

**Category:** OSINT
**Difficulty:** Medium
**Points:** 200

---

## 🕵️‍♂️ Deskripsi Singkat

Challenge ini menguji kemampuan **OSINT pivoting**: menelusuri jejak digital seorang developer bernama **Ayu** dari media sosial → website portofolio → repository GitHub → kebocoran informasi di histori Git → Gravatar → pivot ke Pixiv → menemukan flag.

---

## 🎯 Objective

Menemukan flag **FGTE{...}** dengan melakukan pivot dari:

* X (Twitter) → link website
* GitHub Pages → repo sumber website
* Git history → menemukan email dari file `.env` yang pernah ter-push
* Gravatar → menemukan link Pixiv
* Pixiv → menemukan gambar berisi flag

---

## 🧭 Langkah Penyelesaian

### 1️⃣ Investigasi Akun X (Twitter)

Diberikan akun:

```
https://x.com/AyuPortfol66222
```

Dari bio akun, ditemukan link website portofolio:

```
https://ayu-dev27.github.io
```

---

### 2️⃣ Website Portofolio → Repository GitHub

Karena domain tersebut adalah **GitHub Pages**, repo sumbernya berada di:

```
https://github.com/ayu-dev27/ayu-dev27.github.io
```

Clone repo untuk dianalisis:

```bash
git clone https://github.com/ayu-dev27/ayu-dev27.github.io
cd ayu-dev27.github.io
```

---

### 3️⃣ Menemukan Email dari Histori File `.env` (Data yang Sudah Dihapus Tapi Masih Tersimpan di Git)

Poin penting di challenge ini adalah: **file sensitif yang sudah dihapus masih bisa dilihat lewat histori Git**.

Cek histori file `.env` (ikutin rename / delete):

```bash
git log --follow --name-status -- .env
```

Output menunjukkan `.env` **pernah ditambahkan (A)** lalu **dihapus (D)**:

```
commit fecea6e544777d471e51497c5a410956fe8a483a
D       .env

commit 313f7172b3edb2c10c718422523705fc8d0c3d66
A       .env
```

Ambil isi `.env` pada commit saat file masih ada:

```bash
git show 313f7172b3edb2c10c718422523705fc8d0c3d66:.env
```

Hasil:

```
REACT_APP_EMAIL=ayuportfolio05@gmail.com
```

✅ Email inilah yang dipakai untuk pivot ke Gravatar.

---

### 4️⃣ Hitung MD5 Email untuk Gravatar

Gravatar menggunakan **MD5(email yang sudah dilowercase)**.

```bash
echo -n "ayuportfolio05@gmail.com" | tr '[:upper:]' '[:lower:]' | md5sum
```

Hasil MD5:

```
d3383c1d26e5e4535695ea6db5a3ef7f
```

---

### 5️⃣ Verifikasi Akun Gravatar Ada

Cek apakah hash ini punya avatar/profil (HTTP 200 berarti ada):

```bash
curl -s -o /dev/null -w "%{http_code}" \
"https://www.gravatar.com/avatar/d3383c1d26e5e4535695ea6db5a3ef7f?d=404"
```

Output:

```
200
```

Ambil profil JSON Gravatar:

```bash
curl -s "https://en.gravatar.com/d3383c1d26e5e4535695ea6db5a3ef7f.json" | jq .
```

Di JSON terlihat field penting:

```json
"aboutMe": "https://www.pixiv.net/en/users/120257706"
```

✅ Ini menjadi pivot langsung ke Pixiv.

---

### 6️⃣ Pivot ke Pixiv → Ambil Flag

Buka link Pixiv dari `aboutMe`:

```
https://www.pixiv.net/en/users/120257706
```

Di profile Pixiv tersebut ada gambar yang berisi flag secara eksplisit:

```
FGTE{Pixiv_Gravatar_Github_Found}
```

---

## 🏁 Final Flag

```
FGTE{Pixiv_Gravatar_Github_Found}
```

---

## 🧠 Insight / Catatan

* **Git itu menyimpan histori**: file sensitif seperti `.env` yang sudah dihapus tetap bisa diambil lewat commit lama.
* Pivot OSINT di challenge ini:
  **X → GitHub Pages → Repo → `.env` leak → Gravatar → Pixiv → Flag**
* Teknik yang dipakai umum di real-world: “**info leak via commit history**”.

---
