/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { TotalConfigTitleComponent } from './total-config-title.component';

export default {

  title: 'TotalConfigTitleComponent',

  component: TotalConfigTitleComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<TotalConfigTitleComponent>;



const Template: Story<TotalConfigTitleComponent> = (args: TotalConfigTitleComponent) => ({

  component: TotalConfigTitleComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
