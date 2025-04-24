/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccessGroup2RoleEntity } from './access-group-2role-entity.interface';
import { IClientEntity } from './client-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IClientEntityGenerated extends IEntityBase {

/*
 * AccessGroup2RoleEntities
 */
  AccessGroup2RoleEntities?: IAccessGroup2RoleEntity[] | null;

/*
 * ClientEntities_ClientFk
 */
  ClientEntities_ClientFk?: IClientEntity[] | null;

/*
 * ClientEntity_ClientFk
 */
  ClientEntity_ClientFk?: IClientEntity | null;

/*
 * ClientFk
 */
  ClientFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * Isdisabled
 */
  Isdisabled?: boolean | null;

/*
 * Ishidden
 */
  Ishidden?: boolean | null;

/*
 * Isinternal
 */
  Isinternal?: boolean | null;

/*
 * Name
 */
  Name?: string | null;
}
