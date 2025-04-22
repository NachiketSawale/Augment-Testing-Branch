/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdPaymentScheduleEntity } from './ord-payment-schedule-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IOrdPaymentScheduleEntityGenerated extends IEntityBase {

  /**
   * ActualAmountGross
   */
  ActualAmountGross?: number | null;

  /**
   * ActualAmountGrossOc
   */
  ActualAmountGrossOc?: number | null;

  /**
   * ActualAmountNet
   */
  ActualAmountNet?: number | null;

  /**
   * ActualAmountNetOc
   */
  ActualAmountNetOc?: number | null;

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
   * BilAmountGross
   */
  BilAmountGross?: number | null;

  /**
   * BilAmountGrossOc
   */
  BilAmountGrossOc?: number | null;

  /**
   * BilAmountNet
   */
  BilAmountNet?: number | null;

  /**
   * BilAmountNetOc
   */
  BilAmountNetOc?: number | null;

  /**
   * BilHeaderFk
   */
  BilHeaderFk?: number | null;

  /**
   * BilTypeFk
   */
  BilTypeFk?: number | null;

  /**
   * ChildItems
   */
  ChildItems?: IOrdPaymentScheduleEntity[] | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ControllingUnitFk
   */
  ControllingUnitFk?: number | null;

  /**
   * DatePayment
   */
  DatePayment?: Date | string | null;

  /**
   * DateRequest
   */
  DateRequest: Date | string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDone
   */
  IsDone: boolean;

  /**
   * IsFinal
   */
  IsFinal: boolean;

  /**
   * IsLive
   */
  IsLive: boolean;

  /**
   * IsStructure
   */
  IsStructure: boolean;

  /**
   * IsTotal
   */
  IsTotal: boolean;

  /**
   * MeasuredPerformance
   */
  MeasuredPerformance: number;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;

  /**
   * OrdPsStatusFk
   */
  OrdPsStatusFk: number;

  /**
   * OrdPsStatusIsReadonly
   */
  OrdPsStatusIsReadonly?: boolean | null;

  /**
   * PaymentBalanceGross
   */
  PaymentBalanceGross?: number | null;

  /**
   * PaymentBalanceNet
   */
  PaymentBalanceNet?: number | null;

  /**
   * PaymentDifferenceGross
   */
  PaymentDifferenceGross?: number | null;

  /**
   * PaymentDifferenceGrossOc
   */
  PaymentDifferenceGrossOc?: number | null;

  /**
   * PaymentScheduleFk
   */
  PaymentScheduleFk?: number | null;

  /**
   * PaymentVersion
   */
  PaymentVersion?: string | null;

  /**
   * PercentOfContract
   */
  PercentOfContract: number;

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

  /**
   * TotalPayment
   */
  TotalPayment?: number | null;

  /**
   * TotalPaymentOc
   */
  TotalPaymentOc?: number | null;

  /**
   * TotalPercent
   */
  TotalPercent?: number | null;
}
