/*
 * Copyright(c) RIB Software GmbH
 */

import { IChartTypeEntity } from './chart-type-entity.interface';
import { IDependentDataColumnEntity } from './dependent-data-column-entity.interface';
import { IUserChartEntity } from './user-chart-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IUserChartSeriesEntityGenerated extends IEntityBase {

  /**
   * ChartTypeEntity
   */
  ChartTypeEntity?: IChartTypeEntity | null;

  /**
   * ChartTypeFk
   */
  ChartTypeFk: number;

  /**
   * Config
   */
  Config?: string | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnRFk
   */
  DependentDataColumnEntity_DependentdatacolumnRFk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnXFk
   */
  DependentDataColumnEntity_DependentdatacolumnXFk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnYFk
   */
  DependentDataColumnEntity_DependentdatacolumnYFk?: IDependentDataColumnEntity | null;

  /**
   * DependentdatacolumnRFk
   */
  DependentdatacolumnRFk?: number | null;

  /**
   * DependentdatacolumnXFk
   */
  DependentdatacolumnXFk?: number | null;

  /**
   * DependentdatacolumnYFk
   */
  DependentdatacolumnYFk?: number | null;

  /**
   * Filter
   */
  Filter?: string | null;

  /**
   * Id
   */
  Id: number;

  /**
   * LabelInfo
   */
  LabelInfo?: IDescriptionInfo | null;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * UserChartFk
   */
  UserChartFk: number;

  /**
   * UserchartEntity
   */
  UserchartEntity?: IUserChartEntity | null;
}
