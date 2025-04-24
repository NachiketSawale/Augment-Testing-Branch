/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IProjectComplete, IProjectEntity, ITimekeeping2ClerkEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainTimekeepingClerkDataService extends DataServiceFlatLeaf<ITimekeeping2ClerkEntity, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<ITimekeeping2ClerkEntity>  = {
			apiUrl: 'project/main/timekeeping2clerk',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: false
			},
			createInfo: {
				prepareParam: ident => {
					return {
						Id: ident.pKey1!
					};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<ITimekeeping2ClerkEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Timekeeping2Clerks',
				parent: projectMainDataService,
			},


		};

		super(options);
	}

}








