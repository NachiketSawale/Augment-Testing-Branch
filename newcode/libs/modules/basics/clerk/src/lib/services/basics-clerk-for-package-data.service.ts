/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { IBasicsClerkEntity, IBasicsClerkForPackageEntity, IBasicsClerkComplete } from '@libs/basics/interfaces';
import { IIdentificationData } from '@libs/platform/common';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkForPackageDataService extends DataServiceFlatLeaf<IBasicsClerkForPackageEntity, IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkForPackageEntity> = {
			apiUrl: 'basics/clerk/forpackage',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1};
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
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkForPackageEntity, IBasicsClerkEntity, IBasicsClerkComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ClerksForPackage',
				parent: inject(BasicsClerkDataService),
			},
		};

		super(options);
	}
}
