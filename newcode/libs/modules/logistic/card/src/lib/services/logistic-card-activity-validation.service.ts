/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {
	BaseValidationService, IEntityRuntimeDataRegistry, IValidationFunctions,
	PlatformSchemaService, ValidationServiceFactory
} from '@libs/platform/data-access';
import { inject, Injectable, ProviderToken } from '@angular/core';
import { ILogisticCardActivityEntity } from '@libs/logistic/interfaces';
import { LogisticCardActivityDataService } from './logistic-card-activity-data.service';


@Injectable({
	providedIn: 'root'
})
export class LogisticCardActivityValidationService extends BaseValidationService<ILogisticCardActivityEntity> {
	private activityValidators: IValidationFunctions<ILogisticCardActivityEntity> | null = null;

	public constructor(private readonly dataService: LogisticCardActivityDataService) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<ILogisticCardActivityEntity>> = PlatformSchemaService<ILogisticCardActivityEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Logistic.Card', typeName: 'JobCardActivityDto'}).then(
			function(scheme) {
				self.activityValidators = new ValidationServiceFactory<ILogisticCardActivityEntity>().provideValidationFunctionsFromScheme(scheme, self);
			});
	}

	protected generateValidationFunctions(): IValidationFunctions<ILogisticCardActivityEntity> {
		if(this.activityValidators !== null) {
			return this.activityValidators;
		}

		return {};
	}

	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<ILogisticCardActivityEntity> {
		return this.dataService;
	}

}