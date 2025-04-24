/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { ProductionplanningHeaderModuleInfo } from './model/productionplanning-header-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { BasicsSharedModule } from '@libs/basics/shared';

import { PpsEstResourceDialogLookupComponent }
	from './components/pps-est-resource-dialog-lookup/pps-est-resource-dialog-lookup.component';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningHeaderModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, BasicsSharedModule],
	declarations: [PpsEstResourceDialogLookupComponent,

	],
	exports: [PpsEstResourceDialogLookupComponent,

	]
})
export class ProductionplanningHeaderModule { }
