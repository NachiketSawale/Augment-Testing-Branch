/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosJob2FrmJobEntity } from './cos-job-2-frm-job-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosJobEntityGenerated extends IEntityBase {

  /**
   * CosInsHeaderFk
   */
  CosInsHeaderFk: number;

  /**
   * CosJob2FrmJobEntities
   */
  CosJob2FrmJobEntities?: ICosJob2FrmJobEntity[] | null;

  /**
   * Description
   */
  Description?: string | null;

  /**
   * EndTime
   */
  EndTime?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * JobState
   */
  JobState: number;

  /**
   * LoggingMessage
   */
  LoggingMessage?: string | null;

  /**
   * ProgressMessage
   */
  ProgressMessage?: string | null;

  /**
   * StartTime
   */
  StartTime?: string | null;
}
