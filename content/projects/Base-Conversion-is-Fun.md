---
title: "Writeup: Base Conversion is Fun"
description: "Migrated from database"
year: 2025
category: "CTF"
techStack: "CTF, Cryptography, CLI"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1768735276640_b209b74b5151b.png"
createdAt: "2026-01-17T23:55:47.310Z"
updatedAt: "2026-01-24T17:48:43.413Z"
---

# Writeup: Base Conversion is Fun

# Write-up CTF: Base Conversion is Fun

## Informasi Challenge

**Nama:** Base Conversion is Fun  
**Kategori:** Cryptography / Encoding  
**Tingkat Kesulitan:** Easy  

**Deskripsi:**
> Diberikan sebuah string terenkripsi yang tampaknya menggunakan skema encoding tertentu. Tujuannya adalah untuk mengembalikan string tersebut ke format aslinya (flag).

**String yang Diberikan:**
```
VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==
```

---

## Analisis String

### Karakteristik String

String yang diberikan memiliki ciri-ciri khas **Base64 Encoding**:

1. ✅ **Kombinasi karakter**: Menggunakan huruf besar (A-Z), huruf kecil (a-z), dan angka (0-9)
2. ✅ **Padding**: Terdapat karakter padding berupa simbol sama dengan (`==`) di bagian akhir
3. ✅ **Panjang**: Panjang string merupakan kelipatan 4 (standar Base64)

### Apa itu Base64?

Base64 adalah skema encoding yang mengubah data binary menjadi format teks ASCII. Encoding ini sering digunakan untuk:
- Mentransmisikan data binary melalui medium yang hanya mendukung teks
- Menyimpan data dalam format yang aman untuk URL atau email
- Mengobfuscate data sederhana (bukan enkripsi yang aman!)

**Karakteristik Base64:**
- Menggunakan 64 karakter: A-Z, a-z, 0-9, +, /
- Padding dengan karakter `=` jika diperlukan
- Setiap 3 bytes input menghasilkan 4 karakter output

---

## Solusi

### Metode 1: Menggunakan Command Line Linux

Gunakan tool bawaan `base64` untuk melakukan decode:

```bash
echo "VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==" | base64 -d
```

**Output:**
```
Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}
```

### Metode 2: Menggunakan Python

```python
import base64

encoded_string = "VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ=="
decoded_bytes = base64.b64decode(encoded_string)
flag = decoded_bytes.decode('utf-8')

print(flag)
```

**Output:**
```
Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}
```

### Metode 3: Online Tool

Bisa juga menggunakan online Base64 decoder seperti:
- https://www.base64decode.org/
- https://base64.guru/converter/decode
- CyberChef (https://gchq.github.io/CyberChef/)

**Langkah:**
1. Buka salah satu website di atas
2. Paste string encoded: `VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==`
3. Klik "Decode" atau tool akan otomatis decode
4. Dapatkan hasil: `Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}`

---

## Penjelasan Detail

### Proses Encoding (Bagaimana String Ini Dibuat)

```
Original Text: Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}
       ↓
   Base64 Encode
       ↓
Encoded: VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==
```

### Proses Decoding (Yang Kita Lakukan)

```
Encoded: VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==
       ↓
   Base64 Decode
       ↓
Original: Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}
```

### Mengapa Ada Padding (==)?

Padding (`=`) ditambahkan di akhir string Base64 untuk memastikan panjang output adalah kelipatan 4. 

- Jika data asli panjangnya tidak habis dibagi 3, Base64 akan menambahkan padding
- `=` artinya 1 byte padding
- `==` artinya 2 byte padding

---

## Tips untuk Mengenali Base64

### Ciri-ciri Visual

✅ **Ya, kemungkinan Base64 jika:**
- String hanya berisi A-Z, a-z, 0-9, +, /, dan =
- Panjang string adalah kelipatan 4
- Karakter `=` hanya muncul di akhir (maksimal 2 karakter)
- Tidak ada spasi atau karakter khusus lainnya

❌ **Bukan Base64 jika:**
- Ada karakter selain yang disebutkan di atas
- Ada spasi di tengah string
- `=` muncul di tengah atau lebih dari 2 di akhir

### Contoh String Base64

```
SGVsbG8gV29ybGQ=           → Hello World
VGhpcyBpcyBhIHRlc3Q=       → This is a test
Q1RGe2Jhc2U2NF9pc19mdW59   → CTF{base64_is_fun}
```

---

## Variasi Base Encoding Lainnya

Base64 bukan satu-satunya encoding berbasis "base". Ada beberapa variasi:

### Base32
- Menggunakan 32 karakter: A-Z dan 2-7
- Contoh: `JBSWY3DPEBLW64TMMQ======`

### Base85 (ASCII85)
- Menggunakan 85 karakter ASCII yang dapat dicetak
- Lebih efisien daripada Base64 (20% lebih pendek)

### Base58
- Digunakan di Bitcoin addresses
- Menghindari karakter yang mudah tertukar: 0, O, I, l

### Hexadecimal (Base16)
- Menggunakan 16 karakter: 0-9, A-F
- Contoh: `48656c6c6f` → Hello

---

## Command Lengkap untuk Berbagai Tools

### Linux/Mac Terminal

```bash
# Decode Base64
echo "VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==" | base64 -d

# Decode dan simpan ke file
echo "VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ==" | base64 -d > flag.txt

# Decode dari file
base64 -d encoded.txt
```

### Python

```python
import base64

# Method 1: Langsung dari string
encoded = "VmlhbnVfQ1RGezIyN2JjODViZDk0M2RkMDBkZmY3NDVmZTNjY2FkMzcxfQ=="
print(base64.b64decode(encoded).decode())

# Method 2: Dari file
with open('encoded.txt', 'r') as f:
    encoded = f.read()
    decoded = base64.b64decode(encoded).decode()
    print(decoded)
```

### CyberChef Recipe

```
From Base64 (A-Za-z0-9+/=, true)
```

---

## Pembelajaran

### Apa yang Dipelajari

1. **Base64 Encoding/Decoding** - Skill fundamental dalam CTF
2. **Pattern Recognition** - Mengenali pola encoding dari karakteristik string
3. **Tool Usage** - Menggunakan berbagai tools untuk decode

### Best Practices untuk CTF

- ✅ Selalu cek padding (`=`) di akhir string
- ✅ Coba decode dengan berbagai encoding jika Base64 tidak berhasil
- ✅ Gunakan CyberChef untuk chain multiple operations
- ✅ Simpan hasil decode untuk analisis lebih lanjut

### Common Mistakes

- ❌ Lupa menghapus whitespace sebelum decode
- ❌ Tidak memperhatikan case-sensitive (Base64 is case-sensitive!)
- ❌ Mengira Base64 adalah enkripsi yang aman (ini hanya encoding!)

---

## Flag

```
Vianu_CTF{227bc85bd943dd00dff745fe3ccad371}
```

---

## Cheat Sheet: Base64 Quick Reference

### Decode Base64

| Platform | Command |
|----------|---------|
| Linux/Mac | `echo "STRING" \| base64 -d` |
| Windows PowerShell | `[System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String("STRING"))` |
| Python | `import base64; base64.b64decode("STRING").decode()` |
| Online | CyberChef, base64decode.org |

### Encode Base64

| Platform | Command |
|----------|---------|
| Linux/Mac | `echo "STRING" \| base64` |
| Python | `import base64; base64.b64encode("STRING".encode()).decode()` |

---

**Selesai! 🎯**

Challenge ini mengajarkan fundamental encoding yang sering muncul di CTF:
- Base64 adalah encoding, bukan enkripsi
- Mudah dikenali dari pattern karakternya
- Tools sederhana sudah cukup untuk solve
- Foundation untuk challenge crypto yang lebih kompleks
