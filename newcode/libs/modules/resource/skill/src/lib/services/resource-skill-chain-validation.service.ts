/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IResourceSkillChainEntity, IResourceSkillEntity } from '@libs/resource/interfaces';
import { ResourceSkillUpdate } from '../model/resource-skill-update.class';

@Injectable({
	providedIn: 'root'
})
export class ResourceSkillChainValidationService extends BaseValidationService<IResourceSkillChainEntity> {
	private validators: IValidationFunctions<IResourceSkillChainEntity> | null = null;
	public constructor(protected dataService: DataServiceFlatLeaf<IResourceSkillChainEntity,IResourceSkillEntity,ResourceSkillUpdate>) {
		super();

		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceSkillChainEntity>> = PlatformSchemaService<IResourceSkillChainEntity>;
		const platformSchemaService = inject(schemaSvcToken);

		const self = this;

		platformSchemaService.getSchema({moduleSubModule: 'Resource.Skill', typeName: 'ResourceSkillChain'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IResourceSkillChainEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IResourceSkillChainEntity> {
		if(this.validators !== null) {
			return this.validators;
		}

		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceSkillChainEntity> {
		return this.dataService;
	}
}