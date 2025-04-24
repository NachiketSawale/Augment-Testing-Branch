/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcStructureAccountEntityGenerated extends IEntityBase {

  /**
   * Account
   */
  Account: string;

  /**
   * BasAccountFk
   */
  BasAccountFk?: number | null;

  /**
   * BasAccountOffsetFk
   */
  BasAccountOffsetFk?: number | null;

  /**
   * BasControllingCatFk
   */
  BasControllingCatFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LedgerContextFk
   */
  LedgerContextFk: number;

  /**
   * OffsetAccount
   */
  OffsetAccount: string;

  /**
   * PrcAccountTypeFk
   */
  PrcAccountTypeFk: number;

  /**
   * PrcStructureFk
   */
  PrcStructureFk: number;

  /**
   * TaxCodeFk
   */
  TaxCodeFk?: number | null;
}
