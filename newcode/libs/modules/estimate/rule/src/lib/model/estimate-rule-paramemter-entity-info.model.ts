import {EntityInfo} from '@libs/ui/business-base';
import {EstimateRuleParameterLayoutService} from '../services/estimate-rule-parameter-layout.service';
import {EstimateRuleParameterBehavior} from '../behaviors/estimate-rule-paramemter-behavior.service';
import {EstimateRuleParameterDataService} from '../services/estimate-rule-parameter-data.service';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';


export const estimateRuleParameterEntityInfo: EntityInfo = EntityInfo.create<IEstimateRuleParameterBaseEntity>({
    grid: {
        title: {text:'Estimate Rule Parameter',key: 'estimate.rule.estimateRuleParameter'},
        behavior: ctx => ctx.injector.get(EstimateRuleParameterBehavior),
    },
    form: {
        title: {text:'Estimate Rule Parameter Detail',key: 'estimate.rule.detailEstimateRuleParameter'},
        containerUuid: 'C785FAAAFB434C339A92124045C96FA1',
    },
    dataService: ctx => ctx.injector.get(EstimateRuleParameterDataService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleParamDto'},
    permissionUuid: '7268F6D33A2543D8B3BE0906A253547F',
    layoutConfiguration: context => {
        return context.injector.get(EstimateRuleParameterLayoutService).generateLayout();
    }
});