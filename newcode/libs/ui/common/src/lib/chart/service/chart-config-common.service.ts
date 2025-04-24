/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { find, isString } from 'lodash';
import { PlatformTranslateService } from '@libs/platform/common';
import { IChartConfigOption } from '../interface/chart-config-option.interface';
import { ChartTypeEnum } from '../entity/chart-type.enum';

@Injectable({
	providedIn: 'root'
})
export class ChartConfigCommonService {

	private readonly translateService = inject(PlatformTranslateService);

	/**
	 * get using chart type list
	 *
	 * @returns {id: number, code: string, desc：string} chart type list
	 */
	public getChartTypes (){
		return [
			{id:1, code: ChartTypeEnum.line, desc: this.translateService.instant('basics.common.chartType.lineChart').text},
			{id:2, code: ChartTypeEnum.bar, desc: this.translateService.instant('basics.common.chartType.barChart').text},
			{id:3, code: ChartTypeEnum.radar, desc: this.translateService.instant('basics.common.chartType.radarChart').text},
			{id:4, code: ChartTypeEnum.pie, desc: this.translateService.instant('basics.common.chartType.pieChart').text},
			{id:5, code: ChartTypeEnum.bubble, desc: this.translateService.instant('basics.common.chartType.bubbleChart').text},
			{id:6, code: ChartTypeEnum.doughnut, desc: this.translateService.instant('basics.common.chartType.doughnutChart').text},
			{id:7, code: ChartTypeEnum.polarArea, desc: this.translateService.instant('basics.common.chartType.polarAreaChart').text},
			{id:8, code: ChartTypeEnum.scatter, desc: this.translateService.instant('basics.common.chartType.scatterChart').text},
		];
	}

	/**
	 * return all align items for chart to config title/x Title/y Title position
	 *
	 * @returns {id: number, code: string, desc：string}
	 */
	public getAlignItems(){
		return this.alignItems;
	}

	private alignItems = [
		{id:1, code:'top', desc: this.translateService.instant('basics.common.chartConfig.top').text},
		{id:2, code:'bottom', desc: this.translateService.instant('basics.common.chartConfig.bottom').text},
		{id:3, code:'left', desc: this.translateService.instant('basics.common.chartConfig.left').text},
		{id:4, code:'right', desc: this.translateService.instant('basics.common.chartConfig.right').text}
	];

	private findAlignItem(id: number){
		const res = find(this.alignItems, {id: +id});
		return res || this.alignItems[0];
	}

	/**
	 * base on dataItem to generate basic Chart config
	 * @param { IChartConfigOption } dataItem.
	 * @returns object
	 */
	public getChartOption(dataItem : IChartConfigOption){
		return {
			responsive: true,
			maintainAspectRatio: false,
			skipNull: dataItem.HideZeroValueX,
			plugins:{
				legend: {
					position: this.findAlignItem(dataItem.LegendAlign).code,
					display: dataItem.ShowLegend,
					labels: {
						boxWidth: 10,
						fontSize:10,
						family:'Arial'
					}
				},
				title: {
					display: dataItem.ShowTitle,
					text: dataItem.Title,
					position: this.findAlignItem(dataItem.TitleAlign).code
				},
			},
			scales:{
				x: {
					display: true,
					title:{
						display: dataItem.ShowXAxis,
						text: dataItem.XTitle
					},
					ticks:{
						callback: function (dataLabel: string){
							return dataLabel;
						}
					},
					grid: {drawOnChartArea: !dataItem.HideXGridLine}
				},
				y:{
					display: true,
					title:{
						display: dataItem.ShowYAxis,
						text: dataItem.YTitle
					},
					ticks:{
						beginAtZero: true,
						callback: function(value: number){
							return value;
							// TODO need to format value by culture;
							// let culture = platformContextService.culture();
							// let cultureInfo = platformLanguageService.getLanguageInfo(culture);
							// return accounting.formatNumber(value, 0, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal);
						}
					},
					grid: {drawOnChartArea: !dataItem.HideYGridLine}
				}
			}
		};
	}

	/**
	 * change color format '#100000' to rgb format '111,111,111'
	 * @param { string } dec.
	 * @returns string
	 */
	public parseDecToRgb(dec: string) {
		if(!dec) {
			return null;
		}
		if (isString(dec) && dec.charAt(0) === '#') {
			dec = dec.substring(1);
		}
		const hex = dec.toString();  // dec.toString(16)
		const r = parseInt(hex.slice(0, 2), 16);
		const g = parseInt(hex.slice(2, 4), 16);
		const b = parseInt(hex.slice(4, 6), 16);
		return r + ',' + g + ',' + b;
	}

	/**
	 * change color rgb format '111,111,111 to number '100000'
	 * @param { string } rgb.
	 * @returns number
	 */
	public rgbToDecimal(rgb: string) {
		if(!rgb) {
			return 0;
		}

		const ds = rgb.split(/\D+/);
		return  Number(ds[0]) * 65536 + Number(ds[1]) * 256 + Number(ds[2]);

	}

	/**
	 * return common plugins for chart
	 * @param { IChartConfigOption } dataItem.
	 * @returns oject
	 */
	public getPlugins(dataItem : IChartConfigOption){
		return [
			// {
			// 	beforeInit: function(chart){
			// 		if(dataItem.HideZeroValueX && chart.data.labels.length > 0){
			// 			let labelNum = chart.data.labels.length;
			// 			for(let i=0; i<labelNum; i++){
			// 				let allSetIsZero = true;
			// 				_.forEach(chart.data.datasets, function (item){
			// 					if(item.data[i]){
			// 						allSetIsZero = false;
			// 					}
			// 				});
			// 				if(allSetIsZero){
			// 					chart.data.labels[i] = '';
			// 				}
			// 			}
			// 		}
			// 	},
			// 	beforeDatasetsUpdate: function (chart){
			// 		chart.data.datasets.forEach(function(dataset, i) {
			// 			let meta = chart.getDatasetMeta(i);
			// 			if (!meta.hidden) {
			// 				meta.data.forEach(function(element, index) {
			//
			// 					// hide zero value
			// 					let value = dataset.data[index] - 0;
			// 					dataset.data[index] = value === 0 && (dataItem.HideZeroValue || dataItem.HideZeroValueX) ? NaN : dataset.data[index];
			// 				});
			// 			}
			// 		});
			// 	},
			// 	afterDatasetsDraw: function(chart) {
			// 		let ctx = chart.ctx;
			// 		//let culture = platformContextService.culture();
			// 		//let cultureInfo = platformLanguageService.getLanguageInfo(culture);
			//
			// 		chart.data.datasets.forEach(function(dataset, i) {
			// 			let meta = chart.getDatasetMeta(i);
			// 			if (!meta.hidden) {
			// 				meta.data.forEach(function(element, index) {
			// 					// Draw the text in black, with the specified font
			// 					ctx.fillStyle = 'rgb(0, 0, 0)';
			//
			// 					let fontSize = 11;
			// 					//let fontStyle = 'normal';
			// 					//let fontFamily = 'Helvetica Neue';
			//
			// 					// todo: find new way to enhance this
			// 					//ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
			//
			// 					// Just naively convert to string for now
			// 					let value = dataset.data[index] - 0;
			// 					// TODO need to format value by culture;
			// 					//let dataString = ((!value && scope.dataItem.HideZeroValue) || !scope.dataItem.ShowDataLabel ) ? '' : (accounting.formatNumber(value, 2, cultureInfo.numeric.thousand, cultureInfo.numeric.decimal) || '0.00');
			// 					let dataString = ((!value && dataItem.HideZeroValue) || !dataItem.ShowDataLabel ) ? '' : value || '0.00';
			//
			// 					// Make sure alignment settings are correct
			// 					ctx.textAlign = 'center';
			// 					ctx.textBaseline = 'middle';
			//
			// 					let padding = 1;
			// 					let position = element.tooltipPosition();
			// 					ctx.fillText(dataString, position.x, position.y - (fontSize / 2) - padding);
			// 				});
			// 			}
			// 		});
			// 	}
			// }
		];
	}
}