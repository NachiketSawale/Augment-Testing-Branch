/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosJobEntity } from './cos-job-entity.interface';

export interface IApplyResponseEntityGenerated {

  /**
   * CosJob
   */
  CosJob?: ICosJobEntity | null;

  /**
   * InstanceIds
   */
  InstanceIds?: number[] | null;

  /**
   * SplitInstanceIds
   */
  SplitInstanceIds?: number[] | null;
}
