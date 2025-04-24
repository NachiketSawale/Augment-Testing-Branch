/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonItemListTreeAccordionContentComponent } from './item-list-tree-accordion-content.component';

export default {
	title: 'item-list/UiCommonItemListTreeAccordionContentComponent',
	component: UiCommonItemListTreeAccordionContentComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonItemListTreeAccordionContentComponent>;

const Template: Story<UiCommonItemListTreeAccordionContentComponent> = (args: UiCommonItemListTreeAccordionContentComponent) => ({
	component: UiCommonItemListTreeAccordionContentComponent,
	props: args,
});

export const accordionWithContent = Template.bind({});
const childData = {
	items: [
		{
			Id: 1574,
			BasModuleFk: 167,
			Description: 'Accounting Journals',
			Sorting: 1,
			Isvisible: true,
			InsertedAt: '2019-07-05T13:25:24.493Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
			$$hashKey: 'object:1928',
		},
	],
};

accordionWithContent.args = {
	childs: childData,
};

export const accordionWithoutContent = Template.bind({});
const child = {
	items: [
		{
			Id: 1574,
			BasModuleFk: 167,
			Description: 'Accounting Journals',
			Sorting: 1,
			Isvisible: false,
			InsertedAt: '2019-07-05T13:25:24.493Z',
			InsertedBy: 1,
			Version: 0,
			Visibility: 1,
			$$hashKey: 'object:1928',
		},
	],
};

accordionWithoutContent.args = {
	childs: child,
};
