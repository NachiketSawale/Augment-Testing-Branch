/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { PpsItemModuleInfo } from './model/pps-item-module-info.class';
import { PPS_ITEM_DATA_TOKEN, PpsItemDataService } from './services/pps-item-data.service';
import { PPS_ITEM_BEHAVIOR_TOKEN, PpsItemBehavior } from './behaviors/pps-item-behavior.service';
import { PPS_ITEM_STRUCTURE_BEHAVIOR_TOKEN, PpsItemStructureBehavior } from './behaviors/pps-item-structure-behavior.service';
import { PPS_ITEM_UPSTREAM_ITEM_BEHAVIOR_TOKEN, PpsItemUpstreamItemBehavior } from './behaviors/pps-item-upstream-item-behavior.service';
import {DrawingDisplayMode, DrawingViewerOptionsToken} from '@libs/model/shared';

const routes: Routes = [new BusinessModuleRoute(PpsItemModuleInfo.instance)];

@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: PPS_ITEM_DATA_TOKEN, useExisting: PpsItemDataService },
		{ provide: PPS_ITEM_BEHAVIOR_TOKEN, useExisting: PpsItemBehavior },
		{ provide: PPS_ITEM_STRUCTURE_BEHAVIOR_TOKEN, useExisting: PpsItemStructureBehavior },
		{ provide: PPS_ITEM_UPSTREAM_ITEM_BEHAVIOR_TOKEN, useExisting: PpsItemUpstreamItemBehavior },
		{ provide: DrawingViewerOptionsToken, useValue: { displayMode: DrawingDisplayMode.Document }}
	],
})
export class PpsItemModule {}
