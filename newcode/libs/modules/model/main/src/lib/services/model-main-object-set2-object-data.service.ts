/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IObjectSet2ObjectEntity, IObjectSetEntity, ObjectSetComplete } from '../model/models';
import { ModelMainObjectSetDataService } from './model-main-object-set-data.service';

@Injectable({
	providedIn: 'root'
})

export class ModelMainObjectSet2ObjectDataService extends DataServiceFlatLeaf<IObjectSet2ObjectEntity, IObjectSetEntity, ObjectSetComplete> {

	public constructor(private objectsetDataService: ModelMainObjectSetDataService) {
		const options: IDataServiceOptions<IObjectSet2ObjectEntity> = {
			apiUrl: 'model/main/objectset2object',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyobjectset',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IObjectSet2ObjectEntity, IObjectSetEntity, ObjectSetComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ObjectSet2Object',
				parent: objectsetDataService,
			},
			entityActions: {
				deleteSupported: true,
				createSupported: false
			}
		};

		super(options);
	}

	protected override provideLoadPayload(): object {
		let objectSetId: number = -1;
		if (this.objectsetDataService.hasSelection()) {
			const item = this.objectsetDataService.getSelection()[0];
			if (item) {
				objectSetId = item.Id;
				const modelId = null;
				return {projectId : item.ProjectFk,objectSetId : objectSetId, modelId :modelId };
			}
		}
		return {};
	}

	/**
 * Provides the payload data required for creating a new entity.
 * @returns An object containing the creation payload.
 */
	// protected override provideCreatePayload(): object {
		// let modelId = modelSelectionService.getSelectedModelId(); // modelSelectionservice needs to implement
		// if (modelId) {
		// 	creationData.PKey1 = modelId;
		// 	if (modelMainObjectSetDataService.hasSelection()) {
		// 		var item = modelMainObjectSetDataService.getSelected();
		// 		creationData.PKey1 = item.ModelFk;
		// 	}
		// }
		// if(this.objectsetDataService.hasSelection()) {
		// 	const modelId = this.objectsetDataService.getSelection()[0].ModelFk;
		// 	const projectId = this.getSelectedParent();
		// 	return {Pkey1 : modelId, Pkey2: projectId };
		// }
	// }

		/**
	 * Processes the successful creation of a ObjectSet2ObjectEntity.
	 * @param created The object representing the newly created ObjectSet2ObjectEntity.
	 */
	protected override onCreateSucceeded(created: IObjectSet2ObjectEntity): IObjectSet2ObjectEntity {
		if (this.objectsetDataService.hasSelection()) {
			const item = this.objectsetDataService.getSelection()[0];
			created.ObjectSetFk = item.Id;
			created.ProjectFk = item.ProjectFk;
		}
		return created;
	}

}








