/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IStockTotalVEntityGenerated extends IEntityBase {

  /**
   * BasBlobsFk
   */
  BasBlobsFk?: number | null;

  /**
   * BrandDescription
   */
  BrandDescription?: string | null;

  /**
   * BrandId
   */
  BrandId?: number | null;

  /**
   * CatalogCode
   */
  CatalogCode?: string | null;

  /**
   * CatalogDescription
   */
  CatalogDescription?: string | null;

  /**
   * CatalogId
   */
  CatalogId?: number | null;

  /**
   * Description1
   */
  Description1?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * ExpenseTotal
   */
  ExpenseTotal?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Islotmanagement
   */
  Islotmanagement?: boolean | null;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialFk
   */
  MaterialFk: number;

  /**
   * MaterialGroupId
   */
  MaterialGroupId?: number | null;

  /**
   * MaxQuantity
   */
  MaxQuantity?: number | null;

  /**
   * MinQuantity
   */
  MinQuantity?: number | null;

  /**
   * Modelname
   */
  Modelname?: string | null;

  /**
   * ProductFk
   */
  ProductFk?: number | null;

  /**
   * ProvisionConsumed
   */
  ProvisionConsumed?: number | null;

  /**
   * ProvisionPercent
   */
  ProvisionPercent?: number | null;

  /**
   * ProvisionPeruom
   */
  ProvisionPeruom?: number | null;

  /**
   * ProvisionReceipt
   */
  ProvisionReceipt?: number | null;

  /**
   * ProvisionTotal
   */
  ProvisionTotal: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityAvailable
   */
  QuantityAvailable?: number | null;

  /**
   * QuantityConsumed
   */
  QuantityConsumed?: number | null;

  /**
   * QuantityReceipt
   */
  QuantityReceipt?: number | null;

  /**
   * QuantityReserved
   */
  QuantityReserved?: number | null;

  /**
   * Stock2matId
   */
  Stock2matId?: number | null;

  /**
   * StockCode
   */
  StockCode?: string | null;

  /**
   * StockDescription
   */
  StockDescription?: string | null;

  /**
   * StockFk
   */
  StockFk: number;

  /**
   * StructureFk
   */
  StructureFk?: number | null;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalConsumed
   */
  TotalConsumed?: number | null;

  /**
   * TotalReceipt
   */
  TotalReceipt?: number | null;

  /**
   * Uom
   */
  Uom?: string | null;
}
