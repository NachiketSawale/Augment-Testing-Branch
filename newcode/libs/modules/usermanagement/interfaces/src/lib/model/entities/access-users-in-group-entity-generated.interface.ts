/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IUserEntity } from './user-entity.interface';

/**
 * Usermanagement User in Group interface
 */

export interface IAccessUsersInGroupEntityGenerated extends IEntityBase {

/*
 * AccessGroupEntity
 */
  // AccessGroupEntity?: IAccessGroupEntity | null;

/*
 * AccessGroupFk
 */
  AccessGroupFk?: number | null;

/*
 * Id
 */
  Id?: string | null;

/*
 * IdentityProvider
 */
  IdentityProvider?: number | null;

/*
 * UserEntity
 */
  UserEntity?: IUserEntity | null;

/*
 * UserFk
 */
  UserFk?: number | null;
}
