/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
	PlatformSchemaService, ValidationServiceFactory
} from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { ILogisticCardActClerkEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityClerkDataService } from './logistic-card-activity-clerk-data.service';


@Injectable({
	providedIn: 'root'
})
export class LogisticCardActivityClerkValidationService extends BaseValidationService<ILogisticCardActClerkEntity> {
	private activityClerkValidators: IValidationFunctions<ILogisticCardActClerkEntity> | null = null;

	public constructor(private readonly dataService: LogisticCardActivityClerkDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ILogisticCardActClerkEntity>> = PlatformSchemaService<ILogisticCardActClerkEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Logistic.Card', typeName: 'JobCardActivityDto'}).then(
			function(scheme) {
				self.activityClerkValidators = new ValidationServiceFactory<ILogisticCardActClerkEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardActClerkEntity> {
		if(this.activityClerkValidators !== null) {
			return this.activityClerkValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardActClerkEntity> {
		return this.dataService;
	}

}