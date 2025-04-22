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
	IDataTreeComplete,
	IDataTreeEntity,
	IDataTreeLevelEntity
} from '../model/entities/entities';
import { ModelAdministrationDataTreeDataService } from './data-tree-data.service';

/**
 * The data service for the viewer settings entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelAdministrationDataTreeLevelDataService
	extends DataServiceFlatLeaf<IDataTreeLevelEntity, IDataTreeEntity, IDataTreeComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/administration/datatreelevel',
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
			roleInfo: <IDataServiceChildRoleOptions<IDataTreeLevelEntity, IDataTreeEntity, IDataTreeComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'DataTreeLevels',
				parent: inject(ModelAdministrationDataTreeDataService)
			}
		});
	}
}
