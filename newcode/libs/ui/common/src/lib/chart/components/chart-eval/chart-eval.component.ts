import {
	AfterViewInit,
	Component,
	ElementRef,
	Input,
	NgZone,
	OnChanges,
	OnDestroy,
	SimpleChanges,
	ViewChild
} from '@angular/core';
import { ServiceLocator } from '@libs/platform/common';
import { Chart, ChartOptions } from 'chart.js';
import {ChartTypeEnum} from '../../entity/chart-type.enum';
import {IChartDataSource} from '../../interface/chart-data.interface';
import {ChartDataProcessService} from '../../service/chart-data-process.service';
import {IChartViewData} from '../../interface/chart-view-data.interface';
import {extend} from 'lodash';

@Component({
	selector: 'ui-common-chart-eval',
	templateUrl: './chart-eval.component.html',
	styleUrl: './chart-eval.component.scss',
})
export class UiCommonChartEvalComponent implements AfterViewInit, OnChanges, OnDestroy {
	@Input()
	public chartType!: ChartTypeEnum;

	@Input()
	public chartDataSource!: IChartDataSource;

	@Input()
	public chartUuid?: string;

	@Input()
	public chartOption?: ChartOptions;

	@Input()
	public legendColors: string[] = [];

	@ViewChild('chart')
	public elementRef!: ElementRef;

	private chartDataProcessService = ServiceLocator.injector.get(ChartDataProcessService);

	private myChart?: Chart;

	public constructor(private zone: NgZone) {
	}

	public recreateChart() {
		if (this.myChart) {
			this.myChart.destroy();
		}

		const viewData: IChartViewData = {
			avg: '',
			max: '',
			min: ''
		};
		// this.contextChangedHandler('culture');
		// let viewData = colorProfileService.getCustomDataFromView(scope.chartUuid, 'chartColor');

		const options = {
			onAnimationProgress:  () => {
				if (!this.chartDataProcessService.hasValue(this.chartDataSource)) {
					// this.destroy();
				}
			}
		};

		if (this.chartOption) {
			extend(options, this.chartOption);
		}

		const element = this.elementRef.nativeElement;
		const result = this.chartDataProcessService.processChartEval(this.chartType, this.chartDataSource, element, viewData, this.legendColors, options);
		if (result){
			this.myChart = result ;
		}
	}

	public resizeChart() {
		if (this.myChart) {
			//this.myChart.resize(this.myChart.render, true);
		}
	}

	public contextChangedHandler(type: string) {
		// if (type === 'culture' &&
		// 	this.chartDataSource &&
		// 	this.chartDataSource.chartData.datasets &&
		// 	this.chartDataSource.chartData.datasets.yValueDomain &&
		// 	this.chartDataSource.chartData.datasets.yValueDomain.name) {
		// 	const domainInfo = platformDomainService.loadDomain(this.chartDataSource.chartData.datasets.yValueDomain.name),
		// 		culture = platformContextService.culture(),
		// 		cultureInfo = platformLanguageService.getLanguageInfo(culture);
		//
		// 	extend(this.chartDataSource.datasets.yValueDomain, {
		// 		decimal: cultureInfo[domainInfo.datatype].decimal,
		// 		thousand: cultureInfo[domainInfo.datatype].thousand
		// 	});
		// }
	}

	public ngAfterViewInit(): void {
		this.zone.runOutsideAngular(() => {
			this.recreateChart();
		});
	}

	public ngOnChanges(change: SimpleChanges): void {
		if(!this.elementRef){
			return;
		}

		const chartType = change['chartType'];
		const chartDataSource = change['chartDataSource'];
		const chartOption = change['chartOption'];

		if ( (chartType && chartType.currentValue) || (chartDataSource && chartDataSource.currentValue) || (chartOption && chartOption.currentValue)) {
			this.zone.runOutsideAngular(() => {
				this.recreateChart();
			});
		}
	}

	public ngOnDestroy(): void {
		if (this.myChart){
			this.myChart.destroy();
		}
	}
}
