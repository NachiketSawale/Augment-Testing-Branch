/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, ProviderToken, inject } from '@angular/core';
import { BaseValidationService, IValidationFunctions, IEntityRuntimeDataRegistry, PlatformSchemaService, ValidationServiceFactory, DataServiceFlatRoot } from '@libs/platform/data-access';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { ResourceSkillUpdate } from '../model/resource-skill-update.class';

@Injectable({
	providedIn: 'root'
})
export class ResourceSkillValidationService extends BaseValidationService<IResourceSkillEntity> {
	private validators: IValidationFunctions<IResourceSkillEntity> | null = null;
	public constructor(protected dataService: DataServiceFlatRoot<IResourceSkillEntity,ResourceSkillUpdate>) {
		super();
		
		const schemaSvcToken: ProviderToken<PlatformSchemaService<IResourceSkillEntity>> = PlatformSchemaService<IResourceSkillEntity>;
		const platformSchemaService = inject(schemaSvcToken);
		
		const self = this;
		
		platformSchemaService.getSchema({moduleSubModule: 'Resource.Skill', typeName: 'ResourceSkill'}).then(
			function(scheme) {
				self.validators = new ValidationServiceFactory<IResourceSkillEntity>().provideValidationFunctionsFromScheme(scheme, self);
			}
		);
	}
	public generateValidationFunctions(): IValidationFunctions<IResourceSkillEntity> {
		if(this.validators !== null) {
			return this.validators;
		}
		
		return {};
	}
	protected getEntityRuntimeData(): IEntityRuntimeDataRegistry<IResourceSkillEntity> {
		return this.dataService;
	}
}