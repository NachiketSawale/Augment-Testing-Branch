/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IQtoFormulaScriptTransEntity } from '../entities/qto-formula-script-trans-entity.interface';
import { QtoFormulaScriptValidationDataService } from '../../services/qto-formula-script-validation-data.service';
import { QtoFormulaScriptValidationDataValidationService } from '../../services/validations/qto-formula-script-validation-data-validation.service';


export const QTO_FORMULA_SCRIPT_VILIDATION_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoFormulaScriptTransEntity> ({
    grid: {
        title: {key: 'qto.formula.scriptValidationTrans.scriptValidationTransContainerTitle'}
    },
    dataService: ctx => ctx.injector.get(QtoFormulaScriptValidationDataService),
    validationService: ctx => ctx.injector.get(QtoFormulaScriptValidationDataValidationService),
    dtoSchemeId: {moduleSubModule: 'Qto.Formula', typeName: 'QtoFormulaScriptTransDto'},
    permissionUuid: 'd91f9e1ee98945a98485365129e2c945',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['Code', 'ValidationText']
        }],
        labels: {
            ...prefixAllTranslationKeys('qto.formula.', {
                Code: {key: 'scriptValidationTrans.code'},
                ValidationText: {key: 'scriptValidationTrans.validationText'}
            })
        }
    }
});