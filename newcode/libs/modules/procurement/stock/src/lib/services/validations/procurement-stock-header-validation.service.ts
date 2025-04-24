/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { ProcurementStockHeaderDataService } from '../procurement-stock-header-data.service';
import { IStockHeaderVEntity } from '../../model';

/**
 * procurement stock header validation service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockHeaderValidationService extends BaseValidationService<IStockHeaderVEntity> {
	private dataService = inject(ProcurementStockHeaderDataService);

	protected generateValidationFunctions(): IValidationFunctions<IStockHeaderVEntity> {
		return {
			IsChecked: this.validateIsChecked,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IStockHeaderVEntity> {
		return this.dataService;
	}

	private validateIsChecked(info: ValidationInfo<IStockHeaderVEntity>): ValidationResult {
		//todo: currently transientFields can not bind to validator, wait ticket: https://rib-40.atlassian.net/browse/DEV-22244
		const item = info.entity;
		const value = info.value as boolean;
		this.dataService.fireStockHeaderCheckedChanged(item, value);
		return new ValidationResult();
	}
}
