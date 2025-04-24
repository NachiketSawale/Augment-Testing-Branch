/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ProductionplanningCadimportconfigModuleInfo } from './model/productionplanning-cadimportconfig-module-info.class';
import {  PpsEngineeringCadImportConfigDataService } from './services/cad-import-config-data.service';
import {  CadImportConfigGridBehavior } from './behaviors/cad-import-config-grid-behavior.service';
import {  PpsEngineeringCadValidationDataService } from './services/pps-engineering-cad-validation-data.service';
import {  PpsEngineeringCadValidationBehavior } from './behaviors/pps-engineering-cad-validation-behavior.service';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningCadimportconfigModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: CadImportConfigGridBehavior, deps: [PpsEngineeringCadImportConfigDataService]},
		{provide: PpsEngineeringCadValidationBehavior, deps: [PpsEngineeringCadValidationDataService]},
	],
})
export class ProductionplanningCadimportconfigModule {}
