/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, InjectionToken } from '@angular/core';
import { IMdcContrChartEntity } from '../model/entities/mdc-contr-chart-entity.interface';
import {
    DataServiceFlatRoot,
    IDataServiceEndPointOptions,
    IDataServiceOptions,
    IDataServiceRoleOptions, ServiceRole
} from '@libs/platform/data-access';
import { ControllingConfigurationChartComplete } from '../model/controlling-configuration-chart-complete.class';
import {
    ControllingConfigChartReadonlyProcessor
} from './controlling-config-chart-readonly-processor.service';
import { isArray, filter, forEach, find } from 'lodash';
import { HttpClient } from '@angular/common/http';
import { PlatformConfigurationService, PlatformTranslateService } from '@libs/platform/common';
import { IMdcContrChartSeriesEntity } from '../model/entities/mdc-contr-chart-series-entity.interface';
import { IMdcContrChartCategoryEntity } from '../model/entities/mdc-contr-chart-category-entity.interface';
import { IMdcContrColumnPropDefEntity } from '../model/entities/mdc-contr-column-prop-def-entity.interface';
import { controllingConfigChartDialogService } from './controlling-config-chart-dialog.service';
import { IChartConfig } from '../components/chart-config-dialog/chart-config-dialog-entity.interface';
import { UiCommonMessageBoxService } from '@libs/ui/common';

export const CONTROLLING_CONFIGURATION_CHART_DATA_TOKEN = new InjectionToken<ControllingConfigurationChartDataService<IMdcContrChartEntity>>('controllingConfigurationChartDataToken');

@Injectable({
    providedIn: 'root'
})
export class ControllingConfigurationChartDataService<T extends IMdcContrChartEntity> extends DataServiceFlatRoot<T, ControllingConfigurationChartComplete>{
    private readonly readonlyProcessor: ControllingConfigChartReadonlyProcessor<T>;
    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private requestUrl: string = this.configurationService.webApiBaseUrl;
    private readonly dialogService = inject(controllingConfigChartDialogService);
	private readonly translateService = inject(PlatformTranslateService);
	protected readonly messageBoxService = inject(UiCommonMessageBoxService);

    public constructor() {
        const options: IDataServiceOptions<T> = {
            apiUrl: 'controlling/configuration/contrchart',
            readInfo: <IDataServiceEndPointOptions>{
                endPoint: 'getlistnew?mdcContrConfigHeaderFk=1',
                usePost: false
            },
            roleInfo: <IDataServiceRoleOptions<IMdcContrChartEntity>>{
                role: ServiceRole.Root,
                itemName: 'MdcContrCharToSave',
            }
        };

        super(options);

        this.readonlyProcessor = this.createReadonlyProcessor();
        this.processor.addProcessor([this.readonlyProcessor]);
    }


    protected  createReadonlyProcessor(){

        return new ControllingConfigChartReadonlyProcessor(this);
    }

    public override createUpdateEntity(modified: IMdcContrChartEntity | null): ControllingConfigurationChartComplete {
        const complete = new ControllingConfigurationChartComplete();

        if(modified){
            complete.Id = modified.Id;
            complete.MdcContrCharToSave = [modified];
        }

        return complete;
    }

    public override checkDeleteIsAllowed(entities: IMdcContrChartEntity[] | IMdcContrChartEntity | null): boolean{
        if(!entities){
            return false;
        }

        let selectedItems: IMdcContrChartEntity[] = [];
        if(isArray(entities)){
            selectedItems = entities;
        }else{
            selectedItems.push(entities);
        }

        if(selectedItems.length === 0){
            return false;
        }

        return filter(selectedItems, {IsBaseConfigData: true}).length <= 0;

    }

    protected override onCreateSucceeded(created: object): T {
        const entity = created as T;

        this.readonlyProcessor.process(entity);

        return entity;
    }

    private dialogIsOpening = false;

    public closeChartDialog (){
        this.dialogIsOpening = false;
    }

    public openChartDialog(entity: T){
        if(this.dialogIsOpening){
            return;
        }
        this.dialogIsOpening = true;

        this.select(entity);

        this.http.get(this.requestUrl + 'controlling/configuration/contrchart/getconfig?contrChartId='+ entity.Id).subscribe((response) => {
            if(response && 'MdcContrChartDto' in response){
                const res = response.MdcContrChartDto as T;
                res.BasChartTypeFk = entity.BasChartTypeFk;
                res.Description = entity.Description;
                res.IsDefault1 = entity.IsDefault1;
                res.IsDefault2 = entity.IsDefault2;
                const seriesDtos = 'MdcContrChartSeriesDtos' in response ? response.MdcContrChartSeriesDtos as IMdcContrChartSeriesEntity[] : [];
                const categorys = 'IMdcContrChartCategoryEntity' in response ? response.IMdcContrChartCategoryEntity as IMdcContrChartCategoryEntity[] : [];

                this.http.post(this.requestUrl + 'Controlling/Configuration/ContrColumnPropDefController/getColumnDefinitionList', {ContextFk:null}).subscribe((columnResponse) =>{

						 const columnPropDefEntities = columnResponse && 'dtos' in columnResponse ? columnResponse.dtos as IMdcContrColumnPropDefEntity[] : [];

						  const chartConfig : IChartConfig = {
							  dateItem: entity.ChartOptionConfig ? JSON.parse(entity.ChartOptionConfig) : null,
							  series : this.initSeriesData(columnPropDefEntities,seriesDtos),
							  categories: this.initCategories(categorys)
						  };
						  if(chartConfig.dateItem) {
							  chartConfig.dateItem.ChartTypeId = entity.BasChartTypeFk;
							  chartConfig.dateItem.isReadonly = entity.IsBaseConfigData;
							  if(entity.ChartOptionConfig && entity.ChartOptionConfig.indexOf('FilterBySelectStructure') < 0){
								  chartConfig.dateItem.FilterBySelectStructure = entity.BasChartTypeFk === 2;
							  }
						  }
						  const dialog = this.dialogService.showDialog(chartConfig);
						  if(dialog) {
							  dialog.then(result => {
								  if (result && result.closingButtonId === 'ok' && result.value) {
									  this.saveConfig(result.value);
								  }
							  });
						  }
                    this.dialogIsOpening = false;

                });
            }else{
	            this.messageBoxService.showMsgBox('controlling.configuration.noDataFound', 'Warning', 'ico-warning');
	            this.dialogIsOpening = false;
            }
        });
    }

    private initSeriesData(list: IMdcContrColumnPropDefEntity[], bindItems: IMdcContrChartSeriesEntity[]){
        if(!bindItems || bindItems.length <= 0){
            return list;
        }

        forEach(bindItems, function (item){
            const findItem = find(list, {Id: item.MdcContrColumnPropDefFk}) as IMdcContrColumnPropDefEntity;
            if(findItem){
                findItem.Selected = true;
                if(item.ChartDataConfig){
                    findItem.DataConfig =  item.ChartDataConfig;
                }
            }
        });

        return list;
    }

    private initCategories(bindItems: IMdcContrChartCategoryEntity[]){
        const categories = [{Id:1, IsDate: true, Description: 'Report Period', Selected: false}, {Id:2, IsDate: false,  Description: 'Grouping Structure', Selected: true}];

        if(bindItems && bindItems.length > 0){
            forEach(categories, function (item){
                const findItem = find(bindItems, {GroupKey: item.Id});
                item.Selected = !!findItem;
            });
        }

        return categories;
    }

	 private saveConfig(chartConfig: IChartConfig){
		 const entity = this.getSelectedEntity();
		 if(!entity){
			 throw new Error(this.translateService.instant('controlling.configuration.noChartSelected').text);
		 }

		 entity.BasChartTypeFk = chartConfig.dateItem ? chartConfig.dateItem.ChartTypeId : entity.BasChartTypeFk;
		 entity.ChartOptionConfig = chartConfig.dateItem ? JSON.stringify(chartConfig.dateItem) : entity.ChartOptionConfig;
		 const categories = chartConfig.categories ? filter(chartConfig.categories, {Selected: true}) : [];
		 forEach(categories, function (item){
			 item.MdcContrChartFk = entity.Id;
			 item.GroupKey = item.Id;
		 });
		 const series: IMdcContrChartSeriesEntity[] = [];
		 if(chartConfig.series && chartConfig.series.length > 0){
			 forEach(chartConfig.series, item=>{
				 if(!item.Selected){
					 return;
				 }
				 series.push({
					 Id: 0,
					 Code: item.Code,
					 Description: item.Description,
					 ChartDataConfig: item.DataConfig,
					 Selected : item.Selected,
					 Color: item.Color|| 0,
					 MdcContrColumnPropDefFk: item.Id,
					 MdcContrChartFk: entity.Id
				 });
			 });
		 }

		 const saveObj = {
			 MdcContrChartDto: entity,
			 MdcContrChartSeriesDtos: series,
			 MdcContrChartCategoryDtos: categories
		 };

		 this.http.post(this.requestUrl + 'controlling/configuration/contrchart/saveconfig', saveObj).subscribe((response) => {
			 this.refreshAll();
		 });

	 }
}