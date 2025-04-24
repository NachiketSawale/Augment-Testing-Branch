import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { TimekeepingTimeSymbols2GroupDataService } from './timekeeping-time-symbols2-group-data.service';
import { ITimeSymbol2GroupEntity } from '@libs/timekeeping/interfaces';

/**
 * Timekeeping Payment Group Surcharge Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class TimekeepingTimeSymbols2GroupValidationService extends BaseValidationService<ITimeSymbol2GroupEntity> {
	private validators: IValidationFunctions<ITimeSymbol2GroupEntity> | null = null;

	public constructor(protected dataService: TimekeepingTimeSymbols2GroupDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ITimeSymbol2GroupEntity>> = PlatformSchemaService<ITimeSymbol2GroupEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.PaymentGroup', typeName: 'PaymentGroupSurDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ITimeSymbol2GroupEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<ITimeSymbol2GroupEntity> {
		if (this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimeSymbol2GroupEntity> {
		return this.dataService;
	}
}
