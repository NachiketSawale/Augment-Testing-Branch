/*
 * Copyright(c) RIB Software GmbH
 */

import {isNull} from 'lodash';
import {IEstModifyFunctionEntity, IEstResourceEntity} from '@libs/estimate/interfaces';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EstimateMainReplaceResourceCommonService{
    private selectedFunction: IEstModifyFunctionEntity | {Id: number} | null = null;
    private beReplaceType: number | null = null;
    private currentElement: number | null = null;
    private specifyLookupElement: IEstResourceEntity | null = null;
    private selectedToBeReplaceFk: number | null = null;
    private currentElementJob: number | null = null;

    public setSelectedFunction (selectedFn: IEstModifyFunctionEntity | {Id: number}) {
        this.selectedFunction = selectedFn;
    }

    public getSelectedFunction() {
        if(isNull(this.selectedFunction)) {
            this.setSelectedFunction({Id : 111});// default is replace by costcode
        }
        return this.selectedFunction;
    }

    public setDefaultType(replaceType: number) {
        this.beReplaceType = replaceType;
    }

    public getDefaultType() {
        return this.beReplaceType;
    }

    public setDefaultCurrentElement(_currentElement: number | null, _specifyLookupElement: IEstResourceEntity | null) {
        this.currentElement = _currentElement;
        this.specifyLookupElement = _specifyLookupElement;
    }

    public getDefaultCurrentElement() {
        return this.currentElement || this.selectedToBeReplaceFk;
    }

    public setDefaulteCurrentElementJob(_currentElementJob: number | null) {
        this.currentElementJob = _currentElementJob;
    }

    public getDefaultCurrentElementJob() {
        return this.currentElementJob;
    }

    public setSelectedToBeReplaceFk (toBeReplaceFk: number | null){
        this.selectedToBeReplaceFk = toBeReplaceFk;
    }
}