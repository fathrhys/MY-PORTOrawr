---
title: "Write Up - Seven Bits"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, Seven-Segments, Binary"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769394397634_5714db634401c.png"
createdAt: "2026-01-26T02:26:37.667Z"
updatedAt: "2026-01-26T02:26:37.667Z"
---

# Write Up - Seven Bits

# Write Up - Seven Bits

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria  

Diberikan deretan biner yang dipotong sama panjang (7 bit). Hint mengarah ke:
- Seven-segment display

Format flag:
FGTE{xxxxx_x_xx}

---

## Given

1111100 0110000 0110111 1110111 0110001 1101110 0001000 0000111 0001000 0111111 0000110

---

## Key Insight
Setiap potongan panjangnya **7 bit**, sesuai jumlah segmen pada **seven-segment display** (a–g).  
Jadi tiap blok biner merepresentasikan **kombinasi segmen menyala**, bukan ASCII.

Agar tidak salah urutan bit (abcdefg vs gfedcba) atau kebalikan bit, dilakukan brute terhadap variasi umum.

Output brute yang paling “masuk akal” adalah:
b??A?y_7_01

Tanda `?` muncul karena tabel mapping seven-seg yang dipakai belum mencakup beberapa huruf.

---

## Decode per Block (abcdefg)
Menggunakan representasi seven-seg standar (bit0=a ... bit6=g):

| Binary    | Hex  | Char |
|----------|------|------|
| 1111100  | 0x7C | b |
| 0110000  | 0x30 | i |
| 0110111  | 0x37 | n |
| 1110111  | 0x77 | a (ditulis sebagai A di seven-seg) |
| 0110001  | 0x31 | r |
| 1101110  | 0x6E | y |
| 0001000  | 0x08 | _ |
| 0000111  | 0x07 | 7 |
| 0001000  | 0x08 | _ |
| 0111111  | 0x3F | 0 |
| 0000110  | 0x06 | 1 |

Hasil gabungan:

binary_7_01

---

## Final Flag

FGTE{binary_7_01}


---
