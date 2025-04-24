/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstCostRiskEntityGenerated extends IEntityBase {

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * EstLineItemEntities
 */
  EstLineItemEntities?: IEstLineItemEntity[] | null;

/*
 * Id
 */
  Id: number;

/*
 * IsLive
 */
  IsLive?: boolean | null;

/*
 * Isdefault
 */
  Isdefault?: boolean | null;

/*
 * Sorting
 */
  Sorting?: number | null;
}
