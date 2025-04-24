/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ProjectInfoRequest2ExternalDataService } from './project-info-request-2-external-data.service';
import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, IEntitySchema } from '@libs/platform/data-access';
import { IProjectInfoRequest2ExternalEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequest2ExternalValidationService extends BaseValidationService<IProjectInfoRequest2ExternalEntity> {
	private validators: IValidationFunctions<IProjectInfoRequest2ExternalEntity> | null = null;
	public constructor() {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IProjectInfoRequest2ExternalEntity>> = PlatformSchemaService<IProjectInfoRequest2ExternalEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		platformSchemaService.getSchema({moduleSubModule: 'Project.InfoRequest', typeName: 'InfoRequest2ExternalDto'}).then(this.WriteToValidator);
	}
	private WriteToValidator(scheme : IEntitySchema<IProjectInfoRequest2ExternalEntity>){
		this.validators = new ValidationServiceFactory<IProjectInfoRequest2ExternalEntity>().provideValidationFunctionsFromScheme(scheme, this);
	}
	public generateValidationFunctions(): IValidationFunctions<IProjectInfoRequest2ExternalEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IProjectInfoRequest2ExternalEntity> {
		return inject(ProjectInfoRequest2ExternalDataService);
	}
}