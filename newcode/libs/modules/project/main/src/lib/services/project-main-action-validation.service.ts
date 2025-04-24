/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { IActionEntity } from '@libs/project/interfaces';
import { ProjectMainActionDataService } from './project-main-action-data.service';

@Injectable({
	providedIn: 'root'
})

export class ProjectMainActionValidationService extends BaseValidationService<IActionEntity> {

	private projectMainActionDataService = inject(ProjectMainActionDataService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IActionEntity>): ValidationInfo<IActionEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	protected generateValidationFunctions(): IValidationFunctions<IActionEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,

		};
	}

	private validateValidFrom(info: ValidationInfo<IActionEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<IActionEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);

	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IActionEntity> {
		return this.projectMainActionDataService;
	}
}