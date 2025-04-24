/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */
import {IDescriptionInfo} from '@libs/platform/common';
export interface IStockItemInfoVEntityGenerated {

/*
 * AlternativeQuantity
 */
  AlternativeQuantity?: number | null;

/*
 * ConCode
 */
  ConCode?: string | null;

/*
 * ConDescription
 */
  ConDescription?: string | null;

/*
 * ConQuantity
 */
  ConQuantity: number;

/*
 * ConStatusFk
 */
  ConStatusFk?: number | null;

/*
 * DeliveredQuantity
 */
  DeliveredQuantity: number;

/*
 * DescriptionInfo
 */
  DescriptionInfo?: IDescriptionInfo | null;

/*
 * Id
 */
  Id: number;

/*
 * IsDelivered
 */
  IsDelivered?: number | null;

/*
 * IsStock
 */
  IsStock?: number | null;

/*
 * ItemDate
 */
  ItemDate?: string | null;

/*
 * ItemNo
 */
  ItemNo: number;

/*
 * ItemType
 */
  ItemType: string;

/*
 * MatCode
 */
  MatCode?: string | null;

/*
 * MatDescriptionInfo
 */
  MatDescriptionInfo?: IDescriptionInfo | null;

/*
 * PesCode
 */
  PesCode?: string | null;

/*
 * PesDescription
 */
  PesDescription?: string | null;

/*
 * PesStatusFk
 */
  PesStatusFk?: number | null;

/*
 * PrjStockFk
 */
  PrjStockFk?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

/*
 * StockMatCode
 */
  StockMatCode?: string | null;
}
