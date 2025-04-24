/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { forEach, get, set } from 'lodash';
import { ICharacteristicValueEntity } from '@libs/basics/interfaces';
import { BasicsCharacteristicDiscreteValueDataService } from '../basics-characteristic-discrete-value-data.service';

/**
 * Characteristic discrete value validation service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsCharacteristicDiscreteValueValidationService extends BaseValidationService<ICharacteristicValueEntity> {
	private dataService = inject(BasicsCharacteristicDiscreteValueDataService);

	protected generateValidationFunctions(): IValidationFunctions<ICharacteristicValueEntity> {
		return {
			IsDefault: this.validateIsDefault,
			DescriptionInfo: this.validateDescription,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICharacteristicValueEntity> {
		return this.dataService;
	}

	protected validateIsDefault(info: ValidationInfo<ICharacteristicValueEntity>): ValidationResult {
		this.updateIsDefault(info);
		this.dataService.isDefaultModified(info.entity);
		return { apply: !!info.value, valid: true };
	}

	protected validateDescription(info: ValidationInfo<ICharacteristicValueEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private updateIsDefault(info: ValidationInfo<ICharacteristicValueEntity>) {
		const entity = info.entity;
		const model = info.field;
		const list = this.dataService.getList();
		forEach(list, (item) => {
			if (item !== entity && get(item, model)) {
				set(item, model, false);
				this.dataService.setModified(item);
			}
		});
	}
}
