/*
 * Copyright(c) RIB Software GmbH
 */

import { IMntReportFormdataEntity } from './mnt-report-formdata-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMntActivityReportEntityGenerated extends IEntityBase {

  /**
   * ClerkFk
   */
  ClerkFk: number;

  /**
   * Code
   */
  Code: string;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * EndTime
   */
  EndTime: Date | string;

  /**
   * Id
   */
  Id: number;

  /**
   * MntActivityFk
   */
  MntActivityFk: number;

  /**
   * MntRepStatusFk
   */
  MntRepStatusFk: number;

  /**
   * MntReportFormdataEntities
   */
  MntReportFormdataEntities?: IMntReportFormdataEntity[] | null;

  /**
   * Remarks
   */
  Remarks?: string | null;

  /**
   * StartTime
   */
  StartTime: Date | string;

  /**
   * UserDefined1
   */
  UserDefined1?: string | null;

  /**
   * UserDefined2
   */
  UserDefined2?: string | null;

  /**
   * UserDefined3
   */
  UserDefined3?: string | null;

  /**
   * UserDefined4
   */
  UserDefined4?: string | null;

  /**
   * UserDefined5
   */
  UserDefined5?: string | null;
}
