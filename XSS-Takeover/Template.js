javascript:(function(){
  let defaultConfig = {
      url: "https://auth.grammarly.com/v4/api/oauth/token",
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: {
          client_id: "firefoxExt",
          grant_type: "urn:ietf:params:oauth:grant_type:client_id"
      }
  };
  
  let modal = document.createElement('div');
  modal.style.cssText = "position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.8); z-index:99999; display:flex; justify-content:center; align-items:center;";
  
  let editor = document.createElement('div');
  editor.style.cssText = "background:#1e1e1e; color:#d4d4d4; width:80%; max-width:800px; height:80%; border-radius:8px; padding:20px; font-family:monospace; display:flex; flex-direction:column;";
  
  let title = document.createElement('h3');
  title.textContent = "✏️ Edit Request Config (JSON)";
  title.style.cssText = "margin:0 0 10px 0; color:#fff;";
  
  let textarea = document.createElement('textarea');
  textarea.value = JSON.stringify(defaultConfig, null, 2);
  textarea.style.cssText = "width:100%; height:100%; background:#2d2d2d; color:#d4d4d4; border:none; font-family:monospace; font-size:14px; padding:10px; resize:none; outline:none;";
  
  let buttonDiv = document.createElement('div');
  buttonDiv.style.cssText = "margin-top:15px; display:flex; gap:10px; justify-content:flex-end;";
  
  let runBtn = document.createElement('button');
  runBtn.textContent = "🚀 Execute";
  runBtn.style.cssText = "background:#0d6efd; color:white; border:none; padding:8px 20px; border-radius:5px; cursor:pointer; font-weight:bold;";
  
  let cancelBtn = document.createElement('button');
  cancelBtn.textContent = "❌ Cancel";
  cancelBtn.style.cssText = "background:#6c757d; color:white; border:none; padding:8px 20px; border-radius:5px; cursor:pointer;";
  
  buttonDiv.appendChild(runBtn);
  buttonDiv.appendChild(cancelBtn);
  editor.appendChild(title);
  editor.appendChild(textarea);
  editor.appendChild(buttonDiv);
  modal.appendChild(editor);
  document.body.appendChild(modal);
  
  textarea.focus();
  
  function escapeHtml(str) {
      return str.replace(/[&<>]/g, function(m) {
          if(m === '&') return '&amp;';
          if(m === '<') return '&lt;';
          if(m === '>') return '&gt;';
          return m;
      });
  }
  
  function executeRequest() {
      try {
          let config = JSON.parse(textarea.value);
          let body = config.body;
          
          if (body && typeof body === 'object') {
              body = JSON.stringify(body);
          }
          
          fetch(config.url, {
              method: config.method || "GET",
              credentials: "include",
              headers: config.headers || {"Content-Type": "application/json"},
              body: body || undefined
          })
          .then(function(res) { return res.text(); })
          .then(function(data) {
              modal.remove();
              var resultWindow = window.open();
              resultWindow.document.write(
                  "<html><head><title>Response</title>" +
                  "<style>" +
                  "body { background:#1e1e1e; color:#d4d4d4; font-family:monospace; padding:20px; }" +
                  "pre { background:#2d2d2d; padding:15px; border-radius:8px; overflow:auto; white-space:pre-wrap; }" +
                  ".status { position:fixed; top:10px; right:20px; background:#0d6efd; padding:5px 12px; border-radius:5px; font-size:12px; }" +
                  "button { background:#dc3545; color:white; border:none; padding:5px 12px; border-radius:5px; cursor:pointer; margin-left:10px; }" +
                  "</style></head>" +
                  "<body>" +
                  "<div class=\"status\">📡 " + (config.method || "GET") + " | " + new URL(config.url).hostname +
                  "<button onclick=\"window.close()\">Close</button></div>" +
                  "<h3>✅ Response:</h3>" +
                  "<pre>" + escapeHtml(data) + "</pre>" +
                  "</body></html>"
              );
          })
          .catch(function(err) {
              modal.remove();
              alert("❌ Error: " + err.message);
          });
      } catch(e) {
          alert("❌ Invalid JSON: " + e.message);
      }
  }
  
  runBtn.onclick = executeRequest;
  cancelBtn.onclick = function() { modal.remove(); };
  
  textarea.addEventListener('keydown', function(e) {
      if((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
          executeRequest();
      }
  });
})();