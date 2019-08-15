import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'simple-label',
  shadow: true
})
export class SimpleLabel {
  render() {
    return (
      <Host>
        <label>Label #1</label>
        <slot />
      </Host>
    );
  }
}
