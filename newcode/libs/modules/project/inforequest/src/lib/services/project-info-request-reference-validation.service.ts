/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectInfoRequestReferenceDataService } from './project-info-request-reference-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, IEntitySchema } from '@libs/platform/data-access';
import { IProjectInfoRequestReferenceEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestReferenceValidationService extends BaseValidationService<IProjectInfoRequestReferenceEntity> {
	private validators: IValidationFunctions<IProjectInfoRequestReferenceEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequestReferenceEntity>> = PlatformSchemaService<IProjectInfoRequestReferenceEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'InfoRequestReferenceDto'}).then(this.WriteToValidator);
	}

	private WriteToValidator(scheme : IEntitySchema<IProjectInfoRequestReferenceEntity>){
		this.validators = new ValidationServiceFactory<IProjectInfoRequestReferenceEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IProjectInfoRequestReferenceEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectInfoRequestReferenceEntity> {
		return inject(ProjectInfoRequestReferenceDataService);
	}
}