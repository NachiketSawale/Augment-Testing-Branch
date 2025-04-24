/*
 * Copyright(c) RIB Software GmbH
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { LogisticSundryGroupModuleInfo } from './model/logistic-sundry-service-group-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
/**
 * Adds a default route to render containers to logistic sundry service module
 */
const routes: Routes = [
	new BusinessModuleRoute(LogisticSundryGroupModuleInfo.instance)
];


@NgModule({
	imports: [CommonModule, UiCommonModule, RouterModule.forChild(routes)],
	providers: []
})
export class LogisticSundryGroupModule {}
