/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable} from '@angular/core';
import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IManagedPlantLocVEntity, IProjectComplete, IProjectEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';

@Injectable({
	providedIn: 'root'
})
export class ProjectMainManagedPlantLocDataService extends DataServiceFlatLeaf<IManagedPlantLocVEntity, IProjectEntity, IProjectComplete>{

	public constructor(projectMainDataService : ProjectMainDataService) {
		const options: IDataServiceOptions<IManagedPlantLocVEntity>  = {
			apiUrl: 'project/main/allocation',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1 : ident.pKey1};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IManagedPlantLocVEntity, IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ManagedPlantLocV',
				parent: projectMainDataService,
			},
		};

		super(options);
	}

}



