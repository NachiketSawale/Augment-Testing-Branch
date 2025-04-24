/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Meta, moduleMetadata } from '@storybook/angular';
import { WebApiHelpMainScrollToTopComponent } from './webapihelp-main-scroll-to-top.component';

export default {
  title: 'WebApiHelpScrollToTopComponent',
  component: WebApiHelpMainScrollToTopComponent,

  decorators: [
    moduleMetadata({
      declarations: [WebApiHelpMainScrollToTopComponent],
    }),
  ]
} as Meta<WebApiHelpMainScrollToTopComponent>;

export const Primary = {
  render: (args: WebApiHelpMainScrollToTopComponent) => ({
    props: args,
  }),
  args: {
    isShow: true
  },
};