/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ControllingCommonControllingCommonVersionReportlogDialogComponent } from './controlling-common-version-reportlog-dialog.component';

export default {

  title: 'ControllingCommonControllingCommonVersionReportlogDialogComponent',

  component: ControllingCommonControllingCommonVersionReportlogDialogComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<ControllingCommonControllingCommonVersionReportlogDialogComponent>;



const Template: Story<ControllingCommonControllingCommonVersionReportlogDialogComponent> = (args: ControllingCommonControllingCommonVersionReportlogDialogComponent) => ({

  component: ControllingCommonControllingCommonVersionReportlogDialogComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
