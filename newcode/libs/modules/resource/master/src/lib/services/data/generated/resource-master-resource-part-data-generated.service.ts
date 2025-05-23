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
import { IResourceMasterResourceEntity, IResourceMasterResourcePartEntity } from '@libs/resource/interfaces';

export class ResourceMasterResourcePartDataGeneratedService extends DataServiceFlatLeaf<IResourceMasterResourcePartEntity,IResourceMasterResourceEntity,ResourceMasterResourceUpdate> {
	public constructor(){
		const options: IDataServiceOptions<IResourceMasterResourcePartEntity> = {
			apiUrl: 'resource/master/resourcePart',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IResourceMasterResourcePartEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Parts',
				parent: inject(ResourceMasterResourceDataService)
			},
			processors: [new EntityArrayProcessor<IResourceMasterResourcePartEntity>(['SubResources'])]
		};
		super(options);
	}
	public override isParentFn(parentKey: IResourceMasterResourceEntity, entity: IResourceMasterResourcePartEntity): boolean {
		return entity.ResourceFk === parentKey.Id;
	}
}