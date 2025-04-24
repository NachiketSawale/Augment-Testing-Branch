/*
 * Copyright(c) RIB Software GmbH
 */

import {CostGroupComplete, EstimateShareCostGroupDataService} from '@libs/estimate/shared';
import {QtoMainCostGroupCatalogDataService} from './qto-main-cost-group-catalog-data.service';
import {inject, Injectable} from '@angular/core';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
@Injectable({
    providedIn: 'root',
})
export abstract class QtoMainCostGroupDataService extends EstimateShareCostGroupDataService<ICostGroupEntity, BasicsCostGroupCatalogEntity, CostGroupComplete> {
    /**
     * The constructor
     *
     */
    public constructor() {
        super(inject(QtoMainCostGroupCatalogDataService));
    }
}