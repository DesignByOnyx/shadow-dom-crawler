import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'deep-shadow',
  shadow: true
})
export class DeepShadow {
  render() {
    return (
      <Host>
        <label>Label #1</label>
        <simple-label>
          <div id="deep-div"></div>
          <slot />
        </simple-label>>
      </Host>
    );
  }
}
