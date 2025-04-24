/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatNode,ServiceRole,IDataServiceOptions, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IProjectClerkRoleComplete, IProjectComplete, IProjectEntity, IProjectRoleEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainClerkRoleDataService extends DataServiceFlatNode<IProjectRoleEntity, IProjectClerkRoleComplete, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectRoleEntity>  = {
			apiUrl: 'project/main/clerkrole',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			createInfo: {
				prepareParam: ident => {
					return {
						PKey1: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectRoleEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Node,
				itemName: 'ClerkRoles',
				parent: projectMainDataService,
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IProjectRoleEntity | null): IProjectClerkRoleComplete {
		return {
			MainItemId: modified?.Id,
			ClerkRoles: modified ?? null,
		} as IProjectClerkRoleComplete;
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerNodeModificationsToParentUpdate(complete: IProjectComplete, modified: IProjectClerkRoleComplete[], deleted: IProjectRoleEntity[]) {
		if (modified && modified.length > 0) {
			complete.ClerkRolesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ClerkRolesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectComplete): IProjectRoleEntity[] {
		if	(complete && complete.ClerkRolesToSave) {
			return complete.ClerkRolesToSave.map(e => e.ClerkRoles!);
		}

		return [];
	}



	public override isParentFn(parentKey: IProjectEntity, entity: IProjectRoleEntity): boolean {
		return entity.ProjectFk === parentKey.Id;
	}

}










