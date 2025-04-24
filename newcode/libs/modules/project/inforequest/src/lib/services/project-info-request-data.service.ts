/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatRoot } from '@libs/platform/data-access';
import { ProjectInfoRequestUpdate } from '../model/project-info-request-update.class';
import { IProjectInfoRequestEntity } from '@libs/project/interfaces';

export const PROJECT_INFO_REQUEST_DATA_TOKEN = new InjectionToken<ProjectInfoRequestDataService>('projectInfoRequestDataToken');
@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestDataService extends DataServiceFlatRoot<IProjectInfoRequestEntity, ProjectInfoRequestUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IProjectInfoRequestEntity> = {
			apiUrl: 'project/rfi/informationrequest',
			createInfo:{
				prepareParam: ident => {
					return { PKey1 : 1009619, PKey2 : 1035172, PKey3 : 1001318 };// ToDo: Wizard necessary
				}
			},
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'filtered',
				usePost: true,
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<IProjectInfoRequestEntity>>{
				role: ServiceRole.Root,
				itemName: 'Requests'
			},
			processors: [new EntityArrayProcessor<IProjectInfoRequestEntity>(['SubResources'])]
		};
		super(options);
	}

	public override createUpdateEntity(modified: IProjectInfoRequestEntity | null): ProjectInfoRequestUpdate {
		const complete = new ProjectInfoRequestUpdate();
		if (modified !== null) {
			complete.InfoRequestID = modified.Id;
			complete.Requests = [modified];
		}

		return complete;
	}

	public override getModificationsFromUpdate(complete: ProjectInfoRequestUpdate): IProjectInfoRequestEntity[] {
		if (complete.Requests === null){
			return complete.Requests = [];
		} else{
			return complete.Requests;
		}
	}
}