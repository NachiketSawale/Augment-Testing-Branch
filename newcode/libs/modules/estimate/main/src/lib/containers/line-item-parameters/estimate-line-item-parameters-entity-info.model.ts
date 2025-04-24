import {EntityInfo} from '@libs/ui/business-base';
import {EstimateLineItemParametersDataService} from './estimate-line-item-parameters-data.service';
import {
    EstimateLineItemParametersBehaviorService
} from './estimate-line-item-parameters-behavior.service';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {FieldType} from '@libs/ui/common';
import {BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';



export const ESTIMATE_LINE_ITEM_PARAMETER_INFO: EntityInfo = EntityInfo.create<IEstimateRuleParameterBaseEntity> ({
    grid: {
        title: {text: 'lineItemParameterContainer',key: 'estimate.main.lineItemParameterContainer'},
        behavior: ctx => ctx.injector.get(EstimateLineItemParametersBehaviorService),
        containerUuid:'1964c1d48f5B4b2b99778a0917e2666a',
    },

    dataService: ctx => ctx.injector.get(EstimateLineItemParametersDataService),
    dtoSchemeId: { moduleSubModule: 'Estimate.Rule', typeName: 'EstRuleParamDto' },
    permissionUuid: '681223e37d524ce0b9bfa2294e18d650',
    layoutConfiguration:{
        groups:[
            {
                'gid': 'basicData',
                'title': {
                    'key': 'estimate.main.estimateRuleParameter',
                    'text': 'Basic Data'
                },
                'attributes': [
                    'Info',
                    'Code',
                    'DescriptionInfo',
                    'EstParameterGroupFk',
                    'ValueDetail',
                    'ParameterValue',
                    'UomFk',
                    'DefaultValue',
                    'ValueType',
                    'IsLookup',
                    'AssignedStructureId',
                    'EstRuleParamValueFk',
                    'ProjectEstRuleFk'
                ]
            }
        ],

        labels: {
            ...prefixAllTranslationKeys('estimate.main.', {
                'Info': {
                    'key': 'info',
                    'text': 'Info'
                },'EstParameterGroupFk': {
                    'key': 'estParameterGroupFk',
                    'text': 'Estimate Parameter Group'
                },'ValueDetail': {
                    'key': 'valueDetail',
                    'text': 'Default Value Detail'
                },'DefaultValue': {
                    'key': 'defaultValue',
                    'text': 'Default Value'
                },'ValueType': {
                    'key': 'detailParameterValueType',
                    'text': 'Type'
                },'IsLookup': {
                    'key': 'detailParameterIsLookup',
                    'text': 'Is Lookup'
                },
                'ParameterValue':{
                    'key': 'parameterValue',
                    'text': 'Parameter Value'
                },'AssignedStructureId':{
                    'key': 'assignedStructureId',
                    'text': 'Assigned Structure'
                },'EstRuleParamValueFk':{
                    'key': 'estRuleParamValueFk',
                    'text': 'Assigned Structure'
                },'ProjectEstRuleFk':{
                    'key': 'projectEstRuleFk',
                    'text': 'Project Rule'
                }
            }),
            ...prefixAllTranslationKeys('cloud.common.', {
                'DescriptionInfo': {
                    'key': 'entityDescription',
                    'text': 'Description',
                },'Code': {
                    'key': 'entityCode',
                    'text': 'Code'
                },'Sorting': {
                    'key': 'entitySorting',
                    'text': 'Sorting'
                },'UomFk': {
                    'key': 'entityUoM',
                    'text': 'Uom'
                }
            }),
        },
        overloads: {
            'DescriptionInfo': {
                type: FieldType.Translation,
                'readonly': true
            },'Code': {
                'readonly': true
            },'Sorting': {
                'readonly': true
            },
            UomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(),
            'Info': {
                'readonly': true
            },
            EstParameterGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterGroupReadonlyLookupOverload(),
            // EstRuleParamValueFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterValueTypeReadonlyLookupOverload(),
            'ValueDetail': {
                'readonly': true
            },'DefaultValue': {
                'readonly': true
            },'ValueType': {
                'readonly': true
            },'IsLookup': {
                'readonly': true
            }
        },

    },
    containerBehavior:ctx => ctx.injector.get(EstimateLineItemParametersBehaviorService)
});