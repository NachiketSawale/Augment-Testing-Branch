/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowOutputParametersContainerComponent } from './workflow-output-parameters-container.component';

export default {
	title: 'WorkflowOutputParametersContainerComponent',
	component: WorkflowOutputParametersContainerComponent,
	decorators: [
		moduleMetadata({
			imports: [],
		})
	],
} as Meta<WorkflowOutputParametersContainerComponent>;

const Template: Story<WorkflowOutputParametersContainerComponent> = (args: WorkflowOutputParametersContainerComponent) => ({
	component: WorkflowOutputParametersContainerComponent,
	props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
