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
import { BasicsSalesTaxCodeDataService } from './basics-sales-tax-code-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';

/**
 * Sales Tax Code validation service
 */
@Injectable({
	providedIn: 'root'
})
export class BasicsSalesTaxCodeValidationService extends BaseValidationService<IMdcSalesTaxCodeEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsSalesTaxCodeDataService);

	protected generateValidationFunctions(): IValidationFunctions<IMdcSalesTaxCodeEntity> {
		return {
			Code: this.validateCode
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcSalesTaxCodeEntity> {
		return this.dataService;
	}

	protected async validateCode(info: ValidationInfo<IMdcSalesTaxCodeEntity>): Promise<ValidationResult> {
		return this.validationUtils.isSynAndAsyncUnique(info, this.dataService.getList(), 'basics/salestaxcode/isuniquecode');
	}
}