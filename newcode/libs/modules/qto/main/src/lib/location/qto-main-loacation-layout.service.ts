/*
 * Copyright(c) RIB Software GmbH
 */
import {Injectable} from '@angular/core';
import {prefixAllTranslationKeys} from '@libs/platform/common';
import {ILayoutConfiguration} from '@libs/ui/common';
import {IProjectLocationEntity} from '@libs/project/interfaces';
import {BasicsSharedLookupOverloadProvider} from '@libs/basics/shared';

@Injectable({
    providedIn: 'root',
})
export class QtoMainLoacationLayoutService {
    /*
         * Generate layout configuration
         */
    public async generateConfig(): Promise<ILayoutConfiguration<IProjectLocationEntity>> {
        return {
            groups: [
                {
                    gid: 'baseGroup',
                    title: {
                        text: 'Locations',
                        key: 'qto.main.locations.title',
                    },
                    attributes: ['Code', 'DescriptionInfo', 'Quantity','QuantityPercent', 'Sorting', 'UoMFk'],
                },
            ],
            labels: {
                ...prefixAllTranslationKeys('qto.main.', {
                    Quantity: { key: 'Quantity' },
                    Structure: { key: 'structure' },
                    Sorting: { key: 'sorting' },
                    UoMFk: { key: 'uoMFk' },

                }),
                ...prefixAllTranslationKeys('cloud.common.', {
                    Code: { key: 'entityCode' },
                    DescriptionInfo: { key: 'entityDescription' },
                }),
            },
            overloads: {
                UoMFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),

            },
        };
    }
}
