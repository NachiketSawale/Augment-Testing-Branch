import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';

import { ProductionplanningEventconfigurationModuleInfo } from './model/productionplanning-eventconfiguration-module-info.class';
import { UiCommonModule } from '@libs/ui/common';

const routes: Routes = [new BusinessModuleRoute(ProductionplanningEventconfigurationModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
})
export class ProductionplanningEventconfigurationModule {}
