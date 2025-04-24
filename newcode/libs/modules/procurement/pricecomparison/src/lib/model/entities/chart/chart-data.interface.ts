/*
 * Copyright(c) RIB Software GmbH
 */

import { IChartDataContext } from './chart-data-context.interface';
import { IChartDataEntity } from './chart-data-entity.interface';
import { IChartDataQuote } from './chart-data-quote.interface';

export class IChartData {
	public context?: IChartDataContext;
	public entities: IChartDataEntity[] = [];
	public quotes: IChartDataQuote[] = [];
}