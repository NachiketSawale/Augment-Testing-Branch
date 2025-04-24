/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqItem2CostGroupEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemEntity
 */
  BoqItemEntity?: IBoqItemEntity | null;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * CostGroupCatFk
 */
  CostGroupCatFk: number;

/*
 * CostGroupFk
 */
  CostGroupFk: number;

/*
 * Id
 */
  Id: number;
}
