/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptValidationServiceGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceMasterProvidedResourceSkillDataService } from '../../data/resource-master-provided-resource-skill-data.service';
import { inject } from '@angular/core';
import { BaseGeneratorRevalidationService } from '@libs/platform/data-access';
import { IResourceMasterProvidedResourceSkillEntity } from '@libs/resource/interfaces';

export class ResourceMasterProvidedResourceSkillValidationGeneratedService extends BaseGeneratorRevalidationService<IResourceMasterProvidedResourceSkillEntity> {
	protected resourceMasterProvidedResourceSkillData: ResourceMasterProvidedResourceSkillDataService = inject(ResourceMasterProvidedResourceSkillDataService);
	public constructor(){
		super({moduleSubModule: 'Resource.Master', typeName: 'ProvidedResourceSkillDto'});
	}
	protected getDataService(): ResourceMasterProvidedResourceSkillDataService {
		return this.resourceMasterProvidedResourceSkillData;
	}
}