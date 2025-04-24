/*
 * Copyright(c) RIB Software GmbH
 */

import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IHsqCheckListGroupEntity } from '@libs/hsqe/interfaces';
import { CheckListGroupDataService } from '../checklist-group-data.service';

/**
 * CheckList group validation service
 */
@Injectable({
	providedIn: 'root',
})
export class CheckListGroupValidationService extends BaseValidationService<IHsqCheckListGroupEntity> {
	private readonly dataService = inject(CheckListGroupDataService);

	protected generateValidationFunctions(): IValidationFunctions<IHsqCheckListGroupEntity> {
		return {
			IsChecked: this.validateIsChecked,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IHsqCheckListGroupEntity> {
		return this.dataService;
	}

	private validateIsChecked(info: ValidationInfo<IHsqCheckListGroupEntity>): ValidationResult {
		const item = info.entity;
		const value = info.value as boolean;
		this.dataService.fireGroupCheckedChanged(item, value);
		return new ValidationResult();
	}
}
