# Regex

https://regexlearn.com/learn/regex101

Regex adalah singkatan dari Regular Expression (Ekspresi Reguler) . Fungsinya untuk mencocokkan, menemukan, atau mengelola teks.

## Apa itu Ekspresi Reguler (Regex) ? 

Ekspresi reguler adalah serangkaian karakter yang menyatakan pola pencarian. Sering disingkat sebagai Regex atau Regexp . Ekspresi reguler terutama digunakan untuk menemukan atau mengganti kata dalam teks. Selain itu, kita dapat menguji apakah suatu teks sesuai dengan aturan yang telah kita tetapkan.

Misalnya, anggaplah Anda memiliki daftar nama file. Dan Anda hanya ingin menemukan file dengan ekstensi pdf :

```bash
^\w+\.pdf$
```

## Pencocokan Dasar

Karakter atau kata yang ingin kita cari ditulis langsung. Ini mirip dengan proses pencarian biasa. Misalnya, untuk mencari kata "curious" dalam teks, ketik saja seperti itu. 

### Dot/Titik `.` : Karakter Apa Saja

Tanda titik (`.`) memungkinkan pemilihan karakter apa pun, termasuk karakter khusus dan spasi.

### Set Karakter `[abc]`

Jika salah satu karakter dalam sebuah kata bisa memiliki beberapa kemungkinan karakter, kita dapat menggunakan **character class** dengan tanda kurung siku `[]`.

Semua karakter yang berada di dalam `[]` berarti **pilihan karakter yang diperbolehkan**. Regex akan mencocokkan salah satu karakter tersebut.

Contoh: untuk mencari kata yang memiliki pola `b?r` dengan huruf tengah bisa berupa `a`, `e`, `i`, `o`, atau `u`, kita tuliskan semua pilihan tersebut di dalam `[]`.

**Contoh Teks :**

```text
bar ber bir bor bur
```

**Contoh Regex :**

```regex
b[aeiou]r
```

Hasil yang cocok:

```text
bar
ber
bir
bor
bur
```

Penjelasan:

* `b` → harus diawali huruf **b**
* `[aeiou]` → karakter kedua bisa salah satu dari **a, e, i, o, u**
* `r` → harus diakhiri huruf **r**

Jadi `b[aeiou]r` akan mencari semua kata yang memiliki pola **b + salah satu huruf vokal + r**.


### Himpunan Karakter Negatif `[^abc]`

Jika sebelumnya `[]` digunakan untuk memilih **karakter yang diperbolehkan**, maka `[^]` digunakan untuk memilih **karakter yang tidak diperbolehkan**.

Tanda `^` di dalam kurung siku berarti **negasi** atau pengecualian. Jadi regex akan mencari karakter apa pun **selain** karakter yang ditulis setelah `^`.

Contoh: untuk mencari semua kata pada teks di bawah ini kecuali kata yang memiliki huruf tengah `e` dan `o`, kita gunakan `[^eo]`.

**Contoh Teks :**

```text
bar ber bir bor bur
```

**Contoh Regex :**

```regex
b[^eo]r
```

Hasil yang cocok:

```text
bar
bir
bur
```

Penjelasan:

* `b` → harus diawali huruf **b**
* `[^eo]` → karakter tengah **tidak boleh** berupa `e` atau `o`
* `r` → harus diakhiri huruf **r**

Jadi `b[^eo]r` akan mencari kata dengan pola **b + karakter apa pun kecuali e/o + r**.

### Rentang Huruf / Letter Range `[a-z]`

Untuk mencari karakter dalam sebuah rentang, kita dapat menggunakan tanda hubung `-` di dalam tanda kurung siku `[]`.

Formatnya:

```regex
[awal-akhir]
```

Regex akan mencocokkan semua karakter yang berada di antara huruf awal dan huruf akhir, termasuk kedua huruf tersebut.

Pencarian ini **peka terhadap huruf besar dan kecil**. Artinya `[a-z]` hanya cocok dengan huruf kecil, sedangkan `[A-Z]` hanya cocok dengan huruf besar.

**Contoh Teks :**

```text
abcdefghijklmnopqrstuvwxyz
```

**Contoh Regex :**

```regex
[e-o]
```

Hasil yang cocok:

```text
efghijklmno
```

Penjelasan:

* `[e-o]` → mencari semua huruf kecil mulai dari **e sampai o**
* `e` dan `o` juga termasuk dalam hasil pencarian
* Huruf sebelum `e` dan setelah `o` tidak akan cocok

Contoh lain:

```regex
[a-z]
```

akan mencocokkan semua huruf kecil dari **a sampai z**.
