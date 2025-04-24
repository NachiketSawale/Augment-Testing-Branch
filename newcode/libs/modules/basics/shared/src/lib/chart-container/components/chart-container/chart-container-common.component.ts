/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartDataItem, IChartConfigItem, ISeries } from '../../model/chart-data.interface';
import { ChartConfigCommonService, ChartTypeEnum, IChartDataSource } from '@libs/ui/common';
import { orderBy, find, forEach, padStart, clone } from 'lodash';
import { ChartDataConfigService } from '../../services/chart-data-config.service';
import { chartCategoryType } from '../../model/chart-data.enum';

@Component({
	selector: 'basics-shared-chart-common-container',
	templateUrl: './chart-container-common.component.html',
	styleUrl: './chart-container-common.component.scss',
})
export class BasicsSharedChartContainerCommonComponent implements OnInit, OnChanges{

	private readonly dialogCommonService = inject(ChartConfigCommonService);
	private readonly chartDataConfigService = inject(ChartDataConfigService);


	public constructor() {
	}

	/**
	 * Sets ISeries for chart
	 */
	@Input()
	public series: ISeries[] = [];

	/**
	 * Sets chartConfigItem for chart
	 */
	@Input()
	public chartConfigItem?: IChartConfigItem;

	/**
	 * Sets chartDataItems for chart
	 */
	@Input()
	public chartDataItems: ChartDataItem[] = [];

	/**
	 * Sets containerGuid for chart
	 */
	@Input()
	public containerGuid?: string;

	private chartTypes = this.dialogCommonService.getChartTypes();
	private findChartType(id: number){

		if(this.configItem.Is3DView){
			return {id:0, code: ChartTypeEnum.threeD_Columns};
		}

		const res = find(this.chartTypes, {id: +id});
		return res || this.chartTypes[1];
	}

	private isBarChart() {
		const chartType = find(this.chartTypes, {id:this.configItem.ChartTypeId});
		return chartType && chartType.code === ChartTypeEnum.bar;
	}

	private isLineChart(){
		const chartType = find(this.chartTypes, {id:this.configItem.ChartTypeId});
		return chartType && chartType.code === ChartTypeEnum.line;
	}

	/**
	 * chart basic config
	 */
	protected configItem : IChartConfigItem = {
		ChartTypeId: 2,
		CategoryKey: 0,
		HideZeroValue: false,
		HideZeroValueX: false,
		DrillDownForData: false,
		FilterBySelectStructure: false,
		Is3DView: false,
		ShowTitle: false,
		Title: '',
		TitleAlign: 1,
		ShowDataLabel: false,
		LegendAlign:2,
		ShowLegend: true,
		ReverseOrder: false,
		ShowXAxis: false,
		XTitle: '',
		HideXGridLine: false,
		ShowYAxis: false,
		YTitle: '',
		HideYGridLine: false,
		isReadonly: false
	};

	/**
	 * ngOnInit function
	 */
	public ngOnInit(): void {
		if(!this.chartConfigItem){
			return;
		}
		this.configItem = this.chartConfigItem;

		this.chartType = this.findChartType(this.configItem.ChartTypeId).code;

		if(this.isLineChart()){
			this.configItem.DrillDownForData = false;
			this.configItem.ReverseOrder = false;
		}

		if(this.configItem.Is3DView){
			this.chartType = ChartTypeEnum.threeD_Columns;
		}

		this.chartOption = this.dialogCommonService.getChartOption(this.configItem);

		this.plugins = this.dialogCommonService.getPlugins(this.configItem);

		this.loadChartData();
	}

	/**
	 * Used to recreate and refresh Chart container.
	 */
	public ngOnChanges(change: SimpleChanges): void {
		if(change['chartConfigItem'] && change['chartConfigItem'].currentValue){
			this.ngOnInit();
		}

		if (change['chartDataItems'] && change['chartDataItems'].currentValue) {
			this.loadChartData();
		}
	}

	private loadChartData(){

		let newDataSets: {data: number[]}[] = [{data: [0]}];
		let newLegends: {name: string}[] = [];
		let newLabels: string[] = [];

		if(this.series && this.series.length > 0){
			forEach(this.series, (item) => {
				item.Code = item.Code ? item.Code.trim() : item.Code;
			});
		}

		const itemsCopy = clone(this.chartDataItems);
		if(this.isLineChart()){
			const item: ChartDataItem = {
				label: 'Label',
				Children: []
			};
			itemsCopy.unshift(item);
		}

		if(this.isBarChart()){
			this.series = orderBy(this.series, 'Code');
		}

		if(this.chartDataItems && this.chartDataItems.length > 0){
			newLabels = [];
			forEach(itemsCopy, (item) => {
				let label = item.label;

				if(this.chartConfigItem?.CategoryKey === chartCategoryType.ReportPeriod && label){
					const data = new Date(label);
					if(data.getFullYear() && (data.getMonth()+1) >= 1){
						const month = data.getMonth()+1;
						const monthStr = month < 10 ? '0'+ month : (month + '');
						label = data.getFullYear() + '-' + monthStr;
					}
				}

				newLabels.push(label);

			});
		}

		forEach(this.series, (item) => {
			newLegends.push({name: item.Description ? (item.Description.Translated || item.Description.Description) : ''});
			this.legendColors.push(item.Color ? this.dialogCommonService.parseDecToRgb(padStart(item.Color.toString(16), 7, '#000000')) || '' : '');

			if(this.chartDataItems && this.chartDataItems.length > 0){
				newDataSets = [];
				const newDataSet: number[] = [];
				forEach(itemsCopy, (copy) => {
					let val = (item.Code ? copy[item.Code] as number: 0)  || 0;
					val = +val.toFixed(2);
					newDataSet.push(val);
				});
				newDataSets.push({data: newDataSet});
			}
		});

		if(this.containerGuid){
			this.chartDataConfigService.setCache({
				legends: clone(newLegends),
				labels: newLabels,
				datasets: clone(newDataSets)
			}, this.containerGuid);
		}

		if(this.configItem.ReverseOrder){
			newLegends = newLegends.reverse();
			newDataSets = newDataSets.reverse();
			this.legendColors = this.legendColors.reverse();
		}

		this.chartDataSource = {
			legends: newLegends,
			labels: newLabels,
			datasets: newDataSets,
		};
	}

	protected chartType = ChartTypeEnum.bar;

	protected legendColors: string[] = [];

	protected chartOption: object = {};

	protected plugins: object = {};

	protected chartDataSource?: IChartDataSource;
}
