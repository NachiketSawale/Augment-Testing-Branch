import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { TimekeepingPaymentGroupSurchargeDataService } from './timekeeping-payment-group-surcharge-data.service';
import { IPaymentGroupSurEntity } from '@libs/timekeeping/interfaces';


/**
 * Timekeeping Payment Group Surcharge Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupSurchargeValidationService extends BaseValidationService<IPaymentGroupSurEntity> {
	private validators: IValidationFunctions<IPaymentGroupSurEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPaymentGroupSurEntity>> = PlatformSchemaService<IPaymentGroupSurEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.PaymentGroup', typeName: 'PaymentGroupSurDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IPaymentGroupSurEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}

	public generateValidationFunctions(): IValidationFunctions<IPaymentGroupSurEntity> {
		if (this.validators !== null) {
			return this.validators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPaymentGroupSurEntity> {
		return inject(TimekeepingPaymentGroupSurchargeDataService);
	}
}
