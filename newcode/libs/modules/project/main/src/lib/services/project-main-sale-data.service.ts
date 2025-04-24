/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable,  } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, ISaleEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainSaleDataService extends DataServiceFlatLeaf<ISaleEntity, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<ISaleEntity>  = {
			apiUrl: 'project/main/sale',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return {
						projectId: ident.pKey1!
					};
				}
			},
			createInfo: {
				prepareParam: ident => {
					return {
						Id: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ISaleEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Sales',
				parent: projectMainDataService
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: ISaleEntity[], deleted: ISaleEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.SalesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.SalesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): ISaleEntity[] {
		if (complete && complete.SalesToSave) {
			return complete.SalesToSave;
		}

		return [];
	}

}








