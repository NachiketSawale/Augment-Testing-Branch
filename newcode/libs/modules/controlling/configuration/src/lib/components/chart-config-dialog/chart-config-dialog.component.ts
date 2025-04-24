/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, OnInit } from '@angular/core';
import { PlatformTranslateService } from '@libs/platform/common';
import { ChartConfigCommonService, ColumnDef, FieldType, getCustomDialogDataToken, IChartDataSource, IDialog, IFormConfig, IFormDialog, IGridConfiguration, IMenuItemsList, ItemType } from '@libs/ui/common';
import { ValidationResult } from '@libs/platform/data-access';
import { IChartConfig } from './chart-config-dialog-entity.interface';
import { IMdcContrChartCategoryEntity } from '../../model/entities/mdc-contr-chart-category-entity.interface';
import { forEach, orderBy, filter, find, padStart } from 'lodash';
import { IMdcContrColumnPropDefEntity } from '../../model/entities/mdc-contr-column-prop-def-entity.interface';
import { ChartTypeEnum } from '@libs/ui/common';
import { IChartConfigItem } from '@libs/basics/shared';


@Component({
  selector: 'controlling-configuration-chart-config-dialog',
  templateUrl: './chart-config-dialog.component.html',
  styleUrl: './chart-config-dialog.component.scss'
})
export class ChartConfigDialogComponent implements OnInit {

	private readonly translateService = inject(PlatformTranslateService);
	private readonly dialogCommonService = inject(ChartConfigCommonService);



	public readonly dialogInfo: IFormDialog<IChartConfig>;

	public constructor() {
		this.dialogInfo = (function createDialogInfo(owner: ChartConfigDialogComponent): IFormDialog<IChartConfig> {
			return {
				get value(): IChartConfig | undefined {
					return owner.dialogWrapper.value;
				},
				set value(value: IChartConfig) {
					owner.dialogWrapper.value = value;
				},
				get formConfig(): IFormConfig<IChartConfig> {
					return {
						rows: []
					};
				},
				close() {
					owner.dialogWrapper.close();
				}
			};
		})(this);

		this.entity = this.dialogInfo.value;
	}

	private readonly dialogWrapper = inject(getCustomDialogDataToken<IChartConfig, ChartConfigDialogComponent>());

	private entity?: IChartConfig | null;

	// ======================= basic option ======================================================
	/**
	 *  form tab option
	 */
	protected selectItems = [
		{
			name: this.translateService.instant('basics.common.chartConfig.dataSeries').text,
			value: 'dataSeries'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.dataGroup').text,
			value: 'dataGroup'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.chartType').text,
			value: 'chartType'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.color').text,
			value: 'color'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.title').text,
			value: 'title'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.legendAndData').text,
			value: 'legendAndData'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.x_Aixs').text,
			value: 'x_Aixs'
		},
		{
			name: this.translateService.instant('basics.common.chartConfig.y_Aixs').text,
			value: 'y_Aixs'
		}
	];

	/**
	 *  form tab default value setting
	 */
	protected currentItem:{ name: string; value: string; } = this.selectItems[0];

	/**
	 *  form tab css switch
	 */
	protected selectClass(selectItem: { name: string; value: string; }){
		if(selectItem && selectItem.value === this.currentItem.value){
			return 'selected';
		}

		return '';
	}

	/**
	 *  form tab switch
	 */
	protected selectItem(selectItem: { name: string; value: string; }){
		this.currentItem = selectItem;

		if(selectItem.value === 'dataSeries'){
			this.loadSeriesData();
		}else if(selectItem.value === 'color'){
			this.loadColorData();
		}else if(selectItem.value === 'dataGroup'){
			this.loadCategoryData();
		}
	}

	protected dataItem : IChartConfigItem = {
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

	protected chartType = ChartTypeEnum.bar;

	protected isReadOnly = false;

	/**
	 *  Form control vale change event
	 */
	protected dataItemChange(field: string){
		if(field === 'ChartTypeId'){
			//this.dataItem.Is3DView = this.isLineChart() ? false :this.dataItem.Is3DView;
			this.dataItem.ReverseOrder = this.isLineChart() ? false : this.dataItem.ReverseOrder;
			this.dataItem.DrillDownForData = this.isLineChart() ? false : this.dataItem.DrillDownForData;
			this.dataItem.FilterBySelectStructure = this.isBarChart() || false;
		}
		this.loadChartData();
	}

	// ---------------------- endregion -----------------------------------------------------------

	// ====================== dataSeries ==========================================================
	/**
	 *  used to add Grid header toolbar
	 */
	protected get seriesTools(): IMenuItemsList<IDialog> {
		return {
			cssClass: 'tools',
			items: [
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.taskBarSearch', text: 'Search'},
					iconClass: 'tlb-icons ico-search-all',
					id:'create',
					fn: () => {

					}
				},
				{
					type: ItemType.Item,
					caption: {key: 'cloud.common.taskBarColumnFilter', text: 'Column Filter'},
					iconClass: 'tlb-icons ico-search-column',
					id:'delete',
					fn: () => {

					},
					disabled: () => {
						return false;
					}
				}
			]
		};
	}

	/**
	 *  used to add Grid header toolbar
	 */
	protected get context(): IDialog{
		return {
			close: () => {}
		};
	}

	private seriesColumn : ColumnDef<IMdcContrColumnPropDefEntity>[] = [
		{
			id: 'checked',
			model: 'Selected',
			type: FieldType.Boolean,
			label: {
				text: 'Selected',
				key: 'basics.common.selected'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				info.entity.Selected = info.value as boolean;
				this.loadChartData();
				return new ValidationResult();
			}
		},
		{
			id: 'code',
			model: 'Code',
			type: FieldType.Code,
			label: {
				text: 'Code',
				key: 'cloud.common.entityCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'description',
			model: 'Description',
			type: FieldType.Translation,
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	/**
	 *  series Grid config
	 */
	protected seriesGridData: IGridConfiguration<IMdcContrColumnPropDefEntity> = {
		uuid: 'd55334021fad401fa18ff6b271898777',
		columns: this.seriesColumn,
		idProperty: 'Id',
		items: [],
		skipPermissionCheck: true
	};


	private loadSeriesData(items?: IMdcContrColumnPropDefEntity[]){
		this.seriesColumn[0].readonly = this.isReadOnly;
		this.seriesGridData = {
			...this.seriesGridData,
			columns: [...this.seriesColumn],
			items: items || this.entity?.series || []
		};
	}

	// ---------------------- endregion -----------------------------------------------------------

	// ======================= catagory ===========================================================

	private categories : IMdcContrChartCategoryEntity[] = [];

	private categoryColumns: ColumnDef<IMdcContrChartCategoryEntity>[] = [
		{
			id: 'checked',
			model: 'Selected',
			type: FieldType.Boolean,
			label: {
				text: 'Selected',
				key: 'basics.common.selected'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				this.dataItem.CategoryKey = info.value ? info.entity.Id : 0;
				if(this.dataItem.CategoryKey){
					forEach(this.categories, (item)=>{
						if(item.Id !== info.entity.Id) {
							item.Selected = false;
							this.dataItem.CategoryKey = this.dataItem.CategoryKey || item.Id;
						}
					});
				}else{
					forEach(this.categories, (item) => {
						if(item.Id !== info.entity.Id && !this.dataItem.CategoryKey) {
							item.Selected = !info.value;
							this.dataItem.CategoryKey = this.dataItem.CategoryKey || item.Id;
						}
					});
				}
				//loadCategoryGrid();
				//loadChartData();
				return new ValidationResult();
			}
		},
		{
			id: 'description',
			model: 'Description',
			type: FieldType.Description,
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		}
	];

	/**
	 *  category Grid config
	 */
	protected categoryGridData:IGridConfiguration<IMdcContrChartCategoryEntity> = {
		uuid: '671b025b4b87453790b8ca52d28f9296',
		columns: this.categoryColumns,
		idProperty: 'Id',
		items: [],
		skipPermissionCheck: true
	};

	private loadCategoryData(items?: IMdcContrChartCategoryEntity[]) {
		this.categoryColumns[0].readonly = this.isReadOnly;
		this.categoryGridData = {
			...this.categoryGridData,
			columns: [...this.categoryColumns],
			items: items || this.entity?.categories || []
		};
	}

	// ---------------------- endregion -----------------------------------------------------------

	// ======================= color ==============================================================

	private colorColumns: ColumnDef<IMdcContrColumnPropDefEntity>[] = [
		{
			id: 'code',
			model: 'Code',
			type: FieldType.Code,
			label: {
				text: 'Code',
				key: 'cloud.common.entityCode'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'description',
			model: 'Description',
			type: FieldType.Translation,
			label: {
				text: 'Description',
				key: 'cloud.common.entityDescription'
			},
			visible: true,
			sortable: false,
			readonly: true
		},
		{
			id: 'color',
			model: 'Color',
			type: FieldType.Color,
			label: {
				text: 'Code',
				key: 'basics.common.chartConfig.color'
			},
			visible: true,
			sortable: false,
			readonly: false,
			validator: info => {
				info.entity.Color = info.value as number;
				info.entity.DataConfig = '{color: ' + info.entity.Color +'}';
				this.loadChartData();
				return new ValidationResult();
			}
		}
	];

	/**
	 *  color Grid config
	 */
	protected colorGridData:IGridConfiguration<IMdcContrColumnPropDefEntity> = {
		uuid: '379eb4121051486eba1495ff6214ecb1',
		columns: this.colorColumns,
		idProperty: 'Id',
		items: [],
		skipPermissionCheck: true
	};

	private loadColorData() {
		this.colorColumns[2].readonly = this.isReadOnly;

		if(this.entity && this.entity.series) {
			let colorItems = filter(this.entity.series, {Selected: true});
			if (colorItems) {
				colorItems = orderBy(colorItems, 'Code');
				forEach(colorItems, (item, idx) => {
					item.Color = item.Color || this.dialogCommonService.rgbToDecimal(idx.toString()) || 0;
				});
			}

			this.colorGridData = {
				...this.colorGridData,
				columns: [...this.colorColumns],
				items: colorItems
			};
		}
	}

	// ---------------------- endregion -----------------------------------------------------------


	protected alignitems = this.dialogCommonService.getAlignItems();

	protected chartTypes = filter(this.dialogCommonService.getChartTypes(), (item) => item.id ===1 || item.id === 2);

	/**
	 *  check chart type
	 */
	public isBarChart() {
		const chartType = find(this.chartTypes, {id:+this.dataItem.ChartTypeId});
		return chartType && chartType.code === ChartTypeEnum.bar;
	}

	/**
	 *  check chart type
	 */
	public isLineChart(){
		const chartType = find(this.chartTypes, {id:+this.dataItem.ChartTypeId});
		return chartType && chartType.code === ChartTypeEnum.line;
	}

	/**
	 * init current component
	 */
	public ngOnInit(){

		if(this.entity && this.entity.dateItem) {
			this.dataItem = this.entity.dateItem;
			if (this.isLineChart()) {
				this.dataItem.DrillDownForData = false;
				this.dataItem.ReverseOrder = false;
			}

			this.isReadOnly = this.entity.dateItem.isReadonly;
		}else if(this.entity && !this.entity.dateItem){
			this.dataItem.FilterBySelectStructure = this.isBarChart() || false;
		}

		if(this.entity && this.entity.series){
			this.entity.series = orderBy(this.entity.series, 'Code');
			let i = 0, j = 0;

			forEach(this.entity.series, (item) => {
				if(item.DataConfig){
					item.DataConfig = this.addQuoteToJsonKey(item.DataConfig);
					item.Color = JSON.parse(item.DataConfig).color;
				}

				item.RandValue1 = 0;
				if(item.Selected){
					item.RandValue2 = j === 0 ? 4 : j === 1 ? 5 : j === 2 ? 6 : 2 + j * 3;
					item.RandValue3 = j === 0 ? 7 : j === 1 ? 6 : j === 2 ? 8 : 5 + j * 3;
					item.RandValue4 = j === 0 ? 18 : j === 1 ? 24 : j === 2 ? 35 : 20 + j * 3;
					item.RandValue5 = j === 0 ? 60 : j === 1 ? 65 : j === 2 ? 59 : 30 + j * 3;
					item.RandValue6 = j === 0 ? 120 : j === 1 ? 100 : j === 2 ? 85 : 40 + j * 3;
					const randValue = this.rand(1, 20);
					item.RandValue7 = j === 0 ? 130 : j === 1 ? 170 : j === 2 ? 90 : 190 + j * randValue;
					item.RandValue8 = j === 0 ? 130 : j === 1 ? 190 : j === 2 ? 90 : 190 + j * randValue;
					item.RandValue9 = j === 0 ? 130 : j === 1 ? 190 : j === 2 ? 90 : 190 + j * randValue;
					item.RandValue10 = j === 0 ? 130 : j === 1 ? 200 : j === 2 ? 90 : 190 + j * randValue;
					j++;
				}else{
					item.RandValue2 = 2 + i * 3;
					item.RandValue3 = 5 + i * 3;
					item.RandValue4 = 20 + i * 3;
					item.RandValue5 = 30 + i * 3;
					item.RandValue6 = 40 + i * 3;
					const randValue = this.rand(1, 20);
					item.RandValue7 = 190 + i * randValue;
					item.RandValue8 = 190 + i * randValue;
					item.RandValue9 = 190 + i * randValue;
					item.RandValue10 = 190 + i * randValue;
				}

				item.Selected = !!item.Selected; // fixed issue that can't filter by uncheck, cause its value is undefined.
				item.RandBarValue1 = this.rand(0, 100);
				item.RandBarValue2 = this.rand(0, 100);
				item.RandBarValue3 = this.rand(0, 100);

				i++;
			});

			this.loadSeriesData();
		}

		if(this.entity && this.entity.categories){
			this.categories = this.entity.categories;
		}

		this.loadChartData();
	}

	private _seed = Date.now();
	private rand(min: number, max: number): number {
		const seed = this._seed;
		min = !min ? 0 : min;
		max = !max ? 1 : max;
		this._seed = (seed * 9301 + 49297) % 233280;
		return +(min + (this._seed / 233280) * (max - min)).toFixed(0);
	}

	private generateResult(){
		if(this.entity){
			this.entity.dateItem = this.dataItem;
		}
	}

	private addQuoteToJsonKey(json: string): string{
		const keyRegex = /([a-zA-Z_$][0-9a-zA-Z_$]*)(\s*:)/g;
		const replacer = (match: string, key: string, colon: string): string => {
			return `"${key}"${colon}`;
		};

		return  json.replace(keyRegex, replacer);
	}

	private findChartType(id: number){

		if(this.dataItem.Is3DView){
			return {id:0, code: ChartTypeEnum.threeD_Columns};
		}

		const res = find(this.chartTypes, {id: +id});
		return res || this.chartTypes[1];
	}

	private isDateCategory(id: number){
		let res =  find(this.categories, {Id: +id});
		res = res || this.categories[1];
		return res.IsDate;
	}

	// ======================= Chart ==============================================================
	private loadChartData(ignoreRefreshChart: boolean = false){
		this.loadColorData();

		this.chartType = this.findChartType(this.dataItem.ChartTypeId).code;

		let newDataSets: {data: number[]}[] = [];
		let newLegends: {name: string}[] = [];
		const labelNum = this.isBarChart() ? 2 : 10;
		const newLabels = [];
		for(let i=0; i<labelNum; i++){
			const date = new Date();
			newLabels.push(this.isDateCategory(this.dataItem.CategoryKey) ? date.getUTCFullYear() + '-' + (i<9 ? '0' : '') + (i +1) : 'Category ' + (i + 1));
		}

		this.legendColors = [];
		const colorDataList = this.entity && this.entity.series ? filter(this.entity.series, {Selected: true}) : [];
		forEach(colorDataList, (item)=>{
			newLegends.push({name: (item.Description ? item.Description.Translated : '')});
			this.legendColors.push(item.Color ? this.dialogCommonService.parseDecToRgb(padStart(item.Color.toString(16), 7, '#000000')) || '' : '');
		});

		forEach(colorDataList, (item: IMdcContrColumnPropDefEntity) => {
			const newDataSet: number[] = [];
			for(let i=0; i<labelNum; i++) {
				const isBar = this.isBarChart();
				switch(i) {
					case 0:
						newDataSet.push( isBar?item.RandBarValue1 : item.RandValue1);
						break;
					case 1:
						newDataSet.push( isBar?item.RandBarValue2 : item.RandValue2);
						break;
					case 2:
						newDataSet.push( isBar?item.RandBarValue3 : item.RandValue3);
						break;
					case 3:
						newDataSet.push( isBar?0 : item.RandValue4);
						break;
					case 4:
						newDataSet.push( isBar?0 : item.RandValue5);
						break;
					case 5:
						newDataSet.push( isBar?0 : item.RandValue6);
						break;
					case 6:
						newDataSet.push( isBar?0 : item.RandValue7);
						break;
					case 7:
						newDataSet.push( isBar?0 : item.RandValue8);
						break;
					case 8:
						newDataSet.push( isBar?0 : item.RandValue9);
						break;
					case 9:
						newDataSet.push( isBar?0 : item.RandValue10);
						break;
				}
			}
			newDataSets.push({data: newDataSet});
		});
		if(newDataSets.length > 0){
			const lastDataSet = newDataSets[newDataSets.length - 1];
			lastDataSet.data[0] = 0;
		}

		this.chartOption = this.dialogCommonService.getChartOption(this.dataItem);

		this.plugins = this.dialogCommonService.getPlugins(this.dataItem);

		if(ignoreRefreshChart){
			return;
		}

		if(this.dataItem.ReverseOrder){
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

	protected legendColors: string[] = [];

	protected chartOption: object = {};

	protected plugins: object = {};

	protected chartDataSource?: IChartDataSource;
	// ---------------------- endregion -----------------------------------------------------------
}
