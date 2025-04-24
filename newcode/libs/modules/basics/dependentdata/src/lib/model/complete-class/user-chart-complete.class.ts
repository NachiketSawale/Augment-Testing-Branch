/*
 * Copyright(c) RIB Software GmbH
 */

import { CompleteIdentification } from '@libs/platform/common';
import { IUserChartEntity } from '../entities/user-chart-entity.interface';
import { IUserChartSeriesEntity } from '../entities/user-chart-series-entity.interface';
import { UserChartSeriesComplete } from './user-chart-series-complete.class';

export class UserChartComplete implements CompleteIdentification<IUserChartEntity>{

  /**
   * DependentDataChart
   */
  //public DependentDataChart?: IUserChartEntity | null = {};

  /**
   * DependentDataChartSeriesToDelete
   */
  public DependentDataChartSeriesToDelete?: IUserChartSeriesEntity[] | null = [];

  /**
   * DependentDataChartSeriesToSave
   */
  public DependentDataChartSeriesToSave?: UserChartSeriesComplete[] | null = [];
}
