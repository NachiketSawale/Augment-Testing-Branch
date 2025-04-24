/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEstAssembly2WicItemEntity } from './est-assembly-2wic-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IEstAssembly2WicItemCompositeEntityGenerated extends IEntityBase {

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * BoqLineTypeFk
 */
  BoqLineTypeFk?: number | null;

/*
 * BoqWicCatBoqFk
 */
  BoqWicCatBoqFk?: number | null;

/*
 * BoqWicCatFk
 */
  BoqWicCatFk?: number | null;

/*
 * BriefInfo
 */
  BriefInfo?: string | null;

/*
 * EstAssemblyWicItem
 */
  EstAssemblyWicItem?: IEstAssembly2WicItemEntity | null;

/*
 * Id
 */
  Id: number;

/*
 * UomFk
 */
  UomFk?: number | null;
}
