/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticCostCodeRateEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionCostCodeRateDataService } from './logistic-price-condition-cost-code-rate-data.service';


/**
 * Logistic Price Condition Cost Code Rate Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionCostCodeRateValidationService extends BaseValidationService<ILogisticCostCodeRateEntity> {


	private dataService = inject(LogisticPriceConditionCostCodeRateDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticCostCodeRateEntity> {
		return {
			CurrencyFk:this.validateIsMandatory,
			CommentText:this.validateIsMandatory,
			Rate:this.validateIsMandatory,
			SalesPrice:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCostCodeRateEntity> {
		return this.dataService;
	}


}