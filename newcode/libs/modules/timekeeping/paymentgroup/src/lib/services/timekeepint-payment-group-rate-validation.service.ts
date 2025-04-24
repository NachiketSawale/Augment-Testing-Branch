/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { TimekeepingPaymentGroupRateDataService } from './timekeeping-payment-group-rate-data.service';
import { IPaymentGroupRateEntity } from '@libs/timekeeping/interfaces';


/**
 * Timekeeping Payment Group Rate Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupRateValidationService extends BaseValidationService<IPaymentGroupRateEntity> {
	private validators: IValidationFunctions<IPaymentGroupRateEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPaymentGroupRateEntity>> = PlatformSchemaService<IPaymentGroupRateEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.PaymentGroup', typeName: 'PaymentGroupRateDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IPaymentGroupRateEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPaymentGroupRateEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPaymentGroupRateEntity> {
		return inject(TimekeepingPaymentGroupRateDataService);
	}
}