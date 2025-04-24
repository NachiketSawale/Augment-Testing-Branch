/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { ContainerModuleRoute } from '@libs/ui/container-system';
import { UiCommonModule } from '@libs/ui/common';
import { TimekeepingTimesymbolsModuleInfo } from './model/timekeeping-timesymbols-module-info.class';
import { TIMEKEEPING_TIME_SYMBOLS_DATA_TOKEN, TimekeepingTimeSymbolsDataService } from './services/timekeeping-time-symbols-data.service';
import { TIMEKEEPING_TIME_SYMBOLS2_GROUP_DATA_TOKEN, TimekeepingTimeSymbols2GroupDataService } from './services/timekeeping-time-symbols2-group-data.service';
import { TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_DATA_TOKEN, TimekeepingTimeSymbolsAccountDataService } from './services/timekeeping-time-symbols-account-data.service';

const routes: Routes = [new ContainerModuleRoute(TimekeepingTimesymbolsModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],
	providers: [
		{provide: TIMEKEEPING_TIME_SYMBOLS_DATA_TOKEN, useExisting: TimekeepingTimeSymbolsDataService},
		{provide: TIMEKEEPING_TIME_SYMBOLS2_GROUP_DATA_TOKEN, useExisting: TimekeepingTimeSymbols2GroupDataService},
		{provide: TIMEKEEPING_TIME_SYMBOLS_ACCOUNT_DATA_TOKEN, useExisting: TimekeepingTimeSymbolsAccountDataService},],
})
export class TimekeepingTimesymbolsModule {}
