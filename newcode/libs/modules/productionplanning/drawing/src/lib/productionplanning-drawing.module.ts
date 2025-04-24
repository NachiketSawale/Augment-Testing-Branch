/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { DrawingModuleInfo } from './model/drawing-module-info.class';
import { DrawingBehavior } from './behaviors/drawing-behavior.service';
import { DrawingStackBehavior } from './behaviors/drawing-stack-behavior.service';
import { DrawingRevisionBehavior } from './behaviors/drawing-revision-behavior.service';
import { DrawingStackDataService } from './services/drawing-stack-data.service';
import { DrawingRevisionDataService } from './services/drawing-revision-data.service';
import { DrawingDataService } from './services/drawing-data.service';
import { DrawingComponentBehavior } from './behaviors/drawing-component-behavior.service';
import { DrawingComponentDataService } from './services/drawing-component-data.service';
import { DrawingSkillDataService } from './services/drawing-skill-data.service';
import { DrawingSkillBehavior } from './behaviors/drawing-skill-behavior.service';
import { ProductionplanningSharedModule } from '@libs/productionplanning/shared';


const routes: Routes = [new BusinessModuleRoute(DrawingModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule, ProductionplanningSharedModule],
	providers: [
		{provide: DrawingBehavior, deps: [DrawingDataService]},
		{provide: DrawingStackBehavior, deps: [DrawingStackDataService]},
		{provide: DrawingRevisionBehavior, deps: [DrawingRevisionDataService]},
		{provide: DrawingComponentBehavior, deps: [DrawingComponentDataService]},
		{provide: DrawingSkillBehavior, deps: [DrawingSkillDataService]},
	]
})
export class ProductionplanningDrawingModule {
}
