/*
 * Copyright(c) RIB Software GmbH
 */

import {CostGroupComplete, EstimateShareCostGroupBehaviorService} from '@libs/estimate/shared';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {QtoMainCostGroupCatalogDataService} from './qto-main-cost-group-catalog-data.service';
import {inject, Injectable} from '@angular/core';
import {IQtoMainHeaderGridEntity} from '../model/qto-main-header-grid-entity.class';

@Injectable({
    providedIn: 'root',
})
export class QtoMainCostGroupBehaviorService extends EstimateShareCostGroupBehaviorService<ICostGroupEntity,BasicsCostGroupCatalogEntity,CostGroupComplete,IQtoMainHeaderGridEntity>{

    public constructor() {
        super(inject(QtoMainCostGroupCatalogDataService));
    }
}