import {EntityInfo} from '@libs/ui/business-base';
import {IEstimateMainCostGroupAssignment} from '../../model/interfaces/estimate-main-cost-group-assignment.interface';
import {EstimateMainCostGroupAssignmentDataService} from './estimate-main-cost-group-assignment-data.service';
import {
    EstimateMainCostGroupAssignmentLayoutService
} from './estimate-main-cost-group-assignment-layout.service';
import {
    EstimateMainCostGroupAssignmentBehaviorService
} from './estimate-main-cost-group-assignment-behavior.service';
import {EntityDomainType} from '@libs/platform/data-access';


export const ESTIMATE_MAIN_COST_GROUP_ASSIGNMENT_ENTITY_INFO :EntityInfo = EntityInfo.create<IEstimateMainCostGroupAssignment>({
    grid: {
        title: { text: 'Cost Group Assignment', key: 'estimate.main.costGroupListTitle' },
        containerUuid: '250D65D6FBC542678BAE824A2D077420',
    },

    dataService: ctx => ctx.injector.get(EstimateMainCostGroupAssignmentDataService),
    //dtoSchemeId: { moduleSubModule: 'Basics.CostGroups', typeName: 'CostGroupCatDto' },
    entitySchema: {
        schema: 'CostGroupAssignmentCompositeEntity', properties: {
            Code: {domain: EntityDomainType.Description, mandatory: true},
            Costgroup: {domain: EntityDomainType.Description, mandatory: true},
            Costgroup_Desc: {domain: EntityDomainType.Translation, mandatory: false},
            DescriptionInfo: {domain: EntityDomainType.Translation, mandatory: false}
        }},
    permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
    layoutConfiguration: context => {
        return context.injector.get(EstimateMainCostGroupAssignmentLayoutService).generateLayout();
    },
    containerBehavior:ctx => ctx.injector.get(EstimateMainCostGroupAssignmentBehaviorService)
});