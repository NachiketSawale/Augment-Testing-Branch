/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMdcSalesTaxCodeEntityGenerated extends IEntityBase {

  /**
   * CalculationOrder
   */
  CalculationOrder: number;

  /**
   * Code
   */
  Code: string;

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
   * LedgerContextFk
   */
  LedgerContextFk: number;

  /**
   * Reference
   */
  Reference?: string | null;

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
