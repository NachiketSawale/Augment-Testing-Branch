/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccessRoleEntity } from '../../../roles/model/entities/access-role-entity.interface';
import { IAccessRightDescriptorEntity } from './access-right-descriptor-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IAccessRightEntityGenerated extends IEntityBase {

/*
 * AccessRight
 */
  AccessRight?: number | null;

/*
 * AccessRightDescriptorEntity
 */
  AccessRightDescriptorEntity?: IAccessRightDescriptorEntity | null;

/*
 * AccessRightDescriptorFk
 */
  AccessRightDescriptorFk?: number | null;

/*
 * AccessRoleEntity
 */
  AccessRoleEntity?: IAccessRoleEntity | null;

/*
 * AccessRoleFk
 */
  AccessRoleFk?: number | null;
}
