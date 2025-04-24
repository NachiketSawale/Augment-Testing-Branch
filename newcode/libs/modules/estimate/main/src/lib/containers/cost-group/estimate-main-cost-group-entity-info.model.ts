/*
 * Copyright(c) RIB Software GmbH
 */

import {EstimateMainCostGroupCatalogDataService} from './estimate-main-cost-group-catalog-data.service';
import {EstimateMainCostGroupDataService} from './estimate-main-cost-group-data.service';
import {EstimateMainCostGroupBehaviorService} from './estimate-main-cost-group-behavior.service';
import {
    EstimateShareCostGroupLayoutService,
    EstimateShareCostGroupEntityInfoFactoryService
} from '@libs/estimate/shared';

export const ESTIMATE_MAIN_COST_GROUP_ENTITY_INFO = EstimateShareCostGroupEntityInfoFactoryService.create({
    permissionUuid: '4f3dd493c4e145a49b54506af6da02ef',
    formUuid: '4f3dd493c4e145a49b54506af6da02ef',
    dataServiceToken: EstimateMainCostGroupDataService,
    parentDataService:EstimateMainCostGroupCatalogDataService,
    behavior:EstimateMainCostGroupBehaviorService,
    layoutServiceToken:EstimateShareCostGroupLayoutService
});