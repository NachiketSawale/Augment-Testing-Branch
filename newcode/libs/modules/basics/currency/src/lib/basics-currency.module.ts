/*
 * Copyright(c) RIB Software GmbH
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UiCommonModule } from '@libs/ui/common';
import { BasicsCurrencyModuleInfo } from './model/basics-currency-module-info.class';
import { BASICS_CURRENCY_DATA_TOKEN, BasicsCurrencyDataService } from './services/basics-currency-data.service';
import { BASICS_CURRENCY_CONVERSION_DATA_TOKEN, BasicsCurrencyConversionDataService } from './services/basics-currency-conversion-data.service';
import { BASICS_CURRENCY_RATE_DATA_TOKEN, BasicsCurrencyRateDataService } from './services/basics-currency-rate-data.service';
import { BusinessModuleRoute } from "@libs/ui/business-base";

const routes: Routes = [new BusinessModuleRoute(BasicsCurrencyModuleInfo.instance)];
@NgModule({
	imports: [CommonModule, RouterModule.forChild(routes), UiCommonModule],

	providers: [
		{ provide: BASICS_CURRENCY_DATA_TOKEN, useExisting: BasicsCurrencyDataService },
		{ provide: BASICS_CURRENCY_CONVERSION_DATA_TOKEN, useExisting: BasicsCurrencyConversionDataService },
		{ provide: BASICS_CURRENCY_RATE_DATA_TOKEN, useExisting: BasicsCurrencyRateDataService },
	],
})
export class BasicsCurrencyModule {}
