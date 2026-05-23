# DevTools + manual sink hook (paling kuat & realistis)

```js
const origInnerHTML = Object.getOwnPropertyDescriptor(Element.prototype, 'innerHTML');

Object.defineProperty(Element.prototype, 'innerHTML', {
  set(value) {
    console.log('[innerHTML sink]', value);
    debugger;
    return origInnerHTML.set.call(this, value);
  },
  get: origInnerHTML.get
});
```

# Hook eval & setTimeout (DOM execution sink)

```js
window.eval = new Proxy(window.eval, {
  apply(target, thisArg, args) {
    console.log('[eval sink]', args[0]);
    debugger;
    return target.apply(thisArg, args);
  }
});
```


```js
const origSetTimeout = window.setTimeout;
window.setTimeout = function(fn, t) {
  console.log('[setTimeout sink]', fn);
  return origSetTimeout(fn, t);
};
```