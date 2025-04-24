/*
 * Copyright(c) RIB Software GmbH
 */

import { IChartDataComparingValue } from './chart-data-evaluation-comparing-value.interface';

export interface IChartDataEvaluationComparingValue {
	columnField: string;
	columnTitle: string;
	comparingValues: IChartDataComparingValue[];
}