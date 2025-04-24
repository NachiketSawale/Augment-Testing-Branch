/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta, componentWrapperDecorator } from '@storybook/angular';
import { UiCommonAccordionListComponent } from './accordion-list.component';

export default {
	title: 'item-list/UiCommonAccordionListComponent',
	component: UiCommonAccordionListComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonAccordionListComponent>;

const Template: Story<UiCommonAccordionListComponent> = (args: UiCommonAccordionListComponent) => ({
	component: UiCommonAccordionListComponent,
	props: args,
});

export const withListData = Template.bind({});
const data = {
	id: 802,
	groupId: 250,
	name: 'Plant QR Code',
	text: 'Print QR Code of the selected Plants',
	filename: 'Plant_QR_Code.frx',
	path: 'system\\Plant_Master',
};

withListData.args = {
	list: data,
};
withListData.decorators = [componentWrapperDecorator((story) => `<ul style="list-style-type:none">${story}</ul>`)];
export const disabledList = Template.bind({});
const list = {
	id: 802,
	groupId: 250,
	name: 'Plant QR Code',
	text: 'Print QR Code of the selected Plants',
	filename: 'Plant_QR_Code.frx',
	path: 'system\\Plant_Master',
	disabled: true,
};

disabledList.args = {
	list: list,
};
disabledList.decorators = [componentWrapperDecorator((story) => `<ul style="list-style-type:none">${story}</ul>`)];
