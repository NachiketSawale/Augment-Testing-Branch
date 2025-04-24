/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainPaginatorComponent } from './webapihelp-main-paginator.component';
import { PlatformConfigurationService } from '@libs/platform/common';

export default {
  title: 'WebApiHelpMainPaginatorComponent',
  component: WebApiHelpMainPaginatorComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      providers: [WebApiHelpMainService, PlatformConfigurationService, HttpClient],
      declarations: [WebApiHelpMainPaginatorComponent],
    }),
  ]

} as Meta<WebApiHelpMainPaginatorComponent>;

export const Primary = {
  render: (args: WebApiHelpMainPaginatorComponent) => ({
    props: args,
  }),
  args: {
    totalCount: 1,
    rulerLength: 1,
  },
};