/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstLineItemEntity } from './est-line-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstAssembly2WicItemEntityGenerated extends IEntityBase {

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * EstLineItemEntity
 */
  EstLineItemEntity?: IEstLineItemEntity | null;

/*
 * EstLineItemFk
 */
  EstLineItemFk?: number | null;

/*
 * Id
 */
  Id: number;
}
