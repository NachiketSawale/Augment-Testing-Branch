/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObject2LocationEntity, IModelObjectEntity } from '../model/models';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';
import { ModelMainObjectDataService } from './model-main-object-data.service';

@Injectable({
	providedIn: 'root'
})

export class ModelMainObject2LocationDataService extends DataServiceFlatLeaf<IModelObject2LocationEntity, IModelObjectEntity, ModelObjectComplete> {
	public constructor(private objectDataService: ModelMainObjectDataService) {
		const options: IDataServiceOptions<IModelObject2LocationEntity> = {
			apiUrl: 'model/main/object2location',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelObject2LocationEntity, IModelObjectEntity, ModelObjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelObject2Locations',
				parent: objectDataService,
			},
			entityActions: {
				createSupported: true,
				deleteSupported: true
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		if (this.objectDataService.hasSelection()) {
			const item = this.objectDataService.getSelection()[0];
			if (item) {
				const parentId = {
					modelId: item ? item.ModelFk : 0,
					objectId: item ? item.Id : 0
				};
				return { modelId: parentId.modelId, objectId: parentId.objectId };
			}
		}
		return {};
	}

	/**
		* Provides the payload data required for creating a new entity.
 		* @returns An object containing the creation payload.
 	*/
	protected override provideCreatePayload(): object {
		if (this.objectDataService.hasSelection()) {
			const item = this.objectDataService.getSelection()[0];
			return { Pkey1: item.Id, Pkey2: item.ModelFk };
		}
		return {};
	}


}








