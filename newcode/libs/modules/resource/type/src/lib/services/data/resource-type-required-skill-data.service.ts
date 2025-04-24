/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, IDataServiceOptions } from '@libs/platform/data-access';
import { ResourceTypeDataService } from './resource-type-data.service';
import { IRequiredSkillEntity, IResourceTypeEntity } from '@libs/resource/interfaces';
import { IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { ServiceRole } from '@libs/platform/data-access';
import { IResourceTypeUpdateEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ResourceTypeRequiredSkillDataService extends DataServiceFlatLeaf<IRequiredSkillEntity,
	IResourceTypeEntity, IResourceTypeUpdateEntity> {

	public constructor() {
		const options: IDataServiceOptions<IRequiredSkillEntity> = {
			apiUrl: 'resource/type/requiredskill',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			roleInfo:  <IDataServiceChildRoleOptions<IRequiredSkillEntity, IResourceTypeEntity, IResourceTypeUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'RequiredSkills',
				parent: inject(ResourceTypeDataService)
			},
		};

		super(options);
	}
	public override isParentFn(parentKey: IResourceTypeEntity, entity: IRequiredSkillEntity): boolean {
		return entity.TypeFk === parentKey.Id;
	}
}
