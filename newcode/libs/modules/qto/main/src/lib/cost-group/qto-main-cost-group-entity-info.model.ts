/*
 * Copyright(c) RIB Software GmbH
 */

import {QtoMainCostGroupDataService} from './qto-main-cost-group-data.service';
import {QtoMainCostGroupCatalogDataService} from './qto-main-cost-group-catalog-data.service';
import {QtoMainCostGroupBehaviorService} from './qto-main-cost-group-behavior.service';
import {
    EstimateShareCostGroupEntityInfoFactoryService,
    EstimateShareCostGroupLayoutService
} from '@libs/estimate/shared';

export const QTO_MAIN_COST_GROUP_ENTITY_INFO =  EstimateShareCostGroupEntityInfoFactoryService.create({
    permissionUuid: '4f3dd493c4e145a49b54506af6da02ef',
    formUuid: '4f3dd493c4e145a49b54506af6da02ef',
    dataServiceToken: QtoMainCostGroupDataService,
    parentDataService:QtoMainCostGroupCatalogDataService,
    behavior:QtoMainCostGroupBehaviorService,
    layoutServiceToken:EstimateShareCostGroupLayoutService
});