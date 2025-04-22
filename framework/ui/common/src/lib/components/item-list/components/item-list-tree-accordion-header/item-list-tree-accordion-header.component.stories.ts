/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonItemListTreeAccordionHeaderComponent } from './item-list-tree-accordion-header.component';

export default {
	title: 'item-list/UiCommonItemListTreeAccordionHeaderComponent',
	component: UiCommonItemListTreeAccordionHeaderComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonItemListTreeAccordionHeaderComponent>;

const Template: Story<UiCommonItemListTreeAccordionHeaderComponent> = (args: UiCommonItemListTreeAccordionHeaderComponent) => ({
	component: UiCommonItemListTreeAccordionHeaderComponent,
	props: args,
});

export const Primary = Template.bind({});
const items = {
	id: 'basics.accountingjournals',
	displayName: 'Accounting Journals',
	Description: 'Accounting Journals',
	cssClass: 'ico-accounting-journals',
	redirect: 'app.basicsaccountingjournals',
	headerClickKey: 'app.basicsaccountingjournals',
	disabled: false,
	type: 0,
	expanded: true,
	tabs: {
		items: [],
	},
};

Primary.args = {
	treeitem: items,
};
