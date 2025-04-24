/*
 * Copyright(c) RIB Software GmbH
 */

import { IEvaluationGetChartDataDateSetResponseEntity } from './evaluation-get-chart-data-date-set-response-entity.interface';
import { IEvaluationGetChartDataLabelResponseEntity } from './evaluation-get-chart-data-label-response-entity.interface';

export interface IEvaluationGetChartDataResponseEntityGenerated {

  /**
   * DataSets
   */
  DataSets?: Map<number, IEvaluationGetChartDataDateSetResponseEntity[]>;

  /**
   * Labels
   */
  Labels?: IEvaluationGetChartDataLabelResponseEntity[] | null;
}
