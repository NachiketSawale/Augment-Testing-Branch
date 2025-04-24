/*
 * Copyright(c) RIB Software GmbH
 */

import { IReportParameterEntity } from './report-parameter-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IReportParameterValuesEntityGenerated extends IEntityBase {

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * ReportParameterEntity
   */
  ReportParameterEntity?: IReportParameterEntity | null;

  /**
   * ReportParameterFk
   */
  ReportParameterFk: number;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * Value
   */
  Value?: number | null;
}
