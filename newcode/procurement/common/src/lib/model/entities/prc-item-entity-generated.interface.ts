/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from '@libs/basics/shared';
import { IPrcItemEntity } from './prc-item-entity.interface';
import { IEntityBase } from '@libs/platform/common';
import { IPrcHeaderEntity } from './prc-header-entity.interface';
import { IPrcItemAssignmentEntity } from './prc-item-assignment-entity.interface';

export interface IPrcItemEntityGenerated extends IEntityBase {

  /**
   * AAN
   */
  AAN?: number | null;

  /**
   * AGN
   */
  AGN?: number | null;

  /**
   * Address
   */
  Address?: AddressEntity | null;

  /**
   * AlternativeQuantity
   */
  AlternativeQuantity?: number | null;

  /**
   * AlternativeUomFk
   */
  AlternativeUomFk?: number | null;

  /**
   * BasAddressFk
   */
  BasAddressFk?: number | null;

  /**
   * BasBlobsSpecificationFk
   */
  BasBlobsSpecificationFk?: number | null;

  /**
   * BasItemType2Fk
   */
  BasItemType2Fk: number;

  /**
   * BasItemType85Fk
   */
  BasItemType85Fk?: number | null;

  /**
   * BasItemTypeFk
   */
  BasItemTypeFk: number;

  /**
   * BasMaterialCurrencyDescription
   */
  BasMaterialCurrencyDescription?: string | null;

  /**
   * BasMaterialPrice
   */
  BasMaterialPrice: number;

  /**
   * BasPaymentTermFiFk
   */
  BasPaymentTermFiFk?: number | null;

  /**
   * BasPaymentTermPaFk
   */
  BasPaymentTermPaFk?: number | null;

  /**
   * BasUomFk
   */
  BasUomFk: number;

  /**
   * BasUomPriceUnitFk
   */
  BasUomPriceUnitFk: number;

  /**
   * Batchno
   */
  Batchno?: string | null;

  /**
   * BlobSpecificationToSave
   */
  // BlobSpecificationToSave?: IBlobStringEntity | null;

  /**
   * BpdAgreementFk
   */
  BpdAgreementFk?: number | null;

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
   * BufferLeadTime
   */
  BufferLeadTime: number;

  /**
   * Charge
   */
  Charge: number;

  /**
   * ChargeOc
   */
  ChargeOc: number;

  /**
   * ChildItems
   */
  ChildItems?: IPrcItemEntity[] | null;

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
   * CommentClient
   */
  CommentClient?: string | null;

  /**
   * CommentContractor
   */
  CommentContractor?: string | null;

  /**
   * ContractGrandQuantity
   */
  ContractGrandQuantity: number;

  /**
   * ControllinggrpsetFk
   */
  ControllinggrpsetFk?: number | null;

  /**
   * DateRequired
   */
  DateRequired?: string | null;

  /**
   * DeliverDateConfirm
   */
  DeliverDateConfirm?: string | null;

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
   * DiscountComment
   */
  DiscountComment?: string | null;

  /**
   * DiscountSplit
   */
  DiscountSplit: number;

  /**
   * DiscountSplitOc
   */
  DiscountSplitOc: number;

  /**
   * ExQtnIsEvaluated
   */
  ExQtnIsEvaluated: boolean;

  /**
   * ExternalCode
   */
  ExternalCode?: string | null;

  /**
   * FactorPriceUnit
   */
  FactorPriceUnit: number;

  /**
   * HasLeadTimeFormula
   */
  HasLeadTimeFormula: boolean;

  /**
   * HasReplacementItem
   */
  HasReplacementItem: boolean;

  /**
   * HasScope
   */
  HasScope: boolean;

  /**
   * Hasdeliveryschedule
   */
  Hasdeliveryschedule: boolean;

  /**
   * Hastext
   */
  Hastext: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * InstanceId
   */
  InstanceId: number;

  /**
   * IsChangePrice
   */
  IsChangePrice: boolean;

  /**
   * IsChangePriceGross
   */
  IsChangePriceGross: boolean;

  /**
   * IsContracted
   */
  IsContracted: boolean;

  /**
   * IsDisabled
   */
  IsDisabled: boolean;

  /**
   * IsFreeQuantity
   */
  IsFreeQuantity: boolean;

  /**
   * IsInputTotal
   */
  IsInputTotal?: boolean | null;

  /**
   * ItemCode
   */
  ItemCode?: string | null;

  /**
   * Itemno
   */
  Itemno: number;

  /**
   * JobFk
   */
  JobFk?: number | null;

  /**
   * LeadTime
   */
  LeadTime: number;

  /**
   * LeadTimeExtra
   */
  LeadTimeExtra: number;

  /**
   * Material2Uoms
   */
  Material2Uoms?: {UomFk: number, Quantity: number}[]| null;

  /**
   * MaterialCatalogCode
   */
  MaterialCatalogCode?: string | null;

  /**
   * MaterialCatalogDescription
   */
  MaterialCatalogDescription?: string | null;

  /**
   * MaterialCatalogSupplier
   */
  MaterialCatalogSupplier?: string | null;

  /**
   * MaterialCatalogTypeFk
   */
  MaterialCatalogTypeFk: number;

  /**
   * MaterialCode
   */
  MaterialCode?: string | null;

  /**
   * MaterialDescription
   */
  MaterialDescription?: string | null;

  /**
   * MaterialExternalCode
   */
  MaterialExternalCode?: string | null;

  /**
   * MaterialStockFk
   */
  MaterialStockFk?: number | null;

  /**
   * MdcControllingunitFk
   */
  MdcControllingunitFk?: number | null;

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
   * MinQuantity
   */
  MinQuantity: number;

  /**
   * NewAddress
   */
  NewAddress?: AddressEntity | null;

  /**
   * NewDateRequired
   */
  NewDateRequired?: string | null;

  /**
   * NotSubmitted
   */
  NotSubmitted: boolean;

  /**
   * Offhire
   */
  Offhire?: string | null;

  /**
   * Onhire
   */
  Onhire?: string | null;

  /**
   * OrderText
   */
  OrderText?: string | null;

  /**
   * ParentId
   */
  ParentId: number;

  /**
   * PlantFk
   */
  PlantFk?: number | null;

  /**
   * PrcHeaderEntity
   */
  PrcHeaderEntity?: IPrcHeaderEntity | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * PrcItemAltFk
   */
  PrcItemAltFk?: number | null;

  /**
   * PrcItemAssignmentEntities
   */
  PrcItemAssignmentEntities?: IPrcItemAssignmentEntity[] | null;

  /**
   * PrcItemDescription
   */
  PrcItemDescription?: string | null;

  /**
   * PrcItemEvaluationFk
   */
  PrcItemEvaluationFk?: number | null;

  /**
   * PrcItemFk
   */
  PrcItemFk?: number | null;

  /**
   * PrcItemIncreaseStep
   */
  PrcItemIncreaseStep?: number | null;

  /**
   * PrcItemstatusFk
   */
  PrcItemstatusFk: number;

  /**
   * PrcPackageFk
   */
  PrcPackageFk?: number | null;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PrcReplacementItemFk
   */
  PrcReplacementItemFk?: number | null;

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
   * PriceUnit
   */
  PriceUnit: number;

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
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityAskedfor
   */
  QuantityAskedfor: number;

  /**
   * QuantityConfirm
   */
  QuantityConfirm: number;

  /**
   * QuantityConverted
   */
  QuantityConverted: number;

  /**
   * QuantityDelivered
   */
  QuantityDelivered: number;

  /**
   * QuantityDeliveredUi
   */
  QuantityDeliveredUi: number;

  /**
   * QuantityRemaining
   */
  QuantityRemaining: number;

  /**
   * QuantityRemainingUi
   */
  QuantityRemainingUi: number;

  /**
   * RemainingQuantityForCallOff
   */
  RemainingQuantityForCallOff: number;

  /**
   * ReplacementItems
   */
  ReplacementItems?: IPrcItemEntity[] | null;

  /**
   * ResRequisitionFk
   */
  ResRequisitionFk?: number | null;

  /**
   * SafetyLeadTime
   */
  SafetyLeadTime: number;

  /**
   * SellUnit
   */
  SellUnit: number;

  /**
   * Specification
   */
  Specification?: string | null;

  /**
   * SupplierText
   */
  SupplierText?: string | null;

  /**
   * Supplierreference
   */
  Supplierreference?: string | null;

  /**
   * TargetPrice
   */
  TargetPrice: number;

  /**
   * TargetTotal
   */
  TargetTotal: number;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalCallOffQuantity
   */
  TotalCallOffQuantity: number;

  /**
   * TotalCurrencyNoDiscount
   */
  TotalCurrencyNoDiscount: number;

  /**
   * TotalGross
   */
  TotalGross: number;

  /**
   * TotalGrossOc
   */
  TotalGrossOc: number;

  /**
   * TotalLeadTime
   */
  TotalLeadTime: number;

  /**
   * TotalNoDiscount
   */
  TotalNoDiscount: number;

  /**
   * TotalOc
   */
  TotalOc: number;

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
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
