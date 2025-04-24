/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostcodePriceListEntity } from './costcode-price-list-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICostcodePriceVerEntityGenerated extends IEntityBase {

/*
 * ContextFk
 */
  ContextFk?: number | null;

/*
 * CostcodePricelistEntities
 */
  CostcodePricelistEntities?: ICostcodePriceListEntity[] | null;

/*
 * DataDate
 */
  DataDate?: string | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * PriceListCurrencyFk
 */
  PriceListCurrencyFk?: number | null;

/*
 * PriceListDescription
 */
  PriceListDescription?: string | null;

/*
 * PriceListFk
 */
  PriceListFk?: number | null;

/*
 * ValidFrom
 */
  ValidFrom?: string | null;

/*
 * ValidTo
 */
  ValidTo?: string | null;

/*
 * Weighting
 */
  Weighting?: number | null;
}
