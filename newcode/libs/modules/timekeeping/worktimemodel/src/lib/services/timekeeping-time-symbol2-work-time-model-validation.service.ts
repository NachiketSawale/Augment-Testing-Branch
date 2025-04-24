/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { ITimeSymbol2WorkTimeModelEntity } from '../model/entities/time-symbol-2work-time-model-entity.interface';
import { TimekeepingTimeSymbol2WorkTimeModelDataService } from './timekeeping-time-symbol2-work-time-model-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingTimeSymbol2WorkTimeModelValidationService extends BaseValidationService<ITimeSymbol2WorkTimeModelEntity> {
	private validators: IValidationFunctions<ITimeSymbol2WorkTimeModelEntity> | null = null;

	public constructor(protected dataService: TimekeepingTimeSymbol2WorkTimeModelDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ITimeSymbol2WorkTimeModelEntity>> = PlatformSchemaService<ITimeSymbol2WorkTimeModelEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'TimeSymbol2WorkTimeModelDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ITimeSymbol2WorkTimeModelEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<ITimeSymbol2WorkTimeModelEntity> {
		if (!this.validators) {
			return {};
		}
		return this.validators;
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeSymbol2WorkTimeModelEntity> {
		return this.dataService;
	}
}