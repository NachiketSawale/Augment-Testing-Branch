/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { IQtoFormulaEntity } from '../model/entities/qto-formula-entity.interface';
import { QtoFormulaGridDataService } from '../services/qto-formula-grid-data.service';
import { ServiceLocator } from '@libs/platform/common';

/**
 * script definition container
 */
export class QtoFormulaScriptDefinitionContainerDefinition {
    private readonly definition = {
        uuid: 'a19431f94d1d4ed9b3b75c357fe68d3c',
        id: 'qto.formula.specification',
        title: {
            text: 'Script Definition',
            key: 'qto.formula.script.Title'
        },
        containerType: BasicsSharedScriptEditorContainerComponent,
        permission: 'a19431f94d1d4ed9b3b75c357fe68d3c',
        providers: [{
            provide: new EntityContainerInjectionTokens<IQtoFormulaEntity>().dataServiceToken,
            useExisting: QtoFormulaGridDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                lockMessage: {
                    key: 'qto.formula.scriptDefinitionText',
                    test: 'Script definition only availiable for "Script" (Formula Type) formula'
                },
                scriptField: 'CalculationFormula',
                isReadonly: () => {
                    const formulaDataService = ServiceLocator.injector.get(QtoFormulaGridDataService);
                    return formulaDataService.IsScriptDefinitionReadonly();
                }
            }
        }]
    };

    public getDefinition () {
        return this.definition;
    }
}

export const QTO_FORMULA_SCRIPT_DEFINITION_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
    new QtoFormulaScriptDefinitionContainerDefinition().getDefinition());