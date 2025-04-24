/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Meta, moduleMetadata } from '@storybook/angular';

import { WebApiHelpMainService } from '../../services/webapihelp-main.service';

import { WebApiHelpMainHeaderComponent } from './webapihelp-main-header.component';
import { PlatformConfigurationService } from '@libs/platform/common';

export default {
  title: 'WebApiHelpMainHeaderComponent',
  component: WebApiHelpMainHeaderComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule, BrowserAnimationsModule],
      declarations: [],
      providers: [PlatformConfigurationService, WebApiHelpMainService, HttpClient],
    }),
  ],
  parameters: {
    mockData: [{}],
  },
} as Meta<WebApiHelpMainHeaderComponent>;

export const Primary = {
  render: (args: WebApiHelpMainHeaderComponent) => ({
    props: args,
  }),
  args: {
    filteredData: ['basics/api/1.0/apilogon',
      'basics/api/1.0/buildversion',
      'basics/api/1.0/systeminfo',
      'basics/api/1.0/userinfo',
      'basics/api/2.0/buildversion',
      'basics/api/2.0/datalanguage',
      'basics/api/2.0/datapinelogin',
      'basics/api/2.0/getjwtfromlogonname',
      'basics/api/2.0/jwtfromlogonnamecallback',
      'basics/api/2.0/languages',
      'basics/api/2.0/logon',
      'basics/api/2.0/systeminfo',
      'basics/api/2.0/userinfo',
      'basics/api/3.0/languages',
      'basics/api/4.0/languages',
      'basics/api/apilogon',
      'basics/api/apiversions',
      'basics/api/inquiry/apiversions',
      'basics/api/inquiry/cancelinquiry',
      'basics/api/inquiry/deleteinquiry',
      'basics/api/inquiry/saveinquiries',
      'basics/customizepublicapi/abcclassification/1.0',
      'basics/customizepublicapi/abcclassification/1.0/$count',
      'basics/customizepublicapi/abcclassification/1.0/{id}',
      'basics/customizepublicapi/abcclassification/1.0/apiversions',
      'basics/customizepublicapi/abcclassification/1.0/lastchanged',
      'basics/customizepublicapi/abcclassification/apiversions',
      'basics/customizepublicapi/accounting/1.0'],
    downloadBtnFlag: true,
  },
};
