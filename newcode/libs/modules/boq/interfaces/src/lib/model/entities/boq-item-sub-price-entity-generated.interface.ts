/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IBoqItemSubPriceEntityGenerated extends IEntityBase {

/*
 * Approach
 */
  Approach: string;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * Description
 */
  Description: string;

/*
 * Id
 */
  Id: number;

/*
 * Price
 */
  Price: number;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * TotalPrice
 */
  TotalPrice: number;
}
