import {prefixAllTranslationKeys} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {Injectable} from '@angular/core';
import {BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {IEstimateRuleParameterBaseEntity} from '@libs/estimate/interfaces';
import {
    IEstimateRuleParameterBaseLayoutServiceInterface
} from './estimate-rule-parameter-base-layout.service.interface';

@Injectable({
    providedIn: 'root'
})

export class IEstimateRuleParameterBaseLayoutService<T extends IEstimateRuleParameterBaseEntity> implements IEstimateRuleParameterBaseLayoutServiceInterface<T> {


    public commonLayout(): ILayoutConfiguration<IEstimateRuleParameterBaseEntity> {
        return {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'estimate.interfaces.estimateRuleParameter',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'Info',
                        'EstParameterGroupFk',
                        'ValueDetail',
                        'DefaultValue',
                        'ValueType',
                        'IsLookup',
                        'DescriptionInfo',
                        'Code',
                        'Sorting',
                        'UomFk'
                    ]
                }
            ],
            'labels': {
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
            'overloads': {
                UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
                'Info': {
                },
                EstParameterGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideEstParameterGroupLookupOverload(true),

            }
        };
    }

    public async generateLayout(): Promise<ILayoutConfiguration<T>> {
        return this.commonLayout() as ILayoutConfiguration<T>;
    }
}