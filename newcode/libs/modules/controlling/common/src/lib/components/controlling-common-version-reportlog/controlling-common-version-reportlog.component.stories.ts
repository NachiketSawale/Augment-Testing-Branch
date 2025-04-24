/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ControllingCommonControllingCommonVersionReportlogComponent } from './controlling-common-version-reportlog.component';

export default {

  title: 'ControllingCommonControllingCommonVersionReportlogComponent',

  component: ControllingCommonControllingCommonVersionReportlogComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<ControllingCommonControllingCommonVersionReportlogComponent>;



const Template: Story<ControllingCommonControllingCommonVersionReportlogComponent> = (args: ControllingCommonControllingCommonVersionReportlogComponent) => ({

  component: ControllingCommonControllingCommonVersionReportlogComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
