/*
 * Copyright(c) RIB Software GmbH
 */
import {ChartTypeEnum, IChartDataSource} from '@libs/ui/common';
import {ChartOptions} from 'chart.js';

export interface IEvaluationChartScope {
	chartDataSource: IChartDataSource;
	chartType: ChartTypeEnum;
	chartOption: ChartOptions;
	legendColors: string[];
}
