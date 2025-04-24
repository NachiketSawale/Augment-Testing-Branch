/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo, IEntityBase } from '@libs/platform/common';
import { IReportEntity } from './report-entity.interface';
import { IReportParameterEntity } from './report-parameter-entity.interface';
import { IReportParameterValuesEntity } from './report-parameter-values-entity.interface';



export interface IReportParameterEntityGenerated extends IEntityBase {

  /**
   * DataType
   */
  DataType?: string | null;

  /**
   * Default
   */
  Default?: string | null;

  /**
   * DescriptionInfo
   */
  DescriptionInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsVisible
   */
  IsVisible: boolean;

  /**
   * ParameterName
   */
  ParameterName?: string | null;

  /**
   * ReportEntity
   */
  ReportEntity?: IReportEntity | null;

  /**
   * ReportFk
   */
  ReportFk: number;

  /**
   * ReportParameterEntities_ReportParameterFk
   */
  ReportParameterEntities_ReportParameterFk?: IReportParameterEntity[] | null;

  /**
   * ReportParameterEntity_ReportParameterFk
   */
  ReportParameterEntity_ReportParameterFk?: IReportParameterEntity | null;

  /**
   * ReportParameterFk
   */
  ReportParameterFk?: number | null;

  /**
   * ReportParameterValuesEntities
   */
  ReportParameterValuesEntities?: IReportParameterValuesEntity[] | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * SysContext
   */
  SysContext?: number | null;
}
