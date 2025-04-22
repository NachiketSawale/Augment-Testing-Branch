/*
 * Copyright(c) RIB Software GmbH
 */
import { IEntityBase } from '@libs/platform/common';
import { IPrcInventoryHeaderEntity } from './prc-inventory-header-entity.interface';
export interface IPrcInventoryEntityGenerated extends IEntityBase {
/*
 * ActualProvisionTotal
 */
  ActualProvisionTotal?: number | null;
/*
 * ActualQuantity
 */
  ActualQuantity?: number | null;
/*
 * ActualTotal
 */
  ActualTotal?: number | null;
/*
 * BasUomFk
 */
  BasUomFk: number;
/*
 * CatalogFk
 */
  CatalogFk?: number | null;
/*
 * ClerkFk1
 */
  ClerkFk1?: number | null;
/*
 * ClerkFk2
 */
  ClerkFk2?: number | null;
/*
 * DifferenceClerkQuantity
 */
  DifferenceClerkQuantity?: number | null;
/*
 * ExpirationDate
 */
  ExpirationDate?: string | null;
/*
 * Id
 */
  Id: number;
/*
 * IsCounted
 */
  IsCounted: boolean;
/*
 * IsFromExistStock
 */
  IsFromExistStock?: boolean | null;
/*
 * LotNo
 */
  LotNo?: string | null;
/*
 * Material2Uoms
 */
  // Material2Uoms?: IMaterial2UomItems[] | null;
/*
 * MdcMaterialFk
 */
  MdcMaterialFk: number;
/*
 * PpsProductFk
 */
  PpsProductFk?: number | null;
/*
 * PrcInventoryHeaderEntity
 */
  PrcInventoryHeaderEntity?: IPrcInventoryHeaderEntity | null;
/*
 * PrcInventoryHeaderFk
 */
  PrcInventoryHeaderFk: number;
/*
 * PrcStocktransactiontypeFk
 */
  PrcStocktransactiontypeFk: number;
/*
 * Price
 */
  Price: number;
/*
 * PrjStockLocationFk
 */
  PrjStockLocationFk?: number | null;
/*
 * ProductCode
 */
  ProductCode?: string | null;
/*
 * ProductDescription
 */
  ProductDescription?: string | null;
/*
 * ProvisionDifference
 */
  ProvisionDifference?: number | null;
/*
 * Quantity1
 */
  Quantity1?: number | null;
/*
 * Quantity2
 */
  Quantity2?: number | null;
/*
 * QuantityDifference
 */
  QuantityDifference?: number | null;
/*
 * RecordedQuantity
 */
  RecordedQuantity?: number | null;
/*
 * RecordedUomFk
 */
  RecordedUomFk?: number | null;
/*
 * Status
 */
  Status?: string | null;
/*
 * StockProvisionTotal
 */
  StockProvisionTotal?: number | null;
/*
 * StockQuantity
 */
  StockQuantity?: number | null;
/*
 * StockTotal
 */
  StockTotal?: number | null;
/*
 * TotalDifference
 */
  TotalDifference?: number | null;
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

