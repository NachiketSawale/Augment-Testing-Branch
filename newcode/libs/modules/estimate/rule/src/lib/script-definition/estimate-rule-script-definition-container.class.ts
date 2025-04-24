/*
 * Copyright(c) RIB Software GmbH
 */


import {BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {ServiceLocator} from '@libs/platform/common';
import {EstimateRuleDataService} from '../services/estimate-rule-data.service';
import {IEstRuleEntity} from '@libs/estimate/interfaces';
import {IEstRuleScriptEntity} from '../model/entities/est-rule-script-entity.interface';
import {EstimateRuleScriptDataService} from '../services/estimate-rule-script-data.service';
import {runInInjectionContext} from '@angular/core';

export class EstimateRuleScriptDefinitionContainerClass{

    private readonly definition = {
        uuid: '691b4f8931344a529b9210d44ea2b505',
        id: 'estimate.rule.script',
        title: {
            text: 'Estimate Rules Script',
            key: 'estimate.rule.scriptContainerTitle'
        },
        containerType: BasicsSharedScriptEditorContainerComponent,
        permission: '691b4f8931344a529b9210d44ea2b505',
        providers: [{
            provide: new EntityContainerInjectionTokens<IEstRuleEntity>().dataServiceToken,
            useExisting: EstimateRuleDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                getUrl: 'estimate/rule/script/listorcreate',
                scriptField: 'ScriptData',
                setItemAsModified: (item: IEstRuleScriptEntity) => {
                    const estimateRuleScriptDataService = ServiceLocator.injector.get(EstimateRuleScriptDataService);
                    estimateRuleScriptDataService.setItemAsModified(item);
                },
                getPostRequestBody: (parentItem: IEstRuleEntity,  mainItemIdField: string) => {
                    const estimateMainRuleScriptDataService = ServiceLocator.injector.get(EstimateRuleScriptDataService);
                    return  estimateMainRuleScriptDataService.getPostRequestBody(parentItem, mainItemIdField);
                }
            }
        }]
    };

    public getDefinition () {
        return this.definition;
    }
}

export const ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
    new EstimateRuleScriptDefinitionContainerClass().getDefinition());