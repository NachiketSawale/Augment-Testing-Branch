/*
 * Copyright(c) RIB Software GmbH
 */

import {EstimateMainCostGroupCatalogDataService} from './estimate-main-cost-group-catalog-data.service';
import {inject, Injectable} from '@angular/core';
import { ICostGroupEntity,BasicsCostGroupCatalogEntity } from '@libs/basics/costgroups';
import { CostGroupComplete, EstimateShareCostGroupDataService } from '@libs/estimate/shared';

@Injectable({
    providedIn: 'root',
})
export class EstimateMainCostGroupDataService extends EstimateShareCostGroupDataService<ICostGroupEntity, BasicsCostGroupCatalogEntity, CostGroupComplete> {
    public constructor() {
        super(inject(EstimateMainCostGroupCatalogDataService));
    }
}