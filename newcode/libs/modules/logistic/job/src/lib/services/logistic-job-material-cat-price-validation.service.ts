/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticJobMaterialCatalogPriceEntity } from '@libs/logistic/interfaces';
import { LogisticJobMaterialCatPriceDataService } from './logistic-job-material-cat-price-data.service';


/**
 * Logistic Material Catalog Price Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobMaterialCatPriceValidationService extends BaseValidationService<ILogisticJobMaterialCatalogPriceEntity> {


	private dataService = inject(LogisticJobMaterialCatPriceDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticJobMaterialCatalogPriceEntity> {
		return {
			MaterialCatalogFk:this.validateAdditionalMaterialCatalogFk,
			MaterialPriceListFk:this.validateIsMandatory,
			MaterialPriceVersionFk:this.validateIsMandatory,
		};
	}


	protected validateAdditionalMaterialCatalogFk(info: ValidationInfo<ILogisticJobMaterialCatalogPriceEntity>): ValidationResult {
		const result = new ValidationResult();
		if(info.entity.MaterialPriceListFk){
			result.valid = false;
			result.apply= true;
			result.error = 'cloud.common.emptyOrNullValueErrorMessage';
		}
		return result;
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticJobMaterialCatalogPriceEntity> {
		return this.dataService;
	}

}