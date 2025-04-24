/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { BusinessModuleRoute } from '@libs/ui/business-base';
import { UiCommonModule } from '@libs/ui/common';
import { TransportplanningPackageModuleInfo } from './model/transportplanning-package-module-info.class';
import { TRANSPORTPLANNING_PACKAGE_DATA_TOKEN, TransportplanningPackageDataService } from './services/transportplanning-package-data.service';
import { TRANSPORTPLANNING_PACKAGE_BEHAVIOR_TOKEN, TransportplanningPackageBehavior } from './behaviors/transportplanning-package-behavior.service';

const routes: Routes = [new BusinessModuleRoute(TransportplanningPackageModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{ provide: TRANSPORTPLANNING_PACKAGE_DATA_TOKEN, useExisting: TransportplanningPackageDataService },
		{ provide: TRANSPORTPLANNING_PACKAGE_BEHAVIOR_TOKEN, useExisting: TransportplanningPackageBehavior },
	],
})
export class TransportplanningPackageModule { }
