/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IModelObjectEntity, IPropertyEntity } from '../model/models';
import { ModelObjectComplete } from '../model/model-main-object-complete.class';
import { ModelMainObjectDataService } from './model-main-object-data.service';
@Injectable({
	providedIn: 'root'
})

export class ModelMainPropertyDataService extends DataServiceFlatLeaf<IPropertyEntity, IModelObjectEntity, ModelObjectComplete> {

	public constructor(private objectDataService: ModelMainObjectDataService) {
		const options: IDataServiceOptions<IPropertyEntity> = {
			apiUrl: 'model/main/property',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyobject',
				usePost: true
			},
			roleInfo: <IDataServiceChildRoleOptions<IPropertyEntity, IModelObjectEntity, ModelObjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Properties',
				parent: objectDataService,
			},
		};

		super(options);
	}

	/**
	* Provides the payload data required for read.
	* @returns An object containing the read payload.
	*/
	protected override provideLoadPayload(): object {
		const item = this.objectDataService.getSelection()[0];
		if (item && item.Id && item.ModelFk) {
			return { ModelId: item.ModelFk, ObjectId: item.Id };
		} else {
			return { ModelId: -1, ObjectId: -1 };
		}

	}

	/**
	 * Processes the successful creation of a IPropertyEntity.
	 * @param created The object representing the newly created IPropertyEntity.
	 */
	protected override onCreateSucceeded(created: IPropertyEntity): IPropertyEntity {
		created.idString = created.ModelFk.toString() /*+ '-' + newData.ObjectFk.toString()*/ + '-' + created.Id.toString();
		return created;
	}

	protected override onLoadSucceeded(loaded: IPropertyEntity[]): IPropertyEntity[] {
		loaded.forEach((item) => {
			item.idString = item.ModelFk.toString()/* + '-' + item.ObjectFk.toString()*/ + '-' +  (item.PropertyKeyFk?.toString() ?? '') + '-' + item.Id.toString();
		});
		return loaded;
	}

}


