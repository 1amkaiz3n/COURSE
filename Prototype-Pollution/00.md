# Client-side Prototype Pollution via Browser APIs

## Ringkasan Kerentanan

Aplikasi rentan terhadap DOM XSS melalui prototype pollution di sisi client. Pengembang sudah mencoba melakukan mitigasi, tetapi masih dapat dilewati dengan teknik tertentu.

Untuk menyelesaikan lab ini:

1. Temukan source yang memungkinkan penambahan properti sembarang ke `Object.prototype`.
2. Identifikasi gadget yang bisa mengeksekusi JavaScript.
3. Kombinasikan keduanya untuk memicu `alert()`.

---

## Cara Penyelesaian Manual

### 1. Menemukan Source Prototype Pollution

1. Buka browser dan lakukan injeksi prototype pollution melalui URL:

   ```
   /?__proto__[foo]=bar
   ```

2. Buka DevTools → tab Console.

3. Jalankan:

   ```
   Object.prototype
   ```

4. Amati hasilnya, properti `foo` telah muncul pada prototype. Ini menandakan prototype pollution berhasil.

---

### 2. Identifikasi Gadget

1. Buka DevTools → tab Sources.

2. Analisis file JavaScript yang dimuat oleh aplikasi.

3. Pada file `searchLoggerConfigurable.js`, ditemukan bahwa jika objek `config` memiliki properti `transport_url`, nilai tersebut digunakan untuk menyisipkan script secara dinamis ke DOM.

4. Namun, `transport_url` didefinisikan dan dilindungi menggunakan `Object.defineProperty()` sehingga tidak writable/configurable.

5. Perhatikan bahwa properti `value` tidak didefinisikan secara eksplisit, sehingga berpotensi dieksploitasi melalui prototype pollution.

---

### 3. Membuat Exploit (DOM XSS)

1. Suntikkan properti `value` melalui URL:

   ```
   /?__proto__[value]=foo
   ```

2. Buka tab Elements di DevTools dan periksa HTML halaman.

3. Terlihat adanya elemen:

   ```html
   <script src="foo"></script>
   ```

4. Ubah payload menjadi eksploitasi XSS:

   ```
   /?__proto__[value]=data:,alert(1);
   ```

5. Ketika halaman dimuat ulang, `alert(1)` akan dieksekusi.

---

## Penyelesaian Menggunakan DOM Invader (Burp Suite)

1. Buka lab menggunakan browser bawaan Burp.

2. Aktifkan DOM Invader dan opsi Prototype Pollution.

3. Buka DevTools → tab DOM Invader, lalu reload halaman.

4. DOM Invader akan mendeteksi vektor pollution pada parameter `search`.

5. Klik **Scan for gadgets**.

6. Setelah scanning selesai, buka kembali tab DOM Invader.

7. Terlihat gadget berhasil mencapai sink `script.src` melalui `value`.

8. Klik **Exploit** untuk menghasilkan PoC otomatis.

9. Payload akan dijalankan dan memicu `alert(1)`.

---

