/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import { moduleMetadata, Story, Meta, componentWrapperDecorator } from '@storybook/angular';
import { UiCommonItemListComponent } from './item-list.component';

export default {
	title: 'item-list/UiCommonItemListComponent',
	component: UiCommonItemListComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<UiCommonItemListComponent>;

const Template: Story<UiCommonItemListComponent> = (args: UiCommonItemListComponent) => ({
	component: UiCommonItemListComponent,
	props: args,
});

export const withItemListTemplate = Template.bind({});
withItemListTemplate.args = {
	itemTemplate: `<li class="panel panel-primary">
  <button class="panel-heading">
    <span class="sidebar-icons ico-wiz-change-status"></span>
    <h4 class="panel-title">Asset Master</h4>
    <div class="panel-toggle-img control-icons ico-up"></div>
  </button>
  <ul class="panel-body">
    ##items##
  </ul>
</li>`,
};
withItemListTemplate.decorators = [componentWrapperDecorator((story) => `<li style="list-style-type:none">${story}</li>`)];
export const listWithHorizontalLine = Template.bind({});
listWithHorizontalLine.args = {
	itemTemplate: ' <button><b>Accounting Journal</b></button><button><hr><b>Plant</b></button><hr>',
};
