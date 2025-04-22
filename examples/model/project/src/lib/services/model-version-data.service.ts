/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { DataServiceFlatLeaf, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IModelEntity } from '../model/entities/model-entity.interface';
import { IModelComplete } from '../model/entities/model-complete.interface';
import { ModelProjectModelDataService } from './model-data.service';

/**
 * The data service for the *Model Version* entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelVersionDataService
	extends DataServiceFlatLeaf<IModelEntity, IModelEntity, IModelComplete> {

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		const modelDataSvc = inject(ModelProjectModelDataService);

		super({
			apiUrl: 'model/project/model/version',
			readInfo: {
				prepareParam: () => {
					const selModel = modelDataSvc.getSelectedEntity();
					return {
						modelId: selModel?.Id ?? 0
					};
				}
			},
			entityActions: {
				createSupported: false
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelEntity, IModelEntity, IModelComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ModelVersions',
				parent: modelDataSvc
			}
		});
	}

	private readonly httpSvc = inject(PlatformHttpService);

	/**
	 * Deletes a model version with all associated data.
	 *
	 * @param modelId The ID of the model header that represents the version.
	 *
	 * @returns A promise that is resolved to a value indicating success or failure.
	 */
	public async deleteModelVersion(modelId: number): Promise<boolean> {
		try {
			await this.httpSvc.post('model/project/model/deletemodelversion', {
				mainItemId: modelId
			});
			return true;
		} catch (error: unknown) {
			console.error(error);
			return false;
		}
	}
}
