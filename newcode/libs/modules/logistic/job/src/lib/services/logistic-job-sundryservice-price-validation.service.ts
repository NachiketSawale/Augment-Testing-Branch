/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ILogisticJobSundryServicePriceEntity } from '@libs/logistic/interfaces';
import { LogisticJobSundryServicePriceDataService } from './logistic-job-sundry-service-price-data.service';



/**
 * Logistic job sundry service price validation service
 */

@Injectable({
	providedIn: 'root'
})
export class LogisticJobSundryservicePriceValidationService extends BaseValidationService<ILogisticJobSundryServicePriceEntity> {


	private dataService = inject(LogisticJobSundryServicePriceDataService);
	//private logisticSundryServiceLookupDataService = inject(LogisticSundryServiceLookupDataService);
	public constructor() {
		super();
	}

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<ILogisticJobSundryServicePriceEntity>): ValidationInfo<ILogisticJobSundryServicePriceEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	protected generateValidationFunctions(): IValidationFunctions<ILogisticJobSundryServicePriceEntity> {
		return {
			//SundryServiceFk:this.validateSundryServiceFk,
			LinkageReasonFk:this.validateIsMandatory,
			JobFk:this.validateIsMandatory,
			IsManual:this.validateIsMandatory,
			PricePortion1:this.validateIsMandatory,
			PricePortion2:this.validateIsMandatory,
			PricePortion3:this.validateIsMandatory,
			PricePortion4:this.validateIsMandatory,
			PricePortion5:this.validateIsMandatory,
			PricePortion6:this.validateIsMandatory,
			ValidFrom : this.validateValidFrom,
			ValidTo:this.validateValidTo
		};
	}

	//TODO:logisticSundryServiceLookupDataService and platformRuntimeDataService
	/*private validateSundryServiceFk(info: ValidationInfo<IProject2MaterialEntity>): ValidationResult{
		const sundryServiceLookupService = ServiceLocator.injector.get(logisticSundryServiceLookupDataService);
		const role =  sundryServiceLookupService.getItemById({ SundryServiceHeaderChained : info.value as number});
		if(role.IsManual===true) {
			for (var i = 1; i <= 6; i++) {
				platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: false }]);
				platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + i, readonly: false }]);
			}
		}else{
			for(var j = 1; j <= 6; j++) {
				platformRuntimeDataService.readonly(entity, [{ field: 'IsManual', readonly: true }]);
				platformRuntimeDataService.readonly(entity, [{ field: 'PricePortion' + j, readonly: true }]);
			}
		}

	}*/

	private validateValidFrom(info: ValidationInfo<ILogisticJobSundryServicePriceEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<ILogisticJobSundryServicePriceEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticJobSundryServicePriceEntity> {
		return this.dataService;
	}
}