/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcItemScopeEntityGenerated extends IEntityBase {

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * BusinessPartnerProdFk
   */
  BusinessPartnerProdFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsSelected
   */
  IsSelected: boolean;

  /**
   * MatScope
   */
  MatScope: number;

  /**
   * PrcItemFk
   */
  PrcItemFk: number;

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
   * Remark
   */
  Remark?: string | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * SubsidiaryProdFk
   */
  SubsidiaryProdFk?: number | null;

  /**
   * SupplierFk
   */
  SupplierFk?: number | null;

  /**
   * SupplierProdFk
   */
  SupplierProdFk?: number | null;

  /**
   * Total
   */
  Total: number;

  /**
   * TotalCurrency
   */
  TotalCurrency: number;

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
