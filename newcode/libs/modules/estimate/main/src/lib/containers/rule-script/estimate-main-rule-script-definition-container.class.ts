/*
 * Copyright(c) RIB Software GmbH
 */

import {BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {ServiceLocator} from '@libs/platform/common';
import {EstimateMainRuleDataService} from '../rule/est-main-rule-data.service';
import {EstimateMainRuleScriptDataService} from './estimate-main-rule-script-data.service';
import { runInInjectionContext} from '@angular/core';
import { IEstMainRuleEntity } from '@libs/estimate/interfaces';

export class EstimateMainRuleScriptDefinitionContainer{

    private readonly definition = {
        uuid: 'cf0e55a317b441a4a1f9837758f2e0cd',
        id: 'estimate.rule.script',
        title: {
            text: 'Estimate Rules Script',
            key: 'estimate.rule.ruleScriptContainer'
        },
        containerType: BasicsSharedScriptEditorContainerComponent,
        permission: 'cf0e55a317b441a4a1f9837758f2e0cd',
        providers: [{
            provide: new EntityContainerInjectionTokens<IEstMainRuleEntity>().dataServiceToken,
            useExisting: EstimateMainRuleDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                getUrl: (parentItem: IEstMainRuleEntity) =>{
                    const estimateMainRuleScriptDataService = ServiceLocator.injector.get(EstimateMainRuleScriptDataService);
                    return estimateMainRuleScriptDataService.getUrl(parentItem);
                },
                scriptField: 'ScriptData',
                mainItemIdField: 'OriginalMainId',
                getPostRequestBody: (parentItem: IEstMainRuleEntity, mainItemIdField: string) =>{
                    const estimateMainRuleScriptDataService = ServiceLocator.injector.get(EstimateMainRuleScriptDataService);
                    return estimateMainRuleScriptDataService.getPostRequestBody(parentItem, mainItemIdField);
                }
            }
        }]
    };

    /**
     * get estimate main rule script Definition
     */
    public getDefinition () {
        return this.definition;
    }
}

export const ESTIMATE_MAIN_RULE_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
    new EstimateMainRuleScriptDefinitionContainer().getDefinition());