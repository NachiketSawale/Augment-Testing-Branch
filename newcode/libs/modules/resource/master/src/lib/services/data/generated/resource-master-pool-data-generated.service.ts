/*
 * Copyright(c) RIB Software GmbH
 * ----------------------------------------------------------------------
 * This is auto-generated code by ClientTypeScriptDataServiceGenerator.
 * ----------------------------------------------------------------------
 * This code was generated by RIB Model Generator tool.
 *
 * Changes to this file may cause incorrect behavior and will be lost if
 * the code is regenerated.
 * ----------------------------------------------------------------------
 */

import { ResourceMasterResourceUpdate } from '../../../model/resource-master-resource-update.class';
import { ResourceMasterResourceDataService } from '../resource-master-resource-data.service';
import { inject } from '@angular/core';
import {
	DataServiceFlatLeaf,
	EntityArrayProcessor,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IResourceMasterPoolEntity, IResourceMasterResourceEntity } from '@libs/resource/interfaces';

export class ResourceMasterPoolDataGeneratedService extends DataServiceFlatLeaf<IResourceMasterPoolEntity,IResourceMasterResourceEntity,ResourceMasterResourceUpdate> {
	public constructor(){
		const options: IDataServiceOptions<IResourceMasterPoolEntity> = {
			apiUrl: 'resource/master/pool',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IResourceMasterPoolEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Pools',
				parent: inject(ResourceMasterResourceDataService)
			},
			processors: [new EntityArrayProcessor<IResourceMasterPoolEntity>(['SubResources'])]
		};
		super(options);
	}
	public override isParentFn(parentKey: IResourceMasterResourceEntity, entity: IResourceMasterPoolEntity): boolean {
		return entity.ResourceFk === parentKey.Id;
	}
}