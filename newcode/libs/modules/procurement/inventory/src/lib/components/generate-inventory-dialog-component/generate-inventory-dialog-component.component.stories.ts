/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { GenerateInventoryDialogComponentComponent } from './generate-inventory-dialog-component.component';

export default {

  title: 'GenerateInventoryDialogComponentComponent',

  component: GenerateInventoryDialogComponentComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<GenerateInventoryDialogComponentComponent>;



const Template: Story<GenerateInventoryDialogComponentComponent> = (args: GenerateInventoryDialogComponentComponent) => ({

  component: GenerateInventoryDialogComponentComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
