/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { Injectable } from '@angular/core';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcCertificateEntity } from '@libs/procurement/interfaces';
import { BusinesspartnerSharedCertificateTypeLookupService } from '@libs/businesspartner/shared';

/**
 * Common procurement Certificate layout service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementCommonCertificateLayoutService {


    public async generateLayout<T extends IPrcCertificateEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'baseGroup',
                    attributes: ['BpdCertificateTypeFk', 'Isrequired', 'Ismandatory', 'Isrequiredsubsub', 'Ismandatorysubsub',
                        'RequiredBy', 'RequiredAmount', 'CommentText',
                        'GuaranteeCost', 'GuaranteeCostPercent', 'ValidFrom', 'ValidTo']
                }
            ],
            labels: {
                ...prefixAllTranslationKeys('cloud.common.', {
                    BpdCertificateTypeFk: {key: 'entityType'},
                    CommentText: {key: 'entityComment'},
                    ValidFrom: {key: 'entityValidFrom'},
                    ValidTo: {key: 'entityValidTo'}
                }),
                ...prefixAllTranslationKeys('procurement.common.', {
                    Isrequired: {key: 'certificateIsRequired'},
                    Ismandatory: {key: 'certificateIsMandatory'},
                    Isrequiredsubsub: {key: 'certificateIsRequiredSubSub'},
                    Ismandatorysubsub: {key: 'certificateIsMandatorySubSub'},
                    RequiredBy: {key: 'certificateRequiredBy'},
                    RequiredAmount: {key: 'certificateRequiredAmount'},
                    GuaranteeCost: {key: 'guaranteeCost'},
                    GuaranteeCostPercent: {key: 'guaranteeCostPercent'}
                })
            },
            overloads: {
                BpdCertificateTypeFk: {
                    type: FieldType.Lookup,
                    lookupOptions: createLookup({
                        dataServiceToken: BusinesspartnerSharedCertificateTypeLookupService
                    })
                }
            }
        };
    }
}