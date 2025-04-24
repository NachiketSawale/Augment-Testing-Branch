/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatNode, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { BasicsClerkDataService } from './basics-clerk-data.service';
import { IBasicsClerkEntity, IBasicsClerkGroupEntity, IBasicsClerkComplete, IBasicsClerkGroupComplete } from '@libs/basics/interfaces';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkGroupDataService extends DataServiceFlatNode<IBasicsClerkGroupEntity, IBasicsClerkGroupComplete, IBasicsClerkEntity, IBasicsClerkComplete> {
	public constructor() {
		const options: IDataServiceOptions<IBasicsClerkGroupEntity> = {
			apiUrl: 'basics/clerk/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbyparent',
				usePost: true,
				prepareParam: ident => {
					return { PKey1: ident.pKey1 };
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkGroupEntity, IBasicsClerkEntity, IBasicsClerkComplete>>{
				role: ServiceRole.Node,
				itemName: 'Groups',
				parent: inject(BasicsClerkDataService)
			},
		};

		super(options);
	}

	public override createUpdateEntity(modified: IBasicsClerkGroupEntity | null): IBasicsClerkGroupComplete {
		return {
			MainItemId: modified?.Id,
			Groups: modified ?? null,
		} as IBasicsClerkGroupComplete;
	}

}
