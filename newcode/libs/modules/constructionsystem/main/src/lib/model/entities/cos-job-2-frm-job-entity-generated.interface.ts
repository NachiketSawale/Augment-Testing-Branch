/*
 * Copyright(c) RIB Software GmbH
 */

import { ICosJobEntity } from './cos-job-entity.interface';
import { IEntityBase } from '@libs/platform/common';

export interface ICosJob2FrmJobEntityGenerated extends IEntityBase {

  /**
   * CosJobEntity
   */
  CosJobEntity?: ICosJobEntity | null;

  /**
   * CosJobFk
   */
  CosJobFk: number;

  /**
   * FrmJobFk
   */
  FrmJobFk?: number | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LoggingMessage
   */
  LoggingMessage?: string | null;

  /**
   * ParameterList
   */
  ParameterList?: string | null;

  /**
   * ProgressMessage
   */
  ProgressMessage?: string | null;
}
