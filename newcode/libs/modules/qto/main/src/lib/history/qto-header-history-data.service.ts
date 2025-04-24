/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainDetailGridComplete} from '../model/qto-main-detail-grid-complete.class';
import { BasicsSharedPostConHistoryDataService, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';
import { QtoMainHeaderGridDataService } from '../header/qto-main-header-grid-data.service';

@Injectable({
    providedIn: 'root'
})
export class QtoHeaderHistoryDataService extends BasicsSharedPostConHistoryDataService<IBasicsSharedPostConHistoryEntity,IQtoMainHeaderGridEntity, QtoMainDetailGridComplete> {
    /**
     * The constructor
     */
    public constructor() {

        const parentService = inject(QtoMainHeaderGridDataService);
        super(parentService);
    }

    public getParentId(parent:IQtoMainHeaderGridEntity){
        return{
            contractId: parent.Id
        };
    }


}