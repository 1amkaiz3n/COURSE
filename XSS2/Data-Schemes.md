# Data Schemes

Data URI scheme adalah mekanisme yang memungkinkan data disematkan langsung di dalam URL tanpa perlu mengambil resource dari server eksternal. Skema ini biasanya dimulai dengan prefix:

```
data:[<mediatype>][;base64],<data>
```


## Contoh Penggunaan Data Scheme

Beberapa contoh sederhana:

```text
data:text/html,<script>alert(1)</script>
```

Contoh di atas mencoba menyisipkan HTML langsung ke dalam URL.

Versi lain menggunakan encoding Base64:

```text
data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pgo=
```

Jika di-decode, isi Base64 tersebut adalah:

```html
<script>alert(1)</script>
```


## Cara Kerja Data Scheme

Data scheme memungkinkan browser untuk membaca konten langsung dari URL tanpa melakukan request ke server. Tergantung konteks penggunaan, data ini bisa diperlakukan sebagai:

* HTML (`text/html`)
* Gambar (`image/png`, `image/jpeg`)
* Teks biasa (`text/plain`)
* SVG (`image/svg+xml`)



## Relevansi terhadap XSS

Pada masa awal perkembangan browser, `data:` scheme sering digunakan sebagai salah satu metode untuk menjalankan script di dalam konteks halaman. Hal ini membuatnya pernah menjadi salah satu vektor XSS yang cukup efektif.

Namun pada browser modern, mekanisme ini sudah diperketat.



## Perilaku Browser Modern

Saat ini, sebagian besar browser modern telah menerapkan beberapa mitigasi keamanan terhadap penggunaan `data:` scheme, terutama ketika digunakan dalam konteks navigasi atau execution context.

Beberapa perubahan penting:

* Script di dalam `data:text/html` tidak lagi selalu dieksekusi dalam konteks halaman utama
* Konten data URI sering dijalankan dalam sandbox terisolasi
* Kebijakan keamanan seperti CSP (Content Security Policy) dapat memblokir eksekusi
* Beberapa browser membatasi eksekusi JavaScript dari data URI pada konteks tertentu



## Kesimpulan

Meskipun `data:` scheme masih dapat digunakan untuk menyisipkan konten HTML atau media, penggunaannya sebagai metode eksekusi JavaScript langsung sudah tidak lagi reliable di browser modern.

Dengan demikian:

* ❌ Tidak lagi efektif sebagai teknik XSS utama
* ⚠️ Hanya berfungsi dalam kondisi spesifik / konfigurasi lemah
* ✅ Lebih sering digunakan untuk embedding data statis, bukan eksekusi script
