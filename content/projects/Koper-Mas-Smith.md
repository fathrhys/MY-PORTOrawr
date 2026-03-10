---
title: "Write Up - Koper Mas Smith"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Bytes_to_long, Decoder"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769395111157_8b233bdc348fc.png"
createdAt: "2026-01-26T02:38:31.209Z"
updatedAt: "2026-01-26T02:47:30.635Z"
---

# Write Up - Koper Mas Smith

# Write Up – Koper Mas Smith

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** WanZKey

Diberikan dua file, yaitu `chall.py` dan `output.txt`, yang berisi implementasi RSA dengan parameter khusus:
- `n = p * q` (2048-bit)
- `e = 3` (eksponen publik sangat kecil)
- `c = m^e mod n` (ciphertext utama)
- `BONUS = (2m + 1)^e mod n` (ciphertext tambahan)

Tujuan dari challenge ini adalah **merecover nilai `m`**, yaitu flag yang telah dienkripsi.

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Source Code (`chall.py`)
```python
from Crypto.Util.number import getPrime, bytes_to_long

p = getPrime(1024)
q = getPrime(1024)
n = p * q
e = 3
m = bytes_to_long(open('flag.txt', 'rb').read())

c = pow(m, e, n)
c_bonus = pow(2*m + 1, e, n)

print(f'n = {n}')
print(f'e = {e}')
print(f'c = {c}')
print(f'BONUS = {c_bonus}')
```

### 2. Output (`output.txt`)
```
n = 24047877253441103507612170163621274824476024448146242532149620367866375774180568116730820943531097364620306142442351657434858437546476363588926268765833501207895059077307852064265107346716518027895229155813990181737872391830769383431110227948790630625458742974950544643951340156138540805642103230333863086262037720646193391925890985148467484691366219751675411663066323753511350592483692920465456301226092746744608496110497101649093952047562874805137330965672356740523030935979519129623453808321210640117209246094289020839341589855365567571001444649389040157671270485776978787118123827128311373571598066413397793214119
e = 3
c = 64587411048652722003579907270651465658952749623059183892055105079971817361251883568675070932745762283714982851312186035003127053916421613191144
BONUS = 516699288389221776028639258165211725271621996986405201458888880891600407841942129295901666389321017491246428160584990689127383880026799852102189
```

---

## Key Insight

**Low Exponent Attack (e = 3)**

Karena nilai eksponen publik yang digunakan adalah `e = 3` (sangat kecil), maka jika plaintext `m` cukup kecil akan berlaku:

```
m^3 < n → tidak terjadi operasi modulo
```

**Analisis:**
- Nilai `n` berukuran 2048-bit (~617 digit desimal)
- Nilai `c` hanya ~145 digit desimal (jauh lebih kecil dari `n`)
- Nilai `BONUS` juga ~147 digit desimal (jauh lebih kecil dari `n`)
- Flag biasanya berukuran kecil (< 100 byte), sehingga `m^3` kemungkinan besar tidak melebihi `n`

**Kesimpulan:**
Jika `m^3 < n`, maka `c = m^3` (tanpa modulo), sehingga `m` dapat diperoleh dengan menghitung **integer cube root** dari `c`:

```
m = ∛c
```

---

## Solution Steps

### Step 1 – Verify the Attack Condition
Periksa apakah `c` jauh lebih kecil dari `n`:
- `c` memiliki 145 digit
- `n` memiliki 617 digit
- Karena `c << n`, maka asumsi `m^3 < n` sangat mungkin benar

### Step 2 – Calculate Integer Cube Root
Gunakan fungsi `integer_nthroot` dari library `sympy` untuk menghitung akar pangkat tiga integer dari `c`:

```python
from sympy import integer_nthroot

m, exact = integer_nthroot(c, 3)
```

Parameter `exact` akan bernilai `True` jika `c` adalah perfect cube.

### Step 3 – Convert to Flag
Convert nilai `m` dari long integer kembali ke bytes untuk mendapatkan flag:

```python
from Crypto.Util.number import long_to_bytes

flag = long_to_bytes(m).decode()
```

---

## Solve Script

```python
from sympy import integer_nthroot
from Crypto.Util.number import long_to_bytes

c = 64587411048652722003579907270651465658952749623059183892055105079971817361251883568675070932745762283714982851312186035003127053916421613191144

m, exact = integer_nthroot(c, 3)
assert exact, "c bukan perfect cube, berarti ada wrap modulo n"

flag = long_to_bytes(m).decode(errors="ignore").strip()
print(flag)
```

**Output:**
```
FGTE{Copper_Smith!}
```

---

## Conclusion

Challenge ini mengeksploitasi kelemahan klasik RSA dengan **low public exponent** (`e = 3`) dan **small plaintext**. Ketika `m^e < n`, enkripsi RSA tidak melakukan operasi modulo, sehingga ciphertext dapat di-decrypt dengan simple root extraction tanpa memerlukan private key.

> **Pelajaran:** Jangan pernah menggunakan eksponen publik kecil (`e = 3`) untuk enkripsi RSA tanpa padding yang proper (seperti OAEP), terutama untuk pesan berukuran kecil.

---
