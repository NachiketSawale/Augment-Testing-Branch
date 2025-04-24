/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { GridComponent, UiCommonModule } from '@libs/ui/common';
import { ProductionplanningEngineeringModuleInfo } from './model/productionplanning-engineering-module-info.class';
import { DrawingDisplayMode, DrawingViewerOptionsToken } from '@libs/model/shared';
import { PlatformCommonModule } from '@libs/platform/common';
import { ProductTemplateDialogComponent } from './components/product-template-dialog/product-template-dialog.component';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningEngineeringModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, PlatformCommonModule, GridComponent],
	providers: [{ provide: DrawingViewerOptionsToken, useValue: { displayMode: DrawingDisplayMode.Document } }],
	declarations: [ProductTemplateDialogComponent],
})
export class ProductionplanningEngineeringModule {}
