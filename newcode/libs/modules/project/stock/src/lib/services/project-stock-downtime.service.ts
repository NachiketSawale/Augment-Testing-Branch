/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IProjectStockDownTimeEntity, IProjectStockEntity, IProjectStockComplete } from '@libs/project/interfaces';
import { ProjectStockDataService } from './project-stock-data.service';

@Injectable({
	providedIn: 'root',
})
export class ProjectStockDowntimeService extends DataServiceFlatLeaf<IProjectStockDownTimeEntity, IProjectStockEntity, IProjectStockComplete> {
	public constructor() {
		const options: IDataServiceOptions<IProjectStockDownTimeEntity> = {
			apiUrl: 'project/stock/downtime',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectStockDownTimeEntity, IProjectStockEntity, IProjectStockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectStockDownTime',
				parent: inject(ProjectStockDataService),
			},
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectStockComplete, modified: IProjectStockDownTimeEntity[], deleted: IProjectStockDownTimeEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ProjectStockDownTimeToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ProjectStockDownTimeToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectStockComplete): IProjectStockDownTimeEntity[] {
		if (complete && complete.ProjectStockDownTimeToSave) {
			return complete.ProjectStockDownTimeToSave;
		}

		return [];
	}

	protected override provideLoadPayload(): { mainItemId: number } {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				mainItemId: parentSelection.Id
			};
		}
		return {
			mainItemId: -1
		};
	}

	protected override onLoadSucceeded(loaded: { [key: string]: IProjectStockDownTimeEntity[] }): IProjectStockDownTimeEntity[] {
		const result: IProjectStockDownTimeEntity[] = [];

		if (loaded && loaded['Main'] && loaded['Main'].length > 0) {
			result.push(...loaded['Main']);
		}
		return result;
	}

	protected override provideCreatePayload(): { Pkey1: number } {
		const parentSelection = this.getSelectedParent();
		if (parentSelection) {
			return {
				Pkey1: parentSelection.Id
			};
		}
		throw new Error('please select a project stock first');
	}


	protected override onCreateSucceeded(created: IProjectStockDownTimeEntity): IProjectStockDownTimeEntity {
		return created;
	}
}
