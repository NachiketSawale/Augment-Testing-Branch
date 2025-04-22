/*
 * Copyright(c) RIB Software GmbH
 */

import { moduleMetadata, Story, Meta } from '@storybook/angular';
import { MenuListFileSelectComponent } from './menu-list-file-select.component';


export default {

  title: 'MenuListFileSelectComponent',

  component: MenuListFileSelectComponent,

  decorators: [

    moduleMetadata({

      imports: [],

    })

  ],

} as Meta<MenuListFileSelectComponent<void>>;



const Template: Story<MenuListFileSelectComponent<void>> = (args: MenuListFileSelectComponent<void>) => ({

  component: MenuListFileSelectComponent,

  props: args,

});
export const Primary = Template.bind({});
Primary.args = {};
