/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IProject2MaterialPriceConditionEntity } from '@libs/logistic/interfaces';
import { LogisticJobPrj2MaterialPriceConditionDataService } from './logistic-job-prj2-material-price-condition-data.service';

/**
 * Logistic project 2 material price condition validation service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobPrj2materialPriceConditionValidationService extends BaseValidationService<IProject2MaterialPriceConditionEntity> {


	private dataService = inject(LogisticJobPrj2MaterialPriceConditionDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IProject2MaterialPriceConditionEntity> {
		return {
			ProjectMaterialFk:this.validateIsMandatory,
			PriceConditionTypeFk:this.validateIsMandatory,
			Value:this.validateIsMandatory,
			Total:this.validateIsMandatory,
			TotalOc:this.validateIsMandatory,
			IsPriceComponent:this.validateIsMandatory,
			IsActivated:this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProject2MaterialPriceConditionEntity> {
		return this.dataService;
	}


}