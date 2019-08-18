import { Component, Host, h } from '@stencil/core';

@Component({
	tag: 'label-one',
	shadow: true,
})
export class LabelOne {
	public render() {
		return (
			<Host>
				<label class="label-1">Label #1</label>
				<slot />
			</Host>
		);
	}
}
