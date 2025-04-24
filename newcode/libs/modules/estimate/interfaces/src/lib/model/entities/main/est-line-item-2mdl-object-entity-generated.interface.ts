/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstLineItemEntity } from './estimate-line-item-base-entity.interface';

export interface IEstLineItem2MdlObjectEntityGenerated extends IEntityBase {

/*
 * Date
 */
  Date?: string | null;

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

/*
 * LocationCode
 */
  LocationCode?: string | null;

/*
 * LocationDesc
 */
  LocationDesc?: string | null;

/*
 * MdlModelFk
 */
  MdlModelFk?: number | null;

/*
 * MdlObjectFk
 */
  MdlObjectFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * QuantityDetail
 */
  QuantityDetail?: string | null;

/*
 * QuantityTarget
 */
  QuantityTarget?: number | null;

/*
 * QuantityTargetDetail
 */
  QuantityTargetDetail?: string | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * Remark
 */
  Remark?: string | null;

/*
 * WqQuantityTarget
 */
  WqQuantityTarget?: number | null;

/*
 * WqQuantityTargetDetail
 */
  WqQuantityTargetDetail?: string | null;
}
