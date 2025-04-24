/*
 * Copyright(c) RIB Software GmbH
 */

import { IBilHeaderEntity } from './bil-header-entity.interface';
import { IItemPriceConditionEntity } from './item-price-condition-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IItemEntityGenerated extends IEntityBase {

  /**
   * AmountGross
   */
  AmountGross: number;

  /**
   * AmountGrossOc
   */
  AmountGrossOc: number;

  /**
   * AmountNet
   */
  AmountNet: number;

  /**
   * AmountNetOc
   */
  AmountNetOc: number;

  /**
   * AmountVat
   */
  AmountVat: number;

  /**
   * BasBlobsSpecificationFk
   */
  BasBlobsSpecificationFk?: number | null;

  /**
   * BilHeaderEntity
   */
  BilHeaderEntity?: IBilHeaderEntity | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk: number;

  /**
   * BlobSpecificationToSave
   */
  //BlobSpecificationToSave?: IBlobStringEntity | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * CostCodeFk
   */
  CostCodeFk?: number | null;

  /**
   * CostPrice
   */
  CostPrice: number;

  /**
   * CostPriceOc
   */
  CostPriceOc: number;

  /**
   * Description1
   */
  Description1?: string | null;

  /**
   * Description2
   */
  Description2?: string | null;

  /**
   * ICInvHeaderCode
   */
  ICInvHeaderCode?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvTransactionIcFk
   */
  InvTransactionIcFk?: number | null;

  /**
   * ItemNo
   */
  ItemNo: number;

  /**
   * ItempriceconditionEntities
   */
  ItempriceconditionEntities?: IItemPriceConditionEntity[] | null;

  /**
   * MdcMaterialFk
   */
  MdcMaterialFk?: number | null;

  /**
   * MdcSalesTaxGroupFk
   */
  MdcSalesTaxGroupFk?: number | null;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

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
   * Quantity
   */
  Quantity: number;

  /**
   * Specification
   */
  Specification?: string | null;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;

  /**
   * Total
   */
  Total: number;

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
}
