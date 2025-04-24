import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { ITimekeepingValidationEntity } from '../model/entities/timekeeping-validation-entity.interface';
import { TimekeepingPeriodValidationDataService } from './timekeeping-period-validation-data.service';


/**
 * Timekeeping Period Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPeriodValidationValidationService extends BaseValidationService<ITimekeepingValidationEntity> {
	private validators: IValidationFunctions<ITimekeepingValidationEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ITimekeepingValidationEntity>> = PlatformSchemaService<ITimekeepingValidationEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Period', typeName: 'TimekeepingValidationDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ITimekeepingValidationEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<ITimekeepingValidationEntity> {
		if (this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimekeepingValidationEntity> {
		return inject(TimekeepingPeriodValidationDataService);
	}
}
