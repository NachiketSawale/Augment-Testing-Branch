/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IPriceConditionItemEntityGenerated extends IEntityBase {

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Percentage01
   */
  Percentage01: number;

  /**
   * Percentage02
   */
  Percentage02: number;

  /**
   * Percentage03
   */
  Percentage03: number;

  /**
   * Percentage04
   */
  Percentage04: number;

  /**
   * Percentage05
   */
  Percentage05: number;

  /**
   * Percentage06
   */
  Percentage06: number;

  /**
   * PriceConditionFk
   */
  PriceConditionFk: number;

  /**
   * PricingGroupFk
   */
  PricingGroupFk: number;

  /**
   * ValidFrom
   */
  ValidFrom?: string | null;

  /**
   * ValidTo
   */
  ValidTo?: string | null;

  /**
   * WorkOperationTypeFk
   */
  WorkOperationTypeFk: number;
}
