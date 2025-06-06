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

import { ResourceMasterPoolDataService } from '../../data/resource-master-pool-data.service';
import { inject } from '@angular/core';
import { BaseGeneratorRevalidationService } from '@libs/platform/data-access';
import { IResourceMasterPoolEntity } from '@libs/resource/interfaces';

export class ResourceMasterPoolValidationGeneratedService extends BaseGeneratorRevalidationService<IResourceMasterPoolEntity> {
	protected resourceMasterPoolData: ResourceMasterPoolDataService = inject(ResourceMasterPoolDataService);
	public constructor(){
		super({moduleSubModule: 'Resource.Master', typeName: 'PoolDto'});
	}
	protected getDataService(): ResourceMasterPoolDataService {
		return this.resourceMasterPoolData;
	}
}