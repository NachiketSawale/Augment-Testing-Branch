/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { DisplayParametersComponent } from './display-parameters.component';

export default {

  title: 'DisplayParametersComponent',

  component: DisplayParametersComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<DisplayParametersComponent>;



const Template: Story<DisplayParametersComponent> = (args: DisplayParametersComponent) => ({

  component: DisplayParametersComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
