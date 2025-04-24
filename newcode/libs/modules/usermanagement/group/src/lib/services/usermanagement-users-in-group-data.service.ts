/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatLeaf, IDataServiceOptions, ServiceRole, IDataServiceChildRoleOptions, IDataServiceEndPointOptions } from '@libs/platform/data-access';
import { IAccessUsersInGroupEntity, IUserEntity } from '@libs/usermanagement/interfaces';
import { UsermanagementGroupDataService } from './usermanagement-group-data.service';
import { UsermanagementGroupComplete } from '../model/usermanagement-group-complete.class';

/**
 * Usermanagement User in Group Data Service model/entities/user-entity.interface
 */
@Injectable({
	providedIn: 'root',
})
export class UsermanagementUsersInGroupDataService extends DataServiceFlatLeaf<IAccessUsersInGroupEntity, IUserEntity, UsermanagementGroupComplete> {
	public constructor(groupDataService: UsermanagementGroupDataService) {
		const options: IDataServiceOptions<IAccessUsersInGroupEntity> = {
			apiUrl: 'usermanagement/main/user2group',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'listByGroupId',
				usePost: false,
				prepareParam: ident => {
					return {
						MainItemId: ident.pKey1
					};
				}
			},

			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete',
			},
			roleInfo: <IDataServiceChildRoleOptions<IAccessUsersInGroupEntity, IUserEntity, UsermanagementGroupComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'User2Group',
				parent: groupDataService,
			},
			//Todo: need to implement usermanagement-group-userXgroup-processor service.
		};

		super(options);
	}
}
