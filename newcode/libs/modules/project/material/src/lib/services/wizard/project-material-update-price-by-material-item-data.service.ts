/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {
    IUpdateMaterialPriceByItemEntity
} from '../../model/entities/project-material-update-material-price-by-item.interface';
import * as _ from 'lodash';
import {inject, Injectable} from '@angular/core';
import {ProjectMaterialUpdatePriceFromCatalogMainService} from './project-material-update-price-from-catalog-main.service';
import {
    IProjectMaterialUpdateMaterialPriceByItem2PriceList,
    IProjectMaterialUpdateMaterialPriceByItemPriceList
} from '../../model/entities/project-material-update-material-price-by-item-price-list.interface';
import {ProjectMainUpdatePriceFromCatalogPriceListSourceOption} from '../../model/project-material-constants';
import {PlatformConfigurationService, PlatformTranslateService} from '@libs/platform/common';
import {
    ProjectMaterialUpdatePriceFromCatalogAdditionalData
} from './project-material-update-price-from-catalog-addition-data.service';
import {
    ICalculatePriceWithWeightResultEntity, IUpdatePricesFromCatalogResultEntity
} from '../../model/entities/project-material-update-price-complate.interface';
import {HttpClient} from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialItemDataService {

    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private requestUrl: string = this.configurationService.webApiBaseUrl;
    private _priceByItemList: IUpdateMaterialPriceByItemEntity[] = [];
    private co2AttrId? = 0;
    private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private readonly projectMainUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private _selectedItem?:IUpdateMaterialPriceByItemEntity;
    private readonly translateService = inject(PlatformTranslateService);
    private readonly projectMainUpdatePriceFromCatalogAdditionalData = inject(ProjectMaterialUpdatePriceFromCatalogAdditionalData);

    public constructor() {
        this.projectMainUpdatePriceFromCatalogMainService.PriceListSelectionChanged.subscribe(data => {
            this.onPriceListSelectionChanged(data);
        });

        this.projectMainUpdatePriceFromCatalogMainService.PriceListWithSpecVersionUpdated.subscribe(data => {
            this.onPriceListWithSpecVersionUpdated(data);
        });
    }

    public get PriceByItemList():IUpdateMaterialPriceByItemEntity[]{
        return this._priceByItemList;
    }
    public set PriceByItemList(list: IUpdateMaterialPriceByItemEntity[]){
        this._priceByItemList = list;
    }

    public setSelectedItem(item: IUpdateMaterialPriceByItemEntity){
        this._selectedItem = item;
    }

    public getSelected(): IUpdateMaterialPriceByItemEntity | undefined{
        return this._selectedItem;
    }

    public calculateVariance(entity: IUpdateMaterialPriceByItemEntity): void{
        entity.Variance = entity.NewPrjEstimatePrice - entity.CurPrjEstimatePrice;
    }


    public gridRefresh(): void{
        this.projUpdatePriceFromCatalogMainService.CommonEvent.emit('material-item-grid-refresh');
    }

    public chanageSourceOptionPriceVersionId():void{
        this.projUpdatePriceFromCatalogMainService.SpecificPriceVersionSelected.emit({
            priceVersionFk: this.projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId,
            projectMaterials: this.PriceByItemList
        });
    }

    private onPriceListSelectionChanged(data: object): void{
        if(!data || !('selectedItems' in data)){
            return;
        }

        const marked = this.getSelected();
        if(!marked){
            return;
        }
        const projectId = this.projectMainUpdatePriceFromCatalogMainService.ProjectId;
        const type = ('sourceOption' in data) ? data['sourceOption'] as number : 0;
        const selectedItems = ('selectedItems' in data) ? data['selectedItems'] as IProjectMaterialUpdateMaterialPriceByItemPriceList[] : [];

        if(selectedItems.length > 0){
            const modifications = _.filter(this.PriceByItemList, function (item){
                return item.Checked && item.MaterialId === selectedItems[0].MaterialId;
            });
            for (let i = 0; i < selectedItems.length; i++) {
                if(_.isNil(modifications[0].Co2Project)){
                    modifications[0].Co2Project = 0;
                }
                if(_.isNil(selectedItems[i].Co2Project)){
                    selectedItems[i].Co2Project = 0;
                }
                if(_.isNil(modifications[0].Co2Source)){
                    modifications[0].Co2Source = 0;
                }
                if(_.isNil(selectedItems[i].Co2Source)){
                    selectedItems[i].Co2Source = 0;
                }
                if (modifications[0].Co2Project !== selectedItems[i].Co2Project || modifications[0].Co2Source !== selectedItems[i].Co2Source || modifications[0].Co2SourceFk !== selectedItems[i].Co2SourceFk) {
                    this.co2AttrId = modifications[0].MaterialId;
                    break;
                }else{
                    this.co2AttrId =  0;
                }
            }
        }else{
            this.co2AttrId =  0;
        }

        if (type === ProjectMainUpdatePriceFromCatalogPriceListSourceOption.None) {
            marked.Source = this.translateService.instant('project.main.prjMaterialSource.none').text;
            marked.NewPrjEstimatePrice = marked.CurPrjEstimatePrice;
            marked.NewPrjDayworkRate = marked.CurPrjDayworkRate;
            marked.NewPrjFactorHour = marked.CurPrjFactorHour;
            marked.MaterialPriceVersionFk = undefined;
            this.calculateVariance(marked);
        } else if (type === ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase) {
            marked.Source = this.translateService.instant('project.main.prjMaterialSource.onlyBase').text;
            marked.NewPrjEstimatePrice = selectedItems[0].EstimatePrice;
            marked.NewPrjDayworkRate = selectedItems[0].DayworkRate;
            marked.NewPrjFactorHour = selectedItems[0].FactorHour;
            marked.MaterialPriceVersionFk = this.projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId;
            this.calculateVariance(marked);
        } else if (type === ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion) {
            marked.Source = this.translateService.instant('project.main.prjMaterialSource.onlyOneVersion').text;
            this.calculatePriceByWeighting(marked.CurrencyFk, projectId, selectedItems)
                .subscribe((res) => {
                    const response = res as ICalculatePriceWithWeightResultEntity;
                    marked.NewPrjEstimatePrice = response.EstimatePrice;
                    marked.NewPrjDayworkRate = response.DayworkRate;
                    marked.MaterialPriceVersionFk = selectedItems[0].PriceVersionFk;
                    if (_.isNumber(response.FactorHour)) {
                        marked.NewPrjFactorHour = response.FactorHour;
                    }else {
                        marked.NewPrjFactorHour = marked.CurPrjFactorHour;
                    }
                    this.calculateVariance(marked);
                    this.gridRefresh();
                });
        } else {
            marked.Source = this.translateService.instant('project.main.prjMaterialSource.mixed').text;
            this.calculatePriceByWeighting(marked.CurrencyFk, projectId, selectedItems)
                .subscribe((res) => {
                    const response = res as ICalculatePriceWithWeightResultEntity;
                    marked.NewPrjEstimatePrice = response.EstimatePrice;
                    marked.NewPrjDayworkRate = response.DayworkRate;
                    marked.MaterialPriceVersionFk = this.projectMainUpdatePriceFromCatalogAdditionalData.weightedPriceVersionId;
                    if (_.isNumber(response.FactorHour)) {
                        marked.NewPrjFactorHour = response.FactorHour;
                    }else {
                        marked.NewPrjFactorHour = marked.CurPrjFactorHour;
                    }
                    this.calculateVariance(marked);
                    this.gridRefresh();
                });
        }

        this.gridRefresh();
    }

    private onPriceListWithSpecVersionUpdated(info: object) {
        const prjMaterials: IUpdateMaterialPriceByItemEntity[] = 'prjMaterials' in info ? info['prjMaterials'] as IUpdateMaterialPriceByItemEntity[] : [];
        const prjMat2PriceList: IProjectMaterialUpdateMaterialPriceByItem2PriceList = 'prjMat2PriceList' in info ? info['prjMat2PriceList'] as IProjectMaterialUpdateMaterialPriceByItem2PriceList : {};
        const priceVersionFk: number = 'priceVersionFk' in info ? info['priceVersionFk'] as number: 0;
        const projectId = this.projUpdatePriceFromCatalogMainService.ProjectId;
        const data = {
            ProjectId: projectId,
            ProjectMaterials: prjMaterials,
            PrjMaterial2PriceList: prjMat2PriceList
        };
        if (priceVersionFk === this.projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId) {
            _.forEach(prjMaterials, (prjMat) => {
                const found = prjMat2PriceList[prjMat.Id];
                if (found) {
                    prjMat.NewPrjEstimatePrice = found.EstimatePrice;
                    prjMat.NewPrjDayworkRate = found.DayworkRate;
                    prjMat.NewPrjFactorHour = found.FactorHour;
                    prjMat.MaterialPriceVersionFk = priceVersionFk;
                    prjMat.Source = this.translateService.instant('project.main.prjMaterialSource.OnlyBase').text;
                    this.calculateVariance(prjMat);
                }
            });
            this.gridRefresh();
        } else {
            // calculating.fire(null, true);
            this.http.post(this.requestUrl + 'project/material/updateestimatepricewithspecversion', data)
                .subscribe( (response) => {
                    const updates = response as IUpdatePricesFromCatalogResultEntity[];
                    _.forEach(prjMaterials,  (prjMat) => {
                        const found = _.find(updates, {Id: prjMat.Id});
                        if (found) {
                            prjMat.NewPrjEstimatePrice = found.NewPrjEstimatePrice;
                            prjMat.NewPrjFactorHour = found.NewPrjFactorHour;
                            prjMat.MaterialPriceVersionFk = priceVersionFk;
                            prjMat.Source = this.translateService.instant('project.main.prjMaterialSource.onlyOneVersion').text;
                            this.calculateVariance(prjMat);
                        }
                    });
                    this.gridRefresh();
                });
        }
    }

    private calculatePriceByWeighting(baseMatCurrencyFk: number, projectId: number, list: IProjectMaterialUpdateMaterialPriceByItemPriceList[]) {
        // calculating.fire(null, true);
        return this.http.post(this.requestUrl + 'project/material/calculateestimatepricewithweight?baseMatCurrencyFk=' + baseMatCurrencyFk + '&projectId=' + projectId, list);
    }

    public reset():void{
        this._priceByItemList = [];
    }

    public getListSelectedWidthModification(co2Attr?: number): IUpdateMaterialPriceByItemEntity[]{
        if(this.co2AttrId !== 0){
            this.co2AttrId = co2Attr;
        }

        return _.filter(this.PriceByItemList, function (item) {
            const prjDayworkRateVarianceFlg = (item.NewPrjDayworkRate - item.CurPrjDayworkRate) !== 0;
            const priceUnitVarianceFlg = (item.NewPriceUnit - item.CurPriceUnit) !== 0;
            const priceUnitFactorVarianceFlg = _.isNumber(item.NewFactorPriceUnit) && _.isNumber(item.CurFactorPriceUnit) && ((item.NewFactorPriceUnit - item.CurFactorPriceUnit) !== 0);

            let updated = item.Checked
                && (
                    item.Variance !== 0
                    || prjDayworkRateVarianceFlg
                    || priceUnitVarianceFlg
                    || priceUnitFactorVarianceFlg
                    || (_.isNumber(item.NewPrjFactorHour) && _.isNumber(item.CurPrjFactorHour) && item.NewPrjFactorHour - item.CurPrjFactorHour !== 0)
                    || item.IsMaterialPortionChange
                );

            if (co2Attr !== 0) {
                updated = updated && item.MaterialId !== co2Attr;
            }
            return updated;
        });
    }

    public updatePricesWithSpecifiedPriceList(data:object) {
        return this.http.post(this.requestUrl + 'project/material/updatepriceswithspecifiedpricelist', data);
    }
}