/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, InjectionToken, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { ProjectInfoRequestUpdate } from '../model/project-info-request-update.class';
import { ProjectInfoRequestDataService } from './project-info-request-data.service';
import { IProjectInfoRequestReferenceEntity, IProjectInfoRequestEntity } from '@libs/project/interfaces';


export const PROJECT_INFO_REQUEST_REFERENCE_DATA_TOKEN = new InjectionToken<ProjectInfoRequestReferenceDataService>('projectInfoRequestReferenceDataToken');
@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequestReferenceDataService extends DataServiceFlatLeaf<IProjectInfoRequestReferenceEntity,IProjectInfoRequestEntity,ProjectInfoRequestUpdate> {
	public constructor(projectInfoRequestDataService : ProjectInfoRequestDataService) {
		const options: IDataServiceOptions<IProjectInfoRequestReferenceEntity> = {
			apiUrl: 'project/rfi/requestreference',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: false,
				prepareParam: ident => {
					const selAnnotation = projectInfoRequestDataService.getSelection()[0];
					return { requestInfoId : (selAnnotation ? selAnnotation.Id : 0)};
				}
			},
			roleInfo: <IDataServiceRoleOptions<IProjectInfoRequestReferenceEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'ProjectInfoRequestReferences',
				parent: inject(ProjectInfoRequestDataService)
			},
			processors: [new EntityArrayProcessor<IProjectInfoRequestReferenceEntity>(['SubResources'])]
		};
		super(options);
	}

	public override isParentFn(parentKey: IProjectInfoRequestEntity, entity: IProjectInfoRequestReferenceEntity): boolean {
		return entity.RequestFromFk === parentKey.Id;
	}

	public override registerModificationsToParentUpdate(complete: ProjectInfoRequestUpdate, modified: IProjectInfoRequestReferenceEntity[], deleted: IProjectInfoRequestReferenceEntity[]) {
		if (modified && modified.length > 0) {
			complete.ProjectInfoRequestReferencesToSave = modified;
		}
		if (deleted && deleted.length > 0) {
			complete.ProjectInfoRequestReferencesToDelete = deleted;
		}
	}

}