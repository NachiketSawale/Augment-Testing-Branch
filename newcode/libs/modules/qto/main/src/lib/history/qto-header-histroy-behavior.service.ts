/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';
import {QtoMainDetailGridComplete} from '../model/qto-main-detail-grid-complete.class';
import {QtoHeaderHistoryDataService} from './qto-header-history-data.service';
import { BasicsSharedPostConHistoryBehavior, IBasicsSharedPostConHistoryEntity } from '@libs/basics/shared';


@Injectable({
    providedIn: 'root'
})
export class QtoHeaderHistroyBehavior extends BasicsSharedPostConHistoryBehavior<IBasicsSharedPostConHistoryEntity, IQtoMainHeaderGridEntity,QtoMainDetailGridComplete> {
    /**
     * The constructor
     */
    public constructor() {
        super(inject(QtoHeaderHistoryDataService));
    }
}