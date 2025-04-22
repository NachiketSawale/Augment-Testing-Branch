import { Component, inject, OnInit } from '@angular/core';
import { SplitGridContainerComponent } from '@libs/ui/business-base';
import { CellChangeEvent, ChartTypeEnum, ConcreteMenuItem, ItemType, MouseEvent, UiCommonDialogService } from '@libs/ui/common';
import { BasicsSharedChartColorConfigDialogComponent, BasicsSharedEvaluationStatusLookupService, CHAT_COLOR_CONFIG_SCOPR_OPTION, IChatColorConfigScopeOptions } from '@libs/basics/shared';
import { find, forEach, get, includes, isArray, orderBy } from 'lodash';
import { BusinesspartnerSharedEvaluationDataService } from '../../services/evaluation-data.service';
import { PlatformTranslateService } from '@libs/platform/common';
import { SplitComponent } from '@libs/ui/external';
import { EvaluationCommonService } from '../../services/evaluation-common.service';
import { Chart, ChartDataset, ChartOptions, LegendItem } from 'chart.js';
import { EvaluationBaseService, EvaluationBaseServiceToken } from '../../services/evaluation-base.service';
import { EvaluationScreenModalService } from '../../services/evaluation-screen-modal.service';
import { EvaluationDialogToolbarLayoutService } from '../../services/layouts/evaluation-dialog-toolbar-layout.service';
import { EvaluationToolbarList, IEvaluationChartScope, IEvaluationEntity, IEvaluationGetChartDataDateSetResponseEntity, IEvaluationGetChartDataResponseEntity, IExtendCreateOptions, IExtendUpdateOptions, ILegendStyle, ISummary } from '@libs/businesspartner/interfaces';
import { IBasicsCustomizeEvaluationStatusEntity } from '@libs/basics/interfaces';

export interface IDisplayItemDescription{
	name: string;
}

@Component({
	selector: 'businesspartner-shared-evaluation',
	templateUrl: './evaluation.component.html',
	styleUrl: './evaluation.component.scss',
})
export class BusinesspartnerSharedEvaluationContainerComponent<PT extends object, MT extends object> extends SplitGridContainerComponent<IEvaluationEntity, IEvaluationEntity> implements OnInit {
	public chartType: ChartTypeEnum = ChartTypeEnum.bar;

	private readonly cloudCommonModule = 'cloud.common';
	private readonly businesspartnerMainModuleName = 'businesspartner.main';

	private readonly dialogService = inject(UiCommonDialogService);

	private readonly colorConfigScope: IChatColorConfigScopeOptions;
	public chartDataScope!: IEvaluationChartScope;

	private chartToolbarButton: ConcreteMenuItem[] = this.getChartMenuItem();
	private evalStatusCache: IBasicsCustomizeEvaluationStatusEntity[] = [];

	public chartTitle = '';
	private readonly translate = inject(PlatformTranslateService);
	private readonly evaluationCommonService = inject(EvaluationCommonService);
	private readonly evaluationStatusLookupService = inject(BasicsSharedEvaluationStatusLookupService);

	private readonly parentService: BusinesspartnerSharedEvaluationDataService<PT, MT>;

	private readonly adaptorService = inject<EvaluationBaseService<PT, MT>>(EvaluationBaseServiceToken);

	private isCellChanged = false;

	private readonly myGridConfig = {
		initCalled: false,
		columns: [],
		parentProp: 'PId',
		childProp: 'ChildrenItem',
		enableDraggableGroupBy: false,
	};

	public screenModalService: EvaluationScreenModalService = new EvaluationScreenModalService();

	public detailButton = [
		{
			caption: {
				key: this.businesspartnerMainModuleName + '.toolbarEvaluationDetail',
			},
			iconClass: 'tlb-icons ico-rec',
			id: 't-evaluationDetail',
			disabled: true,
			type: ItemType.Item,
			fn: () => {
				const item = this.parentService.getSelection();
				if (item && item.length > 0) {
					this.showEvaluationDetail(item[0]);
				}
			},
		},
	];

	public evaluationDetailToolbarLayoutService: EvaluationDialogToolbarLayoutService;
	public toolbarList: EvaluationToolbarList;

	// let serviceDescriptor = $scope.getContentValue('serviceDescriptor') || $scope.getContentValue('uuid'),
	// accessRightDescriptor = $scope.getContentValue('permission') || $scope.getContentValue('uuid'),
	// adaptorServiceName = $scope.getContentValue('configService');
	//
	// let adaptorContainer = evaluationAdaptorHelper.createAdaptorContainer(serviceDescriptor, adaptorServiceName ? $injector.get(adaptorServiceName) : {});
	// let serviceContainer = adaptorContainer.serviceContainer;

	public constructor() {
		super();
		this.parentService = this.parentSelection as unknown as BusinesspartnerSharedEvaluationDataService<PT, MT>;

		this.colorConfigScope = {
			viewDatakey: 'chartColor',
		};

		this.evaluationDetailToolbarLayoutService = new EvaluationDialogToolbarLayoutService();
		this.toolbarList = {
			groupViewTools: this.evaluationDetailToolbarLayoutService.groupViewTools,
			documentViewTools: this.evaluationDetailToolbarLayoutService.documentViewTools,
			clerkCommonViewTools: this.evaluationDetailToolbarLayoutService.clerkCommonViewTools,
		};

		this.evaluationCommonService.adaptorService = this.adaptorService;

		this.parentService.setCreateOptions();
	}

	public AddDetailMenuItem() {
		this.uiAddOns.toolbar.addItems({
			type: ItemType.Sublist,
			sort: -50,
			list: {
				items: this.detailButton as ConcreteMenuItem[],
			},
		});
	}

	public getChartMenuItem() {
		this.chartToolbarButton = [
			{
				//echart: radar
				id: 't-radarChart',
				type: ItemType.Item,
				caption: {
					key: this.businesspartnerMainModuleName + '.toolbarRadarChart',
				},
				iconClass: 'tlb-icons ico-radar-chart',
				disabled: true,
				fn: () => {
					this.chartDataScope.chartType = ChartTypeEnum.radar;
				},
			},
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

	public updateMenuItem() {
		this.uiAddOns.toolbar.deleteItems(['create', 'delete']);

		this.uiAddOns.toolbar.addItems([
			{
				caption: {
					key: this.businesspartnerMainModuleName + '.toolbarNewEvaluationScreen',
				},
				iconClass: 'tlb-icons ico-rec-new',
				id: 't-newEvaluation',
				sort: 0,
				permission: '#c',
				type: ItemType.Item,
				fn: (info) => {
					const createOptions: IExtendCreateOptions = {
						EvaluationMotiveId: 1,
						canEditReferences: true,
						canSave: true,
						saveImmediately: false,
						isCreate: true,
					};

					this.adaptorService.extendCreateOptions(createOptions, this.parentService.getParent());

					this.screenModalService.showEvaluationScreenModalDialog(createOptions, this.toolbarList);
				},
			},
			{
				id: 'grpDeletion',
				type: ItemType.Sublist,
				list: {
					items: [
						{
							caption: {
								key: 'cloud.common.taskBarDeleteRecord',
							},
							iconClass: 'tlb-icons ico-rec-delete',
							id: 'delete',
							permission: '#d',
							type: ItemType.Item,
							disabled: (info) => {
								if (!this.parentService.supportsDelete()) {
									return true;
								}

								const selection = this.parentService.getSelection();
								return !(selection && selection.length > 0);
							},
							fn: (info) => {
								const selection = this.parentService.getSelection();
								if (selection && selection.length > 0) {
									this.parentService.delete(selection);
									this.parentService.deleteEntities(selection);

									// this.evaluationCommonService.onEvaluationDataGridRefreshEvent.emit([]);
								}
							},
						},
					],
				},
				sort: 10,
			},
		]);
	}

	public dataChanged() {
		this.chartDataScope.chartDataSource = {
			labels: [],
			datasets: [],
			legends: [],
		};
		this.chartTitle = '';
		this.refreshChartData();
	}

	private showChartConfigDialog() {
		this.colorConfigScope.maxValue = this.evaluationCommonService.initColor;
		this.colorConfigScope.minValue = this.evaluationCommonService.initColor;
		this.colorConfigScope.avgValue = this.evaluationCommonService.initColor;

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
							info.dialog.body.maxValueDataControlContext.value = this.evaluationCommonService.initColor;
							info.dialog.body.minValueDataControlContext.value = this.evaluationCommonService.initColor;
							info.dialog.body.avgValueDateControlContext.value = this.evaluationCommonService.initColor;
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
					this.refreshChartData();
				}
			});
	}

	private getEvaluationDataList() {
		let parentList: IEvaluationEntity[] = [];
		if (this.parentService) {
			parentList = this.parentService.getList();
		}
		return parentList;
	}

	private refreshChartData() {
		const evaluationDataList = this.getEvaluationDataList();
		if (evaluationDataList && evaluationDataList.length > 0) {
			const checkItem = find(evaluationDataList, { Checked: true });
			if (checkItem) {
				this.updateChartData(checkItem);
			}
		}
	}

	private updateChartData(parentNode?: IEvaluationEntity) {
		this.updateToolbarStatusList();

		if (!parentNode || !parentNode.Checked) {
			this.initChartDataSource();
			this.chartTitle = '';
		} else {
			const children = parentNode.ChildrenItem && parentNode.ChildrenItem.length > 0 ? parentNode.ChildrenItem : null;
			if (children) {
				const evaluationIds = children.map(function (item) {
					return item.Id;
				});

				const displayIdItem: number[] = [],
					displayItemDescription: IDisplayItemDescription[] = [];
				for (const item of children){
					if (item.Checked) {
						displayIdItem.push(item.Id);
						displayItemDescription.push({ name: item.Code ?? '' });
					}
				}

				displayIdItem.push(-1000); // average
				// displayIdItem.push(-1001); // summary
				displayItemDescription.push({ name: this.translate.instant('businesspartner.main.chartLegend.average').text });
				// displayItemDescription.push({ name: $translate.instant('businesspartner.main.chartLegend.total')});

				this.parentService.getChartData(parentNode.EvaluationSchemaFk, evaluationIds).subscribe((data) => {
					if (data) {
						if (displayIdItem.length > 1) {
							const newCacheData: Map<number, IEvaluationGetChartDataDateSetResponseEntity[]> = new Map<number, IEvaluationGetChartDataDateSetResponseEntity[]>();
							if (data.DataSets) {
								const groupData: Map<number, IEvaluationGetChartDataDateSetResponseEntity[]> = data.DataSets;
								for (const key of displayIdItem){
									if (groupData) {
										const value = get(groupData, key);
										if (value) {
											newCacheData.set(key, value);
										}
									}
								}
							}
							data.DataSets = newCacheData;
							this.chartTitle = this.adaptorService.getChartTitle(parentNode, this.parentService.getParent()!);
							this.builtChartData(data, displayIdItem, displayItemDescription);
						} else {
							this.chartTitle = '';
							this.initChartDataSource();
						}
					}
				});
			} else {
				this.initChartDataSource();
			}
		}
	}

	private builtChartData(data: IEvaluationGetChartDataResponseEntity, displayIdItem: number[], displayItemDescription: IDisplayItemDescription[]) {
		const labels = !data['Labels']
			? []
			: data['Labels'].map(function (item) {
					return item.Description ?? '';
				});
		const datasets: IEvaluationGetChartDataDateSetResponseEntity[][] = [];
		let chartDataSet: ChartDataset[] = [];
		if (data['DataSets']) {
			const averages: ISummary[] = [];
			const summaries: ISummary[] = [];
			let count = 0;

			const sortedDataSets = orderBy(Array.from(data.DataSets), function (item) {
				return displayIdItem.indexOf(item[1][0].EvaluationFk);
			});

			for (const item of sortedDataSets){
				const evaluationId = item[1][0].EvaluationFk;
				if (displayIdItem.indexOf(evaluationId) > -1) {
					datasets.push(item[1]);
				}
				count++;
				this.evaluationCommonService.summary(summaries, item[1]);
			}

			this.evaluationCommonService.average(averages, summaries, count);

			if (displayIdItem.indexOf(-1000) > -1) {
				datasets.push(averages as unknown as IEvaluationGetChartDataDateSetResponseEntity[]);
			}
			chartDataSet = datasets.map(function (item) {
				return {
					data: item.map(function (subItem) {
						return Number(subItem.Total.toFixed(2));
					}),
				};
			});
		}

		this.chartDataScope.chartDataSource = {
			legends: displayItemDescription,
			labels: labels,
			datasets: chartDataSet,
		};
	}

	private initChartDataSource() {
		if (this.chartDataScope) {
			this.chartDataScope.chartDataSource = {
				legends: [],
				labels: [],
				datasets: [],
			};
		}
	}

	private updateToolbarStatusList() {
		const chartButtons = ['t-radarChart', 't-columnChart', 't-lineChart', 't-3dColumns'];
		const evaluationDataList = this.getEvaluationDataList();

		let hasChecked = false;
		for (const item of evaluationDataList){
			hasChecked = !!find(item.ChildrenItem, { Checked: true });
			if (find(item.ChildrenItem, { Checked: true })) {
				break;
			}
		}

		forEach(this.chartToolbarButton, function (item) {
			if (includes(chartButtons, item.id)) {
				item.disabled = !hasChecked;
			}
		});
	}

	public onSplitterChangeSize(split: SplitComponent) {}

	public override ngOnInit() {
		super.ngOnInit();

		this.AddDetailMenuItem();

		this.uiAddOns.toolbar.addItems(this.getChartMenuItem());

		this.updateMenuItem();

		this.initContainer();

		this.initChartOptions();

		this.evaluationStatusLookupService.getList().subscribe((value: IBasicsCustomizeEvaluationStatusEntity[]) => {
			this.evalStatusCache = value;
		});

		this.initEvent();
	}

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

	public onCellChanged(event: CellChangeEvent<IEvaluationEntity>) {
		this.setStateAndUpdateChartData(event.item);
		this.refreshGrid();

		this.isCellChanged = true;
	}

	public onItemsChanged(items: IEvaluationEntity[]) {
		if (this.isCellChanged) {
			this.isCellChanged = false;
			return;
		}

		const checkedRoot = items.find((item) => item.Checked);
		this.setStateAndUpdateChartData(checkedRoot);
	}

	public override onSelectionChanged(selectedRows: IEvaluationEntity[]) {
		let isDisabled = true;
		this.parentService.select(selectedRows);
		if (selectedRows && selectedRows.length > 0) {
			const data = selectedRows[0];
			isDisabled = !(data && data.Id > 0);
		}
		this.detailButton[0].disabled = isDisabled;
	}

	protected setStateAndUpdateChartData(entity?: IEvaluationEntity) {
		if (!entity) {
			this.updateChartData(entity);
			return;
		}

		let currentParentItem: IEvaluationEntity;
		if (entity.Id < 0 && entity.ChildrenItem && entity.ChildrenItem.length > 0) {
			currentParentItem = entity;

			this.setStateRecursive(entity, entity.Checked);
		} else {
			currentParentItem = find(this.parentService.getList(), { Id: entity.PId }) as IEvaluationEntity;

			const childrenNodes = currentParentItem.ChildrenItem;
			if (childrenNodes) {
				currentParentItem.Checked = childrenNodes.some(function (item) {
					return item.Checked;
				});
			}
		}

		this.parentService.getList().forEach((item) => {
			if (item !== currentParentItem) {
				this.setStateRecursive(item, false);
			}
		});

		this.updateChartData(currentParentItem);
	}

	private setStateRecursive(groupData: IEvaluationEntity, newState: boolean) {
		groupData.Checked = newState;
		// region group select
		const subGroupData = groupData.ChildrenItem;
		if (subGroupData && subGroupData.length > 0) {
			if (newState === true) {
				const notToCountStatusIds: number[] = [];

				if (this.evalStatusCache) {
					forEach(this.evalStatusCache, function (item) {
						if (item.NotToCount) {
							notToCountStatusIds.push(item.Id);
						}
					});
				}
				if (notToCountStatusIds && notToCountStatusIds.length > 0 && groupData?.ChildrenItem) {
					const subGroupData = groupData.ChildrenItem;
					for (const item of subGroupData) {
						item.Checked = true;
						for (let c = 0; c < notToCountStatusIds.length; c++) {
							if (item.EvalStatusFk === notToCountStatusIds[c]) {
								item.Checked = false;
								break;
							}
						}
					}
				}
			} else {
				for (const item of subGroupData){
					item.Checked = newState;
				}
			}
		}
	}

	private refreshGrid() {
		//update items, it needs to create new reference to assign.
		this.parentGridConfig = {
			uuid: this.parentGridConfig.uuid,
			items: [...this.parentService.getList()],
			columns: this.parentGridConfig.columns,
		};

		this.parentService.setColumns(this.parentGridConfig.columns);
	}

	public onGridDblClick(event: MouseEvent<IEvaluationEntity>) {
		this.showEvaluationDetail(event.item);
	}

	private showEvaluationDetail(item: IEvaluationEntity | null) {
		if (item && item.PId !== null && item.PId !== 0) {
			const updateOptions: IExtendUpdateOptions = {
				evaluationId: item.Id,
				permissionObjectInfo: item['EvalPermissionObjectInfo'],
				canEditReferences: true,
				canSave: true,
				saveImmediately: false,
				getDataFromLocal: true,
				isUpdate: true,
			};

			this.adaptorService.extendUpdateOptions(updateOptions, this.parentService.getParent());

			this.screenModalService.showEvaluationScreenModalDialog(updateOptions, this.toolbarList);
		}
	}

	private initEvent() {
		this.evaluationCommonService.onEvaluationDataGridRefreshEvent.subscribe((info) => {
			this.refreshGrid();
		});

		this.evaluationCommonService.onDataChangeMessenger.subscribe((info) => {
			this.dataChanged();
		});
	}
}