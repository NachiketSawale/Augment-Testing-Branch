/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPrcConfigHeaderEntityGenerated extends IEntityBase {

  /**
   * AutoCreateBoq
   */
  AutoCreateBoq: boolean;

  /**
   * BasConfigurationTypeFk
   */
  BasConfigurationTypeFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsChangeFromMainContract
   */
  IsChangeFromMainContract: boolean;

  /**
   * IsConsolidateChange
   */
  IsConsolidateChange: boolean;

  /**
   * IsConsolidatedTransaction
   */
  IsConsolidatedTransaction: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * IsFreeItemsAllowed
   */
  IsFreeItemsAllowed: boolean;

  /**
   * IsInheritUserDefined
   */
  IsInheritUserDefined: boolean;

  /**
   * PrcConfigHeaderTypeFk
   */
  PrcConfigHeaderTypeFk?: number | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * TransactionItemInc
   */
  TransactionItemInc: number;
}
