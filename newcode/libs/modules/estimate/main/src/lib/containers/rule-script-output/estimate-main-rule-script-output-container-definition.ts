import {OutputPartialComponent} from './output-partial.component';
import {runInInjectionContext} from '@angular/core';
import {ServiceLocator} from '@libs/platform/common';
import {EntityContainerInjectionTokens} from '@libs/ui/business-base';
import {SCRIPT_EDITOR_ENTITY_TOKEN} from '@libs/basics/shared';
import {EstimateMainRuleScriptOutputDataService} from './estimate-main-rule-script-output-data.service';
import {IEstRuleResultVEntity} from '@libs/estimate/interfaces';

export class EstimateMainRuleScriptOutputContainerDefinition {

    private readonly definition = {
        uuid: '8989297c1ce24515a2f81521bda937c7',
        id: 'estimate.main.est.rule.script',
        title: {
            text: 'Rule Execution Output', key: 'estimate.main.outputContainerTitle'
        },
        containerType :OutputPartialComponent,
        permissionUuid: '8989297c1ce24515a2f81521bda937c7',
        providers: [{
            provide: new EntityContainerInjectionTokens<IEstRuleResultVEntity>().dataServiceToken,
            useExisting: EstimateMainRuleScriptOutputDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                lockMessage: {
                    key: 'estimate.main.outputContainerTitle',
                    test: 'Rule Execution Output'
                },
                scriptField: 'CalculationFormula',
                isReadonly: () => {
                   // const formulaDataService = ServiceLocator.injector.get(EstimateMainRuleScriptOutputDataService);
                   // return formulaDataService.IsScriptDefinitionReadonly();
                }
            }
        }]
    };

    public getDefinition () {
        return this.definition;
    }
}
export const ESTIMATE_MAIN_RULE_SCRIPT_OUTPUT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
new EstimateMainRuleScriptOutputContainerDefinition().getDefinition());
