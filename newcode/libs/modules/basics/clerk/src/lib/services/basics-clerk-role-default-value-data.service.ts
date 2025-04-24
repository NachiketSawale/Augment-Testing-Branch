/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { IBasicsClerkEntity, IBasicsClerkRoleDefaultValueEntity, IBasicsClerkComplete } from '@libs/basics/interfaces';


@Injectable({
	providedIn: 'root',
})
export class BasicsClerkRoleDefaultValueDataService extends DataServiceFlatLeaf<IBasicsClerkRoleDefaultValueEntity, IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkRoleDefaultValueEntity> = {
			apiUrl: 'basics/clerk/roledefaultvalue',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByParent',
				usePost: true,
				prepareParam: ident => {
					return {
						PKey1 : ident.pKey1};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkRoleDefaultValueEntity, IBasicsClerkEntity, IBasicsClerkComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'ClerkRoleDefaultValues',
				parent: inject(BasicsClerkDataService),
			},
		};

		super(options);
	}
}
