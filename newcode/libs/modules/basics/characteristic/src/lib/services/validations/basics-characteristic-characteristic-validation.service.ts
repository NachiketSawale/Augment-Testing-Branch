/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsCharacteristicType, ICharacteristicEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicCharacteristicDataService } from '../basics-characteristic-characteristic-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';

/**
 * Characteristic validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicCharacteristicValidationService extends BaseValidationService<ICharacteristicEntity> {
	private validationUtils = inject(BasicsSharedDataValidationService);
	private dataService = inject(BasicsCharacteristicCharacteristicDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICharacteristicEntity> {
		return {
			Code: this.validateCode,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
			CharacteristicTypeFk: this.validateCharacteristicTypeFk,
			DefaultValue: this.validateDefaultValue,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICharacteristicEntity> {
		return this.dataService;
	}

	protected validateCode(info: ValidationInfo<ICharacteristicEntity>): ValidationResult {
		return this.validationUtils.isUnique(this.dataService, info, this.dataService.getList(), false);
	}

	private validateValidFrom(info: ValidationInfo<ICharacteristicEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, (info.entity.ValidTo) ? info.entity.ValidTo.toString() : '', 'ValidTo');
	}

	private validateValidTo(info: ValidationInfo<ICharacteristicEntity>): ValidationResult {
		return this.validationUtils.validatePeriod(this.getEntityRuntimeData(), info, (info.entity.ValidFrom) ? info.entity.ValidFrom.toString() : '', <string>info.value, 'ValidFrom');
	}

	private validateCharacteristicTypeFk(info: ValidationInfo<ICharacteristicEntity>): ValidationResult {
		info.entity.CharacteristicTypeFk = <number>info.value;
		this.dataService.characteristicTypeModified(info.entity);
		return this.validationUtils.createSuccessObject();
	}

	private validateDefaultValue(info: ValidationInfo<ICharacteristicEntity>): ValidationResult {
		info.entity.DefaultValue = <number>info.value;
		//this.dataService.gridRefresh();

		if (info.entity.CharacteristicTypeFk === BasicsCharacteristicType.Lookup) {
			//When the type is lookup and the default value changed, let the parent container know.
			this.dataService.defaultValueChanged.next(info.entity);
		}
		return this.validationUtils.createSuccessObject();
	}
}
