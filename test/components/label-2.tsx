import { Component, Host, h } from '@stencil/core';

@Component({
	tag: 'label-two',
	shadow: true,
})
export class LabelTwo {
	public render() {
		return (
			<Host>
				<label class="label-2">Label #2</label>
				<slot />
			</Host>
		);
	}
}
