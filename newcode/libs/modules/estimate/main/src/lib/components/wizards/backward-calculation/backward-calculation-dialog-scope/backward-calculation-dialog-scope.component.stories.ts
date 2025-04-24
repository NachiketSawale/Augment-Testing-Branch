/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { BackwardCalculationDialogScopeComponent } from './backward-calculation-dialog-scope.component';

export default {

  title: 'BackwardCalculationDialogScopeComponent',

  component: BackwardCalculationDialogScopeComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<BackwardCalculationDialogScopeComponent>;



const Template: Story<BackwardCalculationDialogScopeComponent> = (args: BackwardCalculationDialogScopeComponent) => ({

  component: BackwardCalculationDialogScopeComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
