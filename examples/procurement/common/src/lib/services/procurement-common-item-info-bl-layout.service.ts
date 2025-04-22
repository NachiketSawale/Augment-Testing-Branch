/*
 * Copyright(c) RIB Software GmbH
 */
import {inject, Injectable, Injector} from '@angular/core';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {
    BasicsSharedUomLookupService
} from '@libs/basics/shared';
import {IPrcItemInfoBLEntity} from '../model/entities';
/**
 * BaseLine layout service
 */
@Injectable({
    providedIn: 'root',
})
export class ProcurementCommonItemInfoBlLayoutService {
    private readonly injector = inject(Injector);
    public async generateConfig<T extends IPrcItemInfoBLEntity>(): Promise<ILayoutConfiguration<T>> {
            return <ILayoutConfiguration<T>>{
                groups: [
                    {
                        gid: 'basicData',
                        title: {
                            text: 'Basic Data',
                            key: 'cloud.common.entityProperties'
                        },
                        attributes: [
                            'Reference',
                            'Brief',
                            'Quantity',
                            'BasUomFk',
                            'PriceMaterial',
                            'QuantityMaterial'
                        ]
                    }
                ],
                labels: {
                    ...prefixAllTranslationKeys('procurement.common.', {
                        PriceMaterial: {key: 'entityMaterialPrice', text: 'Material Price'},
                        QuantityMaterial: {key: 'entityMaterialQuantity', text: 'Material Quantity'}
                    }),
                    ...prefixAllTranslationKeys('cloud.common.', {
                        Reference: {key: 'entityReference', text: 'Reference'},
                        Brief: {key: 'entityBrief', text: 'Brief'},
                        Quantity: {key: 'entityQuantity', text: 'Quantity'},
                        BasUomFk: {key: 'entityUoM', text: 'Uom'},
                    }),
                },
                overloads: {
                    BasUomFk: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BasicsSharedUomLookupService
                        }),
                        readonly: true
                    },
                    Reference: {readonly: true},
                    Brief: {readonly: true},
                    Quantity: {readonly: true},
                    PriceMaterial: {readonly: true},
                    QuantityMaterial: {readonly: true}
                }
            };
    }
}