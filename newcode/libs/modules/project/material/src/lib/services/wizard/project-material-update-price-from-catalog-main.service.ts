/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import {EventEmitter, Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProjectMaterialUpdatePriceFromCatalogMainService {

    private _projectId = -1; // current project id
    private _materialId = -1; // the id of material for selected project material
    private _prjMaterialId = -1; // selected project material id
    public CommonEvent = new EventEmitter<string>();
    public PriceListSelectionChanged = new EventEmitter<object>();
    public PriceListWithSpecVersionUpdated = new EventEmitter<object>();
    public SpecificPriceVersionSelected = new EventEmitter<object>();

    public get ProjectId(){

        return this._projectId;
    }
    public set ProjectId(value){
        this._projectId = value;
    }

    public get MaterialId(){
        return this._materialId;
    }
    public set MaterialId(value){
        this._materialId = value;
    }

    public get PrjMaterialId(){
        return this._prjMaterialId;
    }
    public set PrjMaterialId(value){
        this._prjMaterialId = value;
    }

    ///////////////////////////
    public reset() {
        this._projectId = -1;
        this._materialId = -1;
        this._prjMaterialId = -1;
    }
}