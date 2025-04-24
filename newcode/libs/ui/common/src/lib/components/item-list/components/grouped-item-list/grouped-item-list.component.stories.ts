/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta, componentWrapperDecorator } from '@storybook/angular';
import { UiCommonGroupedItemListComponent } from './grouped-item-list.component';

export default {
	title: 'item-list/UiCommonGroupedItemListComponent',
	component: UiCommonGroupedItemListComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonGroupedItemListComponent>;

const Template: Story<UiCommonGroupedItemListComponent> = (args: UiCommonGroupedItemListComponent) => ({
	component: UiCommonGroupedItemListComponent,
	props: args,
});

export const withoutContent = Template.bind({});
withoutContent.args = {
	groupTemplate: '<b>Accounting Journals</b>',
	itemTemplate: '',
};
export const withContent = Template.bind({});
withContent.args = {
	groupTemplate: '<b>Accounting Journals</b>',
	itemTemplate: '<li>Accounting Journals</li>',
};
withContent.decorators = [componentWrapperDecorator((story) => `<ul style="list-style-type:none">${story}</ul>`)];
