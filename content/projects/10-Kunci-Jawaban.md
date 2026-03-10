---
title: "Write-up CTF: CryptoEasy – 10 Kunci Jawaban"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Vigenere"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769275248840_6cf7a46f36b64.png"
createdAt: "2026-01-24T17:20:49.004Z"
updatedAt: "2026-01-24T17:45:42.529Z"
---

# Write-up CTF: CryptoEasy – 10 Kunci Jawaban

# Write-up CTF: CryptoEasy – 10 Kunci Jawaban

## Informasi Challenge

**Nama:** 10 Kunci Jawaban  
**Kategori:** Crypto  
**Tingkat Kesulitan:** Easy  
**Author:** aria  
**Points:** 100  

---

## Deskripsi Challenge

Diberikan sebuah ciphertext yang diklaim sebagai kunci **“jawaban”** untuk 10 soal.


**Format flag:**
FGTE{jawaban}

**Hint:**
- Menggunakan **Vigenère cipher**
- Jawabannya sudah benar, tinggal dijawab sebanyak jumlah soal

---

## Analisis

Petunjuk **“10 soal”** tidak berarti mengulang plaintext atau kata `jawaban`, melainkan:

> Cipher harus **didecode menggunakan Vigenère sebanyak 10 kali berturut-turut**

Kesalahan umum yang sering terjadi:
- Mengulang hasil decrypt ❌  
- Mengulang kata `jawaban` ❌  
- Nested `FGTE{}` ❌  

Pendekatan yang benar adalah **iterative decryption (loop 10 kali)**.

---

## Metode Penyelesaian

- **Cipher:** Vigenère  
- **Key:** `jawaban`  
- **Alphabet:** `a-z`  
- **Mode:** Standard Vigenère  
- **Case:** Maintain case  
- **Karakter non-huruf:** Diabaikan  

Decrypt dilakukan **10 kali berturut-turut**, di mana:
- Output decrypt ke-`n` menjadi input decrypt ke-`n+1`

---

## Script Python

```python
from string import ascii_lowercase

alpha = ascii_lowercase

def vigenere_decrypt(ct, key):
    res = ""
    ki = 0
    for c in ct:
        if c.lower() in alpha:
            k = alpha.index(key[ki % len(key)])
            p = (alpha.index(c.lower()) - k) % 26
            res += alpha[p].upper() if c.isupper() else alpha[p]
            ki += 1
        else:
            res += c
    return res

cipher = "F4mc_B1d4_M3ab3rR4k4y_S04y_E4w4j4n_J4nt_O3p4b"
key = "jawaban"

for _ in range(10):
    cipher = vigenere_decrypt(cipher, key)

print(cipher)

Hasil Akhir

Setelah 10 kali dekripsi Vigenère, diperoleh plaintext:
K4mu_B1s4_M3ng3rJ4k4n_S04l_J4w4b4n_Y4ng_T3p4t
Flag
FGTE{K4mu_B1s4_M3ng3rJ4k4n_S04l_J4w4b4n_Y4ng_T3p4t}
Catatan

Soal ini menguji:

Pemahaman iterative cipher

Ketelitian membaca hint

Perbedaan antara pengulangan string dan pengulangan proses

Challenge ini terlihat sederhana, namun dirancang untuk menjebak peserta yang hanya mengandalkan asumsi tanpa memahami proses enkripsi secara menyeluruh.
