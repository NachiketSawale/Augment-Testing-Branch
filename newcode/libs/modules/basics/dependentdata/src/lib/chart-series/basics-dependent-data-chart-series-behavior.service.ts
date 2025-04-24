/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { EntityContainerCommand, IEntityContainerBehavior, IGridContainerLink } from '@libs/ui/business-base';
import { FieldType, FormRow, ItemType, StandardDialogButtonId, UiCommonFormDialogService, UiCommonMessageBoxService } from '@libs/ui/common';
import { IUserChartSeriesEntity } from '../model/entities/user-chart-series-entity.interface';
import { BasicsDependentDataChartSeriesDataService } from './basics-dependent-data-chart-series-data.service';
import { ColorFormat } from '@libs/platform/common';
import { BasicsChartType } from '../model/enums/basics-chart-type.enum';
import { DEFAULT_COLOR } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class BasicsDependentDataChartSeriesBehaviorService implements IEntityContainerBehavior<IGridContainerLink<IUserChartSeriesEntity>, IUserChartSeriesEntity> {
	private readonly dataService = inject(BasicsDependentDataChartSeriesDataService);
	private readonly messageBoxService = inject(UiCommonMessageBoxService);
	private readonly formDialogService = inject(UiCommonFormDialogService);
	private readonly chartGroupId = {
		Line: 'line',
		Bar: 'bar',
		Radar: 'radar',
		Bubble: 'bubble',
		Polar: 'polar'
	};
	private readonly lineType = {
		StraightLine: 0,
		BezierCurve: 1
	};

	public onCreate(containerLink: IGridContainerLink<IUserChartSeriesEntity>) {
		containerLink.uiAddOns.toolbar.addItemsAtId([
			{
				id: 't5',
				caption: {key: 'basics.dependentdata.seriesConfig'},
				hideItem: false,
				type: ItemType.Item,
				iconClass: 'tlb-icons ico-container-config',
				fn: async () => {
					const entity = this.dataService.getSelectedEntity();
					if (!entity) {
						await this.messageBoxService.showInfoBox('cloud.common.noCurrentSelection', 'info', true);
						return;
					}
					const configItem = entity.Config ? JSON.parse(entity.Config) : {
						line: {
							type: 0,
							width: 2,
							color: DEFAULT_COLOR,
							border: {color: DEFAULT_COLOR, width: 2},
							point: {radius: 2},
							showLine: true,
							fillArea: true,
							stack: true
						},
						bar: {
							backgroundColor: DEFAULT_COLOR,
							border: {width: 2, color: DEFAULT_COLOR},
							stack: true
						}
					};
					const lineItems = [{
						id: this.lineType.StraightLine,
						displayName: {
							text: 'Straight Line',
							key: 'basics.dependentdata.straightLine',
						}
					}, {
						id: this.lineType.BezierCurve,
						displayName: {
							text: 'Bezier curve',
							key: 'basics.dependentdata.bezierCurve',
						}
					}];
					let seriesRows = [
						{
							groupId: this.chartGroupId.Line,
							id: 'lineType',
							label: {
								key: 'basics.dependentdata.lineType'
							},
							type: FieldType.Select,
							itemsSource: {
								items: lineItems
							},
							model: 'line.type'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'lineWidth',
							label: {
								key: 'basics.dependentdata.lineWidth'
							},
							type: FieldType.Quantity,
							model: 'line.width'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'lineColor',
							label: {
								key: 'basics.dependentdata.lineColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'line.color'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'pointBorderColor',
							label: {
								key: 'basics.dependentdata.pointBorderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'line.border.color'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'pointBorderWidth',
							label: {
								key: 'basics.dependentdata.pointBorderWidth'
							},
							type: FieldType.Quantity,
							model: 'line.border.width'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'pointRadius',
							label: {
								key: 'basics.dependentdata.pointRadius'
							},
							type: FieldType.Quantity,
							model: 'line.point.radius'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'showLine',
							label: {
								key: 'basics.dependentdata.showLine'
							},
							type: FieldType.Boolean,
							model: 'line.showLine'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'fillAreaUnderLine',
							label: {
								key: 'basics.dependentdata.fillAreaUnderLine'
							},
							type: FieldType.Boolean,
							model: 'line.fillArea'
						},
						{
							groupId: this.chartGroupId.Line,
							id: 'stackedChart',
							label: {
								key: 'basics.dependentdata.stackedChart'
							},
							type: FieldType.Boolean,
							model: 'line.stack'
						},
						// bar group
						{
							groupId: this.chartGroupId.Bar,
							id: 'barBackgroundColor',
							label: {
								key: 'basics.dependentdata.backgroundColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'bar.backgroundColor'
						},
						{
							groupId: this.chartGroupId.Bar,
							id: 'barBorderWidth',
							label: {
								key: 'basics.dependentdata.borderWidth'
							},
							type: FieldType.Quantity,
							model: 'bar.border.width'
						},
						{
							groupId: this.chartGroupId.Bar,
							id: 'barBorderColor',
							label: {
								key: 'basics.dependentdata.borderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'bar.border.color'
						},
						{
							groupId: this.chartGroupId.Bar,
							id: 'stackedChart',
							label: {
								key: 'basics.dependentdata.stackedChart'
							},
							type: FieldType.Boolean,
							model: 'bar.stack'
						},
						// radar group
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarBackgroundColor',
							label: {
								key: 'basics.dependentdata.backgroundColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'radar.backgroundColor'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarBorderWidth',
							label: {
								key: 'basics.dependentdata.borderWidth'
							},
							type: FieldType.Quantity,
							model: 'radar.border.width'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarBorderColor',
							label: {
								key: 'basics.dependentdata.borderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'radar.border.color'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarPointBorderColor',
							label: {
								key: 'basics.dependentdata.pointBorderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'radar.point.border.color'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarPointColor',
							label: {
								key: 'basics.dependentdata.pointColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'radar.point.color'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarPointBorderWidth',
							label: {
								key: 'basics.dependentdata.pointBorderWidth'
							},
							type: FieldType.Quantity,
							model: 'radar.point.border.width'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'radarPointRadius',
							label: {
								key: 'basics.dependentdata.pointRadius'
							},
							type: FieldType.Quantity,
							model: 'radar.point.radius'
						},
						{
							groupId: this.chartGroupId.Radar,
							id: 'fillArea',
							label: {
								key: 'basics.dependentdata.fillArea'
							},
							type: FieldType.Boolean,
							model: 'radar.fillArea'
						},
						// polar group
						{
							groupId: this.chartGroupId.Polar,
							id: 'polarBackgroundColor',
							label: {
								key: 'basics.dependentdata.backgroundColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'polar.backgroundColor'
						},
						{
							groupId: this.chartGroupId.Polar,
							id: 'polarBorderWidth',
							label: {
								key: 'basics.dependentdata.borderWidth'
							},
							type: FieldType.Quantity,
							model: 'polar.border.width'
						},
						{
							groupId: this.chartGroupId.Polar,
							id: 'polarBorderColor',
							label: {
								key: 'basics.dependentdata.borderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'polar.border.color'
						},
						// bubble group
						{
							groupId: this.chartGroupId.Bubble,
							id: 'bubblePointColor',
							label: {
								key: 'basics.dependentdata.pointBorderColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'bubble.borderColor'
						},
						{
							groupId: this.chartGroupId.Bubble,
							id: 'bubblePointColor',
							label: {
								key: 'basics.dependentdata.pointColor'
							},
							type: FieldType.Color,
							format: ColorFormat.RgbaValue,
							model: 'bubble.pointColor'
						},
						{
							groupId: this.chartGroupId.Bubble,
							id: 'bubbleBorderWidth',
							label: {
								key: 'basics.dependentdata.pointBorderWidth'
							},
							type: FieldType.Quantity,
							model: 'polar.pointBorderWidth'
						},
						{
							groupId: this.chartGroupId.Bubble,
							id: 'bubblePointStyle',
							label: {
								key: 'basics.dependentdata.pointStyle'
							},
							type: FieldType.Quantity,
							model: 'polar.pointStyle'
						},
					];
					switch (entity.ChartTypeFk) {
						case BasicsChartType.Line:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Line);
							break;
						case BasicsChartType.Bar:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Bar);
							break;
						case BasicsChartType.Radar:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Radar);
							break;
						case BasicsChartType.PolarArea:
						case BasicsChartType.Pie:
						case BasicsChartType.Doughnut:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Polar);
							break;
						case BasicsChartType.Bubble:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Bubble);
							break;
						default:
							seriesRows = seriesRows.filter(t => t.groupId === this.chartGroupId.Line);
					}
					const result = await this.formDialogService.showDialog({
						id: 'dba3eb6b59e741478e577548f7e1a245',
						width: '400px',
						height: '500px',
						headerText: {key: 'basics.dependentdata.seriesConfig'},
						formConfiguration: {
							formId: 'basics.dependentdata.seriesConfig',
							showGrouping: false,
							groups: [
								{
									groupId: this.chartGroupId.Line,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Bar,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Radar,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Polar,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								},
								{
									groupId: this.chartGroupId.Bubble,
									header: {key: 'basics.dependentdata.entityTitleConfig'},
									open: true
								}
							],
							rows: [...seriesRows] as FormRow<object>[]
						},
						entity: configItem,
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
