/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { ICrbBoqItemEntity } from './crb-boq-item-entity.interface';

export interface ICrbBoqItemScopeEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItem
 */
  BoqItem?: ICrbBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * CostgroupEglFk
 */
  CostgroupEglFk?: number | null;

/*
 * CostgroupEtFk
 */
  CostgroupEtFk?: number | null;

/*
 * CostgroupKagFk
 */
  CostgroupKagFk?: number | null;

/*
 * CostgroupNglFk
 */
  CostgroupNglFk?: number | null;

/*
 * CostgroupOglFk
 */
  CostgroupOglFk?: number | null;

/*
 * CostgroupRglFk
 */
  CostgroupRglFk?: number | null;

/*
 * CostgroupVgrFk
 */
  CostgroupVgrFk?: number | null;

/*
 * Id
 */
  Id: number;
}
