/*
 * Copyright(c) RIB Software GmbH
 */

import { IEntityBase } from '@libs/platform/common';

export interface ICosJob2InstanceEntityGenerated extends IEntityBase {

  /**
   * CosInstanceFk
   */
  CosInstanceFk: number;

  /**
   * CosJobFk
   */
  CosJobFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * InstanceHeaderFk
   */
  InstanceHeaderFk: number;

  /**
   * JobState
   */
  JobState: number;

  /**
   * Log
   */
  Log?: string | null;

  /**
   * Progress
   */
  Progress?: number | null;
}
