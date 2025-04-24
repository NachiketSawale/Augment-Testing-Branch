/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlannedAbsenceEntity } from '@libs/timekeeping/interfaces';
import { TimekeepingEmployeePlannedAbsenceDataService } from './timekeeping-employee-planned-absence-data.service';
import { BasicsSharedDataValidationService } from '@libs/basics/shared';
import { PlatformDateService } from '@libs/platform/common';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingEmployeePlannedAbsenceValidationService extends BaseValidationService<IPlannedAbsenceEntity> {
	private validators: IValidationFunctions<IPlannedAbsenceEntity> | null = null;
	private readonly platformDataValidationService = inject(BasicsSharedDataValidationService);
	private readonly platformDateService = inject(PlatformDateService);

	public constructor(protected  dataService: TimekeepingEmployeePlannedAbsenceDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlannedAbsenceEntity>> = PlatformSchemaService<IPlannedAbsenceEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Employee', typeName: 'PlannedAbsenceDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IPlannedAbsenceEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	protected override generateValidationFunctions(): IValidationFunctions<IPlannedAbsenceEntity> {
		return {
			FromDateTime: [this.validateFromDateTime],
			ToDateTime: [this.validateToDateTime],
		};
	}

	protected override getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlannedAbsenceEntity> {
		return this.dataService;
	}

	public validateFromDateTime (info: ValidationInfo<IPlannedAbsenceEntity>) : ValidationResult {
		info.entity.Absenceday = this.giveAbsencedays(this.platformDateService.getUTC(info.value as string),
			this.platformDateService.getUTC(info.entity.ToDateTime as string));
		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, <string>info.value, info.entity.ToDateTime as string, 'ToDateTime');
	}

	public validateToDateTime (info: ValidationInfo<IPlannedAbsenceEntity>) : ValidationResult {
		info.entity.Absenceday = this.giveAbsencedays(this.platformDateService.getUTC(info.entity.FromDateTime as string),
			this.platformDateService.getUTC(info.value as string));
		return this.platformDataValidationService.validatePeriod(this.getEntityRuntimeData(), info, info.entity.FromDateTime as string, <string>info.value, 'FromDateTime');
	}

	private giveAbsencedays(fromDateTime: Date, toDateTime: Date) : number{
		return toDateTime.getDay() - fromDateTime.getDay();
	}
}
