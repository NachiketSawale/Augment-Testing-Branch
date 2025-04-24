/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { AfterViewInit, Component, ElementRef, EventEmitter, inject, Input, NgZone, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Chart, ChartType, registerables } from 'chart.js';
import { IChartDataSource } from '../../interface/chart-data.interface';
import { ChartDataProcessService } from '../../service/chart-data-process.service';
import { extend } from 'lodash';
import { ChartOptions } from 'chart.js/dist/types';
import { ChartTypeEnum } from '../../entity/chart-type.enum';

Chart.register(...registerables);

@Component({
  selector: 'ui-common-chart-view',
  templateUrl: './chart-view.component.html',
  styleUrl: './chart-view.component.scss'
})
export class UiCommonChartComponent implements AfterViewInit, OnDestroy, OnChanges {
	private readonly chartDataProcessService = inject(ChartDataProcessService);

	@ViewChild('chartView') public myChartRef!: ElementRef;

	public constructor(private zone: NgZone) {

	}

	/**
	 * Sets legend color for chart
	 */
	@Input() public legendColors?: string[];

	/**
	 * Sets data list for chart
	 */
	@Input() public chartDataSource?: IChartDataSource;

	/**
	 * Sets config json for chart
	 */
	@Input() public chartOption?: object;

	/**
	 * Sets plugins for chart
	 */
	@Input() public plugins?: object;

	/**
	 * Sets chart type
	 *  'bar', 'line', 'radar', 'pie', 'bubble', 'doughnut', 'polarArea', 'scatter',
	 */
	@Input() public chartType?: ChartTypeEnum;

	/**
	 * transfer event to parent
	 */
	@Output() public commonEvent = new EventEmitter<object>();

	private myChart?: Chart | null = null;

	/**
	 * Used to recreate and refresh Chart view after chart data is changed.
	 */
	public ngOnChanges(change: SimpleChanges): void {
		if(!this.myChartRef){
			return;
		}
		if (change['chartDataSource'].currentValue || change['chartOption'].currentValue) {
			this.zone.runOutsideAngular(() => {
				this.createChart();
			});
		}
	}

	/**
	 * Used to show chart view while load this component first time
	 */
	public ngAfterViewInit(){
		this.zone.runOutsideAngular(() => {
			this.createChart();
		});
	}

	private createChart(){
		if (this.myChart) {
			this.myChart.destroy();
		}

		const options = {
			onAnimationProgress:  () => {
				if (!this.chartDataProcessService.hasValue(this.chartDataSource)) {
					// this.destroy();
				}
			}
		};

		if(this.chartOption){
			extend(options, this.chartOption);

			// TODO: change bar/ling chart container title
			// if(scope.chartOption.containerTitle){
			// 	let titleElement = element.parent().parent().parent().children('.subview-header').children('.title');
			// 	if(titleElement){
			// 		let titles = titleElement.html().split(' - ');
			// 		titleElement.html(titles[0] +' - ' + scope.chartOption.containerTitle);
			// 	}
			// }
		}

		this.chartDataProcessService.process(this.chartType, this.chartDataSource, options, this.legendColors, this.plugins);

		if(this.chartDataSource && options && this.myChartRef) {
			const ctx = this.myChartRef.nativeElement.getContext('2d');
			this.myChart = new Chart(ctx, {
				type: (this.chartType || ChartTypeEnum.bar) as ChartType,
				data: this.chartDataSource,
				options: options as ChartOptions
			});
		}
	}

	/**
	 * destroy current Chart instance
	 */
	public ngOnDestroy(){
		if (this.myChart) {
			this.myChart.destroy();
		}
	}
}
