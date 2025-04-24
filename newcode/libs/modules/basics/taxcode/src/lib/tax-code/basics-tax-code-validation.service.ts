/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsTaxCodeDataService } from './basics-tax-code-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { IMdcTaxCodeEntity } from '@libs/basics/interfaces';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Tax Code validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeMatrixValidationService extends BaseValidationService<IMdcTaxCodeEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsTaxCodeDataService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);

	protected generateValidationFunctions(): IValidationFunctions<IMdcTaxCodeEntity> {
		return {
			Code: this.validateCode,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IMdcTaxCodeEntity> {
		return this.dataService;
	}

	protected async validateCode(info: ValidationInfo<IMdcTaxCodeEntity>): Promise<ValidationResult> {
		return this.validationUtils.checkSynAndAsyncUnique(info, this.dataService.getList(), 'basics/taxcode/isuniquecode', {
			additionalHttpParams: {code: info.entity.Code},
			fieldName: 'cloud.common.entityCode'
		});
	}
}
