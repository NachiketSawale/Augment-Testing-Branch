/*
 * Copyright(c) RIB Software GmbH
 */

import { IDescriptionInfo } from '@libs/platform/common';

export interface IChartConfiguration{
	BasChartTypeFk: number;
	ChartOptionConfig: string;
	Description: IDescriptionInfo | null
}

export interface IChartSeries{
	Id: number;
	Color: number;
	ChartDataConfig?: string | null;
	Code?: string | null;
	Description?: IDescriptionInfo | null;
}

export interface IChartCategory{
	Id: number;
	IsDate: boolean;
	GroupKey?: number | null;
}