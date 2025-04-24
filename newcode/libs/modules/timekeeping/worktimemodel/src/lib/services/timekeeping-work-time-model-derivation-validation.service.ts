/*
* Copyright(c) RIB Software GmbH
*/

import { inject, Injectable, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IWorkTimeDerivationEntity } from '../model/entities/work-time-derivation-entity.interface';
import { TimekeepingWorkTimeDerivationDataService } from './timekeeping-work-time-derivation-data.service';

@Injectable({
	providedIn: 'root'
})

export class TimekeepingWorkTimeModelDerivationValidationService extends BaseValidationService<IWorkTimeDerivationEntity> {
	private validators: IValidationFunctions<IWorkTimeDerivationEntity> | null = null;

	public constructor(protected dataService: TimekeepingWorkTimeDerivationDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IWorkTimeDerivationEntity>> = PlatformSchemaService<IWorkTimeDerivationEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.WorkTimeModel', typeName: 'WorkTimeDerivationDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IWorkTimeDerivationEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<IWorkTimeDerivationEntity> {
		if (!this.validators) {
			return {};
		}
		return this.validators;
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IWorkTimeDerivationEntity> {
		return this.dataService;
	}
}