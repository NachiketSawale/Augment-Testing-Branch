/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';

import { inject, Injectable } from '@angular/core';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { ICharacteristicGroupEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicGroupDataService } from '../basics-characteristic-group-data.service';
import { PlatformTranslateService } from '@libs/platform/common';

/**
 * Characteristic group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicGroupValidationService extends BaseValidationService<ICharacteristicGroupEntity> {
	private validationService = inject(BasicsSharedDataValidationService);
	private translationService: PlatformTranslateService = inject(PlatformTranslateService);
	private dataService = inject(BasicsCharacteristicGroupDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICharacteristicGroupEntity> {
		return {
			DescriptionInfo: this.validateDescription,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICharacteristicGroupEntity> {
		return this.dataService;
	}

	protected validateDescription(info: ValidationInfo<ICharacteristicGroupEntity>, apply?: boolean): ValidationResult {
		const result = this.validationService.isMandatory(info, 'cloud.common.DescriptionInfo');
		if (apply) {
			result.apply = true;
		}
		return result;
	}
}
