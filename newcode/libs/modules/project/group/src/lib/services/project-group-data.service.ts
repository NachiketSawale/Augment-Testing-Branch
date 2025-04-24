/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceHierarchicalRoot, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole, IDataServiceOptions }
	from '@libs/platform/data-access';

import { IProjectGroupEntity } from '@libs/project/interfaces';
import { ProjectGroupComplete } from '../model/project-group-complete.class';

@Injectable({
	providedIn: 'root'
})

export class ProjectGroupDataService extends DataServiceHierarchicalRoot<IProjectGroupEntity, ProjectGroupComplete> {

	public constructor() {
		const options: IDataServiceOptions<IProjectGroupEntity> = {
			apiUrl: 'project/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			roleInfo: <IDataServiceRoleOptions<IProjectGroupEntity>>{
				role: ServiceRole.Root,
				itemName: 'ProjectGroup',
			}
		};

		super(options);
	}

	protected override provideCreateChildPayload(): object {
		const selectedEntity = this.getSelectedEntity();

		return {
			PKey1: selectedEntity?.Id,
			PKey2: selectedEntity?.ITwoBaselineServerFk,
			PKey3: selectedEntity?.IsAutoIntegration ? 1 : 0,
			parentId: selectedEntity?.Id,
			parent: selectedEntity,
		};
	}

	public override createUpdateEntity(modified: IProjectGroupEntity | null): ProjectGroupComplete {
		const complete = new ProjectGroupComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.ProjectGroup = modified;
		}

		return complete;
	}

	protected override onCreateSucceeded(created: object): IProjectGroupEntity {
		return created as IProjectGroupEntity;
	}

	public override childrenOf(element: IProjectGroupEntity): IProjectGroupEntity[] {
		return element.ProjectGroupChildren ?? [];
	}

	public override parentOf(element: IProjectGroupEntity): IProjectGroupEntity | null {
		if (element.ProjectGroupFk === undefined) {
			return null;
		}

		const parentId = element.ProjectGroupFk;
		const foundParent = this.flatList().find(candidate => candidate.Id === parentId);

		if (foundParent === undefined) {
			return null;
		}

		return foundParent;
	}

	public override getModificationsFromUpdate(complete: ProjectGroupComplete): IProjectGroupEntity[] {
		if (complete.ProjectGroup === null) {
			return [];
		}

		return [complete.ProjectGroup];
	}

	public isCreateAutoGenerationDisabled(): boolean {
		return false; // Check from PlatformPermissionService.hasCreate()
	}

	public createAutoIntegratedRoot() {
		// Set IProjectGroupEntity.IsAutoIntegration = true
		// Create item
	}

}



