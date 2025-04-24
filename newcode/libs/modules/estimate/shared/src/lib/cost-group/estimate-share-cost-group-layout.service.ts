/*
 * Copyright(c) RIB Software GmbH
 */

import {FieldType, ILayoutConfiguration} from '@libs/ui/common';
import {BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {Injectable} from '@angular/core';
import { ICostGroupEntity} from '@libs/basics/costgroups';

@Injectable({
    providedIn: 'root'
})
export class EstimateShareCostGroupLayoutService {
    public async generateLayout<T extends ICostGroupEntity>():  Promise<ILayoutConfiguration<T>>{
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    'gid': 'basicData',
                    'title': {
                        'key': 'estimate.main.costGroupContainer',
                        'text': 'estimate.main.costGroupContainer'
                    },
                    'attributes': [
                        'Code',
                        'DescriptionInfo',
                        'Quantity',
                        'UomFk',
                        'ReferenceQuantityCode','LeadQuantityCalc','NoLeadQuantity','IsLive','IsChecked',
                        'Rule',
                        'Parameters'
                    ],

                }
            ],
            overloads: {
                Code:{readonly:true},
                DescriptionInfo:{readonly:true},
                Quantity:{readonly:true},
                UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
                //Rule TODO Wait rule lookup support -- Jun
                //parameters TODO Wait parameters lookup support -- Jun
            },
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    Code: {key: 'entityCode'},
                    DescriptionInfo: {key: 'entityDescription'},
                    Quantity: {key: 'entityQuantity'},
                    UomFk: {key: 'entityUoM'},
                }),
                ...prefixAllTranslationKeys('basics.costgroups.', {
                    ReferenceQuantityCode: {key: 'referenceQuantityCode'},
                    LeadQuantityCalc: {key: 'leadquantitycalc'},
                    NoLeadQuantity: {key: 'noleadquantity'},
                    IsLive: {key: 'islive'}
                }),
                ...prefixAllTranslationKeys('basics.material.', {
                    IsChecked: {
                        key: 'record.filter',
                        text: 'filter',
                    },
                }),
            },
            transientFields: [
                {
                    id: 'IsChecked',
                    readonly: false,
                    model: 'IsChecked',
                    type: FieldType.Radio,
                    pinned: true,
                },
            ],
        };
    }
}