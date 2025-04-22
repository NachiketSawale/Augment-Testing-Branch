/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowActionParametersComponent } from './workflow-action-parameters.component';

export default {
	title: 'ModulesWorkflowMainWorkflowActionParametersComponent',

	component: WorkflowActionParametersComponent,

	decorators: [
		moduleMetadata({
			imports: [],
		}),
	],
} as Meta<WorkflowActionParametersComponent>;

const Template: Story<WorkflowActionParametersComponent> = (args: WorkflowActionParametersComponent) => ({
	component: WorkflowActionParametersComponent,

	props: args,
});
export const Primary = Template.bind({});
Primary.args = {};
