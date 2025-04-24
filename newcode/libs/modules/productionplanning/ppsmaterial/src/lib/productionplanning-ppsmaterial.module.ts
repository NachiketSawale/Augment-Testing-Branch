/*
 * Copyright(c) RIB Software GmbH
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { PPS_CAD_TO_MATERIAL_BEHAVIOR_TOKEN, PpsCadToMaterialBehavior } from './behaviors/pps-cad-to-material-behavior.service';
import { ProductionplanningPpsmaterialModuleInfo } from './model/productionplanning-ppsmaterial-module-info.class';
import { PPS_CAD_TO_MATERIAL_DATA_TOKEN, PpsCadToMaterialDataService } from './services/cad-to-material/pps-cad-to-material-data.service';
import { PPS_CAD_TO_MATERIAL_VALIDATION_TOKEN, PpsCadToMaterialValidationService } from './services/cad-to-material/pps-cad-to-material-validation.service';
import { PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_DATA_TOKEN, PpsMaterialToMdlProductTypeDataService } from './services/material-to-producttype/pps-material-to-mdl-product-type-data.service';
import { PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_BEHAVIOR_TOKEN, PpsMaterialToMdlProductTypeBehavior } from './behaviors/pps-material-to-mdl-product-type-behavior.service';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningPpsmaterialModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: PPS_CAD_TO_MATERIAL_DATA_TOKEN, useExisting: PpsCadToMaterialDataService },
		{ provide: PPS_CAD_TO_MATERIAL_VALIDATION_TOKEN, useExisting: PpsCadToMaterialValidationService },
		{ provide: PPS_CAD_TO_MATERIAL_BEHAVIOR_TOKEN, useExisting: PpsCadToMaterialBehavior },
		{provide: PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_DATA_TOKEN, useExisting: PpsMaterialToMdlProductTypeDataService},
		{provide: PPS_MATERIAL_TO_MDL_PRODUCT_TYPE_BEHAVIOR_TOKEN, useExisting: PpsMaterialToMdlProductTypeBehavior},
	],
})
export class ProductionplanningPpsmaterialModule { }
