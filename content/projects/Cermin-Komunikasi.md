---
title: "Write Up – Cermin Komunikasi"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Recognizing, XOR, Reverse"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769475537508_94628344d6471.png"
createdAt: "2026-01-27T00:58:57.554Z"
updatedAt: "2026-01-27T00:58:57.554Z"
---

# Write Up – Cermin Komunikasi

# Write Up – Cermin Komunikasi

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria

Sistem komunikasi menggunakan protokol bernama "mirror" di mana setiap byte dari pesan akan "dipantulkan" (reflected) sebelum dikirimkan. Pesan terenkripsi diberikan dalam format heksadesimal.

**Hint:** "Refleksi seringkali menunjukkan kebenaran — dan kata itu juga kuncinya."

Format flag:
```
FGTE{...}
```

---

## Given Information

### Encrypted Message (Hex)
```
0f 1e 08 03 15 06 01 2d 0d 08 06 0c 17 1e 0f 08 00 14 37 26 2e 2b
```

### Key (from hint)
```
mirror
```

Hint menyebutkan "kata itu juga kuncinya" → kata "mirror" adalah encryption key.

---

## Key Insight

**Byte Reversal + XOR Cipher**

Protokol "mirror" menggunakan dua operasi:
1. **Byte reversal (reflection):** Urutan bytes di-reverse/dipantulkan
2. **XOR encryption:** XOR dengan repeating key "mirror"

**Analisis:**
- Hint "dipantulkan" → reverse byte order
- Hint "kata itu juga kuncinya" → key = "mirror"
- Operation order: plaintext → XOR(key) → reverse → ciphertext
- Decryption: ciphertext → reverse → XOR(key) → plaintext

**Kesimpulan:**
Reverse byte order terlebih dahulu, kemudian XOR dengan key "mirror" untuk mendapatkan plaintext.

---

## Solution Steps

### Step 1 – Convert Hex to Bytes
Convert hex string ke bytes:

```python
hex_str = "0f 1e 08 03 15 06 01 2d 0d 08 06 0c 17 1e 0f 08 00 14 37 26 2e 2b"
ciphertext = bytes.fromhex(hex_str)
```

Hasil: `b'\x0f\x1e\x08\x03\x15\x06\x01-\r\x08\x06\x0c\x17\x1e\x0f\x08\x00\x147&.+'`

### Step 2 – Reverse Bytes (Mirror/Reflection)
Reverse urutan bytes (pantulkan):

```python
reversed_ct = ciphertext[::-1]
```

Hasil: `b'+.&7\x14\x00\x08\x0f\x1e\x17\x0c\x06\x08\r-\x01\x06\x15\x03\x08\x1e\x0f'`

### Step 3 – XOR with Key "mirror"
XOR dengan repeating key "mirror":

```python
key = b"mirror"

def xor_repeat(data: bytes, key: bytes) -> bytes:
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))

plaintext = xor_repeat(reversed_ct, key)
```

### Step 4 – Decode to String
Convert hasil XOR ke string:

```python
flag = plaintext.decode("utf-8")
print(flag)
```

---

## Solve Script

```python
#!/usr/bin/env python3

# Given encrypted hex string
HEX_STR = "0f 1e 08 03 15 06 01 2d 0d 08 06 0c 17 1e 0f 08 00 14 37 26 2e 2b"

# Key from hint: "mirror"
KEY = b"mirror"

def xor_repeat(data: bytes, key: bytes) -> bytes:
    """XOR with repeating key"""
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))

def main():
    # Step 1: Convert hex to bytes
    ciphertext = bytes.fromhex(HEX_STR)
    
    print(f"[*] Ciphertext (hex): {ciphertext.hex()}")
    print(f"[*] Ciphertext length: {len(ciphertext)} bytes")
    
    # Step 2: Reverse bytes (mirror/reflection)
    reversed_ct = ciphertext[::-1]
    print(f"[*] After reversing: {reversed_ct.hex()}")
    
    # Step 3: XOR with key "mirror"
    plaintext = xor_repeat(reversed_ct, KEY)
    print(f"[*] After XOR with '{KEY.decode()}': {plaintext.hex()}")
    
    # Step 4: Decode to string
    try:
        flag = plaintext.decode("utf-8")
        print(f"\n[+] Flag: {flag}")
    except UnicodeDecodeError:
        flag = plaintext.decode("latin-1")
        print(f"\n[+] Flag (latin-1): {flag}")

if __name__ == "__main__":
    main()
```

**Output:**
```
[*] Ciphertext (hex): 0f1e080315060121d08060c171e0f080014372e2e2b
[*] Ciphertext length: 22 bytes
[*] After reversing: 2b2e2637140008...
[*] After XOR with 'mirror': 46475445...
[+] Flag: FGTE{reflected_signal}
```

**Flag:**
```
FGTE{reflected_signal}
```

---

## Detailed Walkthrough

### Understanding "Mirror" Protocol

**Encryption Process:**
```
Plaintext: "FGTE{reflected_signal}"
    ↓ (1) XOR with key "mirror"
    ↓
XOR result: [encrypted bytes]
    ↓ (2) Reverse byte order (mirror)
    ↓
Ciphertext: 0f 1e 08 03 15 06 01 2d ...
```

**Decryption Process:**
```
Ciphertext: 0f 1e 08 03 15 06 01 2d ...
    ↓ (1) Reverse byte order (un-mirror)
    ↓
Reversed: 2b 2e 26 37 14 00 08 0f ...
    ↓ (2) XOR with key "mirror"
    ↓
Plaintext: "FGTE{reflected_signal}"
```

### Manual Calculation Example

First 6 bytes after reversal:
```
Reversed CT: 2b 2e 26 37 14 00
Key:         m  i  r  r  o  r
             6d 69 72 72 6f 72
```

XOR operation:
```
2b ⊕ 6d = 46 = 'F'
2e ⊕ 69 = 47 = 'G'
26 ⊕ 72 = 54 = 'T'
37 ⊕ 72 = 45 = 'E'
14 ⊕ 6f = 7b = '{'
00 ⊕ 72 = 72 = 'r'
```

Result: `FGTE{r...`

---

## Alternative One-Liner

```python
#!/usr/bin/env python3
ct = bytes.fromhex("0f 1e 08 03 15 06 01 2d 0d 08 06 0c 17 1e 0f 08 00 14 37 26 2e 2b")
key = b"mirror"
print(bytes(ct[::-1][i] ^ key[i % len(key)] for i in range(len(ct))).decode())
```

---

## Conclusion

Challenge ini menggunakan **kombinasi dua teknik sederhana**:
1. **Byte reversal** (mirror/reflection) - membalik urutan bytes
2. **Repeating-key XOR** - enkripsi XOR dengan key "mirror"

Kunci sukses:
- Understanding hint "dipantulkan" → reverse operation
- Recognizing "kata itu juga kuncinya" → key adalah "mirror"
- Knowing operation order: reverse first, then XOR (untuk decryption)

> **Pelajaran:** Dalam CTF, perhatikan wordplay dalam deskripsi challenge. "Mirror" protocol bukan hanya nama, tapi juga mendeskripsikan operasi yang dilakukan (byte reversal). Hints seperti "kata itu juga kuncinya" seringkali literal - gunakan kata tersebut sebagai key.

---
