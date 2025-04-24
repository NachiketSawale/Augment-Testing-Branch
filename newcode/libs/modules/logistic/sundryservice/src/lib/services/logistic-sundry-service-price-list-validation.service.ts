/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, InjectionToken, ProviderToken } from '@angular/core';
import { BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { ILogisticSundryServicePriceListEntity } from '@libs/logistic/interfaces';
import { LogisticSundryServicePriceListDataService } from './logistic-sundry-service-price-list-data.service';

export const LOGISTIC_SUNDRY_SERVICE_PRICE_LIST_VALIDATION_TOKEN = new InjectionToken<LogisticSundryServicePriceListValidationService>('logisticSundryServicePriceListValidationToken');

export class LogisticSundryServicePriceListValidationService extends BaseValidationService<ILogisticSundryServicePriceListEntity> {
	private priceListValidators: IValidationFunctions<ILogisticSundryServicePriceListEntity> | null = null;

	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ILogisticSundryServicePriceListEntity>> = PlatformSchemaService<ILogisticSundryServicePriceListEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Logistic.SundryService', typeName: 'SundryServicePriceListDto'}).then(
			function(scheme) {
				self.priceListValidators = new ValidationServiceFactory<ILogisticSundryServicePriceListEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticSundryServicePriceListEntity> {
		if(this.priceListValidators !== null) {
			return this.priceListValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticSundryServicePriceListEntity> {
		return inject(LogisticSundryServicePriceListDataService);
	}

}