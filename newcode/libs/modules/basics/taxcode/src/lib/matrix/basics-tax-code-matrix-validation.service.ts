/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsTaxCodeMatrixDataService } from './basics-tax-code-matrix-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Tax Code Matrix validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeMatrixValidationService extends BaseValidationService<IMdcTaxCodeMatrixEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsTaxCodeMatrixDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IMdcTaxCodeMatrixEntity> {
		return {
			Code: this.validateCode,
			BpdVatgroupFk: this.validateBpdVatgroupFk,
			BasVatcalculationtypeFk: this.validateBasVatcalculationtypeFk
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcTaxCodeMatrixEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<IMdcTaxCodeMatrixEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'cloud.common.entityCode');
	}

	protected validateBasVatcalculationtypeFk(info: ValidationInfo<IMdcTaxCodeMatrixEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.taxcode.entityBasVatcalculationtype');
	}

	protected validateBpdVatgroupFk(info: ValidationInfo<IMdcTaxCodeMatrixEntity>): ValidationResult {
		return this.validationUtils.isMandatory(info, 'basics.taxcode.entityVatGroup');
	}
}
