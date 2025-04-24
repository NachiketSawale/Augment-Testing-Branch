/*
 * Copyright(c) RIB Software GmbH
 */

import { IUserChartEntity } from './user-chart-entity.interface';
import { IUserChartSeriesEntity } from './user-chart-series-entity.interface';
import { IEntityBase, IDescriptionInfo } from '@libs/platform/common';

export interface IChartTypeEntityGenerated extends IEntityBase {

  /**
   * DescriptioinInfo
   */
  DescriptioinInfo?: IDescriptionInfo | null;

  /**
   * Id
   */
  Id: number;

  /**
   * IsDefault
   */
  IsDefault: boolean;

  /**
   * Sorting
   */
  Sorting: number;

  /**
   * UserChartEntities
   */
  UserChartEntities?: IUserChartEntity[] | null;

  /**
   * UserChartSeriesEntities
   */
  UserChartSeriesEntities?: IUserChartSeriesEntity[] | null;
}
