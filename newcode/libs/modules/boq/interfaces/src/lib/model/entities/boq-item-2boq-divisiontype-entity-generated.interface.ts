/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IBoqItemEntity } from './boq-item-entity.interface';

export interface IBoqItem2boqDivisiontypeEntityGenerated extends IEntityBase {

/*
 * BoqDivisionTypeFk
 */
  BoqDivisionTypeFk: number;

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
 * Id
 */
  Id: number;
}
