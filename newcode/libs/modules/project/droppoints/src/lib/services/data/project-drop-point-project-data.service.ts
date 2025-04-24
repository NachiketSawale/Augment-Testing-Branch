/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ProjectDropPointHeaderUpdate } from '../../model/project-drop-point-header-update.class';
import {
	DataServiceFlatRoot,
	IDataServiceEndPointOptions,
	IDataServiceOptions,
	IDataServiceRoleOptions,
	ServiceRole
} from '@libs/platform/data-access';
import { IProjectEntity } from '@libs/project/interfaces';
@Injectable({
	providedIn: 'root'
})
export class ProjectDropPointProjectDataService extends DataServiceFlatRoot<IProjectEntity,ProjectDropPointHeaderUpdate> {
	public constructor(){
		const options: IDataServiceOptions<IProjectEntity> = {
			apiUrl: 'project/droppoints',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IProjectEntity>>{
				role: ServiceRole.Root,
				itemName: 'DropPointHeaders'
			},
			entityActions: { createSupported: false, deleteSupported: false }
		};
		super(options);
	}
	public override createUpdateEntity(modified: IProjectEntity | null): ProjectDropPointHeaderUpdate {
		const complete = new ProjectDropPointHeaderUpdate();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.DropPointHeaders = [modified];
		}

		return complete;
	}
	public override getModificationsFromUpdate(complete: ProjectDropPointHeaderUpdate): IProjectEntity[] {
		if (complete.DropPointHeaders === null) {
			return complete.DropPointHeaders = [];
		} else {
			return complete.DropPointHeaders;
		}
	}
}