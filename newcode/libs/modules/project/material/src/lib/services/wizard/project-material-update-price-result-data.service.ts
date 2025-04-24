/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IPriceCondition, IPriceResult} from '../../model/entities/project-material-update-price-complate.interface';
import {HttpClient} from '@angular/common/http';
import {PlatformConfigurationService} from '@libs/platform/common';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceResultDataService{

    private readonly http = inject(HttpClient);
    private readonly configurationService = inject(PlatformConfigurationService);
    private requestUrl: string = this.configurationService.webApiBaseUrl;

    private _dataItems : IPriceResult[] = [];
    public set DataItems(value: IPriceResult[]) {
        this._dataItems = value;
    }
    public get DataItems(): IPriceResult[]{
        return this._dataItems;
    }

    private _priceConditions : IPriceCondition[] = [];
    public set PriceConditions(value: IPriceCondition[]) {
        this._priceConditions = value;
    }
    public get PriceConditions(): IPriceCondition[]{
        return this._priceConditions;
    }

    private _selectedItem?:IPriceResult;
    public SetSelected(item?: IPriceResult){
        this._selectedItem = item;
    }

    public GetSelected():IPriceResult | undefined{
        return this._selectedItem;
    }

    public getResultGridData = function (data: object, resultService: ProjectMaterialUpdatePriceResultDataService){
         return  resultService.http.post(resultService.requestUrl + 'project/material/resultGridData', data);
    };

    public clear(): void{
        this._dataItems = [];
        this._selectedItem = undefined;
        this._priceConditions = [];
    }

    public updateResult(materialDatas: object[]) {
        return this.http.post(this.requestUrl + 'project/material/updatePriceFromPrcItem', materialDatas);
    }
}