/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstBoqRangeCalculationItemEntity } from './est-boq-range-calculation-item-entity.interface';

export interface IEstAreaBoqHeaderItemEntityGenerated {

/*
 * BoqHeaderId
 */
  BoqHeaderId?: number | null;

/*
 * BoqItemId2OrderNumber
 */
  BoqItemId2OrderNumber?: {[key: string]: number} | null;

/*
 * EstBoqRangeCalculationItem
 */
  EstBoqRangeCalculationItem?: IEstBoqRangeCalculationItemEntity[] | null;
}
