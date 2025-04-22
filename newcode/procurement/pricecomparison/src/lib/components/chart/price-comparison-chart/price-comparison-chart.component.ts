/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject } from '@angular/core';
import {
	ChartTypeEnum,
	ConcreteMenuItem, FieldType,
	ItemType,
	UiCommonDialogService
} from '@libs/ui/common';
import {
	BasicsSharedChartColorConfigDialogComponent,
	CHAT_COLOR_CONFIG_SCOPR_OPTION,
	IChatColorConfigScopeOptions
} from '@libs/basics/shared';
import { ILegendStyle } from '@libs/businesspartner/interfaces';
import { Orientation, PlatformTranslateService, RgbColor } from '@libs/platform/common';
import { get, isArray, isEmpty, isNumber } from 'lodash';
import { ISplitGridSplitter } from '@libs/ui/business-base';
import { Chart, ChartOptions, LegendItem, ChartDataset } from 'chart.js';
import { PriceComparisonChartDataService } from '../../../services/price-comparison-chart-data.service';
import { IChartData } from '../../../model/entities/chart/chart-data.interface';
import { SplitComponent } from '@libs/ui/external';
import { ContainerBaseComponent } from '@libs/ui/container-system';
import { IChartScope } from '../../../model/entities/chart/chart-scope';
import { ProcurementPricecomparisonCompareItemDataService } from '../../../services/data/item/compare-item-data.service';
import { ProcurementPriceComparisonCompareItemDataExtensionService } from '../../../services/data/item/compare-item-data-extension.service';
import { ICompositeItemEntity } from '../../../model/entities/item/composite-item-entity.interface';
import { IChartDataEntity } from '../../../model/entities/chart/chart-data-entity.interface';
import { IChartDataQuote } from '../../../model/entities/chart/chart-data-quote.interface';
import { ProcurementPricecomparisonRfqHeaderDataService } from '../../../services/rfq-header-data.service';
import { ProcurementPricecomparisonCompareBoqDataService } from '../../../services/data/boq/compare-boq-data.service';
import { ProcurementPriceComparisonCompareBoqDataExtensionService } from '../../../services/data/boq/compare-boq-data-extension.service';
import { ICompositeBoqEntity } from '../../../model/entities/boq/composite-boq-entity.interface';
export interface IDisplayItemDescription{
	name: string;
}

@Component({
	selector: 'procurement-pricecomparison-price-comparison-chart',
	templateUrl: './price-comparison-chart.component.html',
	styleUrls: ['./price-comparison-chart.component.scss'],
})
export class PriceComparisonChartComponent extends ContainerBaseComponent {

	public chartType: ChartTypeEnum = ChartTypeEnum.bar;
	private readonly translate = inject(PlatformTranslateService);
	private readonly cloudCommonModule = 'cloud.common';
	private readonly businesspartnerMainModuleName = 'businesspartner.main';

	private readonly dialogService = inject(UiCommonDialogService);
	private readonly chartService = inject(PriceComparisonChartDataService);
	private readonly itemDataService = inject(ProcurementPricecomparisonCompareItemDataService);
	private readonly itemService = inject(ProcurementPriceComparisonCompareItemDataExtensionService);
	private readonly boqDataService = inject(ProcurementPricecomparisonCompareBoqDataService);
	private readonly boqService = inject(ProcurementPriceComparisonCompareBoqDataExtensionService);
	private readonly mainService = inject(ProcurementPricecomparisonRfqHeaderDataService);
	private readonly colorConfigScope: IChatColorConfigScopeOptions;
	public chartDataScope!: IChartScope;

	private chartToolbarButton: ConcreteMenuItem[] = this.getChartMenuItem();

	public chartTitle = 'Chart';

	protected splitter: ISplitGridSplitter = {
		direction: Orientation.Horizontal,
		areaSizes: [20, 80]
	};


	private readonly myGridConfig = {
		initCalled: false,
		columns: [],
		parentProp: 'PId',
		childProp: 'ChildrenItem',
		enableDraggableGroupBy: false,
	};

	public data!: IChartData;
	public onSplitterChangeSize(split: SplitComponent) {}

	public constructor() {
		super();
		this.colorConfigScope = {
			viewDatakey: 'chartColor',
		};

		this.uiAddOns.toolbar.addItems(this.getChartMenuItem());

		this.initContainer();

		this.initChartOptions();

		this.initChartDataSource();

		this.mainService.selectionChanged$.subscribe(selectedItems => {
			this.clearChart();
			this.chartService.resetData();
		});

		this.itemDataService.selectionChanged$.subscribe(selectedItems => {
			this.itemService.setSelectedParentItem(selectedItems[0]);
			this.handleParentSelectionChanged('item', selectedItems[0]);
			this.refresh();
		});

		this.boqDataService.selectionChanged$.subscribe(selectedItems => {
			this.boqService.setSelectedParentItem(selectedItems[0]);
			this.handleParentSelectionChanged('boq', selectedItems[0]);
			this.refresh();
		});
	}

	public getChartMenuItem() {
		this.chartToolbarButton = [
			{
				//echart: bar
				id: 't-columnChart',
				type: ItemType.Item,
				caption: {
					key: this.businesspartnerMainModuleName + '.toolbarColumnChart',
				},
				iconClass: 'tlb-icons ico-column-chart',
				disabled: true,
				fn: () => {
					this.chartDataScope.chartType = ChartTypeEnum.bar;
				},
			},
			{
				//echart: line
				id: 't-lineChart',
				type: ItemType.Item,
				caption: {
					key: this.businesspartnerMainModuleName + '.toolbarLineChart',
				},
				iconClass: 'tlb-icons ico-line-chart',
				disabled: true,
				fn: () => {
					this.chartDataScope.chartType = ChartTypeEnum.line;
				},
			},
			{
				id: 't-3dColumns',
				type: ItemType.Item,
				caption: {
					key: this.businesspartnerMainModuleName + '.toolbar3DColumns',
				},
				iconClass: 'tlb-icons ico-3d-column-chart',
				disabled: true,
				fn: () => {
					this.chartType = ChartTypeEnum.threeD_Columns;
				},
			},
			{
				id: 't-chartConfig',
				type: ItemType.Item,
				caption: {
					key: 'basics.common.chartSetting',
				},
				iconClass: 'tlb-icons ico-template-config',
				fn: () => {
					this.showChartConfigDialog();
				},
			},
		];

		return [
			{
				type: ItemType.Sublist,
				sort: -40,
				list: {
					items: this.chartToolbarButton,
				},
			},
		];
	}

	private showChartConfigDialog() {
		this.colorConfigScope.maxValue = new RgbColor(0, 0, 0, 1);
		this.colorConfigScope.minValue = new RgbColor(0, 0, 0, 1);
		this.colorConfigScope.avgValue = new RgbColor(0, 0, 0, 1);

		const OK_ID = 'IsOK';

		this.dialogService
			.show({
				headerText: 'basics.common.chartColorConfig',
				backdrop: false,
				width: '640px',
				resizeable: true,
				showCloseButton: false,

				bodyComponent: BasicsSharedChartColorConfigDialogComponent,
				bodyProviders: [
					{
						provide: CHAT_COLOR_CONFIG_SCOPR_OPTION,
						useValue: this.colorConfigScope,
					},
				],
				buttons: [
					{
						id: OK_ID,
						caption: this.cloudCommonModule + '.ok',
						fn: (event, info) => {
							if (!this.colorConfigScope.maxValue && !this.colorConfigScope.minValue && !this.colorConfigScope.avgValue) {
								//colorProfileService.setCustomViewData($scope.modalOptions.uuid, $scope.viewDatakey, {});
								//todo
							} else {
								//let ViewDataValue = {};
								if (this.colorConfigScope.maxValue) {
									//ViewDataValue.Max = parseDecToRgb($scope.maxValue);
								}
								if (this.colorConfigScope.minValue) {
									//ViewDataValue.Min = parseDecToRgb($scope.minValue);
								}
								if (this.colorConfigScope.avgValue) {
									//ViewDataValue.Avg = parseDecToRgb($scope.avgValue);
								}
								//todo
								//BasicsSharedChartColorConfigService.setCustomViewData('', this.scope.viewDatakey, ViewDataValue);
							}
							info.dialog.close(OK_ID);
						},
					},
					{
						id: 'reset',
						caption: 'basics.common.reset',
						fn: (event, info) => {
							info.dialog.body.maxValueDataControlContext.value = new RgbColor(0, 0, 0, 1);
							info.dialog.body.minValueDataControlContext.value = new RgbColor(0, 0, 0, 1);
							info.dialog.body.avgValueDateControlContext.value = new RgbColor(0, 0, 0, 1);
						},
					},
					{
						id: 'id_cancel',
						caption: this.cloudCommonModule + '.cancel',
						fn: (event, info) => {
							info.dialog.close();
						},
					},
				],
			})
			?.then((result) => {
				if (result.closingButtonId === OK_ID) {
					this.refresh();
				}
			});
	}

	private refreshChartData() {}

	private initContainer() {
		if (!this.chartDataScope) {
			this.chartDataScope = {
				chartType: ChartTypeEnum.bar,
				legendColors: [],
				chartOption: {},
				chartDataSource: {
					legends: [],
					labels: [],
					datasets: [],
				},
			};
		}

		this.chartTitle = '';

		this.initChartOptions();

		this.refreshChartData();
	}

	private initChartOptions() {
		this.chartDataScope.legendColors = [];
		const chartOptions: ChartOptions = {
			plugins: {
				legend: {
					labels: {
						generateLabels: (chart: Chart) => {
							const data = chart.data;
							const legends = isArray(data.datasets)
								? data.datasets.map((dataset, i) => {
									const legendStyle = {
										text: dataset.label ?? '',
										hidden: !chart.isDatasetVisible(i),
										fillStyle: this.chartDataScope.legendColors[i],
										strokeStyle: this.chartDataScope.legendColors[i],
									};
									return this.generateLegend(dataset, legendStyle, i);
								}, this)
								: [];

							//let viewData = colorProfileService.getCustomDataFromView($scope.gridId, 'chartColor');
							const viewData = {
								Max: 0,
								Min: 0,
							};

							let legendLen = legends.length;
							if (viewData?.Max) {
								const legendStyle = {
									text: 'Max',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Max + ',1)',
									strokeStyle: 'rgba(' + viewData.Max + ',1)',
								};
								legends.push(this.generateLegend(data.datasets[0], legendStyle, legendLen));
							}
							legendLen = legends.length;
							if (viewData?.Min) {
								const legendStyle = {
									text: 'Min',
									hidden: false,
									fillStyle: 'rgba(' + viewData.Min + ',1)',
									strokeStyle: 'rgba(' + viewData.Min + ',1)',
								};
								legends.push(this.generateLegend(data.datasets[0], legendStyle, legendLen));
							}
							return legends;
						},
					},
				},
			},
		};
		this.chartDataScope.chartOption = chartOptions;
	}

	private generateLegend(dataset: object, style: ILegendStyle, index: number): LegendItem {
		return {
			text: style.text,
			fillStyle: style.fillStyle,
			hidden: style.hidden,
			lineCap: get(dataset, 'borderCapStyle', undefined),
			lineDash: get(dataset, 'borderDash', undefined),
			lineDashOffset: get(dataset, 'borderDashOffset', undefined),
			lineJoin: get(dataset, 'borderJoinStyle', undefined),
			lineWidth: get(dataset, 'borderWidth', undefined),
			strokeStyle: get(style, 'strokeStyle', undefined),
			pointStyle: get(dataset, 'pointStyle', undefined),

			// Below is extra data used for toggling the datasets
			datasetIndex: index,
		};
	}

	private refresh(){
		// clear the chart
		this.clearChart();
		this.data = this.chartService.getData();
		if (this.data.context && !isEmpty(this.data.context.selected)) {
			// show the chart
			this.displayChart();
		}
	}

	private displayChart(){
		this.data = this.chartService.getData();
		if (this.data && this.data.context && this.data.context.type === 'boq') {
			this.chartTitle = this.translate.instant('procurement.pricecomparison.priceComparisonBoqTitleShort').text;
		} else {
			this.chartTitle = this.translate.instant('procurement.pricecomparison.priceCompareTitleShort').text;
		}

		const entities = this.data.entities.filter(item=>item.IsSelected);
		const legends = entities.map(item=> {
			return { name: item.Name };
		});
		const labels = this.data.quotes.filter(item=>item.IsSelected).map(item=>item.Name);
		const dataSets: ChartDataset[] = [];

		entities.forEach(function (item) {
			if (item && item.Items && !isEmpty(item.Items)) {
				dataSets.push({
					data: item.Items.filter(function(inner) {
						return labels.indexOf(inner.Name) !== -1;
					}).map(function(inner) {
						return isNumber(inner.Value) ? Math.round(100 * inner.Value) / 100 : 0;
					})
				});
			}
		});

		// TODO: new angular datasets does not exit yValueDomain
		//this.chartDataScope.chartDataSource.datasets.yValueDomain = {name: 'money'};

		this.chartDataScope.chartDataSource = {
			legends: legends,
			labels: labels,
			datasets: dataSets
		};
	}

	private clearChart(){
		this.data = {
			entities: [],
			quotes: []
		};
		this.chartTitle = '';
		this.chartDataScope.chartDataSource = {
			legends: [],
			labels: [],
			datasets: []
		};
	}

	private initChartDataSource() {
		this.refresh();
	}

	private handleParentSelectionChanged(type: string, selectedItem: ICompositeItemEntity | ICompositeBoqEntity) {
		if (type === 'item'){
			const prcItem = selectedItem as ICompositeItemEntity;
			if (prcItem) {
				this.chartService.buildEntities(type, this.itemDataService.getDataForGraphicalEvaluation(prcItem), prcItem);
			}
		}
		if (type === 'boq'){
			const boqItem = selectedItem as ICompositeItemEntity;
			if (boqItem) {
				this.chartService.buildEntities(type, this.boqDataService.getDataForGraphicalEvaluation(boqItem), boqItem);
			}
		}
	}

	public onQuoteEntitesChange(newValue: boolean, entity: IChartDataEntity) {
		const changedEntity = this.data.entities.find(item => item.Id == entity.Id);
		if (changedEntity) {
			changedEntity.IsSelected = newValue;
		}
		this.refresh();
	}

	public onQuoteChange(newValue: boolean, quote: IChartDataQuote) {
			const changedEntity = this.data.quotes.find(item => item.Id == quote.Id);
		if (changedEntity) {
			changedEntity.IsSelected = newValue;
		}
		this.refresh();
	}

	protected readonly FieldType = FieldType;
}
