/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticEquipCatalogPriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionEquipmentCatalogPriceDataService } from './logistic-price-condition-equipment-catalog-price-data.service';

/**
 * Logistic Price Condition Equipment Catalog Price Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticPriceConditionEquipmentCatalogPriceValidationService extends BaseValidationService<ILogisticEquipCatalogPriceEntity> {


	private dataService = inject(LogisticPriceConditionEquipmentCatalogPriceDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<ILogisticEquipCatalogPriceEntity> {
		return {
			EquipmentPriceListFk:this.validateIsMandatory,
			CommentText:this.validateIsMandatory,
			EvaluationOrder:this.validateIsMandatory
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticEquipCatalogPriceEntity> {
			return this.dataService;
		}
	}