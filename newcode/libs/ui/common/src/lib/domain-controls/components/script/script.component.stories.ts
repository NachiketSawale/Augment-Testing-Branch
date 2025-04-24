/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { ScriptComponent } from './script.component';

export default {

  title: 'ScriptComponent',

  component: ScriptComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<ScriptComponent>;



const Template: Story<ScriptComponent> = (args: ScriptComponent) => ({

  component: ScriptComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
