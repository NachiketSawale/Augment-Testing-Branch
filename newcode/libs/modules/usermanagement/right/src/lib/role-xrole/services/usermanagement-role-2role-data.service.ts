/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { DataServiceFlatLeaf,IDataServiceOptions,ServiceRole,IDataServiceChildRoleOptions, IDataServiceEndPointOptions} from '@libs/platform/data-access';
import { IAccessRole2RoleEntity } from '../model/entities/access-role-2role-entity.interface';
import { IAccessRoleEntity } from '../../roles/model/entities/access-role-entity.interface';
import { UsermanagementRoleComplete } from '../../roles/model/usermanagement-role-complete.class';
import { UsermanagementRoleDataService } from '../../roles/services/usermanagement-role-data.service';



@Injectable({
	providedIn: 'root'
})

export class UsermanagementRole2roleDataService extends DataServiceFlatLeaf<IAccessRole2RoleEntity,IAccessRoleEntity, UsermanagementRoleComplete >{

	public constructor(usermanagementRoleDataService:UsermanagementRoleDataService) {
		const options: IDataServiceOptions<IAccessRole2RoleEntity>  = {
			apiUrl: 'usermanagement/main/role2role',
			readInfo: <IDataServiceEndPointOptions>{
				endPoint: 'list',
				usePost: false,
				prepareParam: ident => {
					const selectedParent = this.getSelectedParent();
					return {
						MainItemId: selectedParent?.Id,
					};
				}
			},
			deleteInfo: <IDataServiceEndPointOptions>{
				endPoint: 'delete'
			},
			createInfo: <IDataServiceEndPointOptions>{
				prepareParam: ident => {
					const selectedParent = this.getSelectedParent();
					return {MainItemId: selectedParent?.Name,Role: selectedParent?.Description};
				}
			},
			roleInfo: <IDataServiceChildRoleOptions<IAccessRole2RoleEntity,IAccessRoleEntity, UsermanagementRoleComplete>>{
				role: ServiceRole.Leaf,
				itemName: 'Role2Role',
				parent: usermanagementRoleDataService,
			},
		};
		super(options);
	}

}



