/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IOrdMandatoryDeadlineEntityGenerated extends IEntityBase {

  /**
   * BidHeaderFk
   */
  BidHeaderFk?: number | null;

  /**
   * End
   */
  End?: Date | string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IndividualPerformance
   */
  IndividualPerformance?: string | null;

  /**
   * OrdHeaderFk
   */
  OrdHeaderFk?: number | null;

  /**
   * Start
   */
  Start?: Date | string | null;
}
