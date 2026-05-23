# HTML Attribute Injection & Context Breaking Basics

## Attacking Atributes

RESEP :
  - HTML Attributes 
  - HTML Tags
  - Javascript Function


### CONTOH UTAMA — Title Attribute (basic reflection)

**UI:**
Input = `1amkaiz3n`
Output = `found 1 1amkaiz3n`

**Inspect result:**

```html 
<div id="value" class="text-center">
  <h1 class="text-center" title="1amkaiz3n">Result :</h1>
</div>
```

Sebagai attacker, kita dapat memecah atribut menggunakan **single quote (')**, **double quote (")**, dan juga **karakter space ( )**.Tergantung pada atribut tersebut di atur.Jadi di kasus ini,basic payload tidak akan bekerja atau tidak akan di eksekusi.

### Contoh Attack

Kita akan menggunakan **tanda kutip (")** untuk keluar dari konteks atribut.

Jadi yang terjadi adalah seperti ini:

Atribut asli:
`title=""`

Jika kita menambahkan **tanda kutip (")**, maka akan menjadi:

`<h1 class="text-center" title=""">Result :</h1>`

Disini,kita masih di dalam tag atribut,jadi kita perlu menutup tag tersebut dengan `>`,,Sekarang kondisinay menjadi seperti ini :


`<h1 class="text-center" title=""">>Result :</h1>`

Selanutnya kita tambahkn script atau payload basic di input seperi ini :

`"><script>alert(1)</script>`



Kita bisa melakukn ini ke dalam tag atribut :

`<tag atribute+""><script>alert(1)</script>">...</tag>`

atau ke dalam konten HTML :

```html
<tag> 
"><script>alert(1)</script> ...
</tag>
```

### Contoh di tag <textares>

Selanjuntay untuk kasus di tag `<textarea>` yang memungkinkan multi-line input,seperti email,update status,tetapi element `<textarea>` ini unik karena mengangani konten secara berbeda dari elemen lain.

Misakln kita memasukkan payload sebelumnya,`"><script>alert(1)</script>`,,maka yagn terjadi adalah,di kontenay hanya menampilkan : `"><script>alert(1)</script>`.Jadi payload  tidak di eksekusi dan hanya di anggap teks biasa saja.

Jadi yang harus kita kalukan untuk melewati ini adalah kita harus menutup tag `<textarea>` ini dengan `</textarea>`.Sehinga,payloadany menjadi seprti ini :

`</textarea><script>alert(1)</script>`