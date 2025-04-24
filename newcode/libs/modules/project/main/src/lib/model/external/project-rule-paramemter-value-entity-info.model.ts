import {EntityInfo} from '@libs/ui/business-base';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {
    ProjectRuleParameterValueBehavior,
    ProjectRuleParameterValueDataService,
    ProjectRuleParameterValueLayoutService
} from '@libs/project/rule';

export const projectRuleParameterValueEntityInfo: EntityInfo = EntityInfo.create<IEstimateRuleParameterValueBaseEntity>({
    grid: {
        title: {text:'Estimate Rule Parameter Value',key: 'estimate.rule.estimateRuleParameterValue'},
        behavior: ctx => ctx.injector.get(ProjectRuleParameterValueBehavior),
    },
    dataService: ctx => ctx.injector.get(ProjectRuleParameterValueDataService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleParamValueDto'},
    permissionUuid: 'edab9784710a4822aea158e82ece45f7',
    layoutConfiguration: context => {
        return context.injector.get(ProjectRuleParameterValueLayoutService).generateLayout();
    }
});