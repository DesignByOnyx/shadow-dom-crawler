# Shadow DOM Crawler

This is a zero-dependency script for crawling a deeply nested shadow DOM. This can only crawl shadow structures created with `{ mode: 'open' }` because "closed" structures are inaccessable to JavaScript.

```bash
yarn add shadow-dom-crawler
```

## API

> ### `findNode(selector: string, startNode?: Node | Node[] | NodeList)`

```js
import { findNode } from 'shadow-dom-crawler';

const node = findNode('.some-valid-css-selector');
```

By default this will start crawling at the `document.body`. You can pass an optional second parameter of `Node` or `NodeList` from where to start crawling:

```js
const root = document.getElementById('#root');
const node = findNode('.some-valid-css-selector', root);

const items = document.querySelector('li.items');
const node = findNode('.some-valid-css-selector', items);
```

This will stop crawling as soon as an item matches the passed selector. If no item is found, this will return `null`.

## Roadmap

- `findAll('selector', startNode?)` - Find all nodes matching a selector.
- `injectStyles('selector' | node(s), styles, startNode?)` - will find all elements matching the `selector` and inject `styles` into those elements. One or more elements can optionally be passed in to skip the crawling step. This is useful for injecting shared styles into shadow elements.

## Testing

This uses [`@stencil/core`](https://www.npmjs.com/package/@stencil/core) for testing as it provides convenient wrappers around jest for testing web components. Stencil components are also compiled to standards-compliant components which makes it convenient for creating and nesting multiple components used for testing.

```
yarn test
```
