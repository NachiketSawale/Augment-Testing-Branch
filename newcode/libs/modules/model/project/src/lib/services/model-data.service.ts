/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { PlatformHttpService } from '@libs/platform/common';
import { DataServiceFlatNode, IDataServiceChildRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, PROJECT_SERVICE_TOKEN } from '@libs/project/interfaces';
import { IModelEntity } from '../model/entities/model-entity.interface';
import { IModelComplete } from '../model/entities/model-complete.interface';

/**
 * The data service for the *Model* entity.
 */
@Injectable({
	providedIn: 'root'
})
export class ModelProjectModelDataService
	extends DataServiceFlatNode<IModelEntity, IModelComplete, IProjectEntity, IProjectComplete> {

	private readonly httpSvc = inject(PlatformHttpService);

	/**
	 * Initializes a new instance.
	 */
	public constructor() {
		super({
			apiUrl: 'model/project/model',
			readInfo: {
				endPoint: 'list',
				prepareParam: ident => {
					return {
						mainItemId: ident.pKey1 ?? 0
					};
				}
			},
			createInfo: {
				endPoint: 'createmodel',
				prepareParam: () => {
					return {
						mainItemId: this.getSelectedParent()?.Id ?? 0,
						isComposite: this.createCompositeMode
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IModelEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'Models',
				parent: PROJECT_SERVICE_TOKEN
			}
		});
	}

	private createCompositeMode: boolean = false;

	public async createComposite(): Promise<IModelEntity> {
		this.createCompositeMode = true;
		try {
			return await this.create();
		} finally {
			this.createCompositeMode = false;
		}
	}

	/**
	 * Retrieves the original CAD file name of a given model by its ID.
	 *
	 * @param modelId The model ID.
	 *
	 * @returns A promise that is resolved to the CAD file name or to `null`, if there is no CAD file name for the model.
	 */
	public async getCadFileNameById(modelId: number): Promise<string | null> {
		return await this.httpSvc.get<string | null>('model/project/model/modelcadfilename', {
			params: {
				modelId: modelId
			}
		});
	}

	/**
	 * Returns the ID of the selected parent project.
	 */
	public getParentProjectId(): number | undefined {
		return this.getSelectedParent()?.Id;
	}
}
