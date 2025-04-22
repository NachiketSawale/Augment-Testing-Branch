/*
 * Copyright(c) RIB Software GmbH
 */

import { IOrdAdvanceStatusEntity } from './ord-advance-status-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IOrdAdvanceEntityGenerated extends IEntityBase {

  /**
   * AmountDone
   */
  AmountDone: number;

  /**
   * AmountDoneOc
   */
  AmountDoneOc: number;

  /**
   * AmountDue
   */
  AmountDue: number;

  /**
   * AmountDueOc
   */
  AmountDueOc: number;

  /**
   * BilHeaderFk
   */
  BilHeaderFk?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DateDone
   */
  DateDone?: Date | string | null;

  /**
   * DateDue
   */
  DateDue: Date | string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * OrdAdvanceStatusEntity
   */
  OrdAdvanceStatusEntity?: IOrdAdvanceStatusEntity | null;

  /**
   * OrdAdvanceStatusFk
   */
  OrdAdvanceStatusFk?: number | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk: number;

  /**
   * PaymentTermFk
   */
  PaymentTermFk?: number | null;

  /**
   * ReductionRule
   */
  ReductionRule: number;

  /**
   * ReductionValue
   */
  ReductionValue: number;

  /**
   * SlsAdvanceTypeFk
   */
  SlsAdvanceTypeFk: number;

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
