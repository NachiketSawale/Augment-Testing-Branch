import {EntityInfo} from '@libs/ui/business-base';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';
import {
    ProjectRuleParameterBehavior,
    ProjectRuleParameterDataService,
    ProjectRuleParameterLayoutService
} from '@libs/project/rule';

export const projectRuleParameterEntityInfo: EntityInfo = EntityInfo.create<IEstimateRuleParameterBaseEntity>({
    grid: {
        title: {text:'Estimate Rule Parameter',key: 'estimate.rule.estimateRuleParameter'},
        behavior: ctx => ctx.injector.get(ProjectRuleParameterBehavior),
    },
    dataService: ctx => ctx.injector.get(ProjectRuleParameterDataService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'PrjEstRuleParamDto'},
    permissionUuid: '677F693B516C41C3B65FD3D1B68E652D',
    layoutConfiguration: context => {
        return context.injector.get(ProjectRuleParameterLayoutService).generateLayout();
    }
});