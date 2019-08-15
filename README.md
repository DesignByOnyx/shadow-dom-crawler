# Shadow DOM Crawler

This is a zero-dependency script for crawling a deeply nested shadow DOMs. This can only crawl shadow structures created with `{ mode: 'open' }` because "closed" structures are inaccessable to JavaScript.

```bash
yarn add shadow-dom-crawler
```

## API

### `findNode(selector: string, startNode?: Node | Node[] | NodeList)`

Given a **simple CSS selector** string, will start crawling the document in search of a matching element and will stop crawling as soon as one is found. If no item is found, this will return `null`. By default this will start crawling at the `document.body`. You can pass an optional second parameter of `Node | Node[] | NodeList` from where to start crawling:

```js
import { findNode } from 'shadow-dom-crawler';

const node = findNode('.some-valid-css-selector');

const root = document.getElementById('#root');
const node = findNode('.some-valid-css-selector', root);

const items = document.querySelector('li.items');
const node = findNode('.some-valid-css-selector', items);
```

> **NOTE:** - currently, the mechanism used to match nodes is kind of "dumb". Nested selectors cannot search across multiple shadow doms. For example, a selector such a `custom-tag-foo custom-tag-bar` will not work at the moment (assuming those elements both use a shadow DOM). For now, please stick to simple element/class/id based selectors and only use nested selectors where you are sure the elements exist within the same context.

## Roadmap

- Support for nested selectors across shadow DOMs (see note above)
- `findAll('selector', startNode?)` - Find all nodes matching a selector.
- `injectStyles('selector' | node(s), styles, startNode?)` - will find all elements matching the `selector` and inject `styles` into those elements. One or more elements can optionally be passed in order to skip the crawling step. This will be useful for injecting shared styles into shadow elements.

## Testing

This uses [`@stencil/core`](https://www.npmjs.com/package/@stencil/core) for testing as it provides convenient wrappers around jest for testing web components. Stencil components are also compiled to standards-compliant components which makes it convenient for creating and nesting multiple components used for testing.

```
yarn test
```
