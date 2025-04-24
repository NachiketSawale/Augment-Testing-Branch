/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { ILogisticSundryServiceEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServiceDataService } from '@libs/logistic/sundryservice';

export const LOGISTIC_SUNDRY_SERVICE_VALIDATION_TOKEN = new InjectionToken<LogisticSundryServiceValidationService>('logisticSundryServiceValidationToken');

export class LogisticSundryServiceValidationService extends BaseValidationService<ILogisticSundryServiceEntity> {
	private sundryValidators: IValidationFunctions<ILogisticSundryServiceEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ILogisticSundryServiceEntity>> = PlatformSchemaService<ILogisticSundryServiceEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Logistic.SundryService', typeName: 'SundryServiceDto'}).then(
			function(scheme) {
				self.sundryValidators = new ValidationServiceFactory<ILogisticSundryServiceEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryServiceEntity> {
		if(this.sundryValidators !== null) {
			return this.sundryValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryServiceEntity> {
		return inject(LogisticSundryServiceDataService);
	}

}