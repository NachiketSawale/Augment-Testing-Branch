/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';

import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';

import { IEstimateProjectHeader2ClerkEntity } from '../model/entities/estimate-project-header-2clerk-entity.interface';
import { EstimateProjectComplete } from '../model/estimate-project-complete.class';
import { EstimateProjectDataService } from './estimate-project-data.service';
import { IEstimateCompositeEntity } from '@libs/estimate/shared';

export const ESTIMATE_PROJECT_CLERK_DATA_TOKEN = new InjectionToken<EstimateProjectClerkDataService>('estimateProjectClerkDataToken');

@Injectable({
	providedIn: 'root',
})

/**
 * @name estimateProjectClerkDataService
 * @description provides methods to access, create and update estimate Project clerk entities
 *   */
export class EstimateProjectClerkDataService extends DataServiceFlatLeaf<IEstimateProjectHeader2ClerkEntity, IEstimateCompositeEntity, EstimateProjectComplete> {
	public constructor() {
		const options: IDataServiceOptions<IEstimateProjectHeader2ClerkEntity> = {
			apiUrl: 'estimate/project/clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
			},

			createInfo: {
				prepareParam: (ident) => {
					return {
						pKey1: ident.pKey1!
					};
				},
			},

			roleInfo: <IDataServiceRoleOptions<IEstimateProjectHeader2ClerkEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'EstimateProjectHeader2Clerks',
				parent: inject(EstimateProjectDataService),
			},
		};

		super(options);
	}

	/**
	 * Handles the successful loading of data.
	 * @param loaded The loaded data object.
	 * @returns An array of IEstimateProjectHeader2ClerkEntity.
	 */
	protected override onLoadSucceeded(loaded: object): IEstimateProjectHeader2ClerkEntity[] {
		return loaded as IEstimateProjectHeader2ClerkEntity[];
	}

	/**
	 * @brief Determines if the entity should be registered by method.
	 */

	public override registerByMethod(): boolean {
		return true;
	}

	/**
	 * @brief Registers modifications to the parent update object.
	 */
	public override registerModificationsToParentUpdate(parentUpdate: EstimateProjectComplete, modified: IEstimateProjectHeader2ClerkEntity[], deleted: IEstimateProjectHeader2ClerkEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.EstimateProjectHeader2ClerksToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.EstimateProjectHeader2ClerksToDelete = deleted;
		}
	}
	/**
	 * @brief Retrieves the saved entities from the complete update object.
	 */
	public override getSavedEntitiesFromUpdate(complete: EstimateProjectComplete): IEstimateProjectHeader2ClerkEntity[] {
		if (complete && complete.EstimateProjectHeader2ClerksToSave) {
			return complete.EstimateProjectHeader2ClerksToSave;
		}
		return [];
	}
}
