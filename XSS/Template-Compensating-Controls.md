# Attack Vectors

## Compensating Controls


1. Cookie Flags
2. Browser Security Header
3. Content Security Policy (CSP)
4. Web Applications Firewall (WAF)
5. Client-Side  Validation
6. Server-Side Validation
7. Ouptut Encoding

---

1. Cookie Flags
2. Browser Security Header
      - Contoh :
      1. `X-Frame-Options: SAMEORIGIN`
      2. `X-Xss-Protestion: 1;mode=block`
      3. `Cache-Control: private, max-age=0`
      4. `X-Content-Type-Options: nosniff`
      5. `Strict-Transport-Security: max-age=31536000; includeSubDomains`
      6. `Referrer-Policy: no-referrer`
      7. `Permissions-Policy: geolocation=(), camera=()`
      8. `Cross-Origin-Resource-Policy: same-origin`
      9. `Cross-Origin-Opener-Policy: same-origin`
      10. `Cross-Origin-Embedder-Policy: require-corp`
      11. `X-Cache: HIT from cloudfront`
      12. `Pragma: no-cache`
3. Content Security Policy (CSP)
      - Contoh :
        1. `Content-Security-Policy: script-src 'self'; object-src 'none'`
4.  Web Applications Firewall (WAF)
      - Contoh :
        1. `Cloudflare WAF`
        2. `Cloudfront WAF`
5. Client-Side  Validation
6. Server-Side Validation
7. Ouptut Encoding