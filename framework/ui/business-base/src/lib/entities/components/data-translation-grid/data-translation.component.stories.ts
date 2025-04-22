/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DataTranslationGridComponent } from './data-translation-grid.component';

export default {
	title: 'ModulesBasicsSharedDataTranslationComponent',

	component: DataTranslationGridComponent,

	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<DataTranslationGridComponent>;

const Template: Story<DataTranslationGridComponent> = (args: DataTranslationGridComponent) => ({
	component: DataTranslationGridComponent,

	props: args,
});
export const Primary = Template.bind({});
Primary.args = {};
