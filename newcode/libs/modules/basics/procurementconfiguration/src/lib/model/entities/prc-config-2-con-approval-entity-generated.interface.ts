/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcConfig2ConApprovalEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount: number;

  /**
   * ClerkRoleFk
   */
  ClerkRoleFk?: number | null;

  /**
   * EvaluationLevel
   */
  EvaluationLevel: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsCommentApproved
   */
  IsCommentApproved: boolean;

  /**
   * IsCommentReject
   */
  IsCommentReject: boolean;

  /**
   * IsMail
   */
  IsMail: boolean;

  /**
   * Period
   */
  Period: number;

  /**
   * PrcConfigurationFk
   */
  PrcConfigurationFk: number;

  /**
   * ReferneceDateType
   */
  ReferneceDateType: number;
}
