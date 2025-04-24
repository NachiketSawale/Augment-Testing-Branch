/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IAccessGroup2RoleEntity } from '../../../role-xrole/model/entities/access-group-2role-entity.interface';
import { IAccessRole2RoleEntity } from '../../../role-xrole/model/entities/access-role-2role-entity.interface';
import { IAccessRightEntity } from '../../../role-xrole/model/entities/access-right-entity.interface';
export interface IAccessRoleEntityGenerated extends IEntityBase {

/*
 * AccessGroup2RoleEntities
 */
  AccessGroup2RoleEntities?: IAccessGroup2RoleEntity[] | null;

/*
 * AccessRightEntities
 */
  AccessRightEntities?: IAccessRightEntity[] | null;

/*
 * AccessRole2RoleEntities_AccessRoleFk1
 */
  AccessRole2RoleEntities_AccessRoleFk1?: IAccessRole2RoleEntity[] | null;

/*
 * AccessRole2RoleEntities_AccessRoleFk2
 */
  AccessRole2RoleEntities_AccessRoleFk2?: IAccessRole2RoleEntity[] | null;

/*
 * AccessRoleCategoryFk
 */
  AccessRoleCategoryFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id: number ;

/*
 * IsDynamicRole
 */
  IsDynamicRole?: boolean | null;

/*
 * IsUserRole
 */
  IsUserRole?: boolean | null;

/*
 * Name
 */
  Name?: string | null;
}
