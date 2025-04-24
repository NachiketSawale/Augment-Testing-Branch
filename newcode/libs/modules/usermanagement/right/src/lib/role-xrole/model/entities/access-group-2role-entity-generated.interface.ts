/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccessRoleEntity } from '../../../roles/model/entities/access-role-entity.interface';
import { IAccessGroupEntity } from './access-group-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IClientEntity } from './client-entity.interface';


export interface IAccessGroup2RoleEntityGenerated extends IEntityBase {

/*
 * AccessGroupEntity
 */
  AccessGroupEntity?: IAccessGroupEntity | null;

/*
 * AccessGroupFk
 */
  AccessGroupFk?: number | null;

/*
 * AccessRoleEntity
 */
  AccessRoleEntity?: IAccessRoleEntity | null;

/*
 * AccessRoleFk
 */
  AccessRoleFk?: number | null;

/*
 * ClientEntity
 */
  ClientEntity?: IClientEntity | null;

/*
 * ClientFk
 */
  ClientFk?: number | null;

/*
 * Id
 */
  Id?: string | null;

/*
 * OldAccessRoleFk
 */
  OldAccessRoleFk?: number | null;

/*
 * OldClientFk
 */
  OldClientFk?: number | null;
}
