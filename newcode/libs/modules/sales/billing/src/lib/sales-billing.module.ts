/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { SalesBillingModuleInfo } from './model/sales-billing-module-info.class';

const routes: Routes = [new BusinessModuleRoute(SalesBillingModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [],
})
export class SalesBillingModule {}
