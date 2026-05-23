# Praktik HTTP Pollution ke website

Hal pertama yang kita lakukan adalah mengirim payload untuk HTTP pollution melalui input, misalnya pada search bar:

`__proto__[1amkaiz3n]=1amkaiz3n`

Jika serangan berhasil, maka prototype object akan terpengaruh sehingga property `1amkaiz3n` dengan value `1amkaiz3n` bisa diwarisi oleh object lain yang dibuat setelah proses tersebut terjadi.

Tujuannya adalah melihat apakah input tersebut benar-benar diproses oleh aplikasi ke dalam object yang tidak aman, sehingga kita bisa mengidentifikasi adanya prototype pollution dan potensi dampaknya di aplikasi.
