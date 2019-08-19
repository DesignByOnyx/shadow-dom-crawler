# Shadow DOM Crawler

This is a zero-dependency script for crawling deeply nested shadow DOMs. This can only crawl shadow structures created with `{ mode: 'open' }` because "closed" structures are inaccessable to JavaScript.

```bash
npm install shadow-dom-crawler
yarn add shadow-dom-crawler
```

## Use cases

This library was developed for a very limited set of use cases and **should NOT be used to violate the intentions of component developers**. Please remember that components use a shadow DOM in order to isolate themselves from the outside world. DO NOT interfere with, modify, or otherwise disrupt the DOMs in 3rd party components. With that said, here are some of the reasons why I built this script:

- bring focus to a particular element within a modal/popover for ARIA compliance
  - https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/dialog_role
  - https://www.w3.org/TR/wai-aria-practices/examples/dialog-modal/dialog.html
- inject shared styles inside of components to reduce duplicity and bundle sizes
  - NOTE: this is a controversial use case. Components should ship with everything they need to work. However, when building an application I believe it's both ethical and sane to allow a grandmother component inject a set of shared utility styles into known grandchild components.
- if you have other use cases, please [file an issue](./issues) so I can list them here.

### What NOT to do

- modify the DOM inside a shadow root
- share any type of application state between components
- set properties or attributes on nested components
- pretty much anything else which is not listed in the use cases above... seriously, don't do it.

## API

#### `findNode(selector: string, startNode?: Node | Node[] | NodeList)`

This method is analagous to [`Element.prototype.querySelector`](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector), but works with open shadow DOMs.

Given a valid CSS selector string, will start crawling the document in search of a matching element and will stop crawling as soon as one is found. If no item is found, this will return `null`. By default this will start crawling at the `document.body`. You can pass an optional second parameter of `Node | Node[] | NodeList` from where to start crawling:

```js
import { findNode } from 'shadow-dom-crawler';

const node = findNode('.some-valid-css-selector');

const root = document.getElementById('#root');
const node = findNode('.some .nested .css-selector', root);

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
