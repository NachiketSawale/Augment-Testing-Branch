/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */


import {inject, Injectable} from '@angular/core';
import {
    IProjectMaterialUpdateMaterialPriceByItem2PriceList,
    IProjectMaterialUpdateMaterialPriceByItemPriceList, IProjectMaterialUpdateMaterialPriceByItemPriceListMap
} from '../../model/entities/project-material-update-material-price-by-item-price-list.interface';
import * as _ from 'lodash';
import {ProjectMaterialUpdatePriceFromCatalogMainService} from './project-material-update-price-from-catalog-main.service';
import {IPrjMat2SourceOption} from '../../model/entities/project-material-update-price-complate.interface';
import {ProjectMainUpdatePriceFromCatalogPriceListSourceOption} from '../../model/project-material-constants';
import {
    ProjectMaterialUpdatePriceFromCatalogAdditionalData
} from './project-material-update-price-from-catalog-addition-data.service';
import {
    IUpdateMaterialPriceByItemEntity
} from '../../model/entities/project-material-update-material-price-by-item.interface';


@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceByMaterialItemListDataService {

    private prjMat2SourceOption!: IPrjMat2SourceOption;
    private _priceByItemPriceList: IProjectMaterialUpdateMaterialPriceByItemPriceList[] = [];
    private readonly projectMainUpdatePriceFromCatalogMainService = inject(ProjectMaterialUpdatePriceFromCatalogMainService);
    private _localCache: IProjectMaterialUpdateMaterialPriceByItemPriceListMap = {};
    private readonly projectMainUpdatePriceFromCatalogAdditionalData = inject(ProjectMaterialUpdatePriceFromCatalogAdditionalData);

    public set LocalCache(value: IProjectMaterialUpdateMaterialPriceByItemPriceListMap){
        this._localCache = value;

        if(!this.prjMat2SourceOption && value){
            this.prjMat2SourceOption = {};
            for(const key in value){
                if(key in value){
                    const foundBase = _.find(value[key], {PriceVersionFk: -1});
                    if (foundBase) {
                        foundBase.PriceVersionFk = this.projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId;
                    }
                    this.prjMat2SourceOption[key] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
                }
            }
        }
    }

    public constructor() {
        this.projectMainUpdatePriceFromCatalogMainService.SpecificPriceVersionSelected.subscribe(data => {
            this.onSpecificPriceVersionSelected(data);
        });
    }

    public get PriceByItemPriceList():IProjectMaterialUpdateMaterialPriceByItemPriceList[]{
        return this._priceByItemPriceList;
    }
    public set PriceByItemPriceList(list: IProjectMaterialUpdateMaterialPriceByItemPriceList[]){
        this._priceByItemPriceList = list;
    }

    public changeSourceOption(prjMatId?: number) : void{
        const list = prjMatId && (prjMatId in this._localCache) ? this._localCache[prjMatId] : this.PriceByItemPriceList;
        let total = 0; // 0: none; 1: only base material; 2: only one price version; >=3: mixed base material and price version
        const isBase = 1;
        const isVersion = 2;
        prjMatId = this.projectMainUpdatePriceFromCatalogMainService.PrjMaterialId;
        if (!prjMatId) {
            return;
        }

        _.forEach(list, function (item) {
            if (item.Checked) {
                if (item.Id === -1) {
                    total += isBase;
                } else {
                    total += isVersion;
                }
            }
        });
        if (total === 0) {
            this.prjMat2SourceOption[prjMatId] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.None;
        } else if (total === 1) {
            this.prjMat2SourceOption[prjMatId] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
        } else if (total === 2) {
            this.prjMat2SourceOption[prjMatId] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion;
        } else {
            this.prjMat2SourceOption[prjMatId] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.Mixed;
        }
    }

    public collectSourceInfo(prjMatId?: number) {
        const list = prjMatId && (prjMatId in this._localCache) ? this._localCache[prjMatId] : this.PriceByItemPriceList;

        const selectItems = _.filter(list, {Checked: true});
        let materialId = -1;

        if(selectItems && selectItems.length>0){
            materialId = selectItems[0].MaterialId;
        }

        return {
            selectedItems: selectItems,
            sourceOption: this.prjMat2SourceOption[this.projectMainUpdatePriceFromCatalogMainService.PrjMaterialId],
            materialId: materialId
        };
    }

    public gridRefresh(): void{
        this.projectMainUpdatePriceFromCatalogMainService.CommonEvent.emit('material-item-list-grid-refresh');
    }

    public reset(){
        this._localCache = {};
        this.prjMat2SourceOption = {};
        this.PriceByItemPriceList = [];
    }

    public getSelection() : IProjectMaterialUpdateMaterialPriceByItemPriceList[]{
        return _.filter(this.PriceByItemPriceList, {Checked: true});
    }

    public getListByPrjMaterialIds(ids: number[]): IProjectMaterialUpdateMaterialPriceByItemPriceListMap{

        if(!this._localCache || !_.isArray(ids) || ids.length === 0){
            return {};
        }

        const selection:IProjectMaterialUpdateMaterialPriceByItemPriceListMap = {};
        _.forEach(ids,  (id) => {
            if (_.isArray(this._localCache[id]) && this._localCache[id].length > 0) {
                selection[id] = _.filter(this._localCache[id], {Selected: true}) as IProjectMaterialUpdateMaterialPriceByItemPriceList[];
            }
        });

        return selection;
    }

    public getSourceOptionsByPrjMaterialIds(ids: number[]) : IPrjMat2SourceOption{
        if(!this._localCache || !_.isArray(ids) || ids.length === 0){
            return {};
        }

        const options: IPrjMat2SourceOption = {};
        _.forEach(ids,  (id) => {
            if (this.prjMat2SourceOption[id]) {
                options[id] = this.prjMat2SourceOption[id];
            }
        });

        return options;
    }

    private onSpecificPriceVersionSelected(info: object) {
        const versionFk: number = 'priceVersionFk' in info ? info['priceVersionFk'] as number : 0;
        const ProjectMaterials: IUpdateMaterialPriceByItemEntity[] = 'projectMaterials' in info ? info['projectMaterials'] as IUpdateMaterialPriceByItemEntity[] :[];
        let prjMaterials: IUpdateMaterialPriceByItemEntity[] = [];
        let prjMat2PriceList: IProjectMaterialUpdateMaterialPriceByItem2PriceList = {};
        _.forEach(ProjectMaterials,  (prjMat) => {
            const priceList = this._localCache[prjMat.Id];
            if (_.isArray(priceList) && priceList.length > 0) {
                const found = _.find(priceList, {PriceVersionFk: versionFk});
                if (found) {
                    _.forEach(priceList, function (item) {
                        item.Checked = false;
                    });
                    found.Checked = true;
                    if (versionFk !== this.projectMainUpdatePriceFromCatalogAdditionalData.basePriceVersionId &&
                        versionFk !== this.projectMainUpdatePriceFromCatalogAdditionalData.weightedPriceVersionId) {
                        this.prjMat2SourceOption[prjMat.Id] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyOneVersion;
                    } else {
                        this.prjMat2SourceOption[prjMat.Id] = ProjectMainUpdatePriceFromCatalogPriceListSourceOption.OnlyBase;
                    }
                    prjMaterials = prjMaterials || [];
                    prjMat2PriceList = prjMat2PriceList || {};
                    prjMaterials.push(prjMat);
                    prjMat2PriceList[prjMat.Id] = found;
                }
            }
        });

        // todo service.gridRefresh();
        if (prjMaterials && prjMaterials.length > 0 && prjMat2PriceList && Object.keys(prjMat2PriceList).length > 0) {
            this.projectMainUpdatePriceFromCatalogMainService.PriceListWithSpecVersionUpdated.emit({
                priceVersionFk: versionFk,
                prjMaterials: prjMaterials,
                prjMat2PriceList: prjMat2PriceList
            });
        }
    }

    public checkIsValid(selections:IProjectMaterialUpdateMaterialPriceByItemPriceListMap): boolean{
        if(selections){
            return true;
        }

        selections = selections as IProjectMaterialUpdateMaterialPriceByItemPriceListMap;
        for (const prop in selections) {
            if (prop in selections) {
                const list = selections[prop];
                if (this.hasError(list)) {
                    return false;
                }
            }
        }
        return true;
    }

    private hasError(list:IProjectMaterialUpdateMaterialPriceByItemPriceList[]){
        if (!_.isArray(list)) {
            return false;
        }

        for (let i = 0; i < list.length; ++i) {
            const item = list[i];
            for (const field in item) {
                if (field in item) {
                    const _hasError = false; //todo, this function doesn't exist now: platformRuntimeDataService.hasError(item, field);
                    if (_hasError) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}