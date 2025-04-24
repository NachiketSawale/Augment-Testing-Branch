/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BackwardCalculationDialogComponent } from './backward-calculation-dialog.component';

export default {

  title: 'BackwardCalculationDialogComponent',

  component: BackwardCalculationDialogComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<BackwardCalculationDialogComponent>;



const Template: Story<BackwardCalculationDialogComponent> = (args: BackwardCalculationDialogComponent) => ({

  component: BackwardCalculationDialogComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
