/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IModelComplete } from '../model/entities/model-complete.interface';
import { IModelEntity } from '../model/entities/model-entity.interface';
import { IModelFileEntity } from '../model/entities/model-file-entity.interface';
import { ModelProjectModelDataService } from './model-data.service';
import { ModelProjectModelVersionDataService } from './model-version-data.service';

/**
 * The data service for the *Model File* entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelFileDataService
	extends DataServiceFlatLeaf<IModelFileEntity, IModelEntity, IModelComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const modelDataSvc = inject(ModelProjectModelDataService);
		const modelVersionDataSvc = inject(ModelProjectModelVersionDataService);

		super({
			apiUrl: 'model/project/modelfile',
			readInfo: {
				endPoint: 'list',
				prepareParam: () => {
					let selectedModel = modelVersionDataSvc.getSelectedEntity();
					if (!selectedModel) {
						selectedModel = modelDataSvc.getSelectedEntity();
					}
					return {
						mainItemId: selectedModel?.Id ?? 0
					};
				}
			},
			entityActions: {
				createSupported: false,
				deleteSupported: false
			},
			roleInfo:
				<IDataServiceChildRoleOptions<IModelFileEntity, IModelEntity, IModelComplete>>{
					role: ServiceRole.Leaf,
					itemName: 'ModelFiles',
					parent: modelDataSvc
				}
			}
		);
	}
}
