/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {EstimateRuleDataService} from '../services/estimate-rule-data.service';
import {EstimateRuleBehavior} from '../behaviors/estimate-rule-behavior.service';
import {IGridTreeConfiguration} from '@libs/ui/common';
import {EstimateRuleLayoutService} from '../services/estimate-rule-layout.service';
import {EstimateRuleType, IEstRuleEntity} from '@libs/estimate/interfaces';


export const ESTIMATE_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstRuleEntity>({
    grid: {
        title: {key: 'estimateRule'},
        containerUuid: 'CC9CCF50825140F89E37C95E51813971',
        treeConfiguration: ctx => {
            return {
                parent: function (entity: IEstRuleEntity) {
                    const service = ctx.injector.get(EstimateRuleDataService);
                    return service.parentOf(entity);
                },
                children: function (entity: IEstRuleEntity) {
                    const service = ctx.injector.get(EstimateRuleDataService);
                    return service.childrenOf(entity);
                }
            } as IGridTreeConfiguration<IEstRuleEntity>;
        },
        behavior: ctx => ctx.injector.get(EstimateRuleBehavior),
    },
    form: {
        title: {key: 'estimate.rule' + '.detailEstimateRule'},
        containerUuid: '4EA1203C018D49D08D1A671F5EC8B452',
    },
    dataService: ctx => ctx.injector.get(EstimateRuleDataService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleDto'},
    permissionUuid: 'CC9CCF50825140F89E37C95E51813971',
    layoutConfiguration: context => {
        return context.injector.get(EstimateRuleLayoutService).generateLayout(EstimateRuleType.MasterRule);
    }
});