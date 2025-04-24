/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonGroupedAccordionListComponent } from './grouped-accordion-list.component';

export default {
	title: 'item-list/UiCommonGroupedAccordionListComponent',
	component: UiCommonGroupedAccordionListComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonGroupedAccordionListComponent>;

const Template: Story<UiCommonGroupedAccordionListComponent> = (args: UiCommonGroupedAccordionListComponent) => ({
	component: UiCommonGroupedAccordionListComponent,
	props: args,
});

export const withAccordionList = Template.bind({});
const accordion = [
	{
		id: 250,
		name: 'Overview',
		visible: false,
		icon: 'report-icons ico-report00',
		reports: [],
		count: 11,
	},
];
withAccordionList.args = {
	groupedList: accordion,
};

export const AccordionListWithReports = Template.bind({});
const data = [
	{
		id: 250,
		name: 'Overview',
		visible: false,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 802,
				groupId: 250,
				name: 'Plant QR Code',
				text: 'Print QR Code of the selected Plants',
				filename: 'Plant_QR_Code.frx',
				path: 'system\\Plant_Master',
				parameters: 3,
			},
			{
				id: 588,
				groupId: 250,
				name: 'Equipment Overview',
				text: 'List of equipments',
				filename: 'Equipment_Overview.frx',
				path: 'system\\Resource',
				parameters: 3,
			},
		],
		count: 11,
	},

	{
		id: 275,
		name: 'Analysis',
		visible: true,
		icon: 'report-icons ico-report00',
		reports: [
			{
				id: 636,
				groupId: 275,
				name: 'Plant Turnover',
				text: 'Turnover of selected plants',
				filename: 'Plant_Turnover.frx',
				path: 'system\\Plant_Master',
				parameters: 6,
			},
			{
				id: 748,
				groupId: 275,
				name: 'Plant Cost and Revenue Analysis',
				text: 'Cost and Revenue Analysis of selected plant',
				filename: 'Plant_CostRevenueAnalysis.frx',
				path: 'system\\Plant_Master',
				parameters: 3,
			},
		],
		count: 5,
	},
];
AccordionListWithReports.args = {
	groupedList: data,
};
