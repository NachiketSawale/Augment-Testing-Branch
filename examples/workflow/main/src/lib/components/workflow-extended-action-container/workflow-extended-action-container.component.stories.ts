/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { WorkflowExtendedActionContainerComponent } from './workflow-extended-action-container.component';

export default {

  title: 'WorkflowExtendedActionContainerComponent',

  component: WorkflowExtendedActionContainerComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<WorkflowExtendedActionContainerComponent>;



const Template: Story<WorkflowExtendedActionContainerComponent> = (args: WorkflowExtendedActionContainerComponent) => ({

  component: WorkflowExtendedActionContainerComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
