/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';



import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectAddressEntity, IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainAddressDataService extends DataServiceFlatLeaf<IProjectAddressEntity, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService: ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectAddressEntity>  = {
			apiUrl: 'project/main/address',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					const selected = projectMainDataService.getSelectedEntity();
					if(selected){
						return {
							PKey1: selected.Id,
							PKey3: selected.AddressFk
						};
					}
					return {};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectAddressEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectAddress',
				parent: projectMainDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectComplete, modified: IProjectAddressEntity[], deleted: IProjectAddressEntity[]): void {

		if (modified && modified.some(() => true)) {
			parentUpdate.ProjectAddressToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ProjectAddressToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectAddressEntity[] {
		if (complete && complete.ProjectAddressToSave) {
			return complete.ProjectAddressToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IProjectEntity, entity: IProjectAddressEntity): boolean {
		return entity.ProjectFk === parentKey.Id;
	}

}








