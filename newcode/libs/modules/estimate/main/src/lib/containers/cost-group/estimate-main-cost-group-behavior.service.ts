/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, Injectable} from '@angular/core';
import {EstimateMainCostGroupCatalogDataService} from './estimate-main-cost-group-catalog-data.service';
import {CostGroupComplete, EstimateShareCostGroupBehaviorService} from '@libs/estimate/shared';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import {IProjectEntity} from '@libs/project/interfaces';
@Injectable({
    providedIn: 'root',
})
export class EstimateMainCostGroupBehaviorService extends EstimateShareCostGroupBehaviorService<ICostGroupEntity,BasicsCostGroupCatalogEntity,CostGroupComplete,IProjectEntity>{

    public constructor() {
        super(inject(EstimateMainCostGroupCatalogDataService));
    }
}