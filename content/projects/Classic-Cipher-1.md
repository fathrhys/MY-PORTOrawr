---
title: "Write Up – Classic Cipher 1"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Base64, Base32, CustomBinary"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769396870966_6e034f646983c.png"
createdAt: "2026-01-26T03:07:51.023Z"
updatedAt: "2026-01-26T03:07:51.023Z"
---

# Write Up – Classic Cipher 1

# Write Up – Classic Cipher 1

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** [Unknown]

Diberikan sebuah file `clasic1.txt` yang berisi ciphertext panjang. Challenge ini melibatkan **multiple encoding layers** yang harus di-decode secara bertahap untuk mendapatkan flag.

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Ciphertext (`clasic1.txt`)
```
RzRZSFlOWlJQUTNURzdCWEdCNkRPTTM0RzRZSFlOWlRQUTNUQTdCWEdGNkRPTVQ0RzRZWFlO...
(2264 bytes total)
```

File ini berisi string Base64 yang sangat panjang.

---

## Key Insight

**Layered Encoding Attack**

Ciphertext menggunakan **multiple encoding layers**:
1. **Base64** (layer pertama)
2. **Base32** (layer kedua)  
3. **Binary encoding** dengan mapping khusus: `70 → 0` dan `71 → 1`

**Analisis:**
- String asli terlihat seperti Base64 (karakter A-Z, a-z, 0-9, +, /, =)
- Setelah decode Base64, hasilnya masih terenkripsi dengan pola Base32
- Decode Base32 menghasilkan deretan angka yang dipisahkan dengan `|`
- Angka-angka tersebut adalah **ASCII values** yang perlu di-mapping ke bits

**Kesimpulan:**
Harus melakukan **3-stage decoding**: Base64 → Base32 → Binary mapping → ASCII

---

## Solution Steps

### Step 1 – Base64 Decode
Decode string Base64 untuk mendapatkan layer kedua:

```python
import base64

with open("clasic1.txt", "rb") as f:
    s0 = f.read().strip()

s1 = base64.b64decode(s0)
```

Hasil: String Base32 (masih terenkode)

### Step 2 – Base32 Decode
Decode hasil Base64 dengan Base32 untuk mendapatkan deretan angka:

```python
nums_text = base64.b32decode(s1).decode()
```

Hasil: String berisi angka-angka yang dipisahkan dengan delimiter `|`, contoh:
```
70|71|70|71|71|...
```

### Step 3 – Parse Numbers
Convert string angka menjadi list of integers:

```python
nums = list(map(int, nums_text.strip().split("|")))
```

### Step 4 – Binary Mapping
Mapping angka ke bits menggunakan aturan:
- `70` → `0`
- `71` → `1`
- Angka lain → diabaikan

```python
bits = "".join("0" if n == 70 else "1" if n == 71 else "" for n in nums)
```

### Step 5 – Bits to Bytes
Convert bitstring ke bytes, kemudian decode sebagai ASCII:

```python
# Pastikan panjang bits kelipatan 8
bits = bits[: (len(bits)//8)*8]

# Convert setiap 8 bits menjadi 1 byte
out = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))

print(out.decode())
```

---

## Solve Script

```python
#!/usr/bin/env python3
import base64

with open("clasic1.txt","rb") as f:
    s0 = f.read().strip()

# Stage 1: Base64 decode
s1 = base64.b64decode(s0)

# Stage 2: Base32 decode
nums_text = base64.b32decode(s1).decode()

# Parse numbers
nums = list(map(int, nums_text.strip().split("|")))

# Stage 3: Binary mapping (70->0, 71->1)
bits = "".join("0" if n == 70 else "1" if n == 71 else "" for n in nums)

# Stage 4: Bits to bytes
bits = bits[: (len(bits)//8)*8]
out = bytes(int(bits[i:i+8], 2) for i in range(0, len(bits), 8))

print(out.decode())
```

**Output:**
```
FGTE{Cob41n L4g1_p4stI_b1sA_}
```

---

## Conclusion

Challenge ini menggunakan **layered classic encoding** dengan 3 tahap decoding:
1. **Base64** decoding
2. **Base32** decoding  
3. **Custom binary mapping** (70/71 → binary → ASCII)

Kunci dari challenge ini adalah **mengenali pola encoding** di setiap layer dan melakukan decoding secara berurutan.

> **Pelajaran:** Dalam multi-layer encoding, decode setiap layer secara sistematis dan perhatikan pola output di setiap tahap untuk menentukan encoding berikutnya.

---
