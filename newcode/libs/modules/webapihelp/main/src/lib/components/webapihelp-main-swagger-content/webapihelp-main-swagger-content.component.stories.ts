/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';
import { Observable } from 'rxjs';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainSwaggerContentComponent } from './webapihelp-main-swagger-content.component';
import { PlatformConfigurationService } from '@libs/platform/common';
import { PlatformAuthService } from '@libs/platform/authentication';

let getAccessToken!: Observable<string>;

export default {
  title: 'WebApiHelpMainSwaggerContentComponent',
  component: WebApiHelpMainSwaggerContentComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule],
      declarations: [WebApiHelpMainSwaggerContentComponent],
      providers: [WebApiHelpMainService, PlatformConfigurationService,
        { provide: PlatformAuthService, useValue: getAccessToken },
        HttpClient
      ]
    })
  ]
} as Meta<WebApiHelpMainSwaggerContentComponent>;

export const Primary = {
  render: (args: WebApiHelpMainSwaggerContentComponent) => ({
    props: args,
  }),
  args: {
    searchData: '',
  },
};