/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ServiceRole, IDataServiceOptions, IDataServiceEndPointOptions, DataServiceFlatLeaf, IDataServiceChildRoleOptions } from '@libs/platform/data-access';
import { IBasicsClerkGroupEntity, IBasicsClerkMemberEntity, IBasicsClerkGroupComplete } from '@libs/basics/interfaces';
import { BasicsClerkGroupDataService } from './basics-clerk-group-data.service';

@Injectable({
	providedIn: 'root',
})
export class BasicsClerkMemberDataService extends DataServiceFlatLeaf<IBasicsClerkMemberEntity, IBasicsClerkGroupEntity, IBasicsClerkGroupComplete> {
	public constructor(parentDataService: BasicsClerkGroupDataService) {
		const options: IDataServiceOptions<IBasicsClerkMemberEntity> = {
			apiUrl: 'basics/clerk/group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listbygroup',
				usePost: true,
				prepareParam: () => {
					const selection = parentDataService.getSelectedEntity();
					return { Id: selection?.ClerkGroupFk?? 0 };
				},
			},
			createInfo: <IDataServiceEndPointOptions>{
				endPoint: 'createmember',
				usePost: true,
				prepareParam: ident => {
					const selection = parentDataService.getSelectedEntity();
					return { Id: selection?.ClerkGroupFk?? 0 };
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'multidelete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IBasicsClerkMemberEntity, IBasicsClerkGroupEntity, IBasicsClerkGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Members',
				parent: parentDataService,
			},
		};

		super(options);
	}

	public override isParentFn(parentKey: IBasicsClerkGroupEntity, entity: IBasicsClerkMemberEntity): boolean {
		return entity.ClerkGroupFk === parentKey.ClerkGroupFk;
	}

}
