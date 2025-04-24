/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { FieldType, ItemType, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { BasicsDependentDataChartDataService } from './basics-dependent-data-chart-data.service';
import { IUserChartEntity } from '../model/entities/user-chart-entity.interface';
import { ColorFormat } from '@libs/platform/common';
import { BasicsDependentDataColumnLookupService } from '../services/lookup-service/basics-dependent-data-column-lookup.service';
import { zonedTimeToUtc } from 'date-fns-tz';
import { ValidationResult } from '@libs/platform/data-access';
import { BasicsChartType } from '../model/enums/basics-chart-type.enum';
import { DEFAULT_COLOR } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataChartBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IUserChartEntity>, IUserChartEntity> {
	private readonly dataService = inject(BasicsDependentDataChartDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly columnLookupService = inject(BasicsDependentDataColumnLookupService);
	private readonly scaleType = this.dataService.scaleType;

	private readonly positionType = {
		Top: 'Top',
		Left: 'Left',
		Bottom: 'Bottom',
		Right: 'Right'
	};

	private readonly chartGroupId = {
		Title: 'titleGroup',
		Legend: 'legendGroup',
		Config: 'configGroup',
		XAxes: 'xAxesGroup',
		YAxes: 'yAxesGroup',
	};

	public onCreate(containerLink: IGridContainerLink<IUserChartEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't5',
				caption: {key: 'basics.dependentdata.chartConfig'},
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-container-config',
				fn: async () => {
					const entity = this.dataService.getSelectedEntity();
					if (!entity) {
						await this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
						return;
					}
					if (entity.DependentdatacolumnXFk === 0 || entity.DependentdatacolumnYFk === 0) {
						await this.messageBoxService.showInfoBox('basics.dependentdata.noXYColumn', 'info', true);
						return;
					}
					if (!entity.DependentdatacolumnYFk) {
						await this.messageBoxService.showInfoBox('basics.dependentdata.noNumErrorMessage', 'info', true);
						return;
					}
					const defaultConfig = entity.Config ? JSON.parse(entity.Config) : {
						version: 1.0,
						title: {show: true, position: 'left', color: DEFAULT_COLOR},
						legend: {show: true, position: 'left', color: DEFAULT_COLOR},
						group: {enable: false},
						scale: {
							x: {
								type: this.scaleType.Linear,
								time: {dataFormat: 'MM/DD/YYYY', unit: 'day'},
								customCategory: false,
								categorys: []
							}, y: {type: this.scaleType.Linear}
						}
					};
					const chartTypes = [BasicsChartType.Line, BasicsChartType.Bar, BasicsChartType.Bubble];
					if (!chartTypes.includes(entity.ChartTypeFk)) {
						defaultConfig.scale.x.type = this.scaleType.Category;
						if (defaultConfig.scale.x.type === this.scaleType.Time && defaultConfig.scale.x.time) {
							if (defaultConfig.scale.x.time.max) {
								defaultConfig.scale.x.time.max = zonedTimeToUtc(defaultConfig.scale.x.time.max, 'UTC');//moment.utc(defaultConfig.scale.x.time.max);
							}
							if (defaultConfig.scale.x.time.min) {
								defaultConfig.scale.x.time.min = zonedTimeToUtc(defaultConfig.scale.x.time.min, 'UTC');//moment.utc(defaultConfig.scale.x.time.min);
							}
						}
					}
					const xColumnEntity = this.columnLookupService.cache.getItem({id: entity.DependentdatacolumnXFk});
					const xDomainName = xColumnEntity?.DisplayDomainEntity?.DomainName;
					if ('default' === xDomainName) {
						defaultConfig.scale.x.type = this.scaleType.Category;
					}

					const timeFormatItems = [
						{
							id: 'MM/DD/YYYY HH:mm',
							displayName: {
								text: 'MM/DD/YYYY HH:mm',
							}
						},
						{
							id: 'MM/DD/YYYY',
							displayName: {
								text: 'MM/DD/YYYY',
							}
						},
						{
							id: 'DD-MM-YYYY HH:mm',
							displayName: {
								text: 'DD-MM-YYYY HH:mm',
							}
						},
						{
							id: 'DD-MM-YYYY',
							displayName: {
								text: 'DD-MM-YYYY',
							}
						}
					];
					const unitItems = [
						{
							id: 'millisecond',
							displayName: {
								text: 'Millisecond',
								key: 'basics.dependentdata.unitConfig.millisecond',
							}
						},
						{
							id: 'second',
							displayName: {
								text: 'Second',
								key: 'basics.dependentdata.unitConfig.second',
							}
						},
						{
							id: 'minute',
							displayName: {
								text: 'Minute',
								key: 'basics.dependentdata.unitConfig.minute',
							}
						},
						{
							id: 'hour',
							displayName: {
								text: 'Hour',
								key: 'basics.dependentdata.unitConfig.hour',
							}
						},
						{
							id: 'day',
							displayName: {
								text: 'Day',
								key: 'basics.dependentdata.unitConfig.day',
							}
						},
						{
							id: 'week',
							displayName: {
								text: 'Week',
								key: 'basics.dependentdata.unitConfig.week',
							}
						},
						{
							id: 'month',
							displayName: {
								text: 'Month',
								key: 'basics.dependentdata.unitConfig.month',
							}
						},
						{
							id: 'quarter',
							displayName: {
								text: 'Quarter',
								key: 'basics.dependentdata.unitConfig.quarter',
							}
						},
						{
							id: 'year',
							displayName: {
								text: 'Quarter',
								key: 'basics.dependentdata.unitConfig.Year',
							}
						}
					];
					const scaleItems = [
						{
							id: this.scaleType.Linear,
							displayName: {
								text: 'Numeric Linear',
								key: 'basics.dependentdata.scaleConfig.linear',
							}
						}, {
							id: this.scaleType.Time,
							displayName: {
								text: 'Time',
								key: 'basics.dependentdata.scaleConfig.time',
							}
						}, {
							id: this.scaleType.Category,
							displayName: {
								text: 'Category',
								key: 'basics.dependentdata.scaleConfig.category',
							}
						}
					];
					const positionItems = [{
						id: this.positionType.Top,
						displayName: {
							text: 'Top',
							key: 'basics.common.chartConfig.top',
						}
					}, {
						id: this.positionType.Left,
						displayName: {
							text: 'Left',
							key: 'basics.common.chartConfig.left',
						}
					}, {
						id: this.positionType.Right,
						displayName: {
							text: 'Right',
							key: 'basics.common.chartConfig.right',
						}
					}, {
						id: this.positionType.Bottom,
						displayName: {
							text: 'Bottom',
							key: 'basics.common.chartConfig.bottom',
						}
					}];
					const result = await this.formDialogService.showDialog({
						id: 'dd1165db61c24f0e9df1d5b463e5829d',
						width: '600px',
						height: '500px',
						windowClass: 'body-flex-column',
						headerText: {key: 'basics.dependentdata.chartConfig'},
						formConfiguration: {
							formId: 'basics.dependentdata.chartConfig',
							showGrouping: true,
							groups: [
								{
									groupId: this.chartGroupId.Title,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Legend,
									header: {key: 'basics.dependentdata.entityLegendConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Config,
									header: {key: 'basics.dependentdata.entityGroupConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.XAxes,
									header: {key: 'basics.dependentdata.entityxAxesConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.YAxes,
									header: {key: 'basics.dependentdata.entityyAxesConfig'},
									open: true
								}
							],
							rows: [
								{
									groupId: this.chartGroupId.Title,
									id: 'titleShow',
									label: {
										key: 'basics.dependentdata.show'
									},
									type: FieldType.Boolean,
									model: 'title.show'
								},
								{
									groupId: this.chartGroupId.Title,
									id: 'titlePosition',
									label: {
										key: 'basics.dependentdata.position'
									},
									type: FieldType.Select,
									itemsSource: {
										items: positionItems
									},
									model: 'title.position'
								},
								{
									groupId: this.chartGroupId.Title,
									id: 'titlecolor',
									label: {
										key: 'basics.dependentdata.color'
									},
									type: FieldType.Color,
									format: ColorFormat.RgbaValue,
									model: 'title.color'
								},
								{
									groupId: this.chartGroupId.Legend,
									id: 'legendShow',
									label: {
										key: 'basics.dependentdata.show'
									},
									type: FieldType.Boolean,
									model: 'legend.show'
								},
								{
									groupId: this.chartGroupId.Legend,
									id: 'legendPosition',
									label: {
										key: 'basics.dependentdata.position'
									},
									type: FieldType.Select,
									itemsSource: {
										items: positionItems
									},
									model: 'legend.position'
								},
								{
									groupId: this.chartGroupId.Legend,
									id: 'legendcolor',
									label: {
										key: 'basics.dependentdata.color'
									},
									type: FieldType.Color,
									format: ColorFormat.RgbaValue,
									model: 'legend.color'
								},
								{
									groupId: this.chartGroupId.Config,
									id: 'selectable',
									label: {
										key: 'basics.dependentdata.selectable'
									},
									type: FieldType.Boolean,
									model: 'group.enable'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'scaleType',
									label: {
										key: 'basics.dependentdata.entityxAxesConfig'
									},
									type: FieldType.Select,
									itemsSource: {
										items: scaleItems
									},
									validator: (info) => {
										if (info.value === this.scaleType.Linear) {
											//todo refresh dialog to use visible
										}
										return new ValidationResult();
									},
									model: 'scale.x.type'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'linearStep',
									label: {
										key: 'basics.dependentdata.step'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.x.linear.step'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'linearMin',
									label: {
										key: 'basics.dependentdata.minValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.x.linear.min'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'linearMax',
									label: {
										key: 'basics.dependentdata.maxValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.x.linear.max'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'linearTickCount',
									label: {
										key: 'basics.dependentdata.tickCount'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.x.linear.tickCount'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'linearUom',
									label: {
										key: 'basics.dependentdata.uom'
									},
									type: FieldType.Description,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.x.linear.uom'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeDataFormat',
									label: {
										key: 'basics.dependentdata.displayFormat'
									},
									type: FieldType.Select,
									itemsSource: {
										items: timeFormatItems
									},
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.dataFormat'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeUnit',
									label: {
										key: 'basics.dependentdata.unit'
									},
									type: FieldType.Select,
									itemsSource: {
										items: unitItems
									},
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.unit'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeStep',
									label: {
										key: 'basics.dependentdata.step'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.step'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeMinValue',
									label: {
										key: 'basics.dependentdata.minValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.min'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeMaxValue',
									label: {
										key: 'basics.dependentdata.maxValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.max'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeTickCount',
									label: {
										key: 'basics.dependentdata.tickCount'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.tickCount'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'timeUom',
									label: {
										key: 'basics.dependentdata.uom'
									},
									type: FieldType.Description,
									visible: defaultConfig.scale.x.type === this.scaleType.Time,
									model: 'scale.x.time.uom'
								},
								{
									groupId: this.chartGroupId.XAxes,
									id: 'customCategory',
									label: {
										key: 'basics.dependentdata.customCategory'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Category,
									model: 'scale.x.customCategory'
								},
								//todo category tools
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yScaleType',
									label: {
										key: 'basics.dependentdata.scaleType'
									},
									type: FieldType.Select,
									itemsSource: {
										items: [
											{
												id: this.scaleType.Linear,
												displayName: {
													text: 'Numeric Linear',
													key: 'basics.dependentdata.scaleConfig.linear',
												}
											}
										]
									},
									model: 'scale.y.type'
								},
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yLinearStep',
									label: {
										key: 'basics.dependentdata.step'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.y.linear.step'
								},
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yLinearMin',
									label: {
										key: 'basics.dependentdata.minValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.y.linear.min'
								},
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yLinearMax',
									label: {
										key: 'basics.dependentdata.maxValue'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.y.linear.max'
								},
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yLinearTickCount',
									label: {
										key: 'basics.dependentdata.tickCount'
									},
									type: FieldType.Quantity,
									visible: defaultConfig.scale.x.type === this.scaleType.Linear,
									model: 'scale.y.linear.tickCount'
								},
								{
									groupId: this.chartGroupId.YAxes,
									id: 'yUom',
									label: {
										key: 'basics.dependentdata.uom'
									},
									type: FieldType.Description,
									model: 'scale.y.linear.uom'
								},
							]
						},
						entity: defaultConfig,
						resizeable: true
					});
					if (result?.closingButtonId === StandardDialogButtonId.Ok && result.value) {
						if (result.value) {
							entity.Config = JSON.stringify(result.value);
							this.dataService.setModified([entity]);
						}
					}
				},
				sort: 100
			}
		], EntityContainerCommand.Settings);
	}
}