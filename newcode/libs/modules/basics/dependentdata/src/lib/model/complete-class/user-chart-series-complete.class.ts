/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IUserChartSeriesEntity } from '../entities/user-chart-series-entity.interface';

export class UserChartSeriesComplete implements CompleteIdentification<IUserChartSeriesEntity>{

  /**
   * DependentDataChartSeries
   */
  //public DependentDataChartSeries?: IUserChartSeriesEntity | null = {};

  /**
   * MainItemId
   */
  public MainItemId: number = 0;
}
