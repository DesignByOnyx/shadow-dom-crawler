import { newSpecPage } from '@stencil/core/testing';
import { LabelOne } from './components/label-1';
import { LabelTwo } from './components/label-2';
import { findNode } from '../src';

describe('findNode', () => {
	it('works if no start node is provided', async () => {
		await newSpecPage({
			components: [LabelOne],
			html: `<label-one></label-one>`,
		});

		const node = findNode('label');

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL');
	});

	it('should find an item in a shallow shadow DOM', async () => {
		const page = await newSpecPage({
			components: [LabelOne],
			html: `<label-one></label-one>`,
		});

		const node = findNode('label', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL');
	});

	it('should find an item within slotted content', async () => {
		const page = await newSpecPage({
			components: [LabelOne],
			html: `<label-one><input /></label-one>`,
		});

		const node = findNode('input', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('INPUT');
	});

	it('should find a deeply shadowed element', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-one><label-two></label-two></label-one>`,
		});

		const node = findNode('.label-2', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL');
	});

	it('should find a deeply slotted element', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-two><label-one><input /></label-one></label-two>`,
		});

		const node = findNode('input', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('INPUT');
	});

	it('should work with descendant combinator across mutliple shadows', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-two><label-one></label-one></label-two>`,
		});

		const firstMatch = findNode('label-two label-one label', page.root);
		const secondMatch = findNode('label-two label', page.root);

		expect(firstMatch).not.toBe(null);
		expect(secondMatch).not.toBe(null);
		expect(firstMatch.className).toBe('label-1');

		// NOTE: This next assertion is important because `<label-two>` comes first, and it
		// has a direct (shadow) child of `.label-2` which is technically "closer" and would
		// be matched first in a world without shadow DOM. However, since `<label-one>` is
		// part of the light DOM, it gets searched BEFORE label-2's shadow dom.
		expect(secondMatch.className).toBe('label-1');
	});

	it('should work with child ">" combinator', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-two>
				<div class="foo">
					<label-one></label-one>
				</div>
			</label-two>`,
		});

		const node = findNode('.foo > label-one', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL-ONE');
	});

	it('should work with next sibling "+" combinator', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-two>
				<div class="foo"></div>
				<label-one></label-one>
			</label-two>`,
		});

		const node = findNode('.foo + label-one', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL-ONE');
	});

	it('should work with next siblings "~" combinator', async () => {
		const page = await newSpecPage({
			components: [LabelOne, LabelTwo],
			html: `<label-two>
				<div class="foo"></div>
				<span></span>
				<div></div>
				<label-one></label-one>
			</label-two>`,
		});

		const node = findNode('.foo ~ label-one', page.root);

		expect(node).not.toBe(null);
		expect(node.tagName).toBe('LABEL-ONE');
	});
});
