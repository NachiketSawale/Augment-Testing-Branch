/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { BasicsSiteModuleInfo } from './model/basics-site-module-info.class';
import { BASICS_SITE_GRID_DATA_TOKEN, BasicsSiteGridDataService } from './services/basics-site-grid-data.service';
import { BASICS_SITE_GRID_BEHAVIOR_TOKEN, BasicsSiteGridBehavior } from './behaviors/basics-site-grid-behavior.service';
import { BASICS_SITE2_STOCK_DATA_TOKEN, BasicsSite2StockDataService } from './services/basics-site2-stock-data.service';
import { BASICS_SITE2_STOCK_BEHAVIOR_TOKEN, BasicsSite2StockBehavior } from './behaviors/basics-site2-stock-behavior.service';
import { BASICS_SITE2_EXTERNAL_DATA_TOKEN, BasicsSite2ExternalDataService } from './services/basics-site2-external-data.service';
import { BASICS_SITE2_EXTERNAL_BEHAVIOR_TOKEN, BasicsSite2ExternalBehavior } from './behaviors/basics-site2-external-behavior.service';
import { BASICS_SITE2_TKS_SHIFT_DATA_TOKEN, BasicsSite2TksShiftDataService } from './services/basics-site2-tks-shift-data.service';
import { BASICS_SITE2_TKS_SHIFT_BEHAVIOR_TOKEN, BasicsSite2TksShiftBehavior } from './behaviors/basics-site2-tks-shift-behavior.service';
import { PPS_PRODUCTION_PLACE_DATA_TOKEN, PpsProductionPlaceDataService } from './services/pps-production-place-data.service';
import { PPS_PRODUCTION_PLACE_BEHAVIOR_TOKEN, PpsProductionPlaceBehavior } from './behaviors/pps-production-place-behavior.service';
import { BASIC_SITE2_CLERK_DATA_TOKEN, BasicSite2ClerkDataService } from './services/basic-site2-clerk-data.service';
import { PPS_COMMON_CALENDAR_SITE_DATA_TOKEN, PpsCommonCalendarSiteDataService } from './services/pps-common-calendar-site-data.service';
import { PPS_COMMON_CALENDAR_SITE_BEHAVIOR_TOKEN, PpsCommonCalendarSiteBehavior } from './behaviors/pps-common-calendar-site-behavior.service';
import { PPS_PROD_PLACE_CHILDREN_DATA_TOKEN, PpsProdPlaceChildrenDataService } from './services/pps-prod-place-children-data.service';
import { PPS_PROD_PLACE_CHILDREN_BEHAVIOR_TOKEN, PpsProdPlaceChildrenBehavior } from './behaviors/pps-prod-place-children-behavior.service';
import { BASIC_SITE2_CLERK_BEHAVIOR_TOKEN,BasicsSite2ClerkBehavior } from './behaviors/basics-site2-clerk-behaviour.service';

const routes: Routes = [new ContainerModuleRoute(BasicsSiteModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: BASICS_SITE_GRID_DATA_TOKEN, useExisting: BasicsSiteGridDataService },
		{ provide: BASICS_SITE_GRID_BEHAVIOR_TOKEN, useExisting: BasicsSiteGridBehavior },

		{ provide: PPS_PROD_PLACE_CHILDREN_BEHAVIOR_TOKEN, useExisting: PpsProdPlaceChildrenBehavior },

		{ provide: PPS_PROD_PLACE_CHILDREN_DATA_TOKEN, useExisting: PpsProdPlaceChildrenDataService },

		{ provide: BASICS_SITE2_STOCK_DATA_TOKEN, useExisting: BasicsSite2StockDataService },
		{ provide: BASICS_SITE2_STOCK_BEHAVIOR_TOKEN, useExisting: BasicsSite2StockBehavior },
		{ provide: BASICS_SITE2_EXTERNAL_DATA_TOKEN, useExisting: BasicsSite2ExternalDataService },
		{ provide: BASICS_SITE2_EXTERNAL_BEHAVIOR_TOKEN, useExisting: BasicsSite2ExternalBehavior },
		{ provide: BASICS_SITE2_TKS_SHIFT_DATA_TOKEN, useExisting: BasicsSite2TksShiftDataService },
		{ provide: BASICS_SITE2_TKS_SHIFT_BEHAVIOR_TOKEN, useExisting: BasicsSite2TksShiftBehavior },
		{ provide: PPS_PRODUCTION_PLACE_DATA_TOKEN, useExisting: PpsProductionPlaceDataService },
		{ provide: PPS_PRODUCTION_PLACE_BEHAVIOR_TOKEN, useExisting: PpsProductionPlaceBehavior },
		{ provide: BASIC_SITE2_CLERK_DATA_TOKEN, useExisting: BasicSite2ClerkDataService },
		{ provide: BASIC_SITE2_CLERK_BEHAVIOR_TOKEN, useExisting: BasicsSite2ClerkBehavior},
		{ provide: PPS_COMMON_CALENDAR_SITE_DATA_TOKEN, useExisting: PpsCommonCalendarSiteDataService },
		{ provide: PPS_COMMON_CALENDAR_SITE_BEHAVIOR_TOKEN, useExisting: PpsCommonCalendarSiteBehavior },
		{ provide: BASICS_SITE_GRID_DATA_TOKEN, useExisting: BasicsSiteGridDataService },
		{ provide: BASICS_SITE_GRID_BEHAVIOR_TOKEN, useExisting: BasicsSiteGridBehavior },
	],
})
export class BasicsSiteModule {}
