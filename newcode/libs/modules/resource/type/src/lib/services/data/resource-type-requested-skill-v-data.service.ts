/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IRequestedSkillVEntity, IResourceTypeUpdateEntity } from '@libs/resource/interfaces';
import { ResourceTypeRequestedTypeDataService } from './resource-type-requested-type-data.service';
import { IRequestedTypeEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ResourceTypeRequestedSkillVDataService extends DataServiceFlatLeaf<IRequestedSkillVEntity,IRequestedTypeEntity, IResourceTypeUpdateEntity >{

	public constructor(resourceTypeRequestedTypeDataService:ResourceTypeRequestedTypeDataService) {
		const options: IDataServiceOptions<IRequestedSkillVEntity>  = {
			apiUrl: 'resource/type/requestedskillv',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IRequestedSkillVEntity,IRequestedTypeEntity,IResourceTypeUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'RequestedSkillV',
				parent: resourceTypeRequestedTypeDataService,
			},
			entityActions: { createSupported: false, deleteSupported: false },
		};

		super(options);
	}
	public override isParentFn(parentKey: IRequestedTypeEntity, entity: IRequestedSkillVEntity): boolean {
		return entity.TypeRequestedId === parentKey.Id;
	}
}








