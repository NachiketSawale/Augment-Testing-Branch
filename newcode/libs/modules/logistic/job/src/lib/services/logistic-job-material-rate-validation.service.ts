/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticMaterialRateEntity } from '@libs/logistic/interfaces';
import { LogisticJobMaterialRateDataService } from './logistic-job-material-rate-data.service';

/**
 * Logistic Job Material Rate Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobMaterialRateValidationService extends BaseValidationService<ILogisticMaterialRateEntity> {


	private dataService = inject(LogisticJobMaterialRateDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticMaterialRateEntity> {
		return {
			MaterialFk:this.validateIsMandatory,
			PricePortion1:this.validateIsMandatory,
			PricePortion2:this.validateIsMandatory,
			PricePortion3:this.validateIsMandatory,
			PricePortion4:this.validateIsMandatory,
			PricePortion5:this.validateIsMandatory,
			PricePortion6:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticMaterialRateEntity> {
		return this.dataService;
	}


}