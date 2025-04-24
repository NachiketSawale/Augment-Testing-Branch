/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import {  IProjectComplete, IProjectEntity, IProjectMainProjectReleaseEntity } from '@libs/project/interfaces';
import { ProjectMainDataService } from '@libs/project/shared';
import { IIdentificationData } from '@libs/platform/common';


@Injectable({
	providedIn: 'root'
})

export class ProjectMainReleaseDataService extends DataServiceFlatLeaf<IProjectMainProjectReleaseEntity,IProjectEntity, IProjectComplete >{

	public constructor(projectMainDataService:ProjectMainDataService) {
		const options: IDataServiceOptions<IProjectMainProjectReleaseEntity>  = {
			apiUrl: 'project/main/release',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true,
				prepareParam: ident => {
					return { PKey1 : ident.pKey1 };
				}
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: (ident: IIdentificationData) => {
					return {
						PKey1: ident.pKey1,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete'
			},
			roleInfo: <IDataServiceChildRoleOptions<IProjectMainProjectReleaseEntity,IProjectEntity, IProjectComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Releases',
				parent: projectMainDataService,
			},
		};
		super(options);
	}
}



