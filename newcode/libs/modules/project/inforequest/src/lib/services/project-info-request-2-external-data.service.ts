/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable, inject } from '@angular/core';
import { EntityArrayProcessor, IDataServiceEndPointOptions, ServiceRole, IDataServiceOptions, IDataServiceRoleOptions, DataServiceFlatLeaf } from '@libs/platform/data-access';
import { ProjectInfoRequestUpdate } from '../model/project-info-request-update.class';
import { ProjectInfoRequestDataService } from './project-info-request-data.service';
import { IProjectInfoRequest2ExternalEntity, IProjectInfoRequestEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})
export class ProjectInfoRequest2ExternalDataService extends DataServiceFlatLeaf<IProjectInfoRequest2ExternalEntity,IProjectInfoRequestEntity,ProjectInfoRequestUpdate> {
	public constructor() {
		const options: IDataServiceOptions<IProjectInfoRequest2ExternalEntity> = {
			apiUrl: 'project/rfi/inforequest2external',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true
			},
			roleInfo: <IDataServiceRoleOptions<IProjectInfoRequest2ExternalEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'InfoRequest2External',
				parent: inject(ProjectInfoRequestDataService)
			},
			entityActions: {createSupported: false, deleteSupported: false},
			processors: [new EntityArrayProcessor<IProjectInfoRequest2ExternalEntity>(['SubResources'])]
		};
		super(options);
	}

	public override isParentFn(parentKey: IProjectInfoRequestEntity, entity: IProjectInfoRequest2ExternalEntity): boolean {
		return entity.InfoRequestFk === parentKey.Id;
	}
}