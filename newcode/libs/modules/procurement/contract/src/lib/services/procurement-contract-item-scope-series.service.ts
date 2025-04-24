/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import { PrcItemScopeEntitySeriesService } from '@libs/procurement/common';
import {ProcurementContractItemDataService} from './procurement-contract-item-data.service';
import {IConHeaderEntity, IConItemEntity} from '../model/entities';
import {ConItemComplete} from '../model/con-item-complete.class';
import {ContractComplete} from '../model/contract-complete.class';

/**
 * Contract item scope container data service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementContractItemScopeSeriesService extends PrcItemScopeEntitySeriesService<IConItemEntity, ConItemComplete, IConHeaderEntity, ContractComplete> {
    public constructor() {
        super({
            prcItemDataService: inject(ProcurementContractItemDataService)
        });
    }
}