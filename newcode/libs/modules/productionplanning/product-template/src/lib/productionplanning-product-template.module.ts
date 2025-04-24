/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { DrawingDisplayMode, DrawingViewerOptionsToken } from '@libs/model/shared';
import { ProductionplanningProducttemplateModuleInfo } from './model/productionplanning-product-template-module-info.class';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningProducttemplateModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: DrawingViewerOptionsToken, useValue: { displayMode: DrawingDisplayMode.Document }},
	],
})
export class ProductionplanningProductTemplateModule {}
