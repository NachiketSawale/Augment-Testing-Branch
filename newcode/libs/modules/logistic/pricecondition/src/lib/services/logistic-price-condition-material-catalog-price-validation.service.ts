/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionMaterialCatalogPriceDataService } from './logistic-price-condition-material-catalog-price-data.service';

/**
 * Logistic Price Condition Material Catalog Price Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionMaterialCatalogPriceValidationService extends BaseValidationService<ILogisticMaterialCatalogPriceEntity> {


	private dataService = inject(LogisticPriceConditionMaterialCatalogPriceDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticMaterialCatalogPriceEntity> {
		return {
			MaterialCatalogFk:this.validateIsMandatory,
			//MaterialPriceListFk:this.validateIsMandatory,
			//MaterialPriceVersionFk:this.validateIsMandatory,
			CommentText:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticMaterialCatalogPriceEntity> {
		return this.dataService;
	}
}