/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccessGroup2RoleEntity } from './access-group-2role-entity.interface';
// import { IAccessUser2GroupEntity } from './access-user-2group-entity.interface';
// import { IPortalUserGroupEntity } from './portal-user-group-entity.interface';
// import { IIdentityProviderEntity } from './identity-provider-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IAccessGroupEntityGenerated extends IEntityBase {

/*
 * AccessGroup2RoleEntities
 */
  AccessGroup2RoleEntities?: IAccessGroup2RoleEntity[] | null;

/*
 * AccessUser2GroupEntities
 */
  // AccessUser2GroupEntities?: IAccessUser2GroupEntity[] | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * DomainSID
 */
  DomainSID?: string | null;

/*
 * Email
 */
  Email?: string | null;

/*
 * FrmIdentityproviderFk
 */
  FrmIdentityproviderFk?: number | null;

/*
 * FrmPortalusergroupEntities
 */
  // FrmPortalusergroupEntities?: IPortalUserGroupEntity[] | null;

/*
 * GUID
 */
  GUID?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IdentityProviderEntity
 */
  // IdentityProviderEntity?: IIdentityProviderEntity | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * ProviderUniqueIdentifier
 */
  ProviderUniqueIdentifier?: string | null;

/*
 * SynchronizeDate
 */
  SynchronizeDate?: string | null;
}
