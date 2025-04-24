/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { RfqBidderReportComponent } from './rfq-bidder-report.component';

export default {

  title: 'RfqBidderReportComponent',

  component: RfqBidderReportComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<RfqBidderReportComponent>;



const Template: Story<RfqBidderReportComponent> = (args: RfqBidderReportComponent) => ({

  component: RfqBidderReportComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
