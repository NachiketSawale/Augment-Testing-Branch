/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationInfo, ValidationResult, ValidationServiceFactory } from '@libs/platform/data-access';
import { IWorkTimeModelEntity } from '../model/entities/work-time-model-entity.interface';
import { TimekeepingWorkTimeModelDataService } from './timekeeping-work-time-model-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingWorkTimeModelValidationService extends BaseValidationService<IWorkTimeModelEntity> {
	private validators: IValidationFunctions<IWorkTimeModelEntity> | null = null;

	public constructor(protected dataService: TimekeepingWorkTimeModelDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IWorkTimeModelEntity>> = PlatformSchemaService<IWorkTimeModelEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IWorkTimeModelEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<IWorkTimeModelEntity> {
		return {
			IsFallback: [this.validateIsFallback]
		};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWorkTimeModelEntity> {
		return this.dataService;
	}

	public validateIsFallback (info: ValidationInfo<IWorkTimeModelEntity>): ValidationResult {
		if (info.value === true ){
			info.entity.WorkingTimeModelFbFk = null;
		}
		this.getEntityRuntimeData().setEntityReadOnlyFields(
			info.entity,[{field: 'WorkingTimeModelFbFk', readOnly: info.value as boolean}]
		);

		return new ValidationResult();
	}
}