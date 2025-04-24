/*
 * Copyright(c) RIB Software GmbH
 */

import {inject, runInInjectionContext} from '@angular/core';
import {BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN} from '@libs/basics/shared';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {ProjectEstimateRuleDataService} from '../services/project-estimate-rule-data.service';
import {IProjectEstimateRuleEntity} from '@libs/project/interfaces';
import {ProjectEstimateRuleScriptDataService} from '../services/project-estimate-rule-script-data.service';
import {ServiceLocator} from '@libs/platform/common';

export class ProjectEstimateRuleScriptDefinitionContainer{
    private readonly projectEstimateRuleScriptDataService = inject(ProjectEstimateRuleScriptDataService);

    private readonly definition = {
        uuid: 'b514a6f1041b40499f4cfff00a149a25',
        id: 'project.rule.script',
        title: {
            text: 'Estimate Rules Script',
            key: 'estimate.rule.ruleScriptContainer'
        },
        containerType: BasicsSharedScriptEditorContainerComponent,
        permission: 'b514a6f1041b40499f4cfff00a149a25',
        providers: [{
            provide: new EntityContainerInjectionTokens<IProjectEstimateRuleEntity>().dataServiceToken,
            useExisting: ProjectEstimateRuleDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                getUrl: 'estimate/rule/projectestrulescript/listorcreate',
                scriptField: 'ScriptData',
                mainItemIdField: 'Id',
                getPostRequestBody: this.projectEstimateRuleScriptDataService.getPostRequestBody,
                setItemAsModified: (item: IProjectEstimateRuleEntity) => {
                    const projectEstimateRuleScriptDataService = ServiceLocator.injector.get(ProjectEstimateRuleScriptDataService);
                    projectEstimateRuleScriptDataService.setItemAsModified(item);
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

export const PROJECT_ESTIMATE_RULE_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
    new ProjectEstimateRuleScriptDefinitionContainer().getDefinition());