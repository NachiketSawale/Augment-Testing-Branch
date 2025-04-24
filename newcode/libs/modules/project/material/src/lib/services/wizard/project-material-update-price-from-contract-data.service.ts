/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';

import {
    IUpdateMaterialPriceFromContract
} from '../../model/entities/project-material-update-material-price-from-contract.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceFromContractDataService{
    private _dataItems : IUpdateMaterialPriceFromContract[] = [];

    public set DataItems(value: IUpdateMaterialPriceFromContract[]) {
        this._dataItems = value;
    }
    public get DataItems(): IUpdateMaterialPriceFromContract[]{
        return this._dataItems;
    }

    private _selectedItem?:IUpdateMaterialPriceFromContract;
    public SetSelected(item?: IUpdateMaterialPriceFromContract){
        this._selectedItem = item;
    }

    public GetSelected():IUpdateMaterialPriceFromContract | undefined{
        return this._selectedItem;
    }

    public clear(): void{
        this._dataItems = [];
        this._selectedItem = undefined;
        this.TotalCount = 0;
        this.pageNumber = 0;
    }

    public TotalCount: number = 0;
    public pageNumber: number = 0;
}