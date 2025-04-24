/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectClerkRoleComplete, IProjectClerkSiteEntity, IProjectRoleEntity } from '@libs/project/interfaces';
import { ProjectMainClerkRoleDataService } from './project-main-clerk-role-data.service';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainClerkSiteDataService extends DataServiceFlatLeaf<IProjectClerkSiteEntity, IProjectRoleEntity, IProjectClerkRoleComplete>{

	public constructor(projectMainClerkRoleDataService: ProjectMainClerkRoleDataService) {
		const options: IDataServiceOptions<IProjectClerkSiteEntity>  = {
			apiUrl: 'project/main/clerksite',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			createInfo: {
				prepareParam: ident => {
					const selectedClerkRole = projectMainClerkRoleDataService.getSelection()[0];
					return {
						PKey1: selectedClerkRole.Id,
						PKey2: selectedClerkRole.ProjectFk,
						PKey3: selectedClerkRole.ClerkFk
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectClerkSiteEntity, IProjectRoleEntity, IProjectClerkRoleComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ClerkSites',
				parent: projectMainClerkRoleDataService,
			},


		};

		super(options);
	}

	public override registerByMethod(): boolean {
		return true;
	}

	public override registerModificationsToParentUpdate(parentUpdate: IProjectClerkRoleComplete, modified: IProjectClerkSiteEntity[], deleted: IProjectClerkSiteEntity[]): void {
		this.setModified(modified);
		if (modified && modified.some(() => true)) {
			parentUpdate.ClerkSitesToSave = modified;
		}

		if (deleted && deleted.some(() => true)) {
			parentUpdate.ClerkSitesToDelete = deleted;
		}
	}

	public override getSavedEntitiesFromUpdate(complete: IProjectClerkRoleComplete): IProjectClerkSiteEntity[] {
		if (complete && complete.ClerkSitesToSave) {
			return complete.ClerkSitesToSave;
		}

		return [];
	}

	public override isParentFn(parentKey: IProjectRoleEntity, entity: IProjectClerkSiteEntity): boolean {
		return entity.ProjectRoleFk === parentKey.Id;
	}
}








