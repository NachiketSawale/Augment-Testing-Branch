/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';
import { IAddressEntity } from '@libs/ui/map';

export interface IPrjStockOrderProposalEntityGenerated extends IEntityBase {

/*
 * BasBlobsFk
 */
  BasBlobsFk?: number | null;

/*
 * BasClerkPrcFk
 */
  BasClerkPrcFk?: number | null;

/*
 * BasClerkReqFk
 */
  BasClerkReqFk?: number | null;

/*
 * BpdBusinessPartnerFk
 */
  BpdBusinessPartnerFk: number;

/*
 * BpdContactFk
 */
  BpdContactFk?: number | null;

/*
 * BpdSubsidiaryFk
 */
  BpdSubsidiaryFk?: number | null;

/*
 * BpdSupplierFk
 */
  BpdSupplierFk?: number | null;

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
 * DeliveryAddress
 */
  DeliveryAddress?: IAddressEntity | null;

/*
 * DeliveryAddressFk
 */
  DeliveryAddressFk?: number | null;

/*
 * Description
 */
  Description?: string | null;

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
  ExpenseConsumed?: number | null;

/*
 * ExpenseTotal
 */
  ExpenseTotal?: number | null;

/*
 * Expenses
 */
  Expenses?: number | null;

/*
 * Id
 */
  Id?: number | null;

/*
 * IsLive
 */
  IsLive: boolean;

/*
 * Islotmanagement
 */
  Islotmanagement?: boolean | null;

/*
 * LastTransactionDays
 */
  LastTransactionDays?: string | null;

/*
 * LeadTime
 */
  LeadTime: number;

/*
 * Log
 */
  Log?: string | null;

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
  MdcMaterialFk?: number | null;

/*
 * MinQuantity
 */
  MinQuantity?: number | null;

/*
 * OrderProposalStatus
 */
  OrderProposalStatus?: number | null;

/*
 * PendingQuantity
 */
  PendingQuantity?: number | null;

/*
 * PrcConfigurationFk
 */
  PrcConfigurationFk?: number | null;

/*
 * PrcConfigurationReqFk
 */
  PrcConfigurationReqFk?: number | null;

/*
 * PrcItemFk
 */
  PrcItemFk?: number | null;

/*
 * PrcPackageFk
 */
  PrcPackageFk?: number | null;

/*
 * PrcStructureFk
 */
  PrcStructureFk?: number | null;

/*
 * PrjStock2MdcMaterialFk
 */
  PrjStock2MdcMaterialFk?: number | null;

/*
 * PrjStockFk
 */
  PrjStockFk?: number | null;

/*
 * ProjectFk
 */
  ProjectFk?: number | null;

/*
 * ProposedQuantity
 */
  ProposedQuantity?: number | null;

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
  ProvisionTotal?: number | null;

/*
 * Quantity
 */
  Quantity?: number | null;

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
 * StockDeliveryAddress
 */
  StockDeliveryAddress?: IAddressEntity | null;

/*
 * Tolerance
 */
  Tolerance: number;

/*
 * Total
 */
  Total?: number | null;

/*
 * TotalConsumed
 */
  TotalConsumed?: number | null;

/*
 * TotalProvision
 */
  TotalProvision?: number | null;

/*
 * TotalQuantity
 */
  TotalQuantity?: number | null;

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
  TotalValue?: number | null;

/*
 * Uom
 */
  Uom?: string | null;
}
