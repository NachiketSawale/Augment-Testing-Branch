/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UpdateCosInstanceComponent } from './update-cos-instance.component';

export default {

  title: 'UpdateCosInstanceComponent',

  component: UpdateCosInstanceComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<UpdateCosInstanceComponent>;



const Template: Story<UpdateCosInstanceComponent> = (args: UpdateCosInstanceComponent) => ({

  component: UpdateCosInstanceComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
