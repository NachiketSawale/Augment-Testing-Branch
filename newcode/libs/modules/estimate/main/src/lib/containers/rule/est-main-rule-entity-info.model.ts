/*
 * Copyright(c) RIB Software GmbH
 */

import {EntityInfo} from '@libs/ui/business-base';
import {IEstMainRuleEntity} from '@libs/estimate/interfaces';
import {EstimateRuleType} from '@libs/estimate/interfaces';
import {EstimateMainRuleDataService} from './est-main-rule-data.service';
import {EstimateMainRuleBehavior} from './est-main-rule-behavior.service';
import {EstimateMainRuleValidationService} from './estimate-main-rule-validation.service';
import {EstimateRuleBaseLayoutService} from '@libs/estimate/shared';


export const ESTIMATE_MAIN_RULE_ENTITY_INFO: EntityInfo = EntityInfo.create<IEstMainRuleEntity> ({
    grid: {
        title: { text: 'Rules', key: 'estimate.main.ruleContainer' },
        containerUuid: 'c41abea3ef7741d083bfc34029e8a8f1',
        treeConfiguration:true,
        behavior: ctx => ctx.injector.get(EstimateMainRuleBehavior),
    },
    dataService: ctx => ctx.injector.get(EstimateMainRuleDataService),
    validationService: context => context.injector.get(EstimateMainRuleValidationService),
    dtoSchemeId: {moduleSubModule: 'Estimate.Rule', typeName: 'PrjEstRuleDto'},
    permissionUuid: 'c41abea3ef7741d083bfc34029e8a8f1',
    layoutConfiguration: context => {
        return context.injector.get(EstimateRuleBaseLayoutService<IEstMainRuleEntity>).generateLayout(EstimateRuleType.EstimateRule);
    }
});