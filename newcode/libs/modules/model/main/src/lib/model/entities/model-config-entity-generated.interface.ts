/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IModelConfigEntityGenerated extends IEntityBase {

/*
 * AccessRoleFk
 */
  AccessRoleFk?: number | null;

/*
 * Config
 */
  Config?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * Kind
 */
  Kind: number;

/*
 * ModelFk
 */
  ModelFk: number;

/*
 * UserFk
 */
  UserFk?: number | null;
}
