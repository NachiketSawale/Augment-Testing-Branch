/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstPriceAdjustmentTotalEntity } from '@libs/estimate/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';

/**
 * price adjustment layout service
 */
@Injectable({
    providedIn: 'root'
})
export class EstimatePriceAdjustmentTotalLayoutService {

    /**
     * Generate layout configuration
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IEstPriceAdjustmentTotalEntity>> {
        return {
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        key: 'cloud.common.entityProperties',
                        text: 'Basic Data'
                    },
                    attributes: [
                        'AdjType',
                        'Quantity',
                        'EstimatedPrice',
                        'AdjustmentPrice',
                        'TenderPrice',
                        'DeltaA',
                        'DeltaB'
                    ]
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('estimate.main.priceAdjust.',{
                    AdjType: {
                        key: 'AdjType',
                        text: 'Type'
                    },
                    EstimatedPrice: {
                        key: 'EstimatedPrice',
                        text: 'Estimated Price'
                    },
                    AdjustmentPrice: {
                        key: 'AdjustmentPrice',
                        text: 'Adjustment Price'
                    },
                    TenderPrice: {
                        key: 'TenderPrice',
                        text: 'Tender Price'
                    },
                    DeltaA: {
                        key: 'DeltaA',
                        text: 'Delta A'
                    },
                    DeltaB: {
                        key: 'DeltaB',
                        text: 'Delta B'
                    }
                }),
                ...prefixAllTranslationKeys('cloud.common', {
                    Quantity: {
                        key: 'entityQuantity',
                        text: 'Quantity'
                    }
                })
            },
            overloads: {
                AdjType: {
                    readonly: true
                },
                EstimatedPrice: {
                    readonly: true
                }
            }
        };
    }
}