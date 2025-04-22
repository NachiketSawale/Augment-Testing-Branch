/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { SampleActionEditorComponent } from './sample-custom-action-editor.component';


export default {

  title: 'SampleActionEditorComponent',

  component: SampleActionEditorComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<SampleActionEditorComponent>;



const Template: Story<SampleActionEditorComponent> = (args: SampleActionEditorComponent) => ({

  component: SampleActionEditorComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
