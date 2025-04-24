/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {ProjectMaterialUpdatePriceFromCatalogMainService} from './project-material-update-price-from-catalog-main.service';
import {
    IUpdateMaterialPriceByCatalogEntity
} from '../../model/entities/project-material-update-material-price-by-catalog.interface';
import * as _ from 'lodash';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialCatalogDataService{

    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private requestUrl: string = this.configurationService.webApiBaseUrl;
    private readonly projUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private _priceByCatalogList: IUpdateMaterialPriceByCatalogEntity[] = [];
    public calculateVariance(entity: IUpdateMaterialPriceByCatalogEntity): void{
        entity.Variance = entity.NewPrjEstimatePrice - entity.CurPrjEstimatePrice;
    }

    public set PriceByCatalogList(value:IUpdateMaterialPriceByCatalogEntity[]){
        this._priceByCatalogList = value;
    }

    public get PriceByCatalogList(){
        return this._priceByCatalogList;
    }

    public PriceByCatalogFlatList(): IUpdateMaterialPriceByCatalogEntity[]{
        const result:IUpdateMaterialPriceByCatalogEntity[] = [];
        _.forEach(this.PriceByCatalogList, function (item){
           result.push(item);
           if(item.Children){
               _.forEach(item.Children, function (child){
                  result.push(child);
               });
           }
        });

        return result;
    }


    public gridRefresh(): void{
        this.projUpdatePriceFromCatalogMainService.CommonEvent.emit('material-catalog-grid-refresh');
    }

    public getListSelectedWithModification():IUpdateMaterialPriceByCatalogEntity[] {
        const list= this.PriceByCatalogList;
        return _.filter(list, (item) => {
            const prjDayworkRateVarianceFlg=item.isProjectMaterial&&((item.NewPrjDayworkRate - item.CurPrjDayworkRate)!==0);
            const priceUnitVarianceFlg=item.isProjectMaterial&&((item.NewPriceUnit-item.CurPriceUnit)!==0);
            const priceUnitFactorVarianceFlg=item.isProjectMaterial&& _.isNumber(item.NewFactorPriceUnit) && _.isNumber(item.CurFactorPriceUnit)&&((item.NewFactorPriceUnit-item.CurFactorPriceUnit)!==0);
            return item.Checked && item.isProjectMaterial&& (item.Variance !== 0|| prjDayworkRateVarianceFlg || priceUnitVarianceFlg || priceUnitFactorVarianceFlg ||
                (_.isNumber(item.NewPrjFactorHour) && _.isNumber(item.CurPrjFactorHour) && item.NewPrjFactorHour - item.CurPrjFactorHour !== 0)||item.IsMaterialPortionChange);
        });
    }

    public updateFromCatalogs(materialDatas: object[]) {
        return this.http.post(this.requestUrl + 'project/material/updatePriceFromCatalogs', materialDatas);
    }

    public clear():void{
        this._priceByCatalogList = [];
    }

}