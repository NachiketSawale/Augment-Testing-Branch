/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, ISortCode09Entity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectStructuresSortcode09DataService extends DataServiceFlatLeaf<ISortCode09Entity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<ISortCode09Entity>  = {
			apiUrl: 'project/structures/sortcode09',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ISortCode09Entity>>{
			role: ServiceRole.Leaf,
				itemName: 'SortCode',
				parent: projectMainDataService
		}
		};

		super(options);
	}

}








