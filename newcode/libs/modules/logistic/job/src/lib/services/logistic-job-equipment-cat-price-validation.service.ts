/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticEquipmentCatalogPriceEntity } from '@libs/logistic/interfaces';
import { LogisticJobEquipmentCatPriceDataService } from './logistic-job-equipment-cat-price-data.service';

/**
 * Logistic Equipment Catalog Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobEquipmentCatPriceValidationService extends BaseValidationService<ILogisticEquipmentCatalogPriceEntity> {


	private dataService = inject(LogisticJobEquipmentCatPriceDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticEquipmentCatalogPriceEntity> {
		return {
			EvaluationOrder:this.validateIsMandatory,
			EquipmentPriceListFk:this.validateEquipmentPriceListFk,
			JobFk:this.validateIsMandatory,
			EquipmentCatalogFk:this.validateIsMandatory,
		};
	}

	protected validateEquipmentPriceListFk(info: ValidationInfo<ILogisticEquipmentCatalogPriceEntity>): ValidationResult {
		const result = new ValidationResult();
		if(info.entity.EquipmentPriceListFk){
			result.valid = false;
			result.apply= true;
			result.error = 'cloud.common.emptyOrNullValueErrorMessage';
		}
		return result;
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticEquipmentCatalogPriceEntity> {
		return this.dataService;
	}


}