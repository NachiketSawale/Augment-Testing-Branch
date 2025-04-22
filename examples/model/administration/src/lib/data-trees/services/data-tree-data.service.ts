/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	inject
} from '@angular/core';
import {
	DataServiceFlatNode,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IModelAdministrationCompleteEntity,
	IModelAdministrationRootEntity,
	ModelAdministrationRootDataService
} from '../../root-info.model';
import {
	IDataTreeComplete,
	IDataTreeEntity
} from '../model/entities/entities';

/**
 * The data service for the viewer settings entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTreeDataService
	extends DataServiceFlatNode<IDataTreeEntity, IDataTreeComplete, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/datatree',
			readInfo: {
				endPoint: 'listHeaders',
				prepareParam: () => {
					return {};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IDataTreeEntity, IModelAdministrationRootEntity, IModelAdministrationCompleteEntity>>{
				role: ServiceRole.Node,
				itemName: 'DataTrees',
				parent: inject(ModelAdministrationRootDataService)
			}
		});
	}

	public override createUpdateEntity(modified: IDataTreeEntity | null): IDataTreeComplete {
		return {
			DataTrees: modified,
			MainItemId: modified?.Id,
			DataTreeLevelsToSave: null,
			DataTreeLevelsToDelete: null,
			DataTree2ModelsToSave: null,
			DataTree2ModelsToDelete: null
		};
	}
}
