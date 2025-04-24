/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonModule } from '../../../../ui-common.module';
import { UiCommonStatusBarComponent } from './status-bar.component';

export default {
	title: 'Statusbar/UiCommonStatusBarComponent',
	component: UiCommonStatusBarComponent,
	decorators: [
		moduleMetadata({
			imports: [UiCommonModule],
		}),
	],
} as Meta<UiCommonStatusBarComponent>;

const Template: Story<UiCommonStatusBarComponent> = (args: UiCommonStatusBarComponent) => ({
	component: UiCommonStatusBarComponent,
	props: args,
});

export const Statusbar = Template.bind({});
Statusbar.args = {};
