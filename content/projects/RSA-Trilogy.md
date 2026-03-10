---
title: "Write Up – RSA Trilogy"
description: "Migrated from database"
year: 2026
category: "CTF"
techStack: "CTF, Crypto, RSA, Small-Exponent-Attack,"
githubUrl: "-"
demoUrl: "-"
coverUrl: "/uploads/cover_1769412957756_ae1071ae620ef.png"
createdAt: "2026-01-26T07:35:57.822Z"
updatedAt: "2026-01-26T07:35:57.822Z"
---

# Write Up – RSA Trilogy

# Write Up – RSA Trilogy

## Challenge Overview
**Category:** Crypto  
**Difficulty:** Easy  
**Author:** aria

Challenge ini terdiri dari **3 bagian RSA** yang masing-masing mengeksploitasi celah atau kelemahan berbeda dalam implementasi RSA. Setiap bagian memberikan satu potongan flag yang harus digabungkan untuk mendapatkan flag lengkap.

Format flag:
```
FGTE{...}
```

---

## Files Given

### 1. Part 1 Files
- `part1_pubkey.pem` - RSA public key (PEM format)
- `part1_ciphertext.enc` - Base64-encoded ciphertext

### 2. Part 2 File
- `part2.txt` - Contains `n`, `e`, and `ciphertext` values

### 3. Part 3 File
- `part3.txt` - Contains `n`, `e`, `x` (sum of primes), and `ciphertext` values

---

## Part 1: Small Exponent Attack (e = 3)

### Key Insight
**Low Public Exponent without Padding**

```python
e = 3
```

Ketika eksponen publik sangat kecil (e=3) dan plaintext kecil, maka `m^3 < n`, sehingga tidak terjadi modulo operation.

**Attack:**
```
c = m^3 (no modulo)
m = ∛c
```

### Solution

```python
import base64
from Crypto.PublicKey import RSA
from Crypto.Util.number import bytes_to_long, long_to_bytes

def iroot_k(n, k):
    """Calculate integer k-th root"""
    lo, hi = 0, 1
    while hi**k <= n:
        hi *= 2
    while lo + 1 < hi:
        mid = (lo + hi) // 2
        if mid**k <= n:
            lo = mid
        else:
            hi = mid
    return lo

# Load public key
pub_pem = open("part1_pubkey.pem", "rb").read()
rsa = RSA.import_key(pub_pem)
e1, n1 = rsa.e, rsa.n

# Load and decode ciphertext
ct1_b64 = open("part1_ciphertext.enc", "r").read().strip()
c1 = bytes_to_long(base64.b64decode(ct1_b64 + "==="))

# Small exponent attack: m = ∛c
m1 = iroot_k(c1, 3)
part1 = long_to_bytes(m1).decode()

print(f"Part 1: {part1}")
```

**Result:** `FGTE{small_e_works_`

---

## Part 2: Wiener's Attack (Large e, Small d)

### Key Insight
**Wiener's Attack on RSA with Small Private Exponent**

Dari `part2.txt`:
```
n = 104150539323944854218222518232816171826386239923685519274534329680325309132683974594098331104258403147344177189768073033564919038098442267302014694387412013822707091084490543236331842059391521420457366362728247711745105766612827412454300663568582320270027088610499841553840112523546156538174899290062988597593
e = 78740579270309350500158260397098709642129833310142201531554618974616246780757900680733070610557494359287280468205012618493909046694049056934377160129901445553460919676068672752533789927521693126839943987273791616604585961061211346527756846169228011392373290381588435250066915289098198037239703070080127336841
```

Nilai `e` sangat besar (hampir sebesar `n`), mengindikasikan `d` sangat kecil. Ini vulnerable terhadap **Wiener's Attack**.

**Attack Method:**
1. Compute continued fraction expansion of `e/n`
2. For each convergent `k/d`, test if it's valid private key
3. Check if `(e*d - 1) % k == 0` dan `φ = (e*d - 1)/k` valid

### Solution

```python
import math
from Crypto.Util.number import inverse

def cont_frac(a, b):
    """Continued fraction expansion"""
    cf = []
    while b:
        q = a // b
        cf.append(q)
        a, b = b, a - q*b
    return cf

def convergents(cf):
    """Calculate convergents from continued fraction"""
    out = []
    for i in range(len(cf)):
        num, den = 1, 0
        for a in reversed(cf[:i+1]):
            num, den = den + a*num, num
        out.append((num, den))
    return out

def wiener_attack(e, n):
    """Wiener's attack to recover d, p, q"""
    cf = cont_frac(e, n)
    for k, d in convergents(cf):
        if k == 0:
            continue
        if (e*d - 1) % k != 0:
            continue
        phi = (e*d - 1) // k
        s = n - phi + 1
        disc = s*s - 4*n
        if disc < 0:
            continue
        t = math.isqrt(disc)
        if t*t != disc:
            continue
        p = (s + t) // 2
        q = (s - t) // 2
        if p*q == n:
            return d, p, q
    return None

# Parse part2.txt
txt2 = open("part2.txt", "r").read()
n2 = int(txt2.split("n = ")[1].splitlines()[0].strip())
e2 = int(txt2.split("e = ")[1].splitlines()[0].strip())
c2 = int(txt2.split("ciphertext = ")[1].splitlines()[0].strip())

# Wiener's attack
d2, p2, q2 = wiener_attack(e2, n2)

# Decrypt
m2 = pow(c2, d2, n2)
part2 = long_to_bytes(m2).decode()

print(f"Part 2: {part2}")
```

**Result:** `wiener_strikes_back_`

---

## Part 3: Known Sum of Primes (p + q)

### Key Insight
**Factoring n when p+q is Known**

Dari `part3.txt`:
```
n = 0x6b26d86d654e1bb88dbd6da05866e97eebc1169dce56bd3c52c65c49851ffe3bc5ae114cc22fa491f6d6675ba1fdb7a846d199f5e9e68af6322ab7ead2c481aa160c15f9132e0ee07e84423d3e0fa108857198250bb37f032c9499b205beb0f42aee43b533dc79f53a7e27737dd7679d4d44f0beed6a15e78179449a0c655603
e = 65537
x = 0x14ddc18c5fe16ac1125fe2a7049c3c53f98d2c5ecf552013534ddbfc06a714fe094eb33226ad6273eeb9a30d9c01d752b4f7adae4e34c16532cd6b8e2d4e01bac
```

Di mana `x = p + q`.

**Attack:**
Jika kita tahu `p + q` dan `p * q = n`, kita bisa solve quadratic equation:
```
p + q = x
p * q = n

Dari persamaan kuadrat: t² - xt + n = 0
Diskriminan: Δ = x² - 4n
p = (x + √Δ) / 2
q = (x - √Δ) / 2
```

### Solution

```python
import math
from Crypto.Util.number import inverse, long_to_bytes

# Parse part3.txt
txt3 = open("part3.txt", "r").read()
n3 = int(txt3.split("n = ")[1].splitlines()[0].strip(), 16)
e3 = int(txt3.split("e = ")[1].splitlines()[0].strip())
x3 = int(txt3.split("x = ")[1].splitlines()[0].strip(), 16)  # p + q
c3 = int(txt3.split("ciphertext = ")[1].splitlines()[0].strip(), 16)

# Solve quadratic equation
disc = x3*x3 - 4*n3
t = math.isqrt(disc)

if t*t != disc:
    raise ValueError("Discriminant is not a perfect square!")

p3 = (x3 + t) // 2
q3 = (x3 - t) // 2

# Verify factorization
assert p3 * q3 == n3

# Calculate private key
phi3 = (p3 - 1) * (q3 - 1)
d3 = inverse(e3, phi3)

# Decrypt
m3 = pow(c3, d3, n3)
part3 = long_to_bytes(m3).decode()

print(f"Part 3: {part3}")
```

**Result:** `sum_of_primes_indeed!}`

---

## Complete Solve Script

```python
#!/usr/bin/env python3
import base64, math
from Crypto.PublicKey import RSA
from Crypto.Util.number import bytes_to_long, long_to_bytes, inverse

# ---------- Helpers ----------
def iroot_k(n, k):
    lo, hi = 0, 1
    while hi**k <= n:
        hi *= 2
    while lo + 1 < hi:
        mid = (lo + hi) // 2
        if mid**k <= n:
            lo = mid
        else:
            hi = mid
    return lo

def cont_frac(a, b):
    cf = []
    while b:
        q = a // b
        cf.append(q)
        a, b = b, a - q*b
    return cf

def convergents(cf):
    out = []
    for i in range(len(cf)):
        num, den = 1, 0
        for a in reversed(cf[:i+1]):
            num, den = den + a*num, num
        out.append((num, den))
    return out

def wiener_attack(e, n):
    cf = cont_frac(e, n)
    for k, d in convergents(cf):
        if k == 0:
            continue
        if (e*d - 1) % k != 0:
            continue
        phi = (e*d - 1) // k
        s = n - phi + 1
        disc = s*s - 4*n
        if disc < 0:
            continue
        t = math.isqrt(disc)
        if t*t != disc:
            continue
        p = (s + t)//2
        q = (s - t)//2
        if p*q == n:
            return d, p, q
    return None

# ---------- PART 1: Small Exponent Attack ----------
print("[*] Solving Part 1: Small Exponent Attack (e=3)")
pub_pem = open("part1_pubkey.pem", "rb").read()
rsa = RSA.import_key(pub_pem)
e1, n1 = rsa.e, rsa.n

ct1_b64 = open("part1_ciphertext.enc", "r").read().strip()
c1 = bytes_to_long(base64.b64decode(ct1_b64 + "==="))

m1 = iroot_k(c1, 3)
part1 = long_to_bytes(m1).decode(errors="replace")
print(f"[+] Part 1: {part1}")

# ---------- PART 2: Wiener's Attack ----------
print("\n[*] Solving Part 2: Wiener's Attack")
txt2 = open("part2.txt", "r").read()
n2 = int(txt2.split("n = ")[1].splitlines()[0].strip())
e2 = int(txt2.split("e = ")[1].splitlines()[0].strip())
c2 = int(txt2.split("ciphertext = ")[1].splitlines()[0].strip())

res = wiener_attack(e2, n2)
if not res:
    raise SystemExit("[-] Wiener attack failed!")

d2, p2, q2 = res
m2 = pow(c2, d2, n2)
part2 = long_to_bytes(m2).decode(errors="replace")
print(f"[+] Part 2: {part2}")

# ---------- PART 3: Known Sum of Primes ----------
print("\n[*] Solving Part 3: Known p+q")
txt3 = open("part3.txt", "r").read()
n3 = int(txt3.split("n = ")[1].splitlines()[0].strip(), 16)
e3 = int(txt3.split("e = ")[1].splitlines()[0].strip())
x3 = int(txt3.split("x = ")[1].splitlines()[0].strip(), 16)  # p + q
c3 = int(txt3.split("ciphertext = ")[1].splitlines()[0].strip(), 16)

disc = x3*x3 - 4*n3
t = math.isqrt(disc)

if t*t != disc:
    raise SystemExit("[-] Discriminant is not a perfect square!")

p3 = (x3 + t) // 2
q3 = (x3 - t) // 2
phi3 = (p3 - 1) * (q3 - 1)
d3 = inverse(e3, phi3)

m3 = pow(c3, d3, n3)
part3 = long_to_bytes(m3).decode(errors="replace")
print(f"[+] Part 3: {part3}")

# ---------- Combine Flag ----------
flag = part1 + part2 + part3
print(f"\n[+] Complete Flag: {flag}")
```

**Output:**
```
[*] Solving Part 1: Small Exponent Attack (e=3)
[+] Part 1: FGTE{small_e_works_

[*] Solving Part 2: Wiener's Attack
[+] Part 2: wiener_strikes_back_

[*] Solving Part 3: Known p+q
[+] Part 3: sum_of_primes_indeed!}

[+] Complete Flag: FGTE{small_e_works_wiener_strikes_back_sum_of_primes_indeed!}
```

---

## Conclusion

Challenge ini mengajarkan **3 serangan klasik pada RSA**:

1. **Small Exponent Attack (Part 1):** Ketika `e=3` dan message kecil, `m^3 < n` sehingga bisa langsung dihitung cube root tanpa perlu faktoring.

2. **Wiener's Attack (Part 2):** Ketika private exponent `d` sangat kecil (d < n^0.25), kita bisa recover `d` menggunakan continued fraction expansion dari `e/n`.

3. **Known Sum of Primes (Part 3):** Jika `p+q` diketahui, kita bisa langsung factor `n` menggunakan persamaan kuadrat karena `p` dan `q` adalah solusi dari `t² - (p+q)t + pq = 0`.

> **Pelajaran:** RSA hanya aman jika parameter dipilih dengan benar. Gunakan `e = 65537`, pastikan `d` cukup besar, dan jangan pernah leak informasi tentang faktor prima seperti `p+q`, `p-q`, atau `gcd(p-1, q-1)`.

---
