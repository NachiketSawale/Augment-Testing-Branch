/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface IPrcMandatoryDeadlineEntityGenerated extends IEntityBase {

  /**
   * ConHeaderFk
   */
  ConHeaderFk?: number | null;

  /**
   * End
   */
  End?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IndividualPerformance
   */
  IndividualPerformance?: string | null;

  /**
   * QtnHeaderFk
   */
  QtnHeaderFk?: number | null;

  /**
   * Start
   */
  Start?: string | null;
}
