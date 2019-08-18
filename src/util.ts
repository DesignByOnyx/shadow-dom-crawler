type Combinator = '>' | '~' | '+';

/**
 * Special characters in CSS. These do not require spaces on either side!
 */
const REG_COMBINATOR = /^(?:\s|~|\+|>)$/;

/**
 * List of tags to skip when crawling.
 */
const REG_SKIP_TAG = /^(?:STYLE|SCRIPT|IFRAME)$/;

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
		children = Array.from(el.childNodes).concat(Array.from(el.shadowRoot.childNodes));
	} else {
		children = Array.from(el.childNodes);
	}

	return children.filter(c => c.nodeType === 1) as HTMLElement[];
}

/**
 * Searches for a matching element based on the combinator-selector values.
 *
 * @param combinator A CSS combinator
 * @param selector A simple CSS selector
 * @param start The nodes from which to start crawling
 */
function findSpecial(combinator: Combinator, selector: string, start: Node[]) {
	let found: HTMLElement | null = null;

	switch (combinator) {
		case '>':
			start.some((el: HTMLElement) => {
				found = getChildNodes(el).find((child: HTMLElement) => child.matches(selector));

				return !!found;
			});
			break;

		case '+':
			start.some((el: HTMLElement) => {
				if (el.nextElementSibling.matches(selector)) {
					found = el.nextElementSibling as HTMLElement;
				}

				return !!found;
			});
			break;

		case '~':
			start.some((el: HTMLElement) => {
				let sibling = el;
				// tslint:disable-next-line: no-conditional-assignment
				while ((sibling = sibling.nextElementSibling as HTMLElement)) {
					if (sibling.matches(selector)) {
						found = sibling;
						break;
					}
				}

				return !!found;
			});
			break;
	}

	return found;
}

/**
 * Finds all descendant shadow roots for an element. This is used to reduce
 * redundant calls to `querySelector` on children which have already been searched.
 * However, I'm not entirely sure this is actually faster. Needs more testing.
 *
 * @param el The parent element
 */
function getDescendantShadows(el: HTMLElement) {
	const shadows: HTMLElement[] = [];

	getChildNodes(el).forEach(child => {
		if (child.shadowRoot) {
			return shadows.push.apply(shadows, getChildNodes(el));
		}

		const deep = getDescendantShadows(child);
		if (deep && deep.length) {
			shadows.push.apply(shadows, deep);
		}
	});

	return shadows;
}

export {
	Combinator,
	REG_COMBINATOR,
	REG_SKIP_TAG,
	splitSelector,
	getNextSegment,
	getChildNodes,
	findSpecial,
	getDescendantShadows,
};
