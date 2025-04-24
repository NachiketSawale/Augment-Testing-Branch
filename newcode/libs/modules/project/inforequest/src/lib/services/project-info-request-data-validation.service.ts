/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectInfoRequestDataService } from './project-info-request-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, IEntitySchema } from '@libs/platform/data-access';
import { IProjectInfoRequestEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestValidationService extends BaseValidationService<IProjectInfoRequestEntity> {
	private validators: IValidationFunctions<IProjectInfoRequestEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestEntity>> = PlatformSchemaService<IProjectInfoRequestEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'InfoRequestDto'}).then(this.WriteToValidator);
	}

	public WriteToValidator(scheme : IEntitySchema<IProjectInfoRequestEntity>){

		this.validators = new ValidationServiceFactory<IProjectInfoRequestEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IProjectInfoRequestEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectInfoRequestEntity> {
		return inject(ProjectInfoRequestDataService);
	}
}