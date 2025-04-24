/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { ProductionplanningStrandpatternModuleInfo } from './model/productionplanning-strandpattern-module-info.class';
import { PRODUCTIONPLANNING_STRANDPATTERN_DATA_TOKEN, ProductionplanningStrandpatternDataService } from './services/productionplanning-strandpattern-data.service';
import { PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN, ProductionplanningStrandpatternBehavior } from './behaviors/productionplanning-strandpattern-behavior.service';
import { PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_DATA_TOKEN, ProductionplanningStrandpattern2materialDataService } from './services/productionplanning-strandpattern2material-data.service';
import { PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_BEHAVIOR_TOKEN, ProductionplanningStrandpattern2materialBehavior } from './behaviors/productionplanning-strandpattern2material-behavior.service';


const routes: Routes = [new ContainerModuleRoute(ProductionplanningStrandpatternModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: PRODUCTIONPLANNING_STRANDPATTERN_DATA_TOKEN, useExisting: ProductionplanningStrandpatternDataService },
		{ provide: PRODUCTIONPLANNING_STRANDPATTERN_BEHAVIOR_TOKEN, useExisting: ProductionplanningStrandpatternBehavior },
		{ provide: PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_DATA_TOKEN, useExisting: ProductionplanningStrandpattern2materialDataService },
		{ provide: PRODUCTIONPLANNING_STRANDPATTERN2MATERIAL_BEHAVIOR_TOKEN, useExisting: ProductionplanningStrandpattern2materialBehavior },
	],
})
export class ProductionplanningStrandpatternModule {}
