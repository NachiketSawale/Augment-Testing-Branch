/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, ITenderResultEntity, ITenderResultComplete } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainTenderResultDataService extends DataServiceFlatNode<ITenderResultEntity, ITenderResultComplete, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<ITenderResultEntity>  = {
			apiUrl: 'project/main/tenderresult',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { projectId: ident.pKey1 };
				}
			},
			createInfo: {
				prepareParam: ident => {
					return {
						Id: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITenderResultEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'TenderResults',
				parent: projectMainDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: ITenderResultEntity | null): ITenderResultComplete {
		return {
			MainItemId: modified ? modified.Id : 0,
			TenderResults: modified
		} as ITenderResultComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: ITenderResultComplete[], deleted: ITenderResultEntity[]) {
		if (modified && modified.length > 0) {
			complete.TenderResultsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.TenderResultsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): ITenderResultEntity[] {
		return (complete && complete.TenderResultsToSave)
			? complete.TenderResultsToSave.map(e => e.TenderResults!)
			: [];
	}

}










