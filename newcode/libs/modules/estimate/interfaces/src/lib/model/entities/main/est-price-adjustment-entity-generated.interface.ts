/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IEstHeaderEntity } from './est-header-base-entity.interface';

export interface IEstPriceAdjustmentEntityGenerated extends IEntityBase {

/*
 * AqQuantity
 */
  AqQuantity?: number | null;

/*
 * BoqHeaderFk
 */
  BoqHeaderFk?: number | null;

/*
 * BoqItemFk
 */
  BoqItemFk?: number | null;

/*
 * Comment
 */
  Comment?: string | null;

/*
 * EstHeaderEntity
 */
  EstHeaderEntity?: IEstHeaderEntity | null;

/*
 * EstHeaderFk
 */
  EstHeaderFk?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * UrAdjustment
 */
  UrAdjustment?: number | null;

/*
 * UrTender
 */
  UrTender?: number | null;

/*
 * Urb1Adjustment
 */
  Urb1Adjustment?: number | null;

/*
 * Urb1Tender
 */
  Urb1Tender?: number | null;

/*
 * Urb2Adjustment
 */
  Urb2Adjustment?: number | null;

/*
 * Urb2Tender
 */
  Urb2Tender?: number | null;

/*
 * Urb3Adjustment
 */
  Urb3Adjustment?: number | null;

/*
 * Urb3Tender
 */
  Urb3Tender?: number | null;

/*
 * Urb4Adjustment
 */
  Urb4Adjustment?: number | null;

/*
 * Urb4Tender
 */
  Urb4Tender?: number | null;

/*
 * Urb5Adjustment
 */
  Urb5Adjustment?: number | null;

/*
 * Urb5Tender
 */
  Urb5Tender?: number | null;

/*
 * Urb6Adjustment
 */
  Urb6Adjustment?: number | null;

/*
 * Urb6Tender
 */
  Urb6Tender?: number | null;
}
