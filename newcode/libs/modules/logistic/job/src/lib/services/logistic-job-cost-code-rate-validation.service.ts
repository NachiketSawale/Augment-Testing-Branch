/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticJobCostCodeRateEntity } from '@libs/logistic/interfaces';
import { LogisticJobCostcodeRateDataService } from './logistic-job-costcode-rate-data.service';

/**
 * Logistic Price Job Cost Code Rate Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobCostCodeRateValidationService extends BaseValidationService<ILogisticJobCostCodeRateEntity> {


	private dataService = inject(LogisticJobCostcodeRateDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticJobCostCodeRateEntity> {
		return {
			JobFk:this.validateIsMandatory,
			Rate:this.validateIsMandatory,
			SalesPrice:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticJobCostCodeRateEntity> {
		return this.dataService;
	}


}