/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { ResourceTypeDataService } from './resource-type-data.service';
import { IPlanningBoardFilterEntity } from '@libs/resource/interfaces';
import { IResourceTypeEntity } from '@libs/resource/interfaces';
import { IResourceTypeUpdateEntity } from '@libs/resource/interfaces';

@Injectable({
	providedIn: 'root'
})

export class ResourceTypePlanningBoardFilterDataService extends DataServiceFlatLeaf<IPlanningBoardFilterEntity,IResourceTypeEntity, IResourceTypeUpdateEntity>{

	public constructor() {
		const options: IDataServiceOptions<IPlanningBoardFilterEntity>  = {
			apiUrl: 'resource/type/planningboardfilter',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IPlanningBoardFilterEntity,IResourceTypeEntity, IResourceTypeUpdateEntity>>{
				role: ServiceRole.Leaf,
				itemName: 'PlanningBoardFilters',
				parent: inject(ResourceTypeDataService),
			},


		};

		super(options);
	}
	public override isParentFn(parentKey: IResourceTypeEntity, entity: IPlanningBoardFilterEntity): boolean {
		return entity.TypeFk === parentKey.Id;
	}
}








