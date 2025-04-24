/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { EstimateAssembliesModuleInfo } from './model/estimate-assemblies-module-info.class';
import { ESTIMATE_ASSEMBLY_ASSEMBLIES_CATEGORY_BEHAVIOR_TOKEN, EstimateAssemblyAssembliesCategoryBehavior } from './containers/assembly-category/estimate-assembliess-assembly-categories-behavior.service';

const routes: Routes = [new BusinessModuleRoute(EstimateAssembliesModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [{ provide: ESTIMATE_ASSEMBLY_ASSEMBLIES_CATEGORY_BEHAVIOR_TOKEN, useExisting: EstimateAssemblyAssembliesCategoryBehavior }],
})
export class EstimateAssembliesModule {}
