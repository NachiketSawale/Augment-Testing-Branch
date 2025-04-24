/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { FilterEditorComponent } from './filter-editor.component';

export default {

  title: 'FilterEditorComponent',

  component: FilterEditorComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<FilterEditorComponent>;



const Template: Story<FilterEditorComponent> = (args: FilterEditorComponent) => ({

  component: FilterEditorComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
