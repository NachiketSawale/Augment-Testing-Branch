/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, ValidationInfo, ValidationResult } from '@libs/platform/data-access';
import { PpsHeader2ClerkDataService } from './pps-header2clerk-data.service';
import { IPpsHeader2ClerkEntity } from '../model/entities/pps-header2clerk-entity.interface';

@Injectable({
	providedIn: 'root'
})
export class PpsHeader2ClerkValidationService extends BaseValidationService<IPpsHeader2ClerkEntity> {

	private dataService = inject(PpsHeader2ClerkDataService);

	protected generateValidationFunctions(): IValidationFunctions<IPpsHeader2ClerkEntity> {
		return {
			ClerkFk: this.validateClerkFk,
			ClerkRoleFk: this.validateClerkRoleFk,
			ValidFrom: this.validateValidFrom,
			ValidTo: this.validateValidTo,
		};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPpsHeader2ClerkEntity> {
		return this.dataService;
	}

	private validateClerkFk(info: ValidationInfo<IPpsHeader2ClerkEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	private validateClerkRoleFk(info: ValidationInfo<IPpsHeader2ClerkEntity>): ValidationResult {
		return this.validateIsMandatory(info);
	}

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IPpsHeader2ClerkEntity>): ValidationInfo<IPpsHeader2ClerkEntity> | undefined => {
		switch (info.field) {
			case 'ValidFrom':
				return new ValidationInfo(info.entity, info.entity.ValidTo ?? undefined, 'ValidTo');
			case 'ValidTo':
				return new ValidationInfo(info.entity, info.entity.ValidFrom ?? undefined, 'ValidFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	private validateValidFrom(info: ValidationInfo<IPpsHeader2ClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateValidTo(info: ValidationInfo<IPpsHeader2ClerkEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}

}