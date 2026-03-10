---
title: "Write Up - Between the Margins"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Page–line–character, Cipher"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769391464345_0b38f19b5d943.png"
createdAt: "2026-01-26T01:37:44.590Z"
updatedAt: "2026-01-26T01:37:44.590Z"
---

# Write Up - Between the Margins

# Write Up - Between the Margins

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria  

Challenge ini memberikan sebuah file teks sebagai *referensi* dan beberapa angka:

234, 235, 1, 237, 238


Petunjuk utama dari soal:

> Yang penting bukan apa yang dikatakan, melainkan ke mana harus melihat.  
> Sinyal yang kamu temukan hanyalah sebuah rujukan.  
> Sisanya tersembunyi di antara batas-batasnya.

Format flag:
FGTE{WORD_WORD_...}

---

## Initial Analysis
File `referensi.txt` berisi teks naratif yang dibagi menjadi beberapa bagian:

- Judul
- Subjudul
- Page 1 sampai Page 4

Beberapa kalimat kunci di dalam teks:

- *“Search for coordinates.”*
- *“Pages exist. Lines exist. Positions outlive words.”*
- *“The truth lives between the margins.”*

Ini mengindikasikan bahwa:
- Angka **bukan** hasil enkripsi klasik (Caesar, Vigenere, ASCII, dll)
- Angka berfungsi sebagai **koordinat posisi**, bukan nilai kriptografi

---

## Key Insight
Judul challenge **“Between the Margins”** dan petunjuk *“positions outlive words”* mengarah pada **indexing teks**, bukan isi maknanya.

Pendekatan yang benar:
- Hitung **kata secara berurutan** dari seluruh isi `referensi.txt`
- Termasuk:
  - Judul
  - Subjudul
  - Penanda halaman (Page 1, Page 2, dst)
- Gunakan **1-based indexing**

---

## Word Index Extraction
Setelah seluruh teks ditokenisasi menjadi daftar kata berurutan, didapat:

| Index | Word    |
|------:|---------|
| 234   | truth   |
| 235   | lives   |
| 1     | Between |
| 237   | the     |
| 238   | margins |

Jika disusun sesuai urutan angka yang diberikan:

truth lives Between the margins


---

## Final Flag
Sesuai format `FGTE{WORD_WORD_...}` dan menggunakan huruf kapital:


FGTE{TRUTH_LIVES_BETWEEN_THE_MARGINS}


---

## Conclusion
Challenge ini adalah **book cipher sederhana berbasis word index**.  
Kesalahan umum adalah mencoba:
- Dekripsi huruf
- Encoding angka
- Page–line–character cipher

Padahal kuncinya adalah:
> **Bukan apa yang dibaca, tapi ke mana harus melihat.**

---
