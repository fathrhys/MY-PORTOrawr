---
title: "Write-up CTF: BakaCTF - CSIRT Secure Code Review"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, RepairCode, LoginCSIRT, WebExploit"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768896160985_a66f59465ce34.png"
createdAt: "2026-01-20T08:02:41.144Z"
updatedAt: "2026-01-24T17:47:28.180Z"
---

# Write-up CTF: BakaCTF - CSIRT Secure Code Review

# Write-up CTF: BakaCTF - CSIRT Secure Code Review

## Informasi Challenge

**Nama:** BakaCTF - CSIRT Secure Code Review  
**Kategori:** Secure Coding / Web Security  
**Tingkat Kesulitan:** Medium  
**Author:** BakaCTF Security Team

**Deskripsi:**
> Advanced Security Validation Challenge - Rewrite vulnerable login code to meet CSIRT Secure Coding Standards. Fix ALL critical vulnerabilities and implement security best practices.

**Requirements:**
- Minimum Score to Pass: **90%**
- Maximum Attempts: **5**

---

## Tahap 1: Analisis Kode Vulnerable

### Kode Login.php yang Diberikan

```php
<?php
// WARNING: This code contains multiple critical vulnerabilities
// Do NOT use in production!

$db = new SQLite3('users.db');

// DIRECT USER INPUT - HIGH RISK
$username = $_POST['username'];
$password = $_POST['password'];

// SQL INJECTION VULNERABILITY
$query = "SELECT * FROM users 
          WHERE username = '$username' 
          AND password = '$password'
          OR '1' = '1'";

$result = $db->query($query);

if ($result && $result->fetchArray()) {
    // PLAIN TEXT PASSWORD - SECURITY RISK
    echo "Login success as " . htmlspecialchars($username);
    
    // DEBUG INFO EXPOSED
    var_dump($_POST);
} else {
    echo "Login failed for " . htmlspecialehars($username);
    error_log("Failed login: " . $username);
}
?>
```

### Vulnerabilities yang Terdeteksi

#### 🔴 Critical Vulnerabilities:

1. **SQL Injection** - Direct string concatenation dalam query
2. **Plain-text Password** - Password tidak di-hash
3. **Debug Output Exposure** - `var_dump($_POST)` mengekspos data sensitif
4. **No Input Validation** - Tidak ada validasi input
5. **No Prepared Statements** - Menggunakan query string langsung
6. **SELECT *** - Mengambil semua kolom (information disclosure)
7. **No CSRF Protection** - Vulnerable terhadap CSRF attacks
8. **No Rate Limiting** - Brute force attacks possible
9. **No Session Security** - Tidak ada session hardening
10. **Insecure Error Handling** - Error messages terlalu detail

---

## Tahap 2: Implementasi Secure Code

### Strategi Security Hardening

Untuk mencapai skor 90%+, kita harus implement:

1. ✅ **Prepared Statements** - Gunakan SQLite3 prepared statements
2. ✅ **Password Hashing** - Gunakan `password_hash()` dan `password_verify()`
3. ✅ **Input Validation** - Validasi semua input
4. ✅ **CSRF Protection** - Implement CSRF tokens
5. ✅ **Rate Limiting** - Limit login attempts
6. ✅ **Session Security** - Secure session cookies
7. ✅ **Output Encoding** - Proper HTML encoding
8. ✅ **Error Handling** - Generic error messages
9. ✅ **Security Headers** - Set security-related HTTP headers
10. ✅ **Password Rehashing** - Upgrade weak hashes automatically

---

## Tahap 3: Kode Secure yang Lengkap

### Implementasi Final (Score: 90.5%)

```php
<?php
declare(strict_types=1);

header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Referrer-Policy: no-referrer');
header('Content-Type: text/plain; charset=utf-8');

function e(string $s): string {
    return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo e('Method Not Allowed');
    exit;
}

// Session hardening
$secure = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off');
session_set_cookie_params([
    'lifetime' => 0,
    'path' => '/',
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Strict',
]);
session_start();

// CSRF token: generate if missing
if (empty($_SESSION['csrf'])) {
    $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

// CSRF validate
$csrfPost = (string)($_POST['csrf'] ?? '');
$csrfSess = (string)($_SESSION['csrf'] ?? '');
if ($csrfPost === '' || !hash_equals($csrfSess, $csrfPost)) {
    http_response_code(400);
    echo e('Bad Request');
    exit;
}

// Inputs
$username = trim((string)($_POST['username'] ?? ''));
$password = (string)($_POST['password'] ?? '');

if ($username === '' || $password === '') {
    http_response_code(400);
    echo e('Invalid credentials');
    exit;
}

if (mb_strlen($username) > 64 || mb_strlen($password) > 256) {
    http_response_code(400);
    echo e('Invalid credentials');
    exit;
}

if (!preg_match('/^[a-zA-Z0-9_.-]{3,64}$/', $username)) {
    http_response_code(400);
    echo e('Invalid credentials');
    exit;
}

// Rate limit (per-session)
$_SESSION['login_attempts'] = (int)($_SESSION['login_attempts'] ?? 0);
$_SESSION['login_last_ts']  = (int)($_SESSION['login_last_ts'] ?? 0);
$now = time();

if ($_SESSION['login_attempts'] >= 5 && ($now - $_SESSION['login_last_ts']) < 60) {
    http_response_code(429);
    echo e('Too many attempts');
    exit;
}

// Queries as constants (no concat)
const SQL_GET_USER   = 'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1';
const SQL_SET_HASH   = 'UPDATE users SET password_hash = ? WHERE id = ?';

try {
    $db = new SQLite3(__DIR__ . '/users.db', SQLITE3_OPEN_READWRITE);
    $db->busyTimeout(2000);

    $stmt = $db->prepare(SQL_GET_USER);
    $stmt->bindValue(1, $username, SQLITE3_TEXT);

    $res = $stmt->execute();
    $row = $res ? $res->fetchArray(SQLITE3_ASSOC) : false;
} catch (Throwable $t) {
    error_log('login_db_error');
    http_response_code(500);
    echo e('Server error');
    exit;
}

// Verify
$ok = false;
$uid = 0;
$storedHash = '';

if (is_array($row) && isset($row['id'], $row['password_hash'])) {
    $uid = (int)$row['id'];
    $storedHash = (string)$row['password_hash'];
    $ok = password_verify($password, $storedHash);
}

// If success: rehash/upgrade if needed
if ($ok) {
    if (password_needs_rehash($storedHash, PASSWORD_DEFAULT)) {
        $newHash = password_hash($password, PASSWORD_DEFAULT);

        try {
            $u = $db->prepare(SQL_SET_HASH);
            $u->bindValue(1, $newHash, SQLITE3_TEXT);
            $u->bindValue(2, $uid, SQLITE3_INTEGER);
            $u->execute();
        } catch (Throwable $t) {
            error_log('rehash_update_failed');
        }
    }

    session_regenerate_id(true);
    $_SESSION['uid'] = $uid;
    $_SESSION['uname'] = (string)$row['username'];
    $_SESSION['login_attempts'] = 0;
    $_SESSION['login_last_ts'] = $now;

    echo e('Login success');
    exit;
}

// Fail path
$_SESSION['login_attempts']++;
$_SESSION['login_last_ts'] = $now;

error_log('login_failed');

http_response_code(401);
echo e('Invalid credentials');
```

---

## Tahap 4: Security Audit Results

### CSIRT Security Score: **90.5%** (19/21 checks passed)

#### ✅ Passed Security Checks:

1. ✅ Uses SQLite3 prepared statements
2. ✅ No SQL string concatenation with variables
3. ✅ Validates and sanitizes all inputs
4. ✅ Uses `password_hash()` for password storage
5. ✅ Uses `password_verify()` for authentication
6. ✅ Uses specific column selection (no `SELECT *`)
7. ✅ Secure error handling (no debug output)
8. ✅ Implements session security
9. ✅ CSRF protection implemented
10. ✅ Rate limiting considered
11. ✅ Secure database connection
12. ✅ No direct `$_POST` in database operations
13. ✅ Validates input length
14. ✅ Proper output encoding
15. ✅ Proper prepared statement execution
16. ✅ Uses `fetchArray(SQLITE3_ASSOC)` or `fetch_assoc`
17. ✅ Uses `password_needs_rehash` check
18. ✅ Implements login logging
19. ✅ Uses secure password hashing algorithm
20. ✅ Validates username format
21. ✅ Sets secure session cookies

---

## Analisis Security Improvements

### Perbandingan Before & After

| Aspek | Vulnerable Code | Secure Code |
|-------|----------------|-------------|
| **SQL Query** | String concatenation | Prepared statements |
| **Password** | Plain text | `password_hash()` + `password_verify()` |
| **Input Validation** | ❌ None | ✅ Whitelist regex, length check |
| **CSRF Protection** | ❌ None | ✅ Token validation |
| **Rate Limiting** | ❌ None | ✅ 5 attempts per 60 seconds |
| **Session Security** | ❌ None | ✅ Secure cookies, regenerate ID |
| **Error Messages** | ❌ Detailed | ✅ Generic |
| **Output Encoding** | Partial | Full `htmlspecialchars()` |
| **Security Headers** | ❌ None | ✅ Multiple headers |
| **Debug Output** | ❌ `var_dump()` | ✅ None |

---

## Key Security Principles Applied

### 1. Defense in Depth

Implementasi multiple layers of security:
- Input validation
- Prepared statements  
- Password hashing
- CSRF tokens
- Rate limiting
- Session security

### 2. Principle of Least Privilege

```php
const SQL_GET_USER = 'SELECT id, username, password_hash FROM users WHERE username = ? LIMIT 1';
```
- Hanya select kolom yang dibutuhkan
- LIMIT 1 untuk performa dan security

### 3. Secure by Default

```php
session_set_cookie_params([
    'secure' => $secure,
    'httponly' => true,
    'samesite' => 'Strict',
]);
```
- Cookies secure by default
- HttpOnly prevents XSS
- SameSite prevents CSRF

### 4. Fail Securely

```php
if ($ok) {
    // Success path
} else {
    // Fail securely - generic error
    echo e('Invalid credentials');
}
```
- Generic error messages
- No information disclosure
- Proper HTTP status codes

---

## Common Security Mistakes to Avoid

### ❌ Don't Do This:

```php
// BAD: SQL Injection
$query = "SELECT * FROM users WHERE username = '$username'";

// BAD: Plain text password
$query = "... WHERE password = '$password'";

// BAD: Detailed error messages
echo "User $username not found in database";

// BAD: No input validation
$username = $_POST['username'];

// BAD: var_dump in production
var_dump($_POST);
```

### ✅ Do This Instead:

```php
// GOOD: Prepared statements
$stmt = $db->prepare('SELECT ... WHERE username = ?');
$stmt->bindValue(1, $username, SQLITE3_TEXT);

// GOOD: Password hashing
password_verify($password, $storedHash);

// GOOD: Generic error messages
echo 'Invalid credentials';

// GOOD: Input validation
if (!preg_match('/^[a-zA-Z0-9_.-]{3,64}$/', $username)) {
    exit;
}

// GOOD: No debug output
error_log('login_failed');
```

---

## Flag

Setelah submit kode secure dan mencapai score **90.5%**:

```
🎉 CONGRATULATIONS!

Your implementation meets CSIRT Secure Coding Standards!

FLAG: BakaCTF{y4ng_p4ke_AI_gay}
```

---

## Pembelajaran

### Skills yang Dipelajari

1. **Secure Coding Principles** - OWASP best practices
2. **SQL Injection Prevention** - Prepared statements
3. **Password Security** - Proper hashing algorithms
4. **CSRF Protection** - Token-based validation
5. **Session Security** - Secure cookie configuration
6. **Input Validation** - Whitelist approach
7. **Rate Limiting** - Brute force prevention
8. **Error Handling** - Information disclosure prevention

### OWASP Top 10 Coverage

Challenge ini mencakup proteksi terhadap:
- ✅ A01: Broken Access Control
- ✅ A02: Cryptographic Failures (password hashing)
- ✅ A03: Injection (SQL Injection)
- ✅ A05: Security Misconfiguration
- ✅ A07: Identification and Authentication Failures

---

## Resources untuk Belajar Lebih Lanjut

### Official Documentation
- [PHP Password Hashing](https://www.php.net/manual/en/function.password-hash.php)
- [SQLite3 Prepared Statements](https://www.php.net/manual/en/sqlite3.prepare.php)
- [OWASP Secure Coding Practices](https://owasp.org/www-project-secure-coding-practices-quick-reference-guide/)

### Security Best Practices
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [PHP Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/PHP_Configuration_Cheat_Sheet.html)

---

**Selesai! 🔒**

Challenge ini mengajarkan fundamental secure coding yang essential untuk web development:
- Never trust user input
- Always use prepared statements
- Hash passwords with modern algorithms
- Implement defense in depth
- Fail securely
- Log security events
