/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonStatusBarElementComponent } from './status-bar-element.component';
import { HttpClientModule } from '@angular/common/http';
import { UiCommonModule } from '../../../../ui-common.module';

export default {
	title: 'Statusbar/UiCommonStatusBarElementComponent',
	component: UiCommonStatusBarElementComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule, UiCommonModule],
		}),
	],
	argTypes: {
		textColor: { control: 'color' },
		fontFamily: {
			control: {
				type: 'select',
				options: ['Georgia, serif', 'sans-serif', 'fantasy', 'monospace', 'cursive', 'Calibri', 'Verdana'],
			},
		},
	},
} as Meta<UiCommonStatusBarElementComponent>;

const Template: Story<UiCommonStatusBarElementComponent> = (args: UiCommonStatusBarElementComponent) => ({
	component: UiCommonStatusBarElementComponent,
	props: args,
});

const fieldData = {
	align: 'left',
	cssClass: '',
	disabled: false,
	ellipsis: true,
	id: 'status',
	toolTip: '',
	type: 'text',
	value: 100,
	iconClass: '',
	visible: true,
	func: () => {},
	url: '',
};

export const WithModifiedRowCount = Template.bind({});
WithModifiedRowCount.args = {
	rowCount: fieldData.value,
};

export const WithLabelText = Template.bind({});
WithLabelText.args = {
	items: 'items',
	rowCount: fieldData.value,
};

export const WithLabelTextColor = Template.bind({});
WithLabelTextColor.args = {
	textColor: '#333',
	rowCount: fieldData.value,
};

export const WithFontFamily = Template.bind({});
WithFontFamily.args = {
	fontFamily: 'Times New Roman',
	rowCount: fieldData.value,
};

export const WithFontWeight = Template.bind({});
WithFontWeight.args = {
	fontWeight: 500,
	rowCount: fieldData.value,
};
