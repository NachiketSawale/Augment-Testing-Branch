import {prefixAllTranslationKeys} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {Injectable} from '@angular/core';
import {
    IEstimateRuleParameterValueBaseLayoutServiceInterface
} from './estimate-rule-parameter-value-base-layout.service.interface';
import {IEstimateRuleParameterValueBaseEntity} from '@libs/estimate/interfaces';

@Injectable({
    providedIn: 'root'
})

export class EstimateRuleParameterValueBaseLayoutService<T extends IEstimateRuleParameterValueBaseEntity> implements IEstimateRuleParameterValueBaseLayoutServiceInterface<T> {

    public commonLayout(): ILayoutConfiguration<IEstimateRuleParameterValueBaseEntity> {
        return {
            'groups': [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'estimate.interfaces.estimateRuleParameter',
                        'text': 'Basic Data'
                    },
                    'attributes': [
                        'ValueDetail',
                        'ValueType',
                        'IsDefault',
                        'DescriptionInfo',
                        'ParameterCode',
                        'Sorting',
                        'Value'
                    ]
                }
            ],
            'labels': {
                ...prefixAllTranslationKeys('estimate.main.', {
                    'ParameterCode': {
                        'key': 'ParameterCode',
                        'text': 'Parameter Code'
                    },
                    'ValueDetail': {
                        'key': 'valueDetail',
                        'text': 'Default Value Detail'
                    },'Value': {
                        'key': 'Value',
                        'text': 'Value'
                    },'ValueType': {
                        'key': 'detailParameterValueType',
                        'text': 'Type'
                    },'IsDefault': {
                        'key': 'detailParameterIsLookup',
                        'text': 'Is Lookup'
                    }
                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    'DescriptionInfo': {
                        'key': 'entityDescription',
                        'text': 'Description',
                    },'Sorting': {
                        'key': 'entitySorting',
                        'text': 'Sorting'
                    }
                }),

            }
        };
    }

    public async generateLayout(): Promise<ILayoutConfiguration<T>> {
        return this.commonLayout() as ILayoutConfiguration<T>;
    }
}