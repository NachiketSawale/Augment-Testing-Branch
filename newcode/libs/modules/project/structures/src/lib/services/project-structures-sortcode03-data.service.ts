/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, ISortCode03Entity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ProjectStructuresSortcode03DataService extends DataServiceFlatLeaf<ISortCode03Entity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<ISortCode03Entity>  = {
			apiUrl: 'project/structures/sortcode03',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
		roleInfo: <IDataServiceRoleOptions<ISortCode03Entity>>{
			role: ServiceRole.Leaf,
			itemName: 'SortCode',
			parent: projectMainDataService
		}

		};

		super(options);
	}

}








