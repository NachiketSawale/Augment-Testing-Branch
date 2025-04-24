/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { ICostcodePriceVerEntity } from './costcode-price-ver-entity.interface';
import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface ICostcodePriceListEntityGenerated extends IEntityBase {

/*
 * Co2Project
 */
  Co2Project?: number | null;

/*
 * Co2Source
 */
  Co2Source?: number | null;

/*
 * Co2SourceFk
 */
  Co2SourceFk?: number | null;

/*
 * CostCodeFk
 */
  CostCodeFk?: number | null;

/*
 * CostcodePriceVerFk
 */
  CostcodePriceVerFk?: number | null;

/*
 * CostcodePriceverEntity
 */
  CostcodePriceverEntity?: ICostcodePriceVerEntity | null;

/*
 * CurrencyFk
 */
  CurrencyFk?: number | null;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * FactorCost
 */
  FactorCost?: number | null;

/*
 * FactorHour
 */
  FactorHour?: number | null;

/*
 * FactorQuantity
 */
  FactorQuantity?: number | null;

/*
 * Id
 */
  Id: number;

/*
 * Rate
 */
  Rate?: number | null;

/*
 * RealFactorCost
 */
  RealFactorCost?: number | null;

/*
 * RealFactorQuantity
 */
  RealFactorQuantity?: number | null;

/*
 * SalesPrice
 */
  SalesPrice?: number;

/*
 * mdcPriceListFK
 */
  mdcPriceListFK?: number | null;
}
