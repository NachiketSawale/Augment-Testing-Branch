/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IBillingSchemaEntityGenerated extends IEntityBase {

  /**
   * AutoCorrectNetLimit
   */
  AutoCorrectNetLimit: number;

  /**
   * AutoCorrectVatLimit
   */
  AutoCorrectVatLimit: number;

  /**
   * BilStatusErrorFk
   */
  BilStatusErrorFk?: number | null;

  /**
   * BilStatusOkFk
   */
  BilStatusOkFk?: number | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvStatusErrorFk
   */
  InvStatusErrorFk?: number | null;

  /**
   * InvStatusOkFk
   */
  InvStatusOkFk?: number | null;

  /**
   * IsChained
   */
  IsChained: boolean;

  /**
   * IsChainedPes
   */
  IsChainedPes: boolean;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * LedgerContextFk
   */
  LedgerContextFk: number;

  /**
   * Remark
   */
  Remark?: string | null;

  /**
   * Sorting
   */
  Sorting: number;

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
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;
}
