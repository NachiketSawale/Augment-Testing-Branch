/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { SalesCommonLabels } from '../../model/sales-common-labels.class';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ICommonCertificateEntity } from '@libs/sales/interfaces';

/**
 * Sales Common Certificate Layout Service
 */
@Injectable({
	providedIn: 'root',
})
export class SalesCommonCertificateLayoutService{
	/**
	 * Generate layout config
	 */
    public async generateLayout<T extends ICommonCertificateEntity>(): Promise<ILayoutConfiguration<T>> {
        return <ILayoutConfiguration<T>>{
            groups: [
                {
                    gid: 'basicData',
                    title: {
                        text: 'Basic Data',
                        key: 'cloud.common.entityProperties'
                    },
                    attributes: [
                        'BpdCertificateTypeFk', 'IsRequired', 'IsMandatory', 'IsRequiredSubSub', 'IsMandatorySubSub', 'RequiredBy', 'RequiredAmount', 'CommentText'
                    ]
                },
                {
                    gid: 'UserDefinedFields',
                    attributes: ['UserDefinedText1', 'UserDefinedText2', 'UserDefinedText3', 'UserDefinedText4', 'UserDefinedText5',
                    'UserDefinedDate1','UserDefinedDate2','UserDefinedDate3','UserDefinedDate4','UserDefinedDate5',
                    'UserDefinedNumber1','UserDefinedNumber2','UserDefinedNumber3','UserDefinedNumber4','UserDefinedNumber5']
                }
            ],
            labels: {
                ...SalesCommonLabels.getSalesCommonLabels(),
                ...prefixAllTranslationKeys('cloud.common.', {
                    BpdCertificateTypeFk: { key: 'entityType', text: 'Type'},
                    IsRequiredSubSub: { key: 'entityIsRequiredSubSub', text: 'Sub-Sub Required'},
                    IsMandatorySubSub: { key: 'entityIsMandatorySubSub', text: 'Sub-Sub Mandatory'},
                    RequiredBy: { key: 'entityRequiredBy', text: 'Required By'},
                    RequiredAmount: { key: 'entityRequiredAmount', text: 'Required Amount'},
                })
            },
            overloads: {
                BpdCertificateTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeLookupOverload(false),
                IsRequired: { readonly:true },
                IsMandatory: { readonly:true },
                IsRequiredSubSub: { readonly:true },
                IsMandatorySubSub: { readonly:true },
                RequiredAmount: { readonly:true },
                UserDefinedText1: { readonly:true },
                UserDefinedText2: { readonly:true },
                UserDefinedText3: { readonly:true },
                UserDefinedText4: { readonly:true },
                UserDefinedText5: { readonly:true },
                UserDefinedDate1: { readonly:true },
                UserDefinedDate2: { readonly:true },
                UserDefinedDate3: { readonly:true },
                UserDefinedDate4: { readonly:true },
                UserDefinedDate5: { readonly:true },
                UserDefinedNumber1: { readonly:true },
                UserDefinedNumber2: { readonly:true },
                UserDefinedNumber3: { readonly:true },
                UserDefinedNumber4: { readonly:true },
                UserDefinedNumber5:{ readonly:true }
            }
        };
    }
}