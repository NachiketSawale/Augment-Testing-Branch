/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IProjectStock2MaterialEntity, IProjectStockComplete, IProjectStockEntity } from '@libs/project/interfaces';
import { ProjectStockDataService } from './project-stock-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectStockMaterialDataService extends DataServiceFlatLeaf<IProjectStock2MaterialEntity, IProjectStockEntity, IProjectStockComplete> {
	public constructor() {
		const options: IDataServiceOptions<IProjectStock2MaterialEntity> = {
			apiUrl: 'project/stock/material',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'instances',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectStock2MaterialEntity, IProjectStockEntity, IProjectStockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'StockMaterials',
				parent: inject(ProjectStockDataService),
			},
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectStockComplete, modified: IProjectStock2MaterialEntity[], deleted: IProjectStock2MaterialEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.StockMaterialsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.StockMaterialsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectStockComplete): IProjectStock2MaterialEntity[] {
		if (complete && complete.StockMaterialsToSave) {
			return complete.StockMaterialsToSave;
		}

		return [];
	}
}
