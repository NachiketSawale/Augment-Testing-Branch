/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { CommonActionEditorComponent } from './common-action-editor.component';

export default {

  title: 'CommonActionEditorComponent',

  component: CommonActionEditorComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<CommonActionEditorComponent>;



const Template: Story<CommonActionEditorComponent> = (args: CommonActionEditorComponent) => ({

  component: CommonActionEditorComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
