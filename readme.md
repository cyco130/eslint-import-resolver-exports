# eslint-import-resolver-exports

This package adds [`package.json#exports`](https://nodejs.org/api/packages.html#exports) support to [`eslint-plugin-import`](https://www.npmjs.com/package/eslint-plugin-import) using the [resolve.exports](https://github.com/lukeed/resolve.exports) package.

## Usage

Install with `npm install -D eslint-import-resolver-exports` and add it as a resolver to your ESLint configuration:

```js
module.exports = {
  // ... other configuration options
  settings: {
    "import/resolver": {
      // If you use TypeScript
      typescript: {
        project: [__dirname + "/tsconfig.json"],
      },
      exports: {
        // There are no config options currently so leave this empty
      },
    },
  },
};
```

## Credits and license

- By Fatih Aygün under [MIT license](./LICENSE)
