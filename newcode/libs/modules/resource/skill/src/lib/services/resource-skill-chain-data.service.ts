/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { IResourceSkillChainEntity } from '@libs/resource/interfaces';
import { IResourceSkillEntity } from '@libs/resource/interfaces';
import { ResourceSkillUpdate } from '../model/resource-skill-update.class';
import { ResourceSkillDataService } from './resource-skill-data.service';

@Injectable({
	providedIn: 'root'
})
export class ResourceSkillChainDataService extends DataServiceFlatLeaf<IResourceSkillChainEntity,IResourceSkillEntity,ResourceSkillUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IResourceSkillChainEntity> = {
			apiUrl: 'resource/skill/chain',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IResourceSkillChainEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'ResourceSkillChain',
				parent: inject(ResourceSkillDataService)
			},
			processors: [new EntityArrayProcessor<IResourceSkillChainEntity>(['SubResources'])]
		};
		super(options);
	}
}