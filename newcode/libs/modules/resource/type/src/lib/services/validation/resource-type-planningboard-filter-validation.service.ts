/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory } from '@libs/platform/data-access';
import { IPlanningBoardFilterEntity } from '@libs/resource/interfaces';
import { ResourceTypePlanningBoardFilterDataService } from '../data/resource-type-planning-board-filter-data.service';


@Injectable({
	providedIn: 'root'
})
export class ResourceTypePlanningboardFilterValidationService extends BaseValidationService<IPlanningBoardFilterEntity> {
	private validators: IValidationFunctions<IPlanningBoardFilterEntity> | null = null;
	protected dataService: ResourceTypePlanningBoardFilterDataService = inject(ResourceTypePlanningBoardFilterDataService);
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IPlanningBoardFilterEntity>> = PlatformSchemaService<IPlanningBoardFilterEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Type', typeName: 'PlanningBoardFilterDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IPlanningBoardFilterEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IPlanningBoardFilterEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IPlanningBoardFilterEntity> {
		return this.dataService;
	}
}