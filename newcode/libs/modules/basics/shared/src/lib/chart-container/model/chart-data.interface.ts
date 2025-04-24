/*
 * Copyright(c) RIB Software GmbH
 */

import { IChartConfigOption, IChartDataSource } from '@libs/ui/common';
import { IDescriptionInfo } from '@libs/platform/common';

/**
 * IChartDataBase
 */
export interface IChartDataBase {
	label: string;
	Children?: ChartDataItem[];
}

/**
 * IChartDataExtent
 */
export interface IChartDataExtent {
	[key: string]: number | string | ChartDataItem[];
}

/**
 * ChartDataItem, IChartDataBase & IChartDataExtent
 */
export type ChartDataItem = IChartDataBase & IChartDataExtent;

/**
 * IChartConfigItem
 */
export interface IChartConfigItem extends IChartConfigOption {
	/**
	 * set CategoryKey
	 */
	CategoryKey: number;
	/**
	 * set isReadonly
	 */
	isReadonly: boolean;
	/**
	 * set Is3DView
	 */
	Is3DView: boolean;

	/**
	 * set chart filter by main entity
	 */
	FilterBySelectStructure: boolean;
}

/**
 * ISeries
 */
export interface ISeries{
	/**
	 * set Color
	 */
	Color: number;
	/**
	 * set Code
	 */
	Code?: string | null;
	/**
	 * set Description
	 */
	Description?: IDescriptionInfo | null;
}

/**
 * IChartConfig
 */
export interface IChartConfig{
	/**
	 * set chartConfigItem
	 */
	chartConfigItem: IChartConfigItem;
	/**
	 * set ISeries
	 */
	series: ISeries[];
}

/**
 * IChartDataCache
 */
export interface IChartDataCache{
	/**
	 * set gridGrid
	 */
	gridGrid: string;
	/**
	 * set chartDataSource
	 */
	chartDataSource: IChartDataSource;
}

