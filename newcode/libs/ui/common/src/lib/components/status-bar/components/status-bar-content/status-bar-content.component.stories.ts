/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonModule } from '../../../../ui-common.module';
import { UiCommonStatusBarContentComponent } from './status-bar-content.component';

export default {
	title: 'Statusbar/UiCommonStatusBarContentComponent',
	component: UiCommonStatusBarContentComponent,
	decorators: [
		moduleMetadata({
			imports: [UiCommonModule],
		}),
	],
	argTypes: {
		backgroundColor: { control: 'color' },
	},
} as Meta<UiCommonStatusBarContentComponent>;

const Template: Story<UiCommonStatusBarContentComponent> = (args: UiCommonStatusBarContentComponent) => ({
	component: UiCommonStatusBarContentComponent,
	props: args,
});

export const WithBackgroundColor = Template.bind({});
WithBackgroundColor.args = {
	backgroundColor: '#dcdcdc',
};
