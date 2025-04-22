/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { GridHostComponent } from './grid-host.component';

export default {
	title: 'GridHostComponent',

	component: GridHostComponent,

	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<GridHostComponent<object>>;

const Template: StoryFn<GridHostComponent<object>> = (args: GridHostComponent<object>) => ({
	component: GridHostComponent,

	props: args,
});
export const Primary = Template.bind({});
Primary.args = {};
