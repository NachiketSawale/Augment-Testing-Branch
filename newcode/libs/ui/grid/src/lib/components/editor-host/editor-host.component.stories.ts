/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Meta, StoryFn } from '@storybook/angular';
import { UiGridEditorHostComponent } from './editor-host.component';

export default {
	title: 'UiGridEditorHostComponent',

	component: UiGridEditorHostComponent,

	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiGridEditorHostComponent<object>>;

const Template: StoryFn<UiGridEditorHostComponent<object>> = (args: UiGridEditorHostComponent<object>) => ({
	component: UiGridEditorHostComponent,

	props: args,
});
export const Primary = Template.bind({});
Primary.args = {};
