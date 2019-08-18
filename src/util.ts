/**
 * Special characters in CSS. These do not require spaces on either side!
 */
const REG_COMBINATOR = /^(?:\s|~|\+|>)$/;

/**
 * Dictionary of characters between which spaces
 * should be considered part of the selector.
 */
const spaceBoundaries = {
	'"': '"',
	"'": "'",
	'[': ']',
	'(': ')',
};

/**
 * Splits a CSS selector string into individual element parts.
 * > Given the selector string `foo .bar[bing="some value"] .baz`
 * > returns array `['foo', '.bar[bing = "some value"]', '.baz']`
 *
 * @param selector A valid CSS selector
 */
function splitSelector(selector: string) {
	const parts = [];
	let part: string;
	selector = selector.trim();

	// tslint:disable-next-line: no-conditional-assignment
	while (selector && (part = getNextSegment(selector))) {
		parts.push(part);
		selector = selector.substr(part.length).trim();
	}

	return parts;
}

/**
 * Extracts the first element from a selector string.
 * > Given the selector string `foo .bar[bing = "some value"] .baz`
 * > returns string `foo`
 *
 * @param selector A valid CSS selector
 */
function getNextSegment(selector: string) {
	let result = '';
	let pos = -1;
	let boundary = '';
	let char: string | undefined;
	selector = selector.trim();

	// tslint:disable-next-line: no-conditional-assignment
	while ((char = selector[++pos])) {
		if (!boundary) {
			if (spaceBoundaries[char]) {
				boundary = spaceBoundaries[char];
			}

			if (REG_COMBINATOR.test(char)) {
				if (!result) {
					result = char.trim();
				}
				break;
			}
		} else if (char === boundary && result.substr[-1] !== '\\') {
			boundary = '';
		}

		result += char;
	}

	return result;
}

/**
 * Returns the children of the given node.
 * This works for slots and elements with a shadow root as well.
 *
 * @param el Parent element
 */
function getChildNodes(el: HTMLElement | HTMLSlotElement) {
	let children: Node[];

	if ('assignedNodes' in el) {
		children = el.assignedNodes();
	} else if (el.shadowRoot) {
		// The order here is important as it puts the light dom first
		// Maybe we provide an option to put shadow dom first?
		children = [].concat(Array.from(el.childNodes), Array.from(el.shadowRoot.childNodes));
	} else {
		children = Array.from(el.childNodes);
	}

	return children.filter(c => c.nodeType === 1) as HTMLElement[];
}

export { REG_COMBINATOR, splitSelector, getNextSegment, getChildNodes };
