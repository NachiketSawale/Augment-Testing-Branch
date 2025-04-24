/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IKeyFigureEntity, IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';


export const PROJECT_MAIN_KEY_FIGURE_DATA_TOKEN = new InjectionToken<ProjectMainKeyFigureDataService>('projectMainKeyFigureDataToken');

@Injectable({
	providedIn: 'root'
})


export class ProjectMainKeyFigureDataService extends DataServiceFlatLeaf<IKeyFigureEntity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<IKeyFigureEntity>  = {
			apiUrl: 'project/main/keyfigure',
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
			roleInfo: <IDataServiceChildRoleOptions<IKeyFigureEntity,IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'KeyFigures',
				parent: projectMainDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IKeyFigureEntity[], deleted: IKeyFigureEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.KeyFiguresToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.KeyFiguresToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IKeyFigureEntity[]  {
		if (complete && complete.KeyFiguresToSave) {
			return complete.KeyFiguresToSave;
		}

		return [];
	}

}








