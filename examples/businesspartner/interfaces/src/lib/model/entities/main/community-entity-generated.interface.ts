/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICommunityEntityGenerated extends IEntityBase {

  /**
   * BidderFk
   */
  BidderFk: number;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk: number;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * Percentage
   */
  Percentage?: number | null;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk: number;
}
