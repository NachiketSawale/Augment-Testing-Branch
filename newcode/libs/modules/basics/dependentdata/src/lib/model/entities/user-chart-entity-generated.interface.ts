/*
 * Copyright(c) RIB Software GmbH
 */

import { IChartTypeEntity } from './chart-type-entity.interface';
import { IDependentDataColumnEntity } from './dependent-data-column-entity.interface';
import { IDependentDataEntity } from './dependent-data-entity.interface';
import { IUserChartSeriesEntity } from './user-chart-series-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IUserChartEntityGenerated extends IEntityBase {

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
   * DependentDataColumnEntity_DependentdatacolumnGrp1Fk
   */
  DependentDataColumnEntity_DependentdatacolumnGrp1Fk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnGrp2Fk
   */
  DependentDataColumnEntity_DependentdatacolumnGrp2Fk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnXFk
   */
  DependentDataColumnEntity_DependentdatacolumnXFk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataColumnEntity_DependentdatacolumnYFk
   */
  DependentDataColumnEntity_DependentdatacolumnYFk?: IDependentDataColumnEntity | null;

  /**
   * DependentDataEntity
   */
  DependentDataEntity?: IDependentDataEntity | null;

  /**
   * DependentdataFk
   */
  DependentdataFk: number;

  /**
   * DependentdatacolumnGrp1Fk
   */
  DependentdatacolumnGrp1Fk?: number | null;

  /**
   * DependentdatacolumnGrp2Fk
   */
  DependentdatacolumnGrp2Fk?: number | null;

  /**
   * DependentdatacolumnXFk
   */
  DependentdatacolumnXFk: number;

  /**
   * DependentdatacolumnYFk
   */
  DependentdatacolumnYFk: number;

  /**
   * Id
   */
  Id: number;

  /**
   * TitleInfo
   */
  TitleInfo?: IDescriptionInfo | null;

  /**
   * UserchartSeriesEntities
   */
  UserchartSeriesEntities?: IUserChartSeriesEntity[] | null;
}
