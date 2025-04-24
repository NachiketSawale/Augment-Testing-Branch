/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { WebApiHelpMainHomePageComponent } from './components/webapihelp-main-home-page/webapihelp-main-home-page.component';
import { WebApiHelpMainLeftMenuComponent } from './components/webapihelp-main-leftmenu/webapihelp-main-leftmenu.component';
import { WebApiHelpMainHeaderComponent } from './components/webapihelp-main-header/webapihelp-main-header.component';
import { WebApiHelpMainPaginatorComponent } from './components/webapihelp-main-paginator/webapihelp-main-paginator.component';
import { WebApiHelpMainSwaggerContentComponent } from './components/webapihelp-main-swagger-content/webapihelp-main-swagger-content.component';
import { WebApiHelpMainScrollToTopComponent } from './components/webapihelp-main-scroll-to-top/webapihelp-main-scroll-to-top.component';
import { WebApiHelpMainDownloadComponent } from './components/webapihelp-main-download/webapihelp-main-download.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
const routes: Routes = [
	{
		path: '',
		component: WebApiHelpMainHomePageComponent,
	},
	{
		path: 'download',
		component: WebApiHelpMainDownloadComponent,
	},
];
@NgModule({
	imports: [CommonModule,
		RouterModule.forChild(routes), MatProgressSpinnerModule,
		MatAutocompleteModule, FormsModule, ReactiveFormsModule],
	declarations: [WebApiHelpMainHomePageComponent, WebApiHelpMainLeftMenuComponent, WebApiHelpMainHeaderComponent, WebApiHelpMainPaginatorComponent, WebApiHelpMainSwaggerContentComponent, WebApiHelpMainScrollToTopComponent, WebApiHelpMainDownloadComponent],
})
export class WebapiHelpMainModule { }
