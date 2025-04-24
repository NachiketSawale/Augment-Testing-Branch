import {EstimateRuleParameterValueBehavior} from '../behaviors/estimate-rule-paramemter-value-behavior.service';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';
import {EstimateRuleParameterValueLayoutService} from '../services/estimate-rule-parameter-value-layout.service';
import {EstimateRuleParameterValueDataService} from '../services/estimate-rule-parameter-value-data.service';
import {EntityInfo} from '@libs/ui/business-base';


export const estimateRuleParameterValueEntityInfo: EntityInfo = EntityInfo.create<IEstimateRuleParameterValueBaseEntity>({
    grid: {
        title: {text:'Estimate Rule Parameter Value',key: 'estimate.rule.estimateRuleParameterValue'},
        behavior: ctx => ctx.injector.get(EstimateRuleParameterValueBehavior),
    },
    dataService: ctx => ctx.injector.get(EstimateRuleParameterValueDataService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleParamValueDto'},
    permissionUuid: '70901a01659e4365a0845f63f01843cb',
    layoutConfiguration: context => {
        return context.injector.get(EstimateRuleParameterValueLayoutService).generateLayout();
    }
});