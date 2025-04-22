/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IStockTotalVEntityGenerated extends IEntityBase {

/*
 * BasBlobsFk
 */
  BasBlobsFk?: number | null;

/*
 * BrandDescription
 */
  BrandDescription?: string | null;

/*
 * BrandId
 */
  BrandId?: number | null;

/*
 * CatalogCode
 */
  CatalogCode?: string | null;

/*
 * CatalogDescription
 */
  CatalogDescription?: string | null;

/*
 * CatalogId
 */
  CatalogId?: number | null;

/*
 * Description1
 */
  Description1?: string | null;

/*
 * Description2
 */
  Description2?: string | null;

/*
 * ExpenseConsumed
 */
  ExpenseConsumed: number;

/*
 * ExpenseTotal
 */
  ExpenseTotal?: number | null;

/*
 * Expenses
 */
  Expenses: number;

/*
 * Id
 */
  Id: number;

/*
 * InDownTime
 */
  InDownTime?: boolean | null;

/*
 * IsCurrentCompany
 */
  IsCurrentCompany?: boolean | null;

/*
 * Islotmanagement
 */
  Islotmanagement?: boolean | null;

/*
 * LastTransactionDays
 */
  LastTransactionDays?: string | null;

/*
 * MaterialCode
 */
  MaterialCode?: string | null;

/*
 * MaxQuantity
 */
  MaxQuantity?: number | null;

/*
 * MdcMaterialFk
 */
  MdcMaterialFk: number;

/*
 * MinQuantity
 */
  MinQuantity?: number | null;

/*
 * Modelname
 */
  Modelname?: string | null;

/*
 * OrderProposalStatus
 */
  OrderProposalStatus?: number | null;

/*
 * PendingQuantity
 */
  PendingQuantity?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjStockFk
 */
  PrjStockFk: number;

/*
 * ProductCode
 */
  ProductCode?: string | null;

/*
 * ProductDescription
 */
  ProductDescription?: string | null;

/*
 * ProductFk
 */
  ProductFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk: number;

/*
 * ProvisionConsumed
 */
  ProvisionConsumed?: number | null;

/*
 * ProvisionPercent
 */
  ProvisionPercent?: number | null;

/*
 * ProvisionPeruom
 */
  ProvisionPeruom?: number | null;

/*
 * ProvisionReceipt
 */
  ProvisionReceipt?: number | null;

/*
 * ProvisionTotal
 */
  ProvisionTotal: number;

/*
 * Quantity
 */
  Quantity: number;

/*
 * QuantityAvailable
 */
  QuantityAvailable?: number | null;

/*
 * QuantityConsumed
 */
  QuantityConsumed?: number | null;

/*
 * QuantityOnOrder
 */
  QuantityOnOrder?: number | null;

/*
 * QuantityReceipt
 */
  QuantityReceipt?: number | null;

/*
 * QuantityReserved
 */
  QuantityReserved?: number | null;

/*
 * QuantityTotal
 */
  QuantityTotal?: number | null;

/*
 * Specification
 */
  Specification?: string | null;

/*
 * Stock2matId
 */
  Stock2matId?: number | null;

/*
 * StockCode
 */
  StockCode?: string | null;

/*
 * StockDescription
 */
  StockDescription?: string | null;

/*
 * StockLocation
 */
  StockLocation?: number | null;

/*
 * Total
 */
  Total: number;

/*
 * TotalConsumed
 */
  TotalConsumed?: number | null;

/*
 * TotalProvision
 */
  TotalProvision: number;

/*
 * TotalQuantity
 */
  TotalQuantity: number;

/*
 * TotalQuantityByPending
 */
  TotalQuantityByPending?: number | null;

/*
 * TotalReceipt
 */
  TotalReceipt?: number | null;

/*
 * TotalValue
 */
  TotalValue: number;

/*
 * Uom
 */
  Uom?: string | null;
}
