/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IRequiredSkillEntity, IResourceTypeEntity, IResourceTypeUpdateEntity } from '@libs/resource/interfaces';


@Injectable({
	providedIn: 'root'
})
export class ResourceTypeRequiredSkillValidationService extends BaseValidationService<IRequiredSkillEntity> {
	private validators: IValidationFunctions<IRequiredSkillEntity> | null = null;
	public constructor(protected dataService:  DataServiceFlatLeaf<IRequiredSkillEntity,
		IResourceTypeEntity, IResourceTypeUpdateEntity>) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IRequiredSkillEntity>> = PlatformSchemaService<IRequiredSkillEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Type', typeName: 'RequiredSkillDto'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IRequiredSkillEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IRequiredSkillEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IRequiredSkillEntity> {
		return this.dataService;
	}
}