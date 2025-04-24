/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IProjectMainCurrencyRateEntity } from '@libs/project/interfaces';
import { inject } from '@angular/core';
import { ProjectMainCurrencyRateDataService } from './project-main-currency-rate-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { BasicsSharedCurrencyLookupService } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';

/**
 * CurrencyRate validation service
 */
export class ProjectMainCurrencyRateValidationService extends BaseValidationService<IProjectMainCurrencyRateEntity> {

	private dataService = inject(ProjectMainCurrencyRateDataService);
	public constructor() {
		super();
	}
	protected generateValidationFunctions(): IValidationFunctions<IProjectMainCurrencyRateEntity> {
		return {
			CurrencyForeignFk:this.validateCurrencyConversionFk,
			CurrencyHomeFk:this.validateCurrencyConversionFk
		};
	}
	private async validateCurrencyConversionFk(info: ValidationInfo<IProjectMainCurrencyRateEntity>): Promise<ValidationResult>{
		const entity = info.entity;
		const currencyLookupService = ServiceLocator.injector.get(BasicsSharedCurrencyLookupService);
		const result = await firstValueFrom(currencyLookupService.getItemByKey({ id: info.entity.CurrencyForeignFk }));
		if(result){
			entity.CurrencyForeignFk = info.entity.CurrencyForeignFk;
			entity.CurrencyHomeFk = info.entity.CurrencyHomeFk;
		}

		return new ValidationResult();
	}


	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectMainCurrencyRateEntity> {
		return this.dataService;
	}

}