/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IPlantCostCodeEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionPlantCostCodeDataService } from './logistic-price-condition-plant-cost-code-data.service';

/**
 * Logistic Price Condition item Validation Service
 * */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionPlantCostCodeValidationService extends BaseValidationService<IPlantCostCodeEntity> {

	private dataService = inject(LogisticPriceConditionPlantCostCodeDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IPlantCostCodeEntity> {
		return {

		};
	}


	//TO DO - validateAdditionalPlantCostCodeTypeFk
	/*
	protected validateAdditionalPlantCostCodeTypeFk(info: ValidationInfo<ILogisticCostCodeRateEntity>){
		This function is pending because of not able to find the lookup for the basics.customize.logisticsplantcostcodetype
	}
	*/

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlantCostCodeEntity> {
		return this.dataService;
	}
}