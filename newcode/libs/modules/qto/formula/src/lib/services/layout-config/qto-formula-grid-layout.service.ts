/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IQtoFormulaEntity } from '../../model/entities/qto-formula-entity.interface';
import {QtoFormulaTypeLookupService} from '../lookup-service/qto-formula-type-lookup.service';
import {QtoFormulaUserFormLookupService} from '../lookup-service/qto-formula-user-form-lookup.service';
import {QtoFormulaIconLookupService} from '../lookup-service/qto-formula-icon-lookup.service';
/**
 * QTO Formula layout service
 */
@Injectable({
    providedIn: 'root'
})
export class QtoFormulaGridLayoutService {
    /**
     * Generate layout config
     */
    public generateLayout(): ILayoutConfiguration<IQtoFormulaEntity> {
        return {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'cloud.common.entityProperties',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'Code',
                        'Icon',
                        'QtoFormulaTypeFk',
                        'BasFormFk',
                        'DescriptionInfo',
                        'IsDefault',
                        'Value1IsActive',
                        'Operator1',
                        'Value2IsActive',
                        'Operator2',
                        'Value3IsActive',
                        'Operator3',
                        'Value4IsActive',
                        'Operator4',
                        'Value5IsActive',
                        'Operator5',
                        'IsLive',
                        'IsMultiline',
                        'MaxLinenumber',
                        'IsDialog'
                    ]
                }
            ],
            'labels': {
                ...prefixAllTranslationKeys('cloud.common.', {
                    'Code': {
                        'key': 'entityCode',
                        'text': 'Code'
                    },
                    'DescriptionInfo': {
                        'key': 'entityDescription',
                        'text': '*Description'
                    }
                }),
                ...prefixAllTranslationKeys('qto.formula.',{
                    'Icon': {
                        'key': 'icon',
                        'text': 'Icon'
                    },
                    'QtoFormulaTypeFk': {
                        'key': 'formulaType',
                        'text': 'FormulaType'
                    },
                    'BasFormFk': {
                        'key': 'basformfk',
                        'text': 'User Form'
                    },
                    'IsDefault': {
                        'key': 'isdefault',
                        'text': 'IsDefault'
                    },
                    'Value1IsActive': {
                        'key': 'value',
                        'text': 'Value1',
                        'params':{'p_0':1}
                    },
                    'Value2IsActive': {
                        'key': 'value',
                        'text': 'Value2',
                        'params':{'p_0':2}
                    },
                    'Value3IsActive': {
                        'key': 'value',
                        'text': 'Value3',
                        'params':{'p_0':3}
                    },
                    'Value4IsActive': {
                        'key': 'value',
                        'text': 'Value4',
                        'params':{'p_0':4}
                    },
                    'Value5IsActive': {
                        'key': 'value',
                        'text': 'Value5',
                        'params':{'p_0':5}
                    },
                    'Operator1': {
                        'key': 'operator',
                        'text': 'Operator 1',
                        'params':{'p_0':1}
                    },
                    'Operator2': {
                        'key': 'operator',
                        'text': 'Operator 2',
                        'params':{'p_0':2}
                    },
                    'Operator3': {
                        'key': 'operator',
                        'text': 'Operator 3',
                        'params':{'p_0':3}
                    },
                    'Operator4': {
                        'key': 'operator',
                        'text': 'Operator 4',
                        'params':{'p_0':4}
                    },
                    'Operator5': {
                        'key': 'operator',
                        'text': 'Operator 5',
                        'params':{'p_0':5}
                    },
                    'IsLive': {
                        'key': 'islive',
                        'text': 'IsLive'
                    },
                    'IsMultiline': {
                        'key': 'ismultiline',
                        'text': 'Is MultiLine'
                    },
                    'MaxLinenumber': {
                        'key': 'maxlinenumber',
                        'text': 'Max LineNumber'
                    },
                    'IsDialog': {
                        'key': 'isdialog',
                        'text': 'Is Dialog'
                    }
                })
            },
            'overloads': {
                'Icon':{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: QtoFormulaIconLookupService,
                        showClearButton: true
                    })
                },
                'QtoFormulaTypeFk':{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: QtoFormulaTypeLookupService,
                        showClearButton: true,
                        showDescription: true,
                        descriptionMember: 'Description'
                    })
                },
                'BasFormFk':{
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: QtoFormulaUserFormLookupService,
                        showClearButton: true,
                        showDescription: true,
                        descriptionMember: 'Description'
                    })
                }
            }
        };
    }
}