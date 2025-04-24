/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IWorkTimeModelDayEntity } from '../model/entities/work-time-model-day-entity.interface';
import { TimekeepingWorkTimeModelDayDataService } from './timekeeping-work-time-model-day-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingWorkTimeModelDayValidationService extends BaseValidationService<IWorkTimeModelDayEntity> {
	private validators: IValidationFunctions<IWorkTimeModelDayEntity> | null = null;

	public constructor(protected dataService: TimekeepingWorkTimeModelDayDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IWorkTimeModelDayEntity>> = PlatformSchemaService<IWorkTimeModelDayEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeModelDayDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IWorkTimeModelDayEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<IWorkTimeModelDayEntity> {
		if (!this.validators) {
			return {};
		}
		return this.validators;
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWorkTimeModelDayEntity> {
		return this.dataService;
	}
}