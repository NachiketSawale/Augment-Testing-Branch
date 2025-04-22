/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonItemListTreeComponent } from './item-list-tree.component';
import { UiCommonItemListTreeAccordionContentComponent } from '../item-list-tree-accordion-content/item-list-tree-accordion-content.component';
import { UiCommonItemListTreeAccordionHeaderComponent } from '../item-list-tree-accordion-header/item-list-tree-accordion-header.component';

export default {
	title: 'item-list/UiCommonItemListTreeComponent',
	component: UiCommonItemListTreeComponent,
	decorators: [
		moduleMetadata({
			imports: [],
			declarations: [UiCommonItemListTreeAccordionContentComponent, UiCommonItemListTreeAccordionHeaderComponent],
		}),
	],
} as Meta<UiCommonItemListTreeComponent>;

const Template: Story<UiCommonItemListTreeComponent> = (args: UiCommonItemListTreeComponent) => ({
	component: UiCommonItemListTreeComponent,
	props: args,
});

export const withAccordionHeader = Template.bind({});
const headerData = [
	{
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
	},
];
withAccordionHeader.args = {
	treeitems: headerData,
};

export const withAccordionContent = Template.bind({});
const contentData = [
	{
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
		},
	},
	{
		id: 'scheduling.templategroup',
		displayName: 'Activity Groups Templates',
		Description: 'Activity Groups Templates',
		cssClass: 'ico-activity-groups',
		redirect: 'app.schedulingtemplategroup',
		headerClickKey: 'app.schedulingtemplategroup',
		disabled: false,
		type: 0,
		expanded: true,
		tabs: {
			items: [
				{
					Id: 912,
					BasModuleFk: 66,
					Description: 'Templates Master',
					Sorting: 0,
					Isvisible: true,
					InsertedAt: '2014-12-01T10:30:42Z',
					InsertedBy: 1,
					Version: 0,
					Visibility: 1,
					$$hashKey: 'object:1935',
				},
			],
		},
	},
];
withAccordionContent.args = {
	treeitems: contentData,
};
