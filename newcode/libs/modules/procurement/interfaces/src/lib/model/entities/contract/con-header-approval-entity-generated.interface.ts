/*
 * Copyright(c) RIB Software GmbH
 */

import { IConHeaderEntity } from './con-header-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface IConHeaderApprovalEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * ClerkRoleFk
   */
  ClerkRoleFk?: number | null;

  /**
   * Comment
   */
  Comment?: string | null;

  /**
   * DueDate
   */
  DueDate?: string | null;

  /**
   * EvaluatedOn
   */
  EvaluatedOn?: string | null;

  /**
   * EvaluationLevel
   */
  EvaluationLevel?: number | null;

  /**
   * HeaderEntity
   */
  HeaderEntity?: IConHeaderEntity | null;

  /**
   * HeaderFk
   */
  HeaderFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * IsApproved
   */
  IsApproved: boolean;

  /**
   * isFinalApproval
   */
  isFinalApproval: boolean;

  /**
   * isFinalReject
   */
  isFinalReject: boolean;
}
