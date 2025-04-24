/*
 * Copyright(c) RIB Software GmbH
 */

import { Component, inject, InjectionToken, OnInit } from '@angular/core';
import { ChartDataItem, IChartConfig, IChartConfigItem, ISeries } from '@libs/basics/shared';
import { IEntityBase, IEntityIdentification, PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { EntityContainerBaseComponent } from '@libs/ui/business-base';
import { HttpClient } from '@angular/common/http';
import { IChartCategory, IChartConfiguration, IChartSeries } from '../../model/entities/chart-config-date.interface';
import { forEach, extend } from 'lodash';
import { ItemType } from "@libs/ui/common";

export const CHART_CONTAINER_COMMON_TOKEN = new InjectionToken<IChartConfig>('chart-container-common-token');

@Component({
	selector: 'basics-shared-chart-container',
	templateUrl: './chart-container.component.html',
	styleUrl: './chart-container.component.scss',
})
export class ControllingProjectControlsChartContainerComponent<T extends IEntityIdentification & IEntityBase> extends EntityContainerBaseComponent<T> implements OnInit{
	private readonly http = inject(HttpClient);
	private readonly configurationService = inject(PlatformConfigurationService);
	private readonly translate = inject(PlatformTranslateService);

	public constructor() {
		super();

		const customOption = inject(CHART_CONTAINER_COMMON_TOKEN);
		if(customOption) {
			this.customOption = extend(this.customOption, customOption);
		}

		this.containerGuid = this.customOption.containerGuid;

		this.subscribeSelectionChanged();
	}

	private subscribeSelectionChanged() {
		const subscription = this.entitySelection?.selectionChanged$.subscribe(async () => {
			await this.getDoc();
		});
		this.registerFinalizer(() => subscription.unsubscribe());
	}

	private async getDoc(){
		const selectedMainItems = this.entitySelection?.getSelection();
		if (!selectedMainItems || selectedMainItems.length === 0) {
			return;
		}

		const data: ChartDataItem[] = [];
		forEach(selectedMainItems, (selectedMainItem) => {
			//let item = selectedMainItem as ChartDataItem;
			//item.label = item.Id === 0 ? '' : item.Code;
		})
	}

	private customOption = {
		chartKey: '',
		containerGuid: ''
	};

	protected configErr?: string | null = null;

	public ngOnInit(): void {
		const funName = this.customOption.chartKey === 'chart1' ? 'getdefaultchart1config' : 'getdefaultchart2config';
		this.http.get(this.configurationService.webApiBaseUrl + 'controlling/configuration/contrchart/' + funName + '?mdcContrConfigHeaderFk=1').subscribe(response => {
			if(response && 'MdcContrChartDto' in response && response.MdcContrChartDto){

				const seriesDtos = 'MdcContrChartSeriesDtos' in response ? response.MdcContrChartSeriesDtos as IChartSeries[] : [];
				const categories = 'MdcContrChartCategoryDtos' in response ? response.MdcContrChartCategoryDtos as IChartCategory[] : [];

				if('ChartOptionConfig' in (response.MdcContrChartDto as IChartConfiguration) && seriesDtos && seriesDtos.length > 0){
					this.initChartData(response.MdcContrChartDto as IChartConfiguration, seriesDtos);
					this.initContainer(categories);
				}else{
					this.configErr = this.translate.instant('controlling.projectcontrols.noConfigData').text;
				}

			}else{
				this.configErr = this.translate.instant('controlling.projectcontrols.noConfigData').text;
			}
		})
	}

	private initContainer(categories: IChartCategory[]): void{
		if(categories && categories.length > 0 &&  categories[0].GroupKey === 2){
			this.addTools();
		}

	}

	private addTools(){
		this.uiAddOns.toolbar.addItems([{
			caption: {key: 'controlling.projectcontrols.goBack'},
			disabled: () => {
				return false
			},
			hideItem: () => {
				return false;
			},
			iconClass: 'control-icons ico-ar1-left1',
			id: 'goBack',
			fn: () => {

			},
			sort: 1,
			permission: '#c',
			type: ItemType.Item,
		}]);
	}

	private initChartData(chartConfig: IChartConfiguration, serires: IChartSeries[]): void{
		this.chartConfigItem = JSON.parse(chartConfig.ChartOptionConfig);
		forEach(serires, (item) => {
			this.series.push(
				{
					Code: item.Code,
					Color: item.ChartDataConfig ? +JSON.parse(this.addQuoteToJsonKey(item.ChartDataConfig)).color : 0,
					Description: item.Description
				}
			)
		});
	}

	private addQuoteToJsonKey(json: string): string{
		const keyRegex = /([a-zA-Z_$][0-9a-zA-Z_$]*)(\s*:)/g;
		const replacer = (match: string, key: string, colon: string): string => {
			return `"${key}"${colon}`;
		};

		return  json.replace(keyRegex, replacer);
	}

	protected chartConfigItem? : IChartConfigItem;

	protected series: ISeries[] = [];

	protected chartDataItems: ChartDataItem[] = [];

	protected containerGuid = '';
}
