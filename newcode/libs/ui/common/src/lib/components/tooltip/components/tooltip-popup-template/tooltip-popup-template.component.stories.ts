/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonTooltipPopupTemplateComponent } from './tooltip-popup-template.component';
import { HttpClientModule } from '@angular/common/http';

export default {
	title: 'Tooltip/UiCommonTooltipPopupTemplateComponent',
	component: UiCommonTooltipPopupTemplateComponent,
	decorators: [
		moduleMetadata({
			imports: [HttpClientModule],
		}),
	],
} as Meta<UiCommonTooltipPopupTemplateComponent>;

const Template: Story<UiCommonTooltipPopupTemplateComponent> = (args: UiCommonTooltipPopupTemplateComponent) => ({
	component: UiCommonTooltipPopupTemplateComponent,
	props: args,
});

const tooltipArr = [
	{
		toolTip: {
			title: 'View filter is active',
		},
		iconClass: 'control-icons ico-filter-on',
	},
	{
		toolTip: {
			title: 'Automatic loading is active',
			caption: 'The option to Load data after a tab change is active The option can be deactivated in the View Save dialogue.',
		},
		iconClass: 'control-icons ico-opt-load-tab',
	},
	{
		toolTip: {
			title: 'Automatic loading is active',
			caption: 'The option to load data when starting the module is active. The option can be deactivated in the View Save dialogue.',
		},
		iconClass: 'control-icons ico-opt-load-start',
	},
];
export const Default = Template.bind({});
Default.args = {
	fields: tooltipArr,
};

export const WithSlicedTooltip = Template.bind({});
WithSlicedTooltip.args = {
	fields: [...tooltipArr.slice(0, 2)],
};

export const WithDifferentCaptions = Template.bind({});
const data = [
	{
		toolTip: {
			title: 'View filter',
		},
		iconClass: 'control-icons ico-filter-on',
	},
	{
		toolTip: {
			title: 'Automatic loading is active',
			caption: 'The option can be deactivated in the View Save dialogue.',
		},
		iconClass: 'control-icons ico-opt-load-tab',
	},
	{
		toolTip: {
			title: 'Automatic loading is active',
			caption: 'The option to load data when starting the module is active.',
		},
		iconClass: 'control-icons ico-opt-load-start',
	},
];

WithDifferentCaptions.args = {
	fields: data,
};
