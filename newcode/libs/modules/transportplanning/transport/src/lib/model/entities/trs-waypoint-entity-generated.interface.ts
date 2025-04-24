/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ITrsWaypointEntityGenerated extends IEntityBase {

  /**
   * ActualDistance
   */
  ActualDistance?: number | null;

  /**
   * ActualEnd
   */
  ActualEnd?: string | null;

  /**
   * ActualTime
   */
  ActualTime?: string | null;

  /**
   * Address
   */
  //Address?: IAddressEntity | null;

  /**
   * BusinessPartnerFk
   */
  BusinessPartnerFk?: number | null;

  /**
   * Code
   */
  Code: string;

  /**
   * CommentText
   */
  CommentText?: string | null;

  /**
   * CurrencyFk
   */
  CurrencyFk?: number | null;

  /**
   * CustomerFk
   */
  CustomerFk?: number | null;

  /**
   * DeliveryAddressContactFk
   */
  DeliveryAddressContactFk?: number | null;

  /**
   * Distance
   */
  Distance?: number | null;

  /**
   * EarliestFinish
   */
  EarliestFinish?: string | null;

  /**
   * EarliestStart
   */
  EarliestStart?: string | null;

  /**
   * Expenses
   */
  Expenses?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefaultDst
   */
  IsDefaultDst?: boolean | null;

  /**
   * IsDefaultSrc
   */
  IsDefaultSrc?: boolean | null;

  /**
   * LatestFinish
   */
  LatestFinish?: string | null;

  /**
   * LatestStart
   */
  LatestStart?: string | null;

  /**
   * LgmJobFk
   */
  LgmJobFk: number;

  /**
   * PlannedFinish
   */
  PlannedFinish?: string | null;

  /**
   * PlannedTime
   */
  PlannedTime?: string | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SubsidiaryFk
   */
  SubsidiaryFk?: number | null;

  /**
   * TrsRouteFk
   */
  TrsRouteFk: number;

  /**
   * UomFk
   */
  UomFk?: number | null;
}
