/*
 * Copyright(c) RIB Software GmbH
 */


import { Injectable } from '@angular/core';
import { IChartDataCache } from '../model/chart-data.interface';
import { IChartDataSource } from '@libs/ui/common';
import { find } from 'lodash';

@Injectable({
	providedIn: 'root'
})
export class ChartDataConfigService {

	/**
	 * set chart config data cache
	 * @param { IChartDataSource } chartDataSource.
	 * @param { string } grid.
	 */
	public setCache(chartDataSource: IChartDataSource, grid: string){
		const cache = find(this.chartDataCaches, {gridGrid: grid});
		if(cache){
			cache.chartDataSource = chartDataSource;
		}else{
			this.chartDataCaches.push({
				gridGrid: grid,
				chartDataSource: chartDataSource,
			});
		}
	}

	/**
	 * set chart config data cache
	 * @param { string } grid.
	 * @returns IChartDataSource
	 */
	public getCache(grid: string): IChartDataSource | null{
		const cache = find(this.chartDataCaches, {gridGrid: grid});
		if(cache){
			return cache.chartDataSource;
		}

		return null;
	}

	private chartDataCaches: IChartDataCache[] = [];
}