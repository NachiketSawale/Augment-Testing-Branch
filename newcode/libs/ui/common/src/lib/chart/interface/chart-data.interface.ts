/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {ChartDataset} from 'chart.js';

/**
 * chart dataset labels legends structure
 */
export interface  IChartDataSource {
	/**
	 * chart data set
	 */
	datasets: ChartDataset[];
	/**
	 * chart labels
	 */
	labels: string[];
	/**
	 * chart legends
	 */
	legends: ILegends[]
}

/**
 * chart  legends structure
 */
export interface ILegends {
	/**
	 * legend name
	 */
	name: string;
}