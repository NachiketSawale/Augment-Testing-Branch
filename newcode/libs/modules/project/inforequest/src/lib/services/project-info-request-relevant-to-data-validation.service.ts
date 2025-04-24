/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectInfoRequestRelevantToDataService } from './project-info-request-relevant-to-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, IEntitySchema } from '@libs/platform/data-access';
import { IProjectInfoRequestRelevantToEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestRelevantToValidationService extends BaseValidationService<IProjectInfoRequestRelevantToEntity> {
	private validators: IValidationFunctions<IProjectInfoRequestRelevantToEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestRelevantToEntity>> = PlatformSchemaService<IProjectInfoRequestRelevantToEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'RequestRelevantToDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IProjectInfoRequestRelevantToEntity>){
		this.validators = new ValidationServiceFactory<IProjectInfoRequestRelevantToEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IProjectInfoRequestRelevantToEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectInfoRequestRelevantToEntity> {
		return inject(ProjectInfoRequestRelevantToDataService);
	}
}