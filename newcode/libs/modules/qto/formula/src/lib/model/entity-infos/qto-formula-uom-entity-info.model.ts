/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IQtoFormulaUomEntity } from '../entities/qto-formula-uom-entity.interface';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { QtoFormulaUomDataService } from '../../services/qto-formula-uom-data.service';
import { QtoFormulaUomValidationService } from '../../services/validations/qto-formula-uom-validation.service';

export const QTO_FORMULA_UOM_ENTITY_INFO: EntityInfo = EntityInfo.create<IQtoFormulaUomEntity> ({
    grid: {
        title: {key: 'qto.formula.uom.gridViewTitle'}
    },
    form: {
        title: {key: 'qto.formula.uom.formViewTitle'},
        containerUuid: '8a97ce421cab4889bdb7bd50be2bd3f5'
    },
    dataService: ctx => ctx.injector.get(QtoFormulaUomDataService),
    validationService: ctx => ctx.injector.get(QtoFormulaUomValidationService),
    dtoSchemeId: {moduleSubModule: 'Qto.Formula', typeName: 'QtoFormulaUomDto'},
    permissionUuid: '4d2e1c160068475896d53eb5a4daa22d',
    layoutConfiguration: {
        groups: [{
            gid: 'default',
            attributes: ['UomFk', 'Value1IsActive', 'Operator1', 'Value2IsActive', 'Operator2', 'Value3IsActive', 'Operator3', 'Value4IsActive', 'Operator4',
                'Value5IsActive', 'Operator5']
        }],
        overloads: {
            UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true)
        },
        labels: {
            ...prefixAllTranslationKeys('cloud.common.', {
                UomFk: {key: 'entityUoM'}
            }),
            ...prefixAllTranslationKeys('qto.formula.', {
                'Value1IsActive': {
                    'key': 'value',
                    'text': 'Value1',
                    'params': {'p_0': 1}
                },
                'Value2IsActive': {
                    'key': 'value',
                    'text': 'Value2',
                    'params': {'p_0': 2}
                },
                'Value3IsActive': {
                    'key': 'value',
                    'text': 'Value3',
                    'params': {'p_0': 3}
                },
                'Value4IsActive': {
                    'key': 'value',
                    'text': 'Value4',
                    'params': {'p_0': 4}
                },
                'Value5IsActive': {
                    'key': 'value',
                    'text': 'Value5',
                    'params': {'p_0': 5}
                },
                'Operator1': {
                    'key': 'operator',
                    'text': 'Operator 1',
                    'params': {'p_0': 1}
                },
                'Operator2': {
                    'key': 'operator',
                    'text': 'Operator 2',
                    'params': {'p_0': 2}
                },
                'Operator3': {
                    'key': 'operator',
                    'text': 'Operator 3',
                    'params': {'p_0': 3}
                },
                'Operator4': {
                    'key': 'operator',
                    'text': 'Operator 4',
                    'params': {'p_0': 4}
                },
                'Operator5': {
                    'key': 'operator',
                    'text': 'Operator 5',
                    'params': {'p_0': 5}
                }
            })
        }
    }
});