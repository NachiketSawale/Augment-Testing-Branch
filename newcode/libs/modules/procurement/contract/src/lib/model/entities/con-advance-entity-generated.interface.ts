/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IConAdvanceEntityGenerated extends IEntityBase {

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
   * CommentText
   */
  CommentText?: string | null;

  /**
   * ConHeaderFk
   */
  ConHeaderFk: number;

  /**
   * DateDone
   */
  DateDone?: string | null;

  /**
   * DateDue
   */
  DateDue: string;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * PaymentTermFk
   */
  PaymentTermFk?: number | null;

  /**
   * PercentProrata
   */
  PercentProrata: number;

  /**
   * PrcAdvanceTypeFk
   */
  PrcAdvanceTypeFk: number;

  /**
   * Userdefined1
   */
  Userdefined1?: string | null;

  /**
   * Userdefined2
   */
  Userdefined2?: string | null;

  /**
   * Userdefined3
   */
  Userdefined3?: string | null;

  /**
   * Userdefined4
   */
  Userdefined4?: string | null;

  /**
   * Userdefined5
   */
  Userdefined5?: string | null;
}
