/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions,
	ValidationInfo, ValidationResult
} from '@libs/platform/data-access';
import { BasicsSalesTaxCodeMatrixDataService } from './basics-sales-tax-code-matrix-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcSalesTaxMatrixEntity } from '../model/entities/interface/mdc-sales-tax-matrix-entity.interface';

/**
 * Sales Tax Code Matrix validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSalesTaxCodeMatrixValidationService extends BaseValidationService<IMdcSalesTaxMatrixEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsSalesTaxCodeMatrixDataService);

	protected generateValidationFunctions(): IValidationFunctions<IMdcSalesTaxMatrixEntity> {
		return {
			SalesTaxGroupFk: this.validateSalesTaxGroupFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcSalesTaxMatrixEntity> {
		return this.dataService;
	}

	protected async validateSalesTaxGroupFk(info: ValidationInfo<IMdcSalesTaxMatrixEntity>): Promise<ValidationResult> {
		return this.validationUtils.isValueUnique(info, this.dataService.getList());
	}
}