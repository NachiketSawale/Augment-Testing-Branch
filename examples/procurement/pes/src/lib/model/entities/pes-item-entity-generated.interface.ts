/*
 * Copyright(c) RIB Software GmbH
 */

import { IBlobStringEntity } from '@libs/basics/shared';
import { IPesItemPriceConditionEntity } from './pes-item-price-condition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IPesItemEntityGenerated extends IEntityBase {

  /**
   * AlternativeQuantity
   */
  AlternativeQuantity?: number | null;

  /**
   * AlternativeUomFk
   */
  AlternativeUomFk?: number | null;

  /**
   * BasBlobsSpecificationFk
   */
  BasBlobsSpecificationFk?: number | null;

  /**
   * BatchNo
   */
  BatchNo?: string | null;

  /**
   * BlobSpecificationToSave
   */
  BlobSpecificationToSave?: IBlobStringEntity | null;

  /**
   * BudgetFixedTotal
   */
  BudgetFixedTotal: boolean;

  /**
   * BudgetFixedUnit
   */
  BudgetFixedUnit: boolean;

  /**
   * BudgetPerUnit
   */
  BudgetPerUnit: number;

  /**
   * BudgetTotal
   */
  BudgetTotal: number;

  /**
   * Co2Project
   */
  Co2Project?: number | null;

  /**
   * Co2ProjectTotal
   */
  Co2ProjectTotal?: number | null;

  /**
   * Co2Source
   */
  Co2Source?: number | null;

  /**
   * Co2SourceTotal
   */
  Co2SourceTotal?: number | null;

  /**
   * ConHeaderExchangeRate
   */
  ConHeaderExchangeRate: number;

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * ConVatPercent
   */
  ConVatPercent: number;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * ControllinggrpsetFk
   */
  ControllinggrpsetFk?: number | null;

  /**
   * Description1
   */
  Description1?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * Discount
   */
  Discount: number;

  /**
   * DiscountAbsolute
   */
  DiscountAbsolute: number;

  /**
   * DiscountAbsoluteGross
   */
  DiscountAbsoluteGross: number;

  /**
   * DiscountAbsoluteGrossOc
   */
  DiscountAbsoluteGrossOc: number;

  /**
   * DiscountAbsoluteOc
   */
  DiscountAbsoluteOc: number;

  /**
   * DiscountSplit
   */
  DiscountSplit: number;

  /**
   * DiscountSplitOc
   */
  DiscountSplitOc: number;

  /**
   * ExpirationDate
   */
  ExpirationDate?: string | null;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * FixedAssetFk
   */
  FixedAssetFk?: number | null;

  /**
   * HasDuplicatedContractedPesItem
   */
  HasDuplicatedContractedPesItem: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * InstanceId
   */
  InstanceId: number;

  /**
   * IsAssetManagement
   */
  IsAssetManagement: boolean;

  /**
   * IsChangePrice
   */
  IsChangePrice: boolean;

  /**
   * IsChangePriceGross
   */
  IsChangePriceGross: boolean;

  /**
   * IsChangePriceGrossOc
   */
  IsChangePriceGrossOc: boolean;

  /**
   * IsChangePriceOc
   */
  IsChangePriceOc: boolean;

  /**
   * IsFinalDelivery
   */
  IsFinalDelivery: boolean;

  /**
   * ItemNo
   */
  ItemNo: number;

  /**
   * LotNo
   */
  LotNo?: string | null;

  /**
   * Material2Uoms
   */
  // Material2Uoms?: IMaterial2UomItems[] | null;

  Material2Uoms?: {UomFk: number, Quantity: number}[] | null;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialExternalCode
   */
  MaterialExternalCode?: string | null;

  /**
   * MaterialStockFk
   */
  MaterialStockFk?: number | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcSalesTaxGroupFk
   */
  MdcSalesTaxGroupFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * PercentageQuantity
   */
  PercentageQuantity: number;

  /**
   * PesHeaderFk
   */
  PesHeaderFk: number;

  /**
   * PesItempriceconditionEntities
   */
  PesItempriceconditionEntities?: IPesItemPriceConditionEntity[] | null;

  /**
   * PlantFk
   */
  PlantFk: number;

  /**
   * PlantTypeFk
   */
  PlantTypeFk: number;

  /**
   * PrcItemDescription1
   */
  PrcItemDescription1?: string | null;

  /**
   * PrcItemDescription2
   */
  PrcItemDescription2?: string | null;

  /**
   * PrcItemDiscountSplit
   */
  PrcItemDiscountSplit: number;

  /**
   * PrcItemDiscountSplitOc
   */
  PrcItemDiscountSplitOc: number;

  /**
   * PrcItemFactorPriceUnit
   */
  PrcItemFactorPriceUnit: number;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * PrcItemQuantity
   */
  PrcItemQuantity: number;

  /**
   * PrcItemSpecification
   */
  PrcItemSpecification?: string | null;

  /**
   * PrcItemStatusFk
   */
  PrcItemStatusFk?: number | null;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PrcStockTransactionFk
   */
  PrcStockTransactionFk?: number | null;

  /**
   * PrcStockTransactionTypeDefaultFk
   */
  PrcStockTransactionTypeDefaultFk?: number | null;

  /**
   * PrcStockTransactionTypeFk
   */
  PrcStockTransactionTypeFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk?: number | null;

  /**
   * Price
   */
  Price: number;

  /**
   * PriceExtra
   */
  PriceExtra: number;

  /**
   * PriceExtraOc
   */
  PriceExtraOc: number;

  /**
   * PriceGross
   */
  PriceGross: number;

  /**
   * PriceGrossOc
   */
  PriceGrossOc: number;

  /**
   * PriceOc
   */
  PriceOc: number;

  /**
   * PrjChangeFk
   */
  PrjChangeFk?: number | null;

  /**
   * PrjChangeStatusFk
   */
  PrjChangeStatusFk?: number | null;

  /**
   * PrjStockFk
   */
  PrjStockFk?: number | null;

  /**
   * PrjStockLocationFk
   */
  PrjStockLocationFk?: number | null;

  /**
   * ProjectFk
   */
  ProjectFk?: number | null;

  /**
   * ProvisionPercent
   */
  ProvisionPercent: number;

  /**
   * ProvisonTotal
   */
  ProvisonTotal: number;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityAskedFor
   */
  QuantityAskedFor: number;

  /**
   * QuantityContracted
   */
  QuantityContracted: number;

  /**
   * QuantityContractedAccepted
   */
  QuantityContractedAccepted: number;

  /**
   * QuantityContractedConverted
   */
  QuantityContractedConverted: number;

  /**
   * QuantityConverted
   */
  QuantityConverted: number;

  /**
   * QuantityDelivered
   */
  QuantityDelivered: number;

  /**
   * QuantityDeliveredConverted
   */
  QuantityDeliveredConverted: number;

  /**
   * QuantityRemaining
   */
  QuantityRemaining: number;

  /**
   * QuantityRemainingConverted
   */
  QuantityRemainingConverted: number;

  /**
   * StandardCost
   */
  StandardCost: number;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalDelivered
   */
  TotalDelivered: number;

  /**
   * TotalGross
   */
  TotalGross: number;

  /**
   * TotalGrossOc
   */
  TotalGrossOc: number;

  /**
   * TotalOc
   */
  TotalOc: number;

  /**
   * TotalOcDelivered
   */
  TotalOcDelivered: number;

  /**
   * TotalPrice
   */
  TotalPrice: number;

  /**
   * TotalPriceGross
   */
  TotalPriceGross: number;

  /**
   * TotalPriceGrossOc
   */
  TotalPriceGrossOc: number;

  /**
   * TotalPriceOc
   */
  TotalPriceOc: number;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;

  /**
   * Vat
   */
  Vat: number;

  /**
   * VatOC
   */
  VatOC: number;

	/**
	 * InvoiceQuantity
	 */
	InvoiceQuantity:number;
	/**
	 * CumulativeInvoicedQuantity
	 */
	CumulativeInvoicedQuantity:number;
}
