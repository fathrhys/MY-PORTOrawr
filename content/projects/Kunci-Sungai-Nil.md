---
title: "Write Up - Kunci Sungai Nil"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Yunani, Vigenere, Base64"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769393326881_dd5d451219bf2.png"
createdAt: "2026-01-26T02:08:47.137Z"
updatedAt: "2026-01-26T02:10:21.272Z"
---

# Write Up - Kunci Sungai Nil

# Write Up -  Kunci Sungai Nil

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria  

Challenge ini membawa tema Mesir Kuno. Kita diberikan:
- Sebuah ciphertext misterius
- Gambar berisi **8 simbol hieroglif Mesir**
- Petunjuk bahwa **sebuah nama harus diulang terus untuk membuka pesan**

Format flag:
FGTE{WORD_WORD_...}

---

## Files Given

### 1. Ciphertext (`inskripsi_tersembunyi.txt`)

zqPOn86azpV7zpHOoM6cX0pWRFZSX86fV1RWRl/OklnOlV/Ooc6czpN9


### 2. Clue Image (`clue.png`)
Gambar PNG berisi **8 simbol hieroglif Mesir**.

---

## Step 1 – Understanding the Hint
Petunjuk utama:

> “The name etched on the tablet, spoken by the priests during the inundation, unlocks the cryptic symbols.  
> This name must be continuously repeated over the coded message.”

Maknanya:
- Ada **nama tertentu** yang menjadi **kunci**
- Kunci tersebut **diulang terus**
- Ini mengarah ke **repeating-key cipher (Vigenère)**

---

## Step 2 – Decoding the Ciphertext (Base64)
Ciphertext terlihat menggunakan karakter Base64.

Setelah di-*decode*, hasilnya berupa teks dengan **alfabet Yunani dan Latin**:

ΣΟΚΕ{ΑΠΜ_JVDVR_ΟWTVF_ΒYΕ_ΡΜΓ}


---

## Step 3 – Greek to Latin Transliteration
Huruf Yunani hanya berfungsi sebagai **pengaburan visual**.  
Dilakukan transliterasi ke alfabet Latin:

Σ → S
Ο → O
Κ → K
Ε → E
Α → A
Π → P
Μ → M
Β → B
Υ → Y
Ρ → R
Γ → G


Hasil:

SOKE{APM_JVDVR_OWTVF_BYE_RMG}


---

## Step 4 – Analyzing the Hieroglyphs
Dari `clue.png`, terdapat **8 hieroglif**.  
Jika ditransliterasi berdasarkan konvensi hieroglif Mesir:

| Hieroglif | Nilai |
|---------|-------|
| Water ripple | N |
| Reed | I |
| Mouth | R |
| Vulture | A |
| Spiral | H |
| Reed | I |
| Reed | I |
| Cloth | S |

🔑 **Key yang terbentuk:**

NIRAHIIS


Ini sesuai dengan petunjuk:
> *“spoken by the priests during the inundation”*  
Nama sakral + diulang → **Vigenère key**

---

## Step 5 – Vigenère Decryption
Decrypt string:

APM_JVDVR_OWTVF_BYE_RMG

Menggunakan key:
NIRAHIIS

Hasil plaintext:

THE_RIVER_HOLDS_THE_KEY

---

## Final Flag

FGTE{THE_RIVER_HOLDS_THE_KEY}


---

## Conclusion
Challenge ini menggunakan **layered classic crypto**:

1. Base64 decoding  
2. Greek alphabet obfuscation  
3. Hieroglyph transliteration  
4. Vigenère cipher dengan repeating key  

Kunci utama bukan brute force, melainkan **memahami konteks sejarah Mesir Kuno**.

> **Sungai Nil bukan hanya latar — dia adalah kuncinya.**

---
