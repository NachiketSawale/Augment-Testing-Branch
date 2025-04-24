/*
 * Copyright(c) RIB Software GmbH
 */


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { UiCommonModule } from '@libs/ui/common';
import { LogisticSundryServiceModuleInfo } from './model/logistic-sundryservice-module-info.class';
import { BusinessModuleRoute } from '@libs/ui/business-base';
import { LOGISTIC_SUNDRY_SERVICE_VALIDATION_TOKEN, LogisticSundryServiceValidationService } from './services/logistic-sundry-service-validation.service';
import { LOGISTIC_SUNDRY_SERVICE_PRICE_LIST_VALIDATION_TOKEN, LogisticSundryServicePriceListValidationService } from './services/logistic-sundry-service-price-list-validation.service';
/**
 * Adds a default route to render containers to logistic sundry service module
 */
const routes: Routes = [
	new BusinessModuleRoute(LogisticSundryServiceModuleInfo.instance)
];

@NgModule({
	imports: [CommonModule, UiCommonModule, RouterModule.forChild(routes)],
	providers: [
		{ provide: LOGISTIC_SUNDRY_SERVICE_VALIDATION_TOKEN, useExisting: LogisticSundryServiceValidationService },
		{ provide: LOGISTIC_SUNDRY_SERVICE_PRICE_LIST_VALIDATION_TOKEN, useExisting: LogisticSundryServicePriceListValidationService }
	]
})
export class LogisticSundryServiceModule {}
