/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowInputParametersContainerComponent } from './workflow-input-parameters-container.component';

export default {

	title: 'WorkflowInputParametersContainerComponent',

	component: WorkflowInputParametersContainerComponent,

	decorators: [

		moduleMetadata({

			imports: [],

		})

	],

} as Meta<WorkflowInputParametersContainerComponent>;



const Template: Story<WorkflowInputParametersContainerComponent> = (args: WorkflowInputParametersContainerComponent) => ({

	component: WorkflowInputParametersContainerComponent,

	props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
