/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticJobPlantPriceEntity } from '@libs/logistic/interfaces';
import { LogisticJobPlantPriceDataService } from './logistic-job-plant-price-data.service';

/**
 * Logistic job plant price Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobPlantPriceValidationService extends BaseValidationService<ILogisticJobPlantPriceEntity> {


	private dataService = inject(LogisticJobPlantPriceDataService);
	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticJobPlantPriceEntity> {
		return {
			PlantFk:this.validateIsMandatory,
			WorkOperationTypeFk:this.validateIsMandatory,
			PricePortion1:this.validateIsMandatory,
			PricePortion2:this.validateIsMandatory,
			PricePortion3:this.validateIsMandatory,
			PricePortion4:this.validateIsMandatory,
			PricePortion5:this.validateIsMandatory,
			PricePortion6:this.validateIsMandatory,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticJobPlantPriceEntity> {
		return this.dataService;
	}
}