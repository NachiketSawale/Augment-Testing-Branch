/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import {  ILogisticPlantPriceEntity } from '@libs/logistic/interfaces';
import { LogisticPriceConditionPlantPriceDataService } from './logistic-price-condition-plant-price-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { ResourceWorkOperationTypeLookupService } from '@libs/resource/shared';
import { firstValueFrom } from 'rxjs';

/**
 * Logistic Price Condition Plant Price Validation Service
 */

@Injectable({
	providedIn: 'root'
})

export class LogisticPriceConditionPlantPriceValidationService extends BaseValidationService<ILogisticPlantPriceEntity> {

	private dataService = inject(LogisticPriceConditionPlantPriceDataService);
	public constructor() {
		super();
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticPlantPriceEntity> {
		return {
			EquipmentPriceListFk:this.validateIsMandatory,
			CommentText:this.validateIsMandatory,
			EvaluationOrder:this.validateIsMandatory,
			//WorkOperationTypeFk:this.validateWorkOperationTypeFk

		};
	}


	private async validateWorkOperationTypeFk(info: ValidationInfo<ILogisticPlantPriceEntity>){
		const resourceWorkOperationTypeLookupService = ServiceLocator.injector.get(ResourceWorkOperationTypeLookupService);
		const role = await firstValueFrom(resourceWorkOperationTypeLookupService.getItemByKey({ id : info.value as number}));
		const plantPriceList = this.dataService.getList();
		plantPriceList.filter(item => {
			item.UomFk = role.UomFk !== null ? role.UomFk : item.UomFk;
		});
		return plantPriceList;

	}




	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticPlantPriceEntity> {
		return this.dataService;
	}
}