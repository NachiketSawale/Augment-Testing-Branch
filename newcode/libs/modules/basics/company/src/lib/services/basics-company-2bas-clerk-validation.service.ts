/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ICompany2BasClerkEntity } from '@libs/basics/interfaces';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { BasicsCompanyMainDataService } from './basics-company-main-data.service';

@Injectable({
	providedIn: 'root'
})

export class BasicsCompany2basClerkValidationService extends BaseValidationService<ICompany2BasClerkEntity> {

	private basicsCompanyMainDataService = inject(BasicsCompanyMainDataService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<ICompany2BasClerkEntity>): ValidationInfo<ICompany2BasClerkEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	protected generateValidationFunctions(): IValidationFunctions<ICompany2BasClerkEntity> {
		return {
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,

		};
	}

	private validateValidFrom(info: ValidationInfo<ICompany2BasClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<ICompany2BasClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);

	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ICompany2BasClerkEntity> {
		return this.basicsCompanyMainDataService;
	}
}