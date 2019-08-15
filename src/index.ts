const REG_SKIP_TAG = /^(?:STYLE|SCRIPT)$/;
const slice = Array.prototype.slice;

const findNode = (selector: string, start: Node | Node[] | NodeList = document.body): HTMLElement | null => {
	let found: HTMLElement | null = null;

	('length' in start ? slice.call(start) : [start]).some((el: HTMLElement) => {
		if (el.nodeType === 1 && !REG_SKIP_TAG.test(el.tagName)) {
			if (el.tagName === 'SLOT' && 'assignedNodes' in el) {
				// NOTE: Due to the inability to properly emulate slots with JS, this code will not
				// get hit while testing. It's wise to test this in a browser from time to time.
				found = findNode(selector, (el as HTMLSlotElement).assignedNodes());
			} else {
				found = el.matches(selector) ? el : el.querySelector(selector);

				if (!found) {
					found = findNode(selector, (('shadowRoot' in el && el.shadowRoot) || el).childNodes);
				}
			}
		}

		return !!found;
	});

	return found;
};

export { findNode };
