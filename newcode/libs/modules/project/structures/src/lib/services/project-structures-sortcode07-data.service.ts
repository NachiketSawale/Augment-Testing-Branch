/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, ISortCode07Entity } from '@libs/project/interfaces';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
@Injectable({
	providedIn: 'root'
})

export class ProjectStructuresSortcode07DataService extends DataServiceFlatLeaf<ISortCode07Entity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<ISortCode07Entity>  = {
			apiUrl: 'project/structures/sortcode07',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			  roleInfo: <IDataServiceRoleOptions<ISortCode07Entity>>{
			  role: ServiceRole.Leaf,
			  itemName: 'SortCode',
			  parent: projectMainDataService
}


		};

		super(options);
	}

}








