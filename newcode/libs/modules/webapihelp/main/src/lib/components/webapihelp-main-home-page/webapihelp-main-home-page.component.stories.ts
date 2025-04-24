/**
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { HttpClientModule } from '@angular/common/http';
import { Meta, moduleMetadata } from '@storybook/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OidcSecurityService } from 'angular-auth-oidc-client';

import { WebApiHelpMainHomePageComponent } from './webapihelp-main-home-page.component';
import { PlatformConfigurationService } from '@libs/platform/common';

export default {
  title: 'WebApiHelpMainHomePageComponent',
  component: WebApiHelpMainHomePageComponent,
  decorators: [
    moduleMetadata({
      imports: [HttpClientModule, MatAutocompleteModule, FormsModule, ReactiveFormsModule],
      declarations: [WebApiHelpMainHomePageComponent],
      providers: [OidcSecurityService, PlatformConfigurationService]
    }),
  ]
} as Meta<WebApiHelpMainHomePageComponent>;

export const Primary = {
  render: (args: WebApiHelpMainHomePageComponent) => ({
    props: args,
  }),
  args: {
  },
};