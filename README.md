# Shadow DOM Crawler

This is a zero-dependency script for crawling a deeply nested shadow DOMs. This can only crawl shadow structures created with `{ mode: 'open' }` because "closed" structures are inaccessable to JavaScript.

```bash
yarn add shadow-dom-crawler
```

## API

### `findNode(selector: string, startNode?: Node | Node[] | NodeList)`

This method is analagous to [`Element.prototype.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector), but works with open shadow DOMs.

Given a valid CSS selector string, will start crawling the document in search of a matching element and will stop crawling as soon as one is found. If no item is found, this will return `null`. By default this will start crawling at the `document.body`. You can pass an optional second parameter of `Node | Node[] | NodeList` from where to start crawling:

```js
import { findNode } from 'shadow-dom-crawler';

const node = findNode('.some-valid-css-selector');

const root = document.getElementById('#root');
const node = findNode('.some .other .css-selector', root);

const items = document.querySelector('li.items');
const node = findNode('.some complex-css[ selector ]', items);
```

## Roadmap

- `findAll('selector', startNode?)` - Find all nodes matching a selector.
- `injectStyles('selector' | node(s), styles, startNode?)` - will find all elements matching the `selector` and inject `styles` into those elements. One or more elements can optionally be passed in order to skip the crawling step. This will be useful for injecting shared styles into shadow elements.

## Testing

This uses [`@stencil/core`](https://www.npmjs.com/package/@stencil/core) for testing as it provides convenient wrappers around jest for testing web components. Stencil components are also compiled to standards-compliant components which makes it convenient for creating and nesting multiple components used for testing.

```
yarn test
```
