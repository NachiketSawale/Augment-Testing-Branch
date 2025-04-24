/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IGeneralEntity, IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

export const PROJECT_MAIN_GENERAL_DATA_TOKEN = new InjectionToken<ProjectMainGeneralDataService>('projectMainGeneralDataToken');

@Injectable({
	providedIn: 'root'
})


export class ProjectMainGeneralDataService extends DataServiceFlatLeaf<IGeneralEntity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<IGeneralEntity>  = {
			apiUrl: 'project/main/general',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					return { projectId : ident.pKey1};
				}
			},
			createInfo: {
				prepareParam: () => {
					const selection = projectMainDataService.getSelectedEntity();
					return {
						Id: selection?.Id ?? 0
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IGeneralEntity,IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Generals',
				parent: projectMainDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IGeneralEntity[], deleted: IGeneralEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.GeneralsToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.GeneralsToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IGeneralEntity[]  {
		if (complete && complete.GeneralsToSave) {
			return complete.GeneralsToSave;
		}

		return [];
	}

}



