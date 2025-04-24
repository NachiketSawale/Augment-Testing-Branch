/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticMaterialPriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionMaterialPriceDataService } from './logistic-price-condition-material-price-data.service';

/**
 * Logistic Price Condition material Price Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionMaterialPriceValidationService extends BaseValidationService<ILogisticMaterialPriceEntity> {

	private dataService = inject(LogisticPriceConditionMaterialPriceDataService);
	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticMaterialPriceEntity> {
		return {
			Price:this.validateIsMandatory,
			CurrencyFk:this.validateIsMandatory,
			MaterialFk:this.validateIsMandatory,
			MaterialCatalogFk:this.validateIsMandatory,
			CommentText:this.validateIsMandatory,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo
		};
	}


	private validateValidFrom(info: ValidationInfo<ILogisticMaterialPriceEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<ILogisticMaterialPriceEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticMaterialPriceEntity> {
		return this.dataService;
	}
}