/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcPaymentScheduleEntityGenerated extends IEntityBase {

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
   * BasPaymentTermFk
   */
  BasPaymentTermFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DatePayment
   */
  DatePayment?: string | null;

  /**
   * DateRequest
   */
  DateRequest: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * InvTypeFk
   */
  InvTypeFk?: number | null;

  /**
   * IsDone
   */
  IsDone: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsTotal
   */
  IsTotal: boolean;

  /**
   * MeasuredPerformance
   */
  MeasuredPerformance: number;

  /**
   * PaymentVersion
   */
  PaymentVersion?: string | null;

  /**
   * PercentOfContract
   */
  PercentOfContract: number;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcPsStatusFk
   */
  PrcPsStatusFk: number;

  /**
   * PsdActivityFk
   */
  PsdActivityFk?: number | null;

  /**
   * PsdScheduleFk
   */
  PsdScheduleFk?: number | null;

  /**
   * Remaining
   */
  Remaining: number;

  /**
   * RemainingOc
   */
  RemainingOc: number;

  /**
   * Sorting
   */
  Sorting: number;
}
