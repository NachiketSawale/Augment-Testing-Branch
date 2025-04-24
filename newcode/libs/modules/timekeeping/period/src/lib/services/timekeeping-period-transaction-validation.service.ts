import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { ITimekeepingTransactionEntity } from '../model/entities/timekeeping-transaction-entity.interface';
import { TimekeepingPeriodTransactionDataService } from './timekeeping-period-transaction-data.service';

/**
 * Timekeeping Period Validation Service
 */
@Injectable({
	providedIn: 'root'
})
export class TimekeepingPeriodTransactionValidationService extends BaseValidationService<ITimekeepingTransactionEntity> {
	private validators: IValidationFunctions<ITimekeepingTransactionEntity> | null = null;

	public constructor(
		protected dataService: TimekeepingPeriodTransactionDataService
	) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ITimekeepingTransactionEntity>> = PlatformSchemaService<ITimekeepingTransactionEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.Period', typeName: 'TimekeepingTransactionDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<ITimekeepingTransactionEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<ITimekeepingTransactionEntity> {
		if (this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ITimekeepingTransactionEntity> {
		return this.dataService;
	}
}
