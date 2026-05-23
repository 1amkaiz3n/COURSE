```js
(function () {
  function init() {
    const MAX = 300;
    let scheduled = false;

    window.__dom_sinks = [];

    function toStr(v) {
      try { return String(v); } catch { return '[unreadable]'; }
    }

    function push(data) {
      window.__dom_sinks.push(data);
      if (window.__dom_sinks.length > MAX) window.__dom_sinks.shift();
      scheduleRender();
    }

    function scheduleRender() {
      if (scheduled) return;
      scheduled = true;

      requestAnimationFrame(() => {
        scheduled = false;
        render();
      });
    }

    function logSink(type, value, ctx) {
      if (ctx.closest && ctx.closest('#__dom_viewer')) return;

      const data = {
        ts: new Date().toISOString(),
        type,
        value: toStr(value),
        element: ctx.tagName,
      };

      push(data);
    }

    // ===== UI =====
    const panel = document.createElement('div');
    panel.id = '__dom_viewer';
    panel.style = `
      position:fixed;
      bottom:10px;
      right:10px;
      width:420px;
      max-height:50%;
      background:#0b0f14;
      color:#e6edf3;
      font:11px monospace;
      border:1px solid #1f2937;
      border-radius:8px;
      z-index:999999;
      display:flex;
      flex-direction:column;
      box-shadow:0 10px 30px rgba(0,0,0,.6);
      overflow:hidden;
    `;

    panel.innerHTML = `
      <div id="header" style="
        padding:6px;
        background:#111827;
        cursor:move;
        display:flex;
        align-items:center;
        justify-content:space-between;
      ">
        <div>
          <button id="toggleBtn">−</button>
          <button id="copyBtn">Copy</button>
          <button id="clearBtn">Clear</button>
        </div>
        <span id="count">0</span>
      </div>
      <div id="list" style="
        padding:6px;
        overflow:auto;
        max-height:300px;
      "></div>
    `;

    document.body.appendChild(panel);

    const list = panel.querySelector('#list');
    const count = panel.querySelector('#count');
    const toggleBtn = panel.querySelector('#toggleBtn');

    // ===== MINIMIZE =====
    let collapsed = false;
    toggleBtn.onclick = () => {
      collapsed = !collapsed;
      list.style.display = collapsed ? 'none' : 'block';
      toggleBtn.textContent = collapsed ? '+' : '−';
    };

    // ===== DRAG =====
    const header = panel.querySelector('#header');
    let offsetX, offsetY, dragging = false;

    header.onmousedown = (e) => {
      dragging = true;
      offsetX = e.clientX - panel.offsetLeft;
      offsetY = e.clientY - panel.offsetTop;
    };

    document.onmousemove = (e) => {
      if (!dragging) return;
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
      panel.style.right = 'auto';
      panel.style.bottom = 'auto';
    };

    document.onmouseup = () => dragging = false;

    function escapeHtml(s) {
      return s.replace(/[&<>]/g, c => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;'
      }[c]));
    }

    // ===== SMART RENDER =====
    let lastLen = 0;

    function render() {
      const len = window.__dom_sinks.length;
      count.textContent = len;

      if (len === lastLen) return;
      lastLen = len;

      const slice = window.__dom_sinks.slice(-30);

      const html = slice.map(d => `
        <div style="
          border-bottom:1px solid #1f2937;
          margin-bottom:4px;
          padding-bottom:4px;
        ">
          <div style="color:#93c5fd;font-size:10px;">
            ${d.type} | ${d.element}
          </div>
          <pre style="margin:0;font-size:10px;">
${escapeHtml(d.value)}
          </pre>
        </div>
      `).join('');

      list.innerHTML = html;
      list.scrollTop = list.scrollHeight;
    }

    panel.querySelector('#copyBtn').onclick = () => {
      navigator.clipboard.writeText(JSON.stringify(window.__dom_sinks, null, 2));
    };

    panel.querySelector('#clearBtn').onclick = () => {
      window.__dom_sinks.length = 0;
      lastLen = 0;
      render();
    };

    // ===== HOOK =====
    ['innerHTML', 'outerHTML'].forEach(prop => {
      const desc = Object.getOwnPropertyDescriptor(Element.prototype, prop);
      if (!desc) return;

      Object.defineProperty(Element.prototype, prop, {
        set(value) {
          logSink(prop, value, this);
          return desc.set.call(this, value);
        },
        get: desc.get
      });
    });

    const origInsert = Element.prototype.insertAdjacentHTML;
    Element.prototype.insertAdjacentHTML = function (pos, value) {
      logSink('insertAdjacentHTML', value, this);
      return origInsert.call(this, pos, value);
    };

    console.log('[✓] DOM viewer CLEAN & SMOOTH');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
```


Testing

```js
document.body.insertAdjacentHTML('beforeend', '<img src=x onerror=1>');
```