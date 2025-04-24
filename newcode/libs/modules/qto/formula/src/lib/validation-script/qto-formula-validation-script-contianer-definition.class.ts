/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { BasicsSharedScriptEditorContainerComponent, SCRIPT_EDITOR_ENTITY_TOKEN } from '@libs/basics/shared';
import { EntityContainerInjectionTokens } from '@libs/ui/business-base';
import { QtoFormulaGridDataService } from '../services/qto-formula-grid-data.service';
import { ServiceLocator } from '@libs/platform/common';
import { IQtoFormulaScriptEntity } from '../model/entities/qto-formula-script-entity.interface';
import { QtoFormulaValidationScriptDataService } from './qto-formula-validation-script-data.service';
import { QtoFormulaValidationScriptProviderService } from './qto-formula-validation-script-provider.service';

/**
 * script definition container
 */
export class QtoFormulaValidationScriptContianerDefinition {
    private readonly definition = {
        uuid: '3d7638dd7d4f4b568456462ff1a02c68',
        id: 'qto.formula.scriptValidation',
        title: {
            text: 'Validation Script',
            key: 'qto.formula.scriptValidation.scriptValidationContainerTitle'
        },
        containerType: BasicsSharedScriptEditorContainerComponent,
        permission: '3d7638dd7d4f4b568456462ff1a02c68',
        providers: [{
            provide: new EntityContainerInjectionTokens<IQtoFormulaScriptEntity>().dataServiceToken,
            useExisting: QtoFormulaGridDataService
        }, {
            provide: SCRIPT_EDITOR_ENTITY_TOKEN,
            useValue: {
                ScriptProvider: ServiceLocator.injector.get(QtoFormulaValidationScriptProviderService),
                getUrl: 'qto/formula/script/listorcreate',
                isNewDefaultScript: () => {
                    const formulaDataService = ServiceLocator.injector.get(QtoFormulaGridDataService);
                    const itemSelected = formulaDataService.getSelectedEntity();
                    return itemSelected && itemSelected.Version === 0;
                },
                newDefaultScript: 'validator.check("result", result !== "", "The result should not be empty"); \nvalidator.check("result", result !== 0, "The result should not be 0"); ',
                setItemAsModified: (item: IQtoFormulaScriptEntity) => {
                    const formulaValidationScriptService = ServiceLocator.injector.get(QtoFormulaValidationScriptDataService);
                    formulaValidationScriptService.setItemAsModified(item);
                }
            }
        }]
    };

    public getDefinition () {
        return this.definition;
    }
}

export const QTO_FORMULA_VALIDATION_SCRIPT_CONTAINER_DEFINITION = runInInjectionContext(ServiceLocator.injector, () =>
    new QtoFormulaValidationScriptContianerDefinition().getDefinition());