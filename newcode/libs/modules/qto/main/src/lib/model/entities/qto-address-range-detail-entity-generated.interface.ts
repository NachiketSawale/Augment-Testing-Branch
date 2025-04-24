/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IQtoAddressRangeEntity } from './qto-address-range-entity.interface';

export interface IQtoAddressRangeDetailEntityGenerated extends IEntityBase {

/*
 * BasClerkFk
 */
  BasClerkFk?: number | null;

/*
 * BasClerkRoleFk
 */
  BasClerkRoleFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * IndexArea
 */
  IndexArea?: string | null;

/*
 * LineArea
 */
  LineArea?: string | null;

/*
 * QtoAddressRangeEntity
 */
  QtoAddressRangeEntity?: IQtoAddressRangeEntity | null;

/*
 * QtoAddressRangeFk
 */
  QtoAddressRangeFk: number;

/*
 * SheetArea
 */
  SheetArea?: string | null;
}
