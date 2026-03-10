---
title: "Write Up – Classic Cipher 2"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Base58, Base62, CustomBinary"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769399404176_716c652898c63.png"
createdAt: "2026-01-26T03:50:04.227Z"
updatedAt: "2026-01-26T03:50:04.227Z"
---

# Write Up – Classic Cipher 2

# Write Up – Classic Cipher 2

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** [Unknown]

Diberikan sebuah file `clasic2.txt` yang berisi ciphertext sangat panjang (2815 bytes). Challenge ini melibatkan **multiple encoding layers** yang lebih kompleks dari Classic 1, menggunakan kombinasi Base58, Base62, dan binary mapping.

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Ciphertext (`clasic2.txt`)
```
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
(2815 bytes total)
```

String ini tidak terlihat seperti Base64 standar karena mengandung karakter lowercase dan uppercase yang bercampur.

---

## Key Insight

**Layered Encoding dengan Base58 dan Base62**

Ciphertext menggunakan **multiple encoding layers** yang tidak umum:
1. **Base62** (layer pertama) - encoding menggunakan alfabet `0-9A-Za-z`
2. **Base58** (layer kedua) - encoding Bitcoin-style tanpa karakter ambigu (0, O, I, l)
3. **Binary mapping** dengan nilai dominan: `88 → 0` dan `99 → 1`

**Analisis:**
- String mengandung karakter alphanumeric (Base62 charset)
- Setelah decode Base62 → menghasilkan data yang cocok dengan Base58 charset
- Decode Base58 → menghasilkan deretan angka
- Angka-angka tersebut memiliki 2 nilai dominan: **88** dan **99**
- Mapping binary: 88→0, 99→1 untuk mendapatkan bitstring → ASCII

**Kesimpulan:**
Harus melakukan **3-stage decoding**: Base62 → Base58 → Binary mapping (88/99) → ASCII

---

## Solution Steps

### Step 1 – Base62 Decode
Decode string Base62 menggunakan alfabet `0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`:

```python
import base64

B62_ALPH = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

def base62_decode(s: bytes):
    idx = {c: i for i, c in enumerate(B62_ALPH)}
    n = 0
    for c in s:
        n = n * 62 + idx[c]
    return n.to_bytes((n.bit_length() + 7) // 8 or 1, "big")

with open("clasic2.txt", "rb") as f:
    data = f.read().strip()

stage1 = base62_decode(data)
```

### Step 2 – Base58 Decode
Decode hasil Base62 dengan Base58 (Bitcoin alphabet):

```python
B58_ALPH = b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def base58_decode(s: bytes):
    idx = {c: i for i, c in enumerate(B58_ALPH)}
    n = 0
    for c in s:
        n = n * 58 + idx[c]
    # Handle leading '1' sebagai leading zero bytes
    lead = sum(1 for c in s if c == ord('1') else 0)
    out = n.to_bytes((n.bit_length() + 7) // 8 or 1, "big")
    return b"\x00" * lead + out

stage2 = base58_decode(stage1)
```

Hasil: Deretan angka (dalam bytes) yang didominasi nilai 88 dan 99

### Step 3 – Binary Mapping
Extract angka-angka dan mapping ke bits:
- Nilai `88` → `0`
- Nilai `99` → `1`

```python
# Filter hanya byte 88 dan 99
bits = "".join("0" if b == 88 else "1" if b == 99 else "" for b in stage2)
```

### Step 4 – Bits to Bytes
Convert bitstring ke bytes, kemudian decode sebagai ASCII:

```python
# Pastikan panjang bits kelipatan 8
bits = bits[: (len(bits) // 8) * 8]

# Convert setiap 8 bits menjadi 1 byte
out = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))

print(out.decode())
```

---

## Solve Script

```python
#!/usr/bin/env python3
from pathlib import Path

B62_ALPH = b"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
B58_ALPH = b"123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"

def baseN_decode(s: bytes, alph: bytes):
    idx = {c: i for i, c in enumerate(alph)}
    n = 0
    for c in s:
        n = n * len(alph) + idx[c]
    out = n.to_bytes((n.bit_length() + 7) // 8 or 1, "big")
    # Handle leading zeros for base58
    if alph == B58_ALPH:
        lead = sum(1 for c in s if c == ord('1') else 0)
        out = b"\x00" * lead + out
    return out

# Read ciphertext
data = Path("clasic2.txt").read_bytes().strip()

# Stage 1: Base62 decode
stage1 = baseN_decode(data, B62_ALPH)

# Stage 2: Base58 decode
stage2 = baseN_decode(stage1, B58_ALPH)

# Stage 3: Binary mapping (88->0, 99->1)
bits = "".join("0" if b == 88 else "1" if b == 99 else "" for b in stage2)

# Stage 4: Bits to bytes
bits = bits[: (len(bits) // 8) * 8]
out = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))

print(out.decode())
```

**Output:**
```
FGTE{L4njut4n_Cl4sic_2_b4s3_58_d4n_b4s3_62}
```

---

## Conclusion

Challenge ini menggunakan **layered encoding** dengan kombinasi encoding yang jarang digunakan:
1. **Base62** decoding (alfabet 0-9A-Za-z)
2. **Base58** decoding (Bitcoin-style alphabet)
3. **Custom binary mapping** (88/99 → binary → ASCII)

Kunci dari challenge ini adalah **mengenali Base62 dan Base58 encoding** yang tidak umum dalam CTF, serta menemukan pola binary mapping dengan 2 nilai dominan (88 dan 99).

> **Pelajaran:** Base58 dan Base62 sering digunakan dalam blockchain dan URL shortening. Dalam CTF, perhatikan distribusi byte - jika ada 2 nilai yang sangat dominan (>85%), kemungkinan itu adalah binary encoding.

---
