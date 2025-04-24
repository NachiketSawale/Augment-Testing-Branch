/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IAccessRoleEntity } from './entities/access-role-entity.interface';

export class UsermanagementRoleComplete implements CompleteIdentification<IAccessRoleEntity>{


	/*
  * DescriptorStructurePresenterToDelete
  */
	//public DescriptorStructurePresenterToDelete: IDescriptorStructurePresenter[] | null = [];

	/*
	 * DescriptorStructurePresenterToSave
	 */
	// public DescriptorStructurePresenterToSave: IDescriptorStructurePresenter[] | null = [];
   
	/*
	 * EntitiesCount
	 */
	 public EntitiesCount: number | null = 10;
   
	/*
	 * MainItemId
	 */
	 public MainItemId: number | null = 10;
   
	/*
	 * Role
	 */
	 public Role: IAccessRoleEntity[] | null = [];
   
	/*
	 * Role2RoleToDelete
	 */
	 //public Role2RoleToDelete: IAccessRole2RoleEntity[] | null = [];
   
	/*
	 * Role2RoleToSave
	 */
	// public Role2RoleToSave: IAccessRole2RoleEntity[] | null = [];
	
}
