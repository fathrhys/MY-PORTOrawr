---
title: "Write Up: Not Everything Uploaded"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Vuln, WebExploit,"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768919674453_6a6a984579721.png"
createdAt: "2026-01-20T14:34:34.674Z"
updatedAt: "2026-01-24T17:46:56.603Z"
---

# Write Up: Not Everything Uploaded

# Write-up CTF: BakaCTF - Not Everything Uploaded

## Informasi Challenge

**Nama:** Not Everything Uploaded  
**Kategori:** Web Security / File Upload  
**Tingkat Kesulitan:** Easy  
**Author:** Admin

**Deskripsi:**
> An upload gateway protects its system by checking file types. Only images are allowed.

**Target URL:**
```
https://labctf.free.nf/uploader.php
```

---

## Tahap 1: Analisis Awal Aplikasi

### Observasi Fungsionalitas

Aplikasi menyediakan fitur file upload dengan pesan pembatasan:

```
Only image files are allowed
```

Setelah upload file tertentu, aplikasi menampilkan pesan:
- `Upload accepted` - jika file diterima
- `Error message` - jika file ditolak

**Indikasi:** Terdapat validasi tipe file pada sisi server.

---

## Tahap 2: Analisis Mekanisme Validasi

### Dugaan Mekanisme Validasi

Pada challenge upload dengan tingkat Easy, validasi biasanya dilakukan dengan salah satu cara berikut:

1. **Validasi ekstensi file** - `.jpg`, `.png`
2. **Validasi MIME type** - `image/jpeg`
3. **Validasi magic bytes** - signature file

Karena tidak ada pesan error detail dan tidak ada pembatasan tambahan (size, dimensi, dsb), kemungkinan besar server hanya memeriksa **ekstensi file**.

---

## Tahap 3: Eksploitasi – File Extension Bypass

### Teknik yang Digunakan

**File Extension Bypass**

#### Langkah Eksploitasi:

1. Mengambil file non-image (misalnya file teks)
2. Mengubah nama file agar berakhiran ekstensi gambar (`.jpg`)
3. Mengunggah file tersebut ke server

#### Contoh:

```bash
test.txt → test.txt.jpg
```

### Hasil Upload

Server menerima file tersebut dan menampilkan respon:

```
Upload accepted. BakaCTF{file_extension_bypass_success}
```

**Hal ini membuktikan bahwa:**
- ❌ Server tidak memeriksa MIME type sebenarnya
- ❌ Server tidak memverifikasi magic bytes
- ✅ Validasi hanya bergantung pada ekstensi file

---

## Tahap 4: Bukti Tambahan (Magic Bytes Test)

### Pembuatan Fake JPEG

Untuk memastikan kelemahan validasi, dilakukan pembuatan fake JPEG:

```bash
printf '\xFF\xD8\xFF\xE0JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00' > fake.jpg
echo "HELLO" >> fake.jpg
```

**Hasil:** File tersebut tetap diterima oleh server, menunjukkan bahwa signature check tidak dilakukan secara ketat.

---

## Vulnerability yang Ditemukan

### 🔴 File Upload Vulnerability – Improper File Validation

**Jenis kerentanan:**
- CWE-434: Unrestricted File Upload
- OWASP A05: Security Misconfiguration

**Penyebab utama:**
- Validasi hanya berdasarkan ekstensi file
- Tidak ada validasi konten file

---

## Dampak Keamanan

Jika aplikasi ini digunakan di lingkungan nyata, dampaknya bisa meliputi:

- ⚠️ Upload file berbahaya (webshell, script)
- ⚠️ Remote Code Execution (jika server salah konfigurasi)
- ⚠️ Information Disclosure
- ⚠️ Defacement

---

## Rekomendasi Perbaikan (Mitigation)

Untuk mengamankan fitur upload, server seharusnya:

### ✅ Security Best Practices:

1. **Validasi MIME type** menggunakan `finfo_file()`
2. **Validasi magic bytes** (file signature)
3. **Whitelist** ekstensi dan konten file
4. **Simpan file upload** di luar web root
5. **Rename file** dengan nama acak
6. **Nonaktifkan eksekusi** script di folder upload

### Contoh Validasi Aman (PHP):

```php
<?php
// Validasi MIME type
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $_FILES['file']['tmp_name']);
finfo_close($finfo);

// Whitelist MIME types
$allowedMimes = ['image/jpeg', 'image/png', 'image/gif'];

if (!in_array($mime, $allowedMimes)) {
    http_response_code(400);
    die('Invalid file type');
}

// Validasi ekstensi
$allowedExts = ['jpg', 'jpeg', 'png', 'gif'];
$ext = strtolower(pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION));

if (!in_array($ext, $allowedExts)) {
    http_response_code(400);
    die('Invalid file extension');
}

// Generate random filename
$newFilename = bin2hex(random_bytes(16)) . '.' . $ext;

// Simpan di luar web root
$uploadDir = '/var/uploads/'; // Outside web root
move_uploaded_file($_FILES['file']['tmp_name'], $uploadDir . $newFilename);
?>
```

### .htaccess untuk Folder Upload:

```apache
# Disable script execution
<FilesMatch "\.(php|phtml|php3|php4|php5|pl|py|jsp|asp|html|htm|shtml|sh|cgi)$">
    Order Deny,Allow
    Deny from all
</FilesMatch>
```

---

## Exploit Timeline

```
1. Reconnaissance
   └─> Identifikasi fitur upload
   └─> Deteksi validasi "images only"

2. Testing
   └─> Upload file .txt → Rejected
   └─> Upload file .jpg → Accepted
   └─> Upload file .txt.jpg → Accepted ✓

3. Exploitation
   └─> File extension bypass berhasil
   └─> Flag ditemukan dalam response

4. Verification
   └─> Test dengan fake JPEG
   └─> Konfirmasi tidak ada magic bytes check
```

---

## Flag

```
BakaCTF{file_extension_bypass_success}
```

---

## Pembelajaran

### Skills yang Dipelajari

1. **File Upload Security** - Understanding validation mechanisms
2. **Extension Bypass** - Double extension technique
3. **MIME Type Analysis** - How servers validate file types
4. **Magic Bytes** - File signature identification
5. **Security Misconfiguration** - Common upload vulnerabilities

### OWASP Top 10 Coverage

Challenge ini mencakup:
- ✅ A05: Security Misconfiguration
- ✅ A04: Insecure Design (improper validation)
- ✅ CWE-434: Unrestricted Upload of File with Dangerous Type

---

## Common File Upload Attacks

### Attack Vectors:

| Attack Type | Technique | Risk Level |
|-------------|-----------|------------|
| **Extension Bypass** | `.txt.jpg`, `.php.jpg` | Medium |
| **MIME Type Spoofing** | Fake Content-Type header | Medium |
| **Magic Bytes Injection** | Add signature to malicious file | High |
| **Path Traversal** | `../../etc/passwd.jpg` | Critical |
| **Polyglot Files** | Valid image + embedded code | High |

---

## Resources untuk Belajar Lebih Lanjut

### File Upload Security
- [OWASP File Upload Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html)
- [HackTricks - File Upload](https://book.hacktricks.xyz/pentesting-web/file-upload)
- [PortSwigger - File Upload Vulnerabilities](https://portswigger.net/web-security/file-upload)

### Magic Bytes Reference
- [File Signatures Table](https://en.wikipedia.org/wiki/List_of_file_signatures)
- [GCK's File Signatures](https://www.garykessler.net/library/file_sigs.html)

### Security Standards
- [CWE-434: Unrestricted Upload](https://cwe.mitre.org/data/definitions/434.html)
- [OWASP Top 10 2021](https://owasp.org/Top10/)

---

**Selesai! 📁**

Challenge ini mengajarkan fundamental file upload security:
- Never trust file extensions alone
- Always validate MIME types
- Check magic bytes/signatures
- Store uploads outside web root
- Rename uploaded files
- Disable script execution in upload directories
