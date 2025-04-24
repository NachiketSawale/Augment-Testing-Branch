/*
 * Copyright(c) RIB Software GmbH
 */
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { TimekeepingPaymentGroupDataService } from  './timekeeping-payment-group-data.service';
import { IPaymentGroupEntity } from '@libs/timekeeping/interfaces';



/**
 * Timekeeping Payment Group Validation Service
 */

@Injectable({
	providedIn: 'root'
})
export class TimekeepingPaymentGroupValidationService extends BaseValidationService<IPaymentGroupEntity> {
	private validators: IValidationFunctions<IPaymentGroupEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPaymentGroupEntity>> = PlatformSchemaService<IPaymentGroupEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Timekeeping.PaymentGroup', typeName: 'PaymentGroupDto'}).then(
			(scheme) => {
				this.validators = new ValidationServiceFactory<IPaymentGroupEntity>().provideValidationFunctionsFromScheme(scheme, this);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPaymentGroupEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPaymentGroupEntity> {
		return inject(TimekeepingPaymentGroupDataService);
	}
}