/*
 * Copyright(c) RIB Software GmbH
 */

import { IFormDataEntity } from './form-data-entity.interface';
import { IMntActivityReportEntity } from './mnt-activity-report-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IMntReportFormdataEntityGenerated extends IEntityBase {

  /**
   * ContextFk
   */
  ContextFk: number;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * FormDataEntity
   */
  FormDataEntity?: IFormDataEntity | null;

  /**
   * FormDataFk
   */
  FormDataFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * MntActivityReportEntity
   */
  MntActivityReportEntity?: IMntActivityReportEntity | null;
}
