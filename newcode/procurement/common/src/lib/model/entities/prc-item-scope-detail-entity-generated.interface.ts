/*
 * Copyright(c) RIB Software GmbH
 */

import { AddressEntity } from '@libs/basics/shared';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcItemScopeDetailEntityGenerated extends IEntityBase {

  /**
   * Address
   */
  Address?: AddressEntity | null;

  /**
   * AddressFk
   */
  AddressFk?: number | null;

  /**
   * Batchno
   */
  Batchno?: string | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DateRequired
   */
  DateRequired?: string | null;

  /**
   * Description1Info
   */
  Description1Info?: IDescriptionInfo | null;

  /**
   * Description2Info
   */
  Description2Info?: IDescriptionInfo | null;

  /**
   * FactorPriceUnit
   */
  FactorPriceUnit: number;

  /**
   * HasText
   */
  HasText: boolean;

  /**
   * Id
   */
  Id: number;

  /**
   * ItemNo
   */
  ItemNo: number;

  /**
   * MaterialFk
   */
  MaterialFk?: number | null;

  /**
   * PaymentTermFiFk
   */
  PaymentTermFiFk?: number | null;

  /**
   * PaymentTermPaFk
   */
  PaymentTermPaFk?: number | null;

  /**
   * PrcIncotermFk
   */
  PrcIncotermFk?: number | null;

  /**
   * PrcItemScopeFk
   */
  PrcItemScopeFk: number;

  /**
   * PrcPriceConditionFk
   */
  PrcPriceConditionFk?: number | null;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

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
   * PriceOc
   */
  PriceOc: number;

  /**
   * PriceUnit
   */
  PriceUnit: number;

  /**
   * PrjCostGroup1Fk
   */
  PrjCostGroup1Fk?: number | null;

  /**
   * PrjCostGroup2Fk
   */
  PrjCostGroup2Fk?: number | null;

  /**
   * PrjCostGroup3Fk
   */
  PrjCostGroup3Fk?: number | null;

  /**
   * PrjCostGroup4Fk
   */
  PrjCostGroup4Fk?: number | null;

  /**
   * PrjCostGroup5Fk
   */
  PrjCostGroup5Fk?: number | null;

  /**
   * Quantity
   */
  Quantity: number;

  /**
   * QuantityAskedFor
   */
  QuantityAskedFor: number;

  /**
   * QuantityDelivered
   */
  QuantityDelivered: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * ScopeOfSupplyTypeFk
   */
  ScopeOfSupplyTypeFk: number;

  /**
   * SpecificationInfo
   */
  SpecificationInfo?: IDescriptionInfo | null;

  /**
   * SupplierReference
   */
  SupplierReference?: string | null;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalCurrency
   */
  TotalCurrency: number;

  /**
   * Trademark
   */
  Trademark?: string | null;

  /**
   * UomFk
   */
  UomFk: number;

  /**
   * UomPriceUnitFk
   */
  UomPriceUnitFk?: number | null;

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
}
