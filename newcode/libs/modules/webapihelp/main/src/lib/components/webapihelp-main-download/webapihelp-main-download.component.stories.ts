/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainDownloadComponent } from './webapihelp-main-download.component';
import { PlatformConfigurationService } from '@libs/platform/common';

export default {
  title: 'WebApiHelpMainDownloadComponent',
  component: WebApiHelpMainDownloadComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      declarations: [WebApiHelpMainDownloadComponent],
      providers: [PlatformConfigurationService, WebApiHelpMainService]
    }),
  ]
} as Meta<WebApiHelpMainDownloadComponent>;

export const Primary = {
  render: (args: WebApiHelpMainDownloadComponent) => ({
    props: args,
  }),
  args: {
    styleName: {
      left: '-2%',
    },
    text: 'Download was canceled!'
  },
};