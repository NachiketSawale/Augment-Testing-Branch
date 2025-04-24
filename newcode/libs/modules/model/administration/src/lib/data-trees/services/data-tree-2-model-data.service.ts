/*
 * Copyright(c) RIB Software GmbH
 */

import {
	Injectable,
	inject
} from '@angular/core';
import {
	DataServiceFlatLeaf,
	IDataServiceChildRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import {
	IDataTree2ModelEntity,
	IDataTreeComplete,
	IDataTreeEntity
} from '../model/entities/entities';
import { ModelAdministrationDataTreeDataService } from './data-tree-data.service';

/**
 * The data service for the viewer settings entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTree2ModelDataService
	extends DataServiceFlatLeaf<IDataTree2ModelEntity, IDataTreeEntity, IDataTreeComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/datatree2model',
			readInfo: {
				endPoint: 'list'
			},
			createInfo: {
				prepareParam: () => {
					const selDataTree = this.getSelectedParent();
					if (!selDataTree) {
						throw new Error('No parent data tree selected.');
					}

					return {
						PKey1: selDataTree.Id
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IDataTree2ModelEntity, IDataTreeEntity, IDataTreeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DataTree2Models',
				parent: inject(ModelAdministrationDataTreeDataService)
			}
		});
	}
}
