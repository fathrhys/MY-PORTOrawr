---
title: "Write Up – jejak_kolonial"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "SearchGoogle, FindIsland, CTF, OSINT"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769741134960_cb111a0672ea7772.png"
createdAt: "2026-01-30T02:45:35.279Z"
updatedAt: "2026-01-30T02:45:35.279Z"
---

# Write Up – jejak_kolonial

---

# Write Up – *jejak_kolonial*

## Informasi Challenge

* **Nama Challenge**: jejak_kolonial
* **Kategori**: OSINT
* **Deskripsi Singkat**:
  Diberikan sebuah foto bangunan peninggalan kolonial Inggris di sebuah pulau kecil di Samudra Hindia. Di depan bangunan terdapat papan peringatan (plaque) yang mencatat peristiwa penting pengambilalihan pulau oleh Inggris pada tahun 1888. Tantangan ini meminta nama kapten dan kapal yang tertulis di papan tersebut.

---

## Analisis Awal

Dari deskripsi:

* Pulau kecil di **Samudra Hindia**
* Bangunan peninggalan **kolonial Inggris**
* Kediaman resmi **Administrator Inggris**
* Papan peringatan mencatat **pengambilalihan tahun 1888**

Ciri-ciri ini mengarah kuat ke **Christmas Island**, wilayah teritorial Inggris yang dianeksasi pada akhir abad ke-19.

---

## Analisis Gambar

Gambar menunjukkan:

* Bangunan bergaya kolonial Inggris
* Lokasi di tepi laut dengan tebing
* Papan peringatan berada di bagian depan bangunan

Gambar tambahan yang diberikan memperlihatkan **isi teks papan peringatan** dengan jelas.

Isi papan (disederhanakan):

> *This island, known as Christmas Island, was taken possession of, in the name of Her Most Gracious Majesty Victoria, Queen of Great Britain and Ireland, Empress of India, by Captain William Henry May commanding Her Britannic Majesty’s Ship “Imperieuse” on the 6th day of June, 1888.*

---

## Informasi Penting yang Diperoleh

Dari papan peringatan:

* **Nama Kapten**: William Henry May
* **Nama Kapal**: Imperieuse
* **Tahun**: 1888

Catatan penting:

* Nama kapal **ditulis “Imperieuse”** (tanpa aksen dan bukan “Impérieuse”)
* Sesuai instruksi challenge:

  * Huruf kecil semua
  * Spasi diganti underscore
  * Tidak menyertakan “HMS”

---

## Penyusunan Flag

Format yang diminta:

```
FGTE{nama_kapten_nama_kapal}
```

Maka:

* `william_henry_may`
* `imperieuse`

---

## Final Flag

```
FGTE{william_henry_may_imperieuse}
```

---

## Kesimpulan

Challenge ini menekankan ketelitian OSINT, khususnya:

* Mengacu pada **teks yang tertulis langsung di sumber primer (plaque)**
* Tidak menggunakan variasi nama dari arsip atau sumber sekunder
* Memperhatikan detail penulisan (ejaan kapal)

Kesalahan umum adalah menggunakan nama kapal dengan ejaan berbeda atau menambahkan “HMS”, yang menyebabkan flag menjadi incorrect.

✅ **Flag berhasil ditemukan dengan membaca langsung isi papan peringatan.**

---
