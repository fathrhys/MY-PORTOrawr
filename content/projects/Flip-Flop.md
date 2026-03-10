---
title: "Write-up CTF: CryptoBaby – Flip-Flop"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Chiper"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769275708412_c5fcb77630f84.png"
createdAt: "2026-01-24T17:28:28.470Z"
updatedAt: "2026-01-24T17:32:36.501Z"
---

# Write-up CTF: CryptoBaby – Flip-Flop

# Write-up CTF: CryptoBaby – Flip-Flop

## Informasi Challenge

**Nama:** Flip-Flop  
**Kategori:** Crypto  
**Tingkat Kesulitan:** Baby  
**Author:** aria  
**Points:** 50  

**Files:**
```bash
wget 'https://raw.githubusercontent.com/ariafatah0711/fgte_s1/refs/heads/main/03_crypto/flip_flop/chall.py' -O 'chall.py' \
&& wget 'https://raw.githubusercontent.com/ariafatah0711/fgte_s1/refs/heads/main/03_crypto/flip_flop/cipher.txt' -O 'cipher.txt'
```

---

## Deskripsi Challenge

Sebuah pesan disembunyikan dengan cara membalik urutan bit pada setiap karakter. Karena prosesnya hanya membalik bit, maka untuk mengembalikannya cukup lakukan proses yang sama sekali lagi.

---

## Tahap 1: Analisis Source Code

Isi utama `chall.py`:

```python
def encode(text: str) -> str:
    out = []
    for c in text:
        bits = f"{ord(c):08b}"       # jadi biner 8-bit
        rev = bits[::-1]             # dibalik
        out.append(chr(int(rev, 2))) # balik ke char
    return "".join(out)
```

### Inti Algoritma

Untuk setiap karakter:
1. Diubah menjadi biner 8-bit
2. Urutan bit dibalik (reverse)
3. Dikembalikan menjadi karakter lagi

Karena reverse bit adalah operasi yang bersifat **involutory**:
- Jika dibalik dua kali → kembali ke nilai semula

Artinya:
```
decode(cipher) == encode(cipher)
```

---

## Tahap 2: Observasi Ciphertext

Saat `cipher.txt` dibuka, isinya terlihat "rusak" / aneh karena berisi byte non-printable:

```bash
cat cipher.txt
strings cipher.txt
```

`strings` juga tidak menampilkan apa-apa karena ciphertext bukan teks ASCII yang terbaca.

---

## Tahap 3: Buat Solver (Reverse Bit per Byte)

Karena file disimpan sebagai bytes (latin-1), kita baca `cipher.txt` dalam mode `rb`, lalu balik bit setiap byte.

### Script Solver (`solve.py`)

```python
def flip_byte(b: int) -> int:
    bits = f"{b:08b}"     # byte → biner 8-bit
    rev = bits[::-1]      # reverse bit
    return int(rev, 2)    # kembali ke byte

with open("cipher.txt", "rb") as f:
    data = f.read()

plain = bytes(flip_byte(b) for b in data)
print(plain.decode())
```

### Jalankan Script

```bash
python3 solve.py
```

---

## Hasil Akhir

Output plaintext yang didapat:

```
FGTE{B1T_FL1PP1NG_FUN}
```

---

## Flag

```
FGTE{B1T_FL1PP1NG_FUN}
```

---

## Catatan

Soal ini menguji:
- Pemahaman tentang representasi bit
- Sifat involutory pada operasi bit reversal
- Kemampuan membaca binary file dengan Python

Challenge ini terlihat sederhana namun menguji pemahaman dasar tentang manipulasi bit-level pada data.
