/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { UiCommonLoadingComponent } from './loading.component';

export default {

  title: 'UiCommonLoadingComponent',

  component: UiCommonLoadingComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<UiCommonLoadingComponent>;



const Template: Story<UiCommonLoadingComponent> = (args: UiCommonLoadingComponent) => ({

  component: UiCommonLoadingComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
