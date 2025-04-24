/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import EstimateMainDissolveAssemblyResourceDialogComponent from './estimate-main-dissolve-assembly-resource-dialog.component';

export default {

  title: 'EstimateMainDissolveAssemblyResourceDialogComponent',

  component: EstimateMainDissolveAssemblyResourceDialogComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<EstimateMainDissolveAssemblyResourceDialogComponent>;



const Template: Story<EstimateMainDissolveAssemblyResourceDialogComponent> = (args: EstimateMainDissolveAssemblyResourceDialogComponent) => ({

  component: EstimateMainDissolveAssemblyResourceDialogComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
