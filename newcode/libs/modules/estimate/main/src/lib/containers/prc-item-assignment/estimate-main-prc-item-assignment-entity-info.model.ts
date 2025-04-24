import {EntityInfo} from '@libs/ui/business-base';
import {EstimateMainPrcItemAssignmentDataService} from './estimate-main-prc-item-assignment-data.service';
import {EstimateMainPrcItemAssignmentLayoutService} from './estimate-main-prc-item-assignment-layout.service';
import { IEstimateMainPrcItemAssignmentEntity } from '@libs/estimate/shared';
import { EstimateMainPrcItemAssignmentBehaviorService } from './estimate-main-prc-item-assignment-behavior.service';

export const ESTIMATE_MAIN_PRC_ITEM_ASSIGNMENT_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstimateMainPrcItemAssignmentEntity> ({
    grid: {
        title: {text: 'itemAssignment',key: 'estimate.main.itemAssignment'},
        behavior: ctx => ctx.injector.get(EstimateMainPrcItemAssignmentBehaviorService),
    },

    dataService: ctx => ctx.injector.get(EstimateMainPrcItemAssignmentDataService),
    dtoSchemeId: { moduleSubModule: 'Procurement.Common', typeName: 'PrcItemAssignmentDto' },
    permissionUuid: '4cf3bc54dd38437b8aaae2005cc80ae4',
    layoutConfiguration: context => {
        return context.injector.get(EstimateMainPrcItemAssignmentLayoutService).generateLayout();
    },
    containerBehavior:ctx => ctx.injector.get(EstimateMainPrcItemAssignmentBehaviorService)
});