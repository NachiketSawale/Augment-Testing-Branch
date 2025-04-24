/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { AssignValuesForAttributesWizardDialogComponent } from './assign-values-for-attributes-wizard-dialog.component';

export default {

  title: 'AssignValuesForAttributesWizardDialogComponent',

  component: AssignValuesForAttributesWizardDialogComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<AssignValuesForAttributesWizardDialogComponent>;



const Template: Story<AssignValuesForAttributesWizardDialogComponent> = (args: AssignValuesForAttributesWizardDialogComponent) => ({

  component: AssignValuesForAttributesWizardDialogComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
