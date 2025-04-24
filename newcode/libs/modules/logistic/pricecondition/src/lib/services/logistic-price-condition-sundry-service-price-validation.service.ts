/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionSundryServicePriceDataService } from './logistic-price-condition-sundry-service-price-data.service';



/**
 * Logistic Price Condition sundry service price validation Service
 */


@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionSundryServicePriceValidationService extends BaseValidationService<ILogisticSundryServicePriceEntity> {

	//private logisticSundryServiceLookupService = inject(LogisticSundryServiceLookupService);
	private logisticPriceConditionSundryServiceDataService = inject(LogisticPriceConditionSundryServicePriceDataService);

	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryServicePriceEntity> {
		return {

			SundryServiceFk : this.validateIsMandatory
		};
	}


	// TO DO - platformValidationRevalidationEntitiesFactory - for addValidationServiceInterface
	// TO DO - platformValidationPeriodOverlappingService - for validateAdditionalValidFrom
	// TO DO - platformValidationPeriodOverlappingService - for validateTo




	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryServicePriceEntity> {
		return this.logisticPriceConditionSundryServiceDataService;
	}
}
