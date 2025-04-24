/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAccessRoleEntity } from '../../../roles/model/entities/access-role-entity.interface';


export interface IAccessRole2RoleEntityGenerated extends IEntityBase {

/*
 * AccessRoleEntity_AccessRoleFk1
 */
  AccessRoleEntity_AccessRoleFk1?: IAccessRoleEntity | null;

/*
 * AccessRoleEntity_AccessRoleFk2
 */
  AccessRoleEntity_AccessRoleFk2?: IAccessRoleEntity | null;

/*
 * AccessRoleFk1
 */
  AccessRoleFk1?: number | null;

/*
 * AccessRoleFk2
 */
  AccessRoleFk2?: number | null;



/*
 * Id
 */
  Id: string;
  

}
