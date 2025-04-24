/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IBoqItemEntity } from './boq-item-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IBoqItemFlagEntityGenerated extends IEntityBase {

/*
 * BoqItemEntities
 */
  BoqItemEntities?: IBoqItemEntity[] | null;

/*
 * Code
 */
  Code?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDefault
 */
  IsDefault: boolean;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * Sorting
 */
  Sorting: number;
}
