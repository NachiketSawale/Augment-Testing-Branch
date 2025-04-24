/*
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService,
	IEntityRuntimeDataRegistry,
	IValidationFunctions, ValidationInfo, ValidationResult,
} from '@libs/platform/data-access';
import { inject, Injectable } from '@angular/core';
import { IBasicsClerkAbsenceEntity } from '@libs/basics/interfaces';
import { BasicsClerkAbsenceDataService } from './basics-clerk-absence-data.service';
import { addDays } from 'date-fns';

@Injectable({
	providedIn: 'root'
})
export class BasicsClerkAbsenceValidationService extends BaseValidationService<IBasicsClerkAbsenceEntity>{
	private dataService = inject(BasicsClerkAbsenceDataService);

	protected override getMissingTimeSpanInfo = (info: ValidationInfo<IBasicsClerkAbsenceEntity>) : ValidationInfo<IBasicsClerkAbsenceEntity> | undefined => {
		switch (info.field) {
			case 'AbsenceFrom':
				return new ValidationInfo(info.entity, info.entity.AbsenceTo ?? undefined, 'AbsenceTo');
			case 'AbsenceTo':
				return new ValidationInfo(info.entity, info.entity.AbsenceFrom ?? undefined, 'AbsenceFrom');
			default:
				return new ValidationInfo(info.entity, info.value, info.field);
		}
	};

	protected generateValidationFunctions(): IValidationFunctions<IBasicsClerkAbsenceEntity> {
		return {
			AbsenceFrom: this.validateAbsenceFrom,
			AbsenceTo: this.validateAbsenceTo
		};
	}

	private validateAbsenceFrom(info: ValidationInfo<IBasicsClerkAbsenceEntity>): ValidationResult {
		info.entity.AbsenceTo = addDays(info.value as Date, 1);
		return this.validateIsValidTimeSpanFrom(info);
	}

	private validateAbsenceTo(info: ValidationInfo<IBasicsClerkAbsenceEntity>): ValidationResult {
		return this.validateIsValidTimeSpanTo(info);
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IBasicsClerkAbsenceEntity> {
		return this.dataService;
	}
}