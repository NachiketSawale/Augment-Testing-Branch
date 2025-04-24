/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PriceAdjustModifyComponent } from './price-adjust-modify.component';

export default {

  title: 'PriceAdjustModifyComponent',

  component: PriceAdjustModifyComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<PriceAdjustModifyComponent>;



const Template: Story<PriceAdjustModifyComponent> = (args: PriceAdjustModifyComponent) => ({

  component: PriceAdjustModifyComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
