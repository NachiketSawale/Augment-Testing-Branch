/*
 * Copyright(c) RIB Software GmbH
 */


import { IEntityBase } from '@libs/platform/common';
import { IPrcMilestonetypeEntity } from './prc-milestonetype-entity.interface';

export interface IPrcMilestoneEntityGenerated extends IEntityBase {

  /**
   * Amount
   */
  Amount?: number | null;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LedgerContextFk
   */
  LedgerContextFk?: number | null;

  /**
   * MdcTaxCodeFk
   */
  MdcTaxCodeFk?: number | null;

  /**
   * Milestone
   */
  Milestone?: string | null;

  /**
   * PrcHeaderFk
   */
  PrcHeaderFk: number;

  /**
   * PrcMilestonetypeEntity
   */
  PrcMilestonetypeEntity?: IPrcMilestonetypeEntity | null;

  /**
   * PrcMilestonetypeFk
   */
  PrcMilestonetypeFk: number;
}
