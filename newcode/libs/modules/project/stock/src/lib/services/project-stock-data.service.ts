/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode, ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions } from '@libs/platform/data-access';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectComplete, IProjectEntity, IProjectStockEntity, IProjectStockComplete } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectStockDataService extends DataServiceFlatNode<IProjectStockEntity, IProjectStockComplete, IProjectEntity, IProjectComplete>{

	public constructor( projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectStockEntity> = {
			apiUrl: 'project/stock',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'instances',
				usePost: true
			},
			createInfo:{
				prepareParam: () => {
					const selection = projectMainDataService.getSelection()[0];
					return { Id: selection.Id};
				}
			},
			roleInfo: <IDataServiceRoleOptions<IProjectStockEntity>>{
				role: ServiceRole.Node,
				itemName: 'ProjectStocks',
				parent: projectMainDataService,
			}
		};

		super(options);
	}

	public override createUpdateEntity(modified: IProjectStockEntity | null): IProjectStockComplete {
		if (modified) {
			return {
				ProjectStockId: modified.Id ?? 0,
				ProjectStocks: modified
			} as IProjectStockComplete;
		}
		return undefined as unknown as IProjectStockComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectStockComplete[], deleted: IProjectStockEntity[]) {
		if (modified && modified.length > 0) {
			complete.ProjectStocksToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ProjectStocksToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectStockEntity[] {
		return (complete && complete.ProjectStocksToSave)
			? complete.ProjectStocksToSave.map(e => e.ProjectStocks!)
			: [];
	}
}










