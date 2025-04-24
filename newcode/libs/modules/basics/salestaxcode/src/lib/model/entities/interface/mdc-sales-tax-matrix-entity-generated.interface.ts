/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';

export interface IMdcSalesTaxMatrixEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * Reference
   */
  Reference?: string | null;

  /**
   * SalesTaxCodeFk
   */
  SalesTaxCodeFk: number;

  /**
   * SalesTaxGroupFk
   */
  SalesTaxGroupFk: number;

  /**
   * TaxPercent
   */
  TaxPercent: number;

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
}
