/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IProjectStock2ClerkEntity, IProjectStockEntity, IProjectStockComplete } from '@libs/project/interfaces';
import { ProjectStockDataService } from './project-stock-data.service';


@Injectable({
	providedIn: 'root',
})
export class ProjectStockClerkDataService extends DataServiceFlatLeaf<IProjectStock2ClerkEntity, IProjectStockEntity, IProjectStockComplete> {
	public constructor() {
		const options: IDataServiceOptions<IProjectStock2ClerkEntity> = {
			apiUrl: 'project/stock/clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectStock2ClerkEntity, IProjectStockEntity, IProjectStockComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectStock2Clerk',
				parent: inject(ProjectStockDataService),
			},
		};

		super(options);
	}
	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectStockComplete, modified: IProjectStock2ClerkEntity[], deleted: IProjectStock2ClerkEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ProjectStock2ClerkToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ProjectStock2ClerkToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectStockComplete): IProjectStock2ClerkEntity[] {
		if (complete && complete.ProjectStock2ClerkToSave) {
			return complete.ProjectStock2ClerkToSave;
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

	protected override onLoadSucceeded(loaded: { [key: string]: IProjectStock2ClerkEntity[] }): IProjectStock2ClerkEntity[] {
		const result: IProjectStock2ClerkEntity[] = [];

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


	protected override onCreateSucceeded(created: IProjectStock2ClerkEntity): IProjectStock2ClerkEntity {
		return created;
	}

}
