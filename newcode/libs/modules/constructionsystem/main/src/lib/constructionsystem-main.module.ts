/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { ConstructionsystemMainModuleInfo } from './model/constructionsystem-main-module-info.class';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_DATA_TOKEN, ConstructionSystemMainInstanceDataService } from './services/construction-system-main-instance-data.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_BEHAVIOR_TOKEN, ConstructionSystemMainInstanceBehavior } from './behaviors/construction-system-main-instance-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_JOB_DATA_TOKEN, ConstructionSystemMainJobDataService } from './services/construction-system-main-job-data.service';
import { CONSTRUCTION_SYSTEM_MAIN_JOB_GRID_BEHAVIOR_TOKEN, ConstructionSystemMainJobGridBehavior } from './behaviors/construction-system-main-job-grid-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_GRID_BEHAVIOR_TOKEN, ConstructionSystemMainInstanceHeaderParameterGridBehaviorService } from './behaviors/construction-system-main-instance-header-parameter-grid-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_FORM_BEHAVIOR_TOKEN, ConstructionSystemMainInstanceHeaderParameterFormBehaviorService } from './behaviors/construction-system-main-instance-header-parameter-form-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_DATA_TOKEN, ConstructionSystemMainInstance2ObjectDataService } from './services/construction-system-main-instance2-object-data.service';
import { CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_BEHAVIOR_TOKEN, ConstructionSystemMainInstance2ObjectBehavior } from './behaviors/construction-system-main-instance2-object-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_DATA_TOKEN, ConstructionSystemMainObject2LocationDataService } from './services/construction-system-main-object2-location-data.service';
import { CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_DATA_TOKEN, ConstructionSystemMainLineItemDataService } from './services/construction-system-main-line-item-data.service';
import { CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_BEHAVIOR_TOKEN, ConstructionSystemMainLineItemBehavior } from './behaviors/construction-system-main-line-item-behavior.service';
import { CONSTRUCTION_SYSTEM_MAIN_RESOURCE_DATA_TOKEN, ConstructionSystemMainResourceDataService } from './services/construction-system-main-resource-data.service';

const routes: Routes = [new BusinessModuleRoute(ConstructionsystemMainModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE_DATA_TOKEN, useExisting: ConstructionSystemMainInstanceDataService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainInstanceBehavior },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_JOB_DATA_TOKEN, useExisting: ConstructionSystemMainJobDataService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_JOB_GRID_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainJobGridBehavior },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_GRID_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainInstanceHeaderParameterGridBehaviorService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE_HEADER_PARAMETER_FORM_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainInstanceHeaderParameterFormBehaviorService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_DATA_TOKEN, useExisting: ConstructionSystemMainInstance2ObjectDataService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_INSTANCE2_OBJECT_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainInstance2ObjectBehavior },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_OBJECT2_LOCATION_DATA_TOKEN, useExisting: ConstructionSystemMainObject2LocationDataService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_DATA_TOKEN, useExisting: ConstructionSystemMainLineItemDataService },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_LINE_ITEM_BEHAVIOR_TOKEN, useExisting: ConstructionSystemMainLineItemBehavior },
		{ provide: CONSTRUCTION_SYSTEM_MAIN_RESOURCE_DATA_TOKEN, useExisting: ConstructionSystemMainResourceDataService },
	],
})
export class ConstructionsystemMainModule {}
