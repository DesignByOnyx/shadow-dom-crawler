import { REG_COMBINATOR, REG_SKIP_TAG, getNextSegment, getChildNodes, findSpecial, getDescendantShadows } from './util';

const slice = Array.prototype.slice;

/**
 * Searches a DOM structure until an element is found matching the selector.
 * This is similar to `element.querySelector`, but works with shadow DOMs.
 *
 * @param selector Any valid CSS selector
 * @param start The start node/nodes from where to start crawling
 */
const findNode = (selector: string, start: Node | Node[] | NodeList = document.body): HTMLElement | null => {
	selector = selector.trim();
	start = ('length' in start ? slice.call(start) : [start]) as Node[];

	const segment = getNextSegment(selector);
	let found: HTMLElement | null = null;

	if (REG_COMBINATOR.test(segment)) {
		if (!start) {
			// Technically starting with a combinator is not valid. In our case it is so that we
			// can allow recursion... but only if there's a start node.
			throw new Error(`'${selector}' is not a valid selector.`);
		}

		const combinator = segment;
		const nextSegment = getNextSegment(selector.substr(segment.length));
		found = findSpecial(combinator, nextSegment, start);
	} else {
		found = findFirstMatch(segment, start);
	}

	// If there's still more of the original selector left, continue crawling
	if (found && segment.length < selector.length) {
		found = findNode(selector.substr(segment.length + 1), found);
	}

	return found;
};

/**
 * Finds the first element which matches the selector within the node list.
 * This only works with simple CSS slectors with no descendants or combinators.
 *
 * @param selector A valid css selector
 * @param start The nodes from where to start crawling
 */
function findFirstMatch(selector: string, start: Node[]) {
	let found: HTMLElement | null = null;

	start.some((el: HTMLElement) => {
		if (el.nodeType === 1 && !REG_SKIP_TAG.test(el.tagName)) {
			if (el.tagName === 'SLOT' && 'assignedNodes' in el) {
				// NOTE: Due to the inability to properly emulate slots with JS, this code will not
				// get hit while testing. It's wise to test this in a browser from time to time.
				// TODO: test in a real browser
				found = findNode(selector, getChildNodes(el));
			} else {
				found = el.matches(selector) ? el : el.querySelector(selector);

				if (!found) {
					found = findNode(selector, el.shadowRoot ? getChildNodes(el) : getDescendantShadows(el));
				}
			}
		}

		return !!found;
	});

	return found;
}

export { findNode };
