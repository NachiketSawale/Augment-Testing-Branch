/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';
import {
    IUpdateMaterialPriceFromQuote
} from '../../model/entities/project-material-update-material-price-from-quote.interface';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceFromQuoteDataService{
    private _dataItems : IUpdateMaterialPriceFromQuote[] = [];

    public set DataItems(value: IUpdateMaterialPriceFromQuote[]) {
        this._dataItems = value;
    }
    public get DataItems(): IUpdateMaterialPriceFromQuote[]{
        return this._dataItems;
    }

    private _selectedItem?:IUpdateMaterialPriceFromQuote;
    public SetSelected(item?: IUpdateMaterialPriceFromQuote){
        this._selectedItem = item;
    }

    public GetSelected():IUpdateMaterialPriceFromQuote | undefined{
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