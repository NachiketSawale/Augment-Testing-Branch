/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';

import { DataServiceFlatRoot,ServiceRole,IDataServiceOptions, IDataServiceEndPointOptions,IDataServiceRoleOptions } from '@libs/platform/data-access';

import { UsermanagementRoleComplete } from '../model/usermanagement-role-complete.class';
import { IAccessRoleEntity } from '../model/entities/access-role-entity.interface';




@Injectable({
	providedIn: 'root'
})

export class UsermanagementRoleDataService extends DataServiceFlatRoot<IAccessRoleEntity, UsermanagementRoleComplete> {

	public constructor() {
		const options: IDataServiceOptions<IAccessRoleEntity> = {
			apiUrl: 'usermanagement/main/role',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: true
			},
			updateInfo:<IDataServiceEndPointOptions>{
				endPoint:'update',
				usePost: true
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete' 
			},
			roleInfo: <IDataServiceRoleOptions<IAccessRoleEntity>>{
				role: ServiceRole.Root,
				itemName: 'Role',
			},
			
		};

		super(options);
	}
	public override createUpdateEntity(modified: IAccessRoleEntity | null): UsermanagementRoleComplete {
		const complete = new UsermanagementRoleComplete();
		if (modified !== null) {
			complete.MainItemId = modified.Id;
			complete.Role = [modified];
		}

		return complete;
	}

	

}







