# 𝓡𝓮𝓪𝓬𝓽i18𝓷

<hr />

[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/fzn0x/fasti18n/ci.yml?branch=main)](https://github.com/fzn0x/fasti18n/actions)
[![GitHub](https://img.shields.io/github/license/fzn0x/fasti18n)](https://github.com/fzn0x/fasti18n/blob/main/LICENSE)
[![npm](https://img.shields.io/npm/v/fasti18n)](https://www.npmjs.com/package/fasti18n)
[![npm](https://img.shields.io/npm/dm/fasti18n)](https://www.npmjs.com/package/fasti18n)
[![JSR](https://jsr.io/badges/@fzn0x/fasti18n)](https://jsr.io/@fzn0x/fasti18n)
[![Bundle Size](https://img.shields.io/bundlephobia/min/fasti18n)](https://bundlephobia.com/result?p=fasti18n)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/fasti18n)](https://bundlephobia.com/result?p=fasti18n)
[![GitHub commit activity](https://img.shields.io/github/commit-activity/m/fzn0x/fasti18n)](https://github.com/fzn0x/fasti18n/pulse)
[![GitHub last commit](https://img.shields.io/github/last-commit/fzn0x/fasti18n)](https://github.com/fzn0x/fasti18n/commits/main)

<hr />

⚡Straightforward & less effort React i18n library.

## Get to Know

- [Installation](#installation)
- [Usage](#usage)
  - [JavaScript](#javascript)
  - [TypeScript](#typescript)
  - [React](#react)
- [License](#license)

## Installation

```bash
bun install fasti18n
npm install fasti18n
yarn add fasti18n
pnpm install fasti18n
```

## Usage

Creates `lang.json` and `lang-admin.json` files:

**`lang.json` :**

```json
{
  "en": {
    "hello": "hello world"
  },
  "de": {
    "hello": "Guten Morgen"
  },
  "id": {
    "hello": "Hallo bang"
  }
}
```

**`lang-admin.json` :**

```json
{
  "en": {
    "hello": "hello world from admin"
  },
  "de": {
    "hello": "Guten Morgen from admin"
  },
  "id": {
    "hello": "Hallo bang from admin"
  }
}
```

### JavaScript

```js
// lang.js
const i18n = require('fasti18n')

const t = i18n.init({
  namespace: {
    default: {
      // user pages
      load: `/lang.json`, // multiple files loads also
      // supported: [`lang.json`, `lang-2.json`]
      type: 'json', // json, sqlite
      storage: 'path',
    },
    admin: {
      // admin pages
      load: `/lang-admin.json`, // multiple files loads also
      // supported: [`lang-admin.json`, `lang-admin-2.json`]
      type: 'json',
      storage: 'cookie',
    },
    // otherCustomNamespace: {
    //     load: `/lang.db`,
    //     type: 'sqlite', // json, sqlite
    // }
  },
  detection: {
    order: ['cookie', 'path', 'query'], // use defaultLang if not found
    defaultLang: 'en',
  },
})

console.log(t('hello')) // "hello" from default namespace
console.log(t('admin.hello')) // "hello" from admin namespace,
// defaultLang: en if no language detected in cookie, path or query
// for path: url must includes /en/ path or similar lang names like /de/ path to be recognized
// for query: url must includes query params `?lang=en` to work,
// or other similar lang names like `?lang=de` or `?lang=id` to work.
// for cookie: you need to store cookie with name `lang` and with the value of current lang
// name, for example: en, de, id

// You can export for reusability
// module.exports = t;
```

### TypeScript

```js
// lang.ts
import i18n from 'fasti18n'

const t = i18n.init({
  namespace: {
    default: {
      // user pages
      load: `/lang.json`,
      type: 'json', // json, sqlite
      storage: 'path',
    },
    admin: {
      // admin pages
      load: `/lang-admin.json`,
      type: 'json',
      storage: 'cookie',
    },
    // otherCustomNamespace: {
    //     load: `/lang.db`,
    //     type: 'sqlite', // json, sqlite
    // }
  },
  detection: {
    order: ['cookie', 'path', 'query'], // use defaultLang if not found
    defaultLang: 'en',
  },
})

console.log(t('hello')) // "hello" from default namespace
console.log(t('admin.hello')) // "hello" from admin namespace,

// You can export for reusability
// export default t;
```

### React

```jsx
import i18n from 'fasti18n'

const t = i18n.init({
  namespace: {
    default: {
      // user pages
      load: `/lang.json`,
      type: 'json', // json, sqlite
      storage: 'path',
    },
    admin: {
      // admin pages
      load: `/lang-admin.json`,
      type: 'json',
      storage: 'cookie',
    },
    // otherCustomNamespace: {
    //     load: `/lang.db`,
    //     type: 'sqlite', // json, sqlite
    // }
  },
  detection: {
    order: ['cookie', 'path', 'query'], // use defaultLang if not found
    defaultLang: 'en',
  },
})

// Creates a function LanguageSwitch to change defaultLang
export default function LanguageSwitch({ lang, ns }) {
  // t.switch is to change the defaultLang
  return <div onClick={() => t.switch(lang, ns)}>Switch Language for {ns}</div>
}

;<LanguageSwitch lang='de' ns='default' />
;<LanguageSwitch lang='de' ns='admin' />
```

## License

fasti18n is [MIT Licensed](./LICENSE) and Open Source Software by [@fzn0x](https://github.com/fzn0x)
