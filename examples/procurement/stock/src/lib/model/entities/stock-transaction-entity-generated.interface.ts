/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IStockTransactionEntityGenerated extends IEntityBase {

/*
 * BasUomFk
 */
  BasUomFk: number;

/*
 * Code
 */
  Code: string;

/*
 * CommentText
 */
  CommentText?: string | null;

/*
 * Description
 */
  Description: string;

/*
 * DispatchHeaderFk
 */
  DispatchHeaderFk?: number | null;

/*
 * DispatchRecordFk
 */
  DispatchRecordFk?: number | null;

/*
 * DocumentDate
 */
  DocumentDate: string;

/*
 * ExpirationDate
 */
  ExpirationDate?: string | null;

/*
 * Id
 */
  Id: number;

/*
 * Inv2contractFk
 */
  Inv2contractFk?: number | null;

/*
 * InvHeaderFk
 */
  InvHeaderFk?: number | null;

/*
 * InventoryDate
 */
  InventoryDate?: string | null;

/*
 * Lotno
 */
  Lotno?: string | null;

/*
 * MdcControllingunitFk
 */
  MdcControllingunitFk?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk: number;

/*
 * PesHeaderFk
 */
  PesHeaderFk?: number | null;

/*
 * PesItemFk
 */
  PesItemFk?: number | null;

/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;

/*
 * PrcInventoryFk
 */
  PrcInventoryFk?: number | null;

/*
 * PrcInventoryHeaderFk
 */
  PrcInventoryHeaderFk?: number | null;

/*
 * PrcStocktransactionFk
 */
  PrcStocktransactionFk?: number | null;

/*
 * PrcStocktransactiontypeFk
 */
  PrcStocktransactiontypeFk: number;

/*
 * PrjStockFk
 */
  PrjStockFk: number;

/*
 * PrjStocklocationFk
 */
  PrjStocklocationFk?: number | null;

/*
 * ProvisionPercent
 */
  ProvisionPercent: number;

/*
 * ProvisionTotal
 */
  ProvisionTotal: number;

/*
 * Quantity
 */
  Quantity: number;

/*
 * RemainQuantity
 */
  RemainQuantity: number;

/*
 * ReservationId
 */
  ReservationId?: number | null;

/*
 * Total
 */
  Total: number;

/*
 * TransactionDate
 */
  TransactionDate: string;

/*
 * Userdefined1
 */
  Userdefined1?: string | null;

/*
 * Userdefined2
 */
  Userdefined2?: string | null;

/*
 * Userdefined3
 */
  Userdefined3?: string | null;

/*
 * Userdefined4
 */
  Userdefined4?: string | null;

/*
 * Userdefined5
 */
  Userdefined5?: string | null;
}
