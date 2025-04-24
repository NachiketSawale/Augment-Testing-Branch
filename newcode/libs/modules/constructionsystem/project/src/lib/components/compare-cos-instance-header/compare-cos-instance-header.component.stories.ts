/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CompareCosInstanceHeaderComponent } from './compare-cos-instance-header.component';

export default {

  title: 'CompareCosInstanceHeaderComponent',

  component: CompareCosInstanceHeaderComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<CompareCosInstanceHeaderComponent>;



const Template: Story<CompareCosInstanceHeaderComponent> = (args: CompareCosInstanceHeaderComponent) => ({

  component: CompareCosInstanceHeaderComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
