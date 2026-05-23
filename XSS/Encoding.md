#

## Single URL Encoding

- `<` -> `%3c`
- `"` -> `%22`
- `'` -> `%27

## Double URL Encoding

- `<` -> `%253c`
- `"` -> `%2522`
- `'` -> `%2527`




input → urldecode → escape HTML → render
  - `test&gt;z&lt;`
  - `test>z< → test&gt;z&lt;`