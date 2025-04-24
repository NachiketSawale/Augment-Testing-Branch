/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, IDataServiceEndPointOptions, IDataServiceOptions, ServiceRole } from '@libs/platform/data-access';
import { ResourceTypeDataService } from './resource-type-data.service';
import { IRequestedTypeEntity, IResourceTypeEntity, IRequestedTypeUpdateEntity, IResourceTypeUpdateEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ResourceTypeRequestedTypeDataService extends DataServiceFlatNode<IRequestedTypeEntity, IRequestedTypeUpdateEntity,IResourceTypeEntity, IResourceTypeUpdateEntity >{

	public constructor() {
		const options: IDataServiceOptions<IRequestedTypeEntity>  = {
			apiUrl: 'resource/type/requestedtype',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
		   roleInfo:<IDataServiceChildRoleOptions<IRequestedTypeEntity, IResourceTypeEntity, IResourceTypeUpdateEntity>>{
				role: ServiceRole.Node,
			   itemName :'RequestedTypes',
			   parent: inject(ResourceTypeDataService)
		   }
		};

		super(options);
	}


	public override createUpdateEntity(modified: IRequestedTypeEntity | null): IRequestedTypeUpdateEntity {
		return {
			Id : modified? modified.Id :null,
			RequestedTypes: modified
		} as IRequestedTypeUpdateEntity;
	}

	public override isParentFn(parentKey: IResourceTypeEntity, entity: IRequestedTypeEntity): boolean {
		return entity.TypeFk === parentKey.Id;
	}

}










