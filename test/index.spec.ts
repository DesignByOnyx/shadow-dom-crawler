import { newSpecPage } from '@stencil/core/testing';
import { SimpleLabel } from './components/simple-label';
import { DeepShadow } from './components/deep-shadow';
import { findNode } from '../src';

it('works if no start node is provided', async () => {
  await newSpecPage({
    components: [SimpleLabel],
    html: `<simple-label></simple-label>`,
  });

  const node = findNode('label');

  expect(node).not.toBe(null);
  expect(node.tagName).toBe('LABEL');
});

it('should find an item in a shallow shadow DOM', async () => {
  const page = await newSpecPage({
    components: [SimpleLabel],
    html: `<simple-label></simple-label>`,
  });

  const node = findNode('label', page.root);

  expect(node).not.toBe(null);
  expect(node.tagName).toBe('LABEL');
});

it('should find an item within slotted content', async () => {
  const page = await newSpecPage({
    components: [SimpleLabel],
    html: `<simple-label><input /></simple-label>`,
  });

  const node = findNode('input', page.root);

  expect(node).not.toBe(null);
  expect(node.tagName).toBe('INPUT');
});

it('should find a deeply shadowed element', async () => {
  const page = await newSpecPage({
    components: [DeepShadow, SimpleLabel],
    html: `<deep-shadow></deep-shadow>`,
  });

  const node = findNode('#deep-div', page.root);

  expect(node).not.toBe(null);
  expect(node.tagName).toBe('DIV');
});

it('should find a deeply slotted element', async () => {
  const page = await newSpecPage({
    components: [DeepShadow, SimpleLabel],
    html: `<deep-shadow><input /></deep-shadow>`,
  });

  const node = findNode('input', page.root);

  expect(node).not.toBe(null);
  expect(node.tagName).toBe('INPUT');
});
