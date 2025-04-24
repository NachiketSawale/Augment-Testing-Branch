/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IEntityIdentification } from '@libs/platform/common';

export interface IProjectStockDownTimeEntityGenerated extends IEntityBase, IEntityIdentification {

/*
 * BasClerkFk
 */
  BasClerkFk: number;

/*
 * Description
 */
  Description: string;

/*
 * EndDate
 */
  EndDate: string;

/*
 * PrjStockFk
 */
  PrjStockFk: number;

/*
 * StartDate
 */
  StartDate: string;
}
