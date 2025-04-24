/*
 * Copyright(c) RIB Software GmbH
 */

import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class EstimateProjectRateBookConfigDataService{
    private isInProjectModule: boolean = true;
    private contentTypeId: null | number = null;
    private contentId: null | number = null;

    public isInProject(): boolean{
        return this.isInProjectModule;
    }

    public reSetData(){
        this.isInProjectModule = true;
    }

    public getCustomizeContentTypeId (): null | number {
        return this.contentTypeId;
    }

    public getCustomizeContentId(): null | number{
        return this.contentId;
    }
}