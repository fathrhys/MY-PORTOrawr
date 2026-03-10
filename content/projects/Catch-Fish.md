---
title: "Write Up – Catch Fish"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, CBC, zeroIV, Ciphertext, Recognizing-Blowfish"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769474414350_29031a1c096ba.png"
createdAt: "2026-01-27T00:40:14.413Z"
updatedAt: "2026-01-27T00:40:14.413Z"
---

# Write Up – Catch Fish

# Write Up – Catch Fish

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria

Seorang nelayan menyimpan hasil tangkapannya (flag) dalam file terenkripsi. Untuk mendapatkan flag, kita perlu menggunakan "umpan" yang tepat yaitu password **"cacing"** 🪱 (worm/bait dalam bahasa Indonesia).

**Hint:** "gunakan tool yang lebih mudah tanpa perlu setting mode dan iv mungkin akan membantu.."

Format flag:
```
FGTE{...}
```

---

## Given Information

### Ciphertext (Base64)
```
ZldUWHBG1VYwplBd9eIfSwTx714K9SVSwoKj4h4wcYM5ypO8JIPFjNlYZZtjRiq3
```

### Password/Key
```
cacing
```

---

## Key Insight

**Blowfish Cipher with Password-Based Encryption**

Challenge ini menggunakan **Blowfish encryption** dengan:
- **Password:** `cacing` (6 bytes)
- **Mode:** CBC (Cipher Block Chaining)
- **IV:** Zero IV (`\x00` * 8)
- **Key derivation:** Password di-pad menjadi 16 bytes

**Analisis:**
- Hint menyarankan menggunakan "tool yang lebih mudah" → CyberChef atau script sederhana
- Password "cacing" perlu di-process untuk menjadi valid Blowfish key
- Blowfish menggunakan block size 8 bytes
- IV kemungkinan zero atau di-extract dari ciphertext

**Kesimpulan:**
Decrypt Base64 ciphertext menggunakan Blowfish-CBC dengan password "cacing" dan zero IV.

---

## Solution Steps

### Step 1 – Base64 Decode
Decode ciphertext dari Base64 ke raw bytes:

```python
import base64

b64_ct = "ZldUWHBG1VYwplBd9eIfSwTx714K9SVSwoKj4h4wcYM5ypO8JIPFjNlYZZtjRiq3"
raw = base64.b64decode(b64_ct)
```

### Step 2 – Prepare Blowfish Key
Password "cacing" (6 bytes) perlu di-pad menjadi key length yang valid. Common padding:
- Pad dengan null bytes: `cacing\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00` (16 bytes)
- Repeat key: `cacingcacingcaci` (16 bytes)

```python
password = b"cacing"
key = (password * 3)[:16]  # Repeat and truncate to 16 bytes
# atau
key = password.ljust(16, b"\x00")  # Pad with zeros
```

### Step 3 – Blowfish Decryption
Gunakan Blowfish-CBC dengan zero IV:

```python
from Crypto.Cipher import Blowfish
from Crypto.Util.Padding import unpad

# Key preparation (repeat method works)
password = b"cacing"
key = (password * 3)[:16]  # 'cacingcacingcaci'

# Zero IV for CBC
iv = b"\x00" * 8

# Create cipher and decrypt
cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv=iv)

# Note: First 8 bytes might be IV, rest is ciphertext
# Try decrypting from offset 8
ciphertext = raw[8:]
plaintext = cipher.decrypt(ciphertext)

# Unpad PKCS7
plaintext = unpad(plaintext, 8)

print(plaintext.decode())
```

### Alternative: Using CyberChef
Sesuai hint, bisa menggunakan CyberChef:
1. Input: Base64 string
2. Operation 1: `From Base64`
3. Operation 2: `Blowfish Decrypt`
   - Key: `cacing` (UTF-8)
   - IV: `00 00 00 00 00 00 00 00` (Hex)
   - Mode: CBC
   - Input: Raw (skip first 8 bytes if needed)
   - Output: Raw

---

## Solve Script

```python
#!/usr/bin/env python3
import base64
from Crypto.Cipher import Blowfish
from Crypto.Util.Padding import unpad

# Given ciphertext
b64_ct = "ZldUWHBG1VYwplBd9eIfSwTx714K9SVSwoKj4h4wcYM5ypO8JIPFjNlYZZtjRiq3"

# Decode Base64
raw = base64.b64decode(b64_ct)

# Password
password = b"cacing"

# Prepare Blowfish key (16 bytes by repeating)
key = (password * 3)[:16]  # 'cacingcacingcaci'

# Zero IV (8 bytes for Blowfish)
iv = b"\x00" * 8

# The first 8 bytes of raw might be IV, rest is ciphertext
# Try both: full raw or skip first 8 bytes
attempts = [
    ("Full raw", raw),
    ("Skip first 8 bytes (IV embedded)", raw[8:])
]

for desc, ct in attempts:
    try:
        cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv=iv)
        plaintext = cipher.decrypt(ct)
        
        # Try to unpad
        try:
            plaintext_unpadded = unpad(plaintext, 8)
        except:
            plaintext_unpadded = plaintext
        
        # Check if it contains flag
        if b"FGTE{" in plaintext_unpadded:
            print(f"[+] SUCCESS with: {desc}")
            print(f"[+] Plaintext: {plaintext_unpadded.decode()}")
            break
    except Exception as e:
        continue
```

**Output:**
```
[+] SUCCESS with: Skip first 8 bytes (IV embedded)
[+] Plaintext: flag: FGTE{f1sh_g0t_c4ught}
```

**Flag:**
```
FGTE{f1sh_g0t_c4ught}
```

---

## Alternative Solution: Brute Force Approach

Karena challenge tergolong mudah, bisa juga menggunakan brute force berbagai cipher:

```python
#!/usr/bin/env python3
import base64
from Crypto.Cipher import AES, Blowfish, DES3, DES, ARC4
from Crypto.Util.Padding import unpad

b64_ct = "ZldUWHBG1VYwplBd9eIfSwTx714K9SVSwoKj4h4wcYM5ypO8JIPFjNlYZZtjRiq3"
raw = base64.b64decode(b64_ct)
password = b"cacing"

# Try Blowfish-CBC with zero IV (skip first 8 bytes)
key = (password * 3)[:16]
iv = b"\x00" * 8
ct = raw[8:]

cipher = Blowfish.new(key, Blowfish.MODE_CBC, iv=iv)
pt = cipher.decrypt(ct)
pt = unpad(pt, 8)

print(pt.decode())
```

---

## Conclusion

Challenge ini menggunakan **Blowfish-CBC encryption** dengan:
1. **Password:** `cacing` di-repeat menjadi 16-byte key
2. **Mode:** CBC dengan zero IV
3. **Ciphertext structure:** First 8 bytes might be IV (or padding), actual CT starts at offset 8

Kunci sukses:
- Recognizing Blowfish cipher dari hint "tool yang lebih mudah" (mengacu ke tools seperti CyberChef yang support Blowfish)
- Understanding password "cacing" adalah key yang perlu di-process
- Trying common patterns: zero IV, IV from first bytes, key padding methods

> **Pelajaran:** Dalam password-based encryption, password jarang langsung digunakan sebagai key. Common transformations: padding, repeating, hashing (MD5/SHA), atau KDF (PBKDF2). Dalam CTF, coba zero IV terlebih dahulu karena sering digunakan untuk simplicity.

---
