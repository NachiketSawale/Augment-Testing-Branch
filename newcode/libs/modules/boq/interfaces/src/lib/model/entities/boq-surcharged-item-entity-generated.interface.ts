/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';


export interface IBoqSurchargedItemEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk: number;

/*
 * BoqItemFk
 */
  BoqItemFk: number;

/*
 * BoqSurcharedItemFk
 */
  BoqSurcharedItemFk?: number | null;

/*
 * BoqSurchargedItem
 */
  BoqSurchargedItem?: IBoqItemEntity | null;

/*
 * Id
 */
  Id: number;

/*
 * QuantitySplit
 */
  QuantitySplit: number;
}
