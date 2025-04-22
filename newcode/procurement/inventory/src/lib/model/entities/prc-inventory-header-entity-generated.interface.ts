/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcInventoryHeaderEntityGenerated extends IEntityBase {

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * CompanyFk
 */
  CompanyFk: number;

/*
 * Description
 */
  Description?: string | null;

/*
 * HasInventory
 */
  HasInventory?: boolean | null;

/*
 * Id
 */
  Id: number;

/*
 * InventoryDate
 */
  InventoryDate: string;

/*
 * InventoryTotal
 */
  InventoryTotal?: number | null;

/*
 * IsCurrentCompany
 */
  IsCurrentCompany?: boolean | null;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * IsPosted
 */
  IsPosted?: boolean | null;

/*
 * IsReadonlyStatus
 */
  IsReadonlyStatus?: boolean | null;

/*
 * PrcInventoryEntities
 */
  // PrcInventoryEntities?: IPrcInventoryEntity[] | null;

/*
 * PrcInventorydocumentEntities
 */
  // PrcInventorydocumentEntities?: IPrcInventoryDocumentEntity[] | null;

/*
 * PrcStockTransactionTypeFk
 */
  PrcStockTransactionTypeFk: number;

/*
 * PrjProjectFk
 */
  PrjProjectFk: number;

/*
 * PrjStockDownTimeFk
 */
  PrjStockDownTimeFk?: number | null;

/*
 * PrjStockFk
 */
  PrjStockFk: number;

/*
 * StockCurrencyFk
 */
  StockCurrencyFk?: number | null;

/*
 * StockProjectFk
 */
  StockProjectFk?: number | null;

/*
 * StockTotal
 */
  StockTotal?: number | null;

/*
 * TransactionDate
 */
  TransactionDate: string;

/*
 * UserDefined1
 */
  UserDefined1?: string | null;

/*
 * UserDefined2
 */
  UserDefined2?: string | null;

/*
 * UserDefined3
 */
  UserDefined3?: string | null;

/*
 * UserDefined4
 */
  UserDefined4?: string | null;

/*
 * UserDefined5
 */
  UserDefined5?: string | null;
}
