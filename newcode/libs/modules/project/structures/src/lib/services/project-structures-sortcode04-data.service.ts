/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, IDataServiceEndPointOptions, IDataServiceRoleOptions, ServiceRole } from '@libs/platform/data-access';
import { IProjectComplete, ISortCode04Entity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';


@Injectable({
	providedIn: 'root'
})

export class ProjectStructuresSortcode04DataService extends DataServiceFlatLeaf<ISortCode04Entity,IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<ISortCode04Entity>  = {
			apiUrl: 'project/structures/sortcode04',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceRoleOptions<ISortCode04Entity>>{
			role: ServiceRole.Leaf,
			itemName: 'SortCode',
			parent: projectMainDataService
}

		};

		super(options);
	}

}








