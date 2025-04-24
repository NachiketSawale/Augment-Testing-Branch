/*
 * Copyright(c) RIB Software GmbH
 */

import { IAccessRightEntity } from './access-right-entity.interface';
import { IEntityBase } from '@libs/platform/common';


export interface IAccessRightDescriptorEntityGenerated extends IEntityBase {

/*
 * AccessGUID
 */
  AccessGUID?: string | null;

/*
 * AccessMask
 */
  AccessMask?: number | null;

/*
 * AccessRightEntities
 */
  AccessRightEntities?: IAccessRightEntity[] | null;

/*
 * Description
 */
  Description?: string | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsDynamic
 */
  IsDynamic?: boolean | null;

/*
 * IsProtected
 */
  IsProtected?: boolean | null;

/*
 * IsStatic
 */
  IsStatic?: boolean | null;

/*
 * Name
 */
  Name?: string | null;

/*
 * SortOrderPath
 */
  SortOrderPath?: string | null;
}
