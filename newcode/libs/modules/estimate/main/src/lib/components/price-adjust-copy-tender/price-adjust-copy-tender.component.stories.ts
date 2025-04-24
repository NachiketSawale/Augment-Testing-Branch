/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { PriceAdjustCopyTenderComponent } from './price-adjust-copy-tender.component';

export default {

  title: 'PriceAdjustCopyTenderComponent',

  component: PriceAdjustCopyTenderComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<PriceAdjustCopyTenderComponent>;



const Template: Story<PriceAdjustCopyTenderComponent> = (args: PriceAdjustCopyTenderComponent) => ({

  component: PriceAdjustCopyTenderComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
