/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IModelObjectEntity, IObjectSet2ObjectEntity} from '../model/models';
import { ModelMainObjectDataService } from './model-main-object-data.service';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ModelMainObject2ObjectSetDataService extends DataServiceFlatLeaf<IObjectSet2ObjectEntity,IModelObjectEntity, ModelObjectComplete  >{

	public constructor(private objectDataService: ModelMainObjectDataService) {
		const options: IDataServiceOptions<IObjectSet2ObjectEntity>  = {
			apiUrl: 'model/main/objectset2object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyobject',
				usePost: false,
				prepareParam:() => {
					const item =  this.objectDataService.getSelection()[0];
					const selectedProject = this.getSelectedParent();
					const objectId = item.Id;
					return {mainItemId: selectedProject?.Id ,objectId : objectId, modelId: item.ModelFk };
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IObjectSet2ObjectEntity,IModelObjectEntity, ModelObjectComplete >>{
				role: ServiceRole.Leaf,
				itemName: 'ObjectSet2Object',
				parent: objectDataService,
			},
			entityActions : {
				deleteSupported: true,
				createSupported: false
			}
		};

		super(options);
	}
	

/**
 * Provides the payload data required for creating a new entity.
 * @returns An object containing the creation payload.
 */
	protected override provideCreatePayload(): object {
		if(this.objectDataService.hasSelection()) {
			const modelId = this.objectDataService.getSelection()[0].ModelFk;
			const projectId = this.getSelectedParent();
			return {Pkey1 : modelId, Pkey2: projectId };
		}
		return {};
	}

		/**
	 * Processes the successful creation of a ObjectSet2ObjectEntity.
	 * @param created The object representing the newly created ObjectSet2ObjectEntity.
	 */
	protected override onCreateSucceeded(created: IObjectSet2ObjectEntity): IObjectSet2ObjectEntity {
		if(this.objectDataService.hasSelection()) {
			const item = this.objectDataService.getSelection()[0];
			created.ObjectFk = item.Id;
		}
		return created;
	}
}

		
			





