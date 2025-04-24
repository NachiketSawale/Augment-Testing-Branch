/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { ProjectInfoRequestUpdate } from '../model/project-info-request-update.class';
import { ProjectInfoRequestDataService } from './project-info-request-data.service';
import { IProjectInfoRequestRelevantToEntity, IProjectInfoRequestEntity } from '@libs/project/interfaces';

export const PROJECT_INFO_REQUEST_RELEVANT_TO_DATA_TOKEN = new InjectionToken<ProjectInfoRequestRelevantToDataService>('projectInfoRequestRelevantToDataToken');

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestRelevantToDataService extends DataServiceFlatLeaf<IProjectInfoRequestRelevantToEntity, IProjectInfoRequestEntity, ProjectInfoRequestUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IProjectInfoRequestRelevantToEntity> = {
			apiUrl: 'project/rfi/requestrelevantto',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IProjectInfoRequestRelevantToEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'Relevants',
				parent: inject(ProjectInfoRequestDataService)
			},
			processors: [new EntityArrayProcessor<IProjectInfoRequestRelevantToEntity>(['SubResources'])]
		};
		super(options);
	}

	public override isParentFn(parentKey: IProjectInfoRequestEntity, entity: IProjectInfoRequestRelevantToEntity): boolean {
		return entity.InfoRequestFk === parentKey.Id;
	}

	public override registerModificationsToParentUpdate(complete: ProjectInfoRequestUpdate, modified: IProjectInfoRequestRelevantToEntity[], deleted: IProjectInfoRequestRelevantToEntity[]) {
		if (modified && modified.length > 0) {
			complete.RelevantsToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.RelevantsToDelete = deleted;
		}
	}
}