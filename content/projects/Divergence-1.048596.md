---
title: "Write Up – Divergence: 1.048596"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, RGBA, base32, XOR, ConverImage"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769411297919_ffe5a70099ecb.png"
createdAt: "2026-01-26T07:08:17.988Z"
updatedAt: "2026-01-26T07:08:17.988Z"
---

# Write Up – Divergence: 1.048596

# Write Up – Divergence: 1.048596

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Medium  
**Author:** aria

Sebuah pesan telah dikonversi menjadi gambar greyscale dan disebarkan sebagai media biasa. Namun gambar ini bukan sekadar gambar - setiap piksel menyimpan urutan dan setiap pengulangan memiliki arti. Challenge ini adalah **reverse engineering dari CyberChef recipe** yang menyembunyikan flag dalam pixel values.

**Divergence value:** 1.048596

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Encoded Image (`1.048596.png`)
```
PNG image data, 780 x 420, 8-bit/color RGBA, non-interlaced
Size: 849309 bytes
```

Gambar RGBA yang setiap pixel channel-nya menyimpan encoded data.

---

## Key Insight

**Reverse CyberChef Recipe dengan Image Encoding**

Gambar ini adalah hasil dari **CyberChef encoding pipeline**:

**Original Pipeline:**
```
PNG Flag → Base64 → XOR(key: FGTE) → Zlib Deflate → Base32 → Generate Image (Greyscale)
```

**Reverse Pipeline:**
```
Image → Extract R Channel → Base32 Decode → Zlib Inflate → XOR(key: FGTE) → Base64 Decode → PNG Flag
```

**Analisis:**
- Gambar RGBA dengan ukuran 780×420 pixels
- Data tersimpan di **Red channel** sebagai Base32 ASCII characters
- Setiap pixel's R value = ASCII value dari karakter Base32 (A-Z, 2-7, =)
- Pipeline decoding: R channel → Base32 → Zlib → XOR → Base64 → PNG
- Key XOR: `FGTE` (dari hint CyberChef screenshot)

**Kesimpulan:**
Extract Red channel dari semua pixels, treat sebagai Base32 string, kemudian reverse semua encoding operations.

---

## Solution Steps

### Step 1 – Load Image and Extract Red Channel
Load gambar RGBA dan extract semua nilai Red channel:

```python
from PIL import Image

img = Image.open("1.048596.png").convert("RGBA")
w, h = img.size
pixels = img.getdata()

# Extract R channel dari setiap pixel (r, g, b, a)
stream = bytes([r for (r, g, b, a) in pixels])
```

### Step 2 – Clean and Prepare Base32
Remove null padding di akhir stream dan tambahkan padding Base32 yang proper:

```python
# Remove null bytes padding
stream = stream.split(b"\x00", 1)[0]

# Add proper Base32 padding
b32 = stream + b"=" * ((-len(stream)) % 8)
```

### Step 3 – Base32 Decode
Decode Base32 untuk mendapatkan compressed data:

```python
import base64

compressed = base64.b32decode(b32, casefold=True)
```

### Step 4 – Zlib Inflate
Decompress data menggunakan zlib:

```python
import zlib

inflated = zlib.decompress(compressed)
```

### Step 5 – XOR Decrypt
XOR decrypt dengan repeating key "FGTE":

```python
KEY = b"FGTE"

def xor_repeat(data: bytes, key: bytes) -> bytes:
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))

xor_decrypted = xor_repeat(inflated, KEY)
```

### Step 6 – Base64 Decode
Decode Base64 untuk mendapatkan PNG flag:

```python
# Clean whitespace and add padding
b64_clean = b"".join(xor_decrypted.split())
b64_clean += b"=" * ((-len(b64_clean)) % 4)

# Decode to get final PNG
decoded_png = base64.b64decode(b64_clean, validate=False)

# Save as image
with open("decoded.png", "wb") as f:
    f.write(decoded_png)
```

### Step 7 – Read Flag
Buka `decoded.png` untuk melihat flag yang tersembunyi di dalam gambar.

---

## Solve Script

```python
#!/usr/bin/env python3
from PIL import Image
import base64, zlib

PNG = "1.048596.png"
KEY = b"FGTE"

def xor_repeat(data: bytes, key: bytes) -> bytes:
    """XOR decrypt with repeating key"""
    return bytes(b ^ key[i % len(key)] for i, b in enumerate(data))

# Load image and extract Red channel
img = Image.open(PNG).convert("RGBA")
w, h = img.size
px = img.getdata()

print(f"[*] Image size: {w}x{h}")
print(f"[*] Total pixels: {w * h}")

# Extract R channel from all pixels (row-major order)
stream = bytes([r for (r, g, b, a) in px])

# Remove null byte padding at the end
stream = stream.split(b"\x00", 1)[0]
print(f"[*] Stream length after removing padding: {len(stream)}")

# This is Base32 text (ASCII characters)
# Add proper Base32 padding
b32 = stream + b"=" * ((-len(stream)) % 8)

# Base32 decode
compressed = base64.b32decode(b32, casefold=True)
print(f"[+] Base32 decoded: {len(compressed)} bytes")

# Zlib inflate
inflated = zlib.decompress(compressed)
print(f"[+] Zlib decompressed: {len(inflated)} bytes")

# XOR decrypt to get Base64
b64 = xor_repeat(inflated, KEY)

# Clean and add Base64 padding
b64 = b"".join(b64.split()) + b"=" * ((-len(b64)) % 4)

# Base64 decode to get final PNG
decoded = base64.b64decode(b64, validate=False)
print(f"[+] Base64 decoded: {len(decoded)} bytes")

# Write decoded PNG
with open("decoded.png", "wb") as f:
    f.write(decoded)

print("[+] Flag image saved to decoded.png")
print("[+] Open decoded.png to see the flag!")
```

**Output:**
```
[*] Image size: 780x420
[*] Total pixels: 327600
[*] Stream length after removing padding: ...
[+] Base32 decoded: ... bytes
[+] Zlib decompressed: ... bytes
[+] Base64 decoded: ... bytes
[+] Flag image saved to decoded.png
[+] Open decoded.png to see the flag!
```

**Flag (from decoded.png):**
```
FGTE{Th3_1m4g3_5cr4mbl3r}
```

---

## Conclusion

Challenge ini menggunakan **image-based steganography** dengan multiple encoding layers. Teknik yang digunakan:
1. **Red Channel Extraction** - data tersimpan di R channel sebagai ASCII Base32
2. **Base32 Decode** - convert ASCII stream ke binary
3. **Zlib Inflate** - decompress compressed data
4. **XOR Decrypt** - decrypt dengan repeating key "FGTE"
5. **Base64 Decode** - decode untuk mendapatkan PNG flag
6. **Image Analysis** - baca flag dari gambar hasil decode

Kunci sukses adalah **memahami bahwa pixel values adalah ASCII characters** (bukan mapping numerik), dan **mengikuti exact reverse order** dari CyberChef pipeline.

> **Pelajaran:** Dalam image steganography, data tidak selalu di-encode secara visual. Pixel values bisa merepresentasikan ASCII text atau encoded binary yang perlu di-extract dan di-decode. Perhatikan metadata seperti "Divergence" yang bisa menjadi hint tentang encoding method.

---
