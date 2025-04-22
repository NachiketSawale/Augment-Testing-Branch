/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedCustomizeLookupOverloadProvider,BasicsSharedLookupOverloadProvider, } from '@libs/basics/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IGuarantorEntity } from '@libs/businesspartner/interfaces';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Guarantor layout service
 */
@Injectable({
    providedIn: 'root',
})
export class GuarantorLayoutService {
    
    private readonly lazyInjector = inject(PlatformLazyInjectorService);
    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<IGuarantorEntity>> {
        const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
        return {
            groups: [
                {
                    gid: 'basicData',
                    attributes: ['CompanyFk', 'GuarantorTypeFk', 'CreditLine', 'GuaranteeFee', 'GuaranteeFeeMinimum', 'GuaranteePercent', 'AmountMaximum', 'AmountMaximumText', 'CommentText', 'RhythmFk', 'GuaranteeTypeFk', 'GuaranteeStartDate', 'GuaranteeEndDate', 'GuarantorActive', 'AmountRemaining', 'AmountCalledOff', 'GuaranteeType1', 'GuaranteeType2', 'GuaranteeType3', 'GuaranteeType4', 'GuaranteeType5', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'BpdIssuerbusinesspartnerFk', 'Issuer', 'RequiredDate', 'ExpirationDate', 'DischargedDate', 'ValidatedDate', 'Date', 'Validfrom', 'Validto', 'CurrencyFk']
                },
            ],
            overloads: {
                CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false),
                GuarantorTypeFk: BasicsSharedLookupOverloadProvider.provideGuarantorTypeLookupOverload(false),
                RhythmFk: BasicsSharedCustomizeLookupOverloadProvider.provideRythmLookupOverload(false),
                GuaranteeTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideCertificateTypeLookupOverload(false),
                BpdIssuerbusinesspartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload(),
                CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyTypeLookupOverload(false),
            },            
            labels: {
                ...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
                    BpdIssuerbusinesspartnerFk: {key: 'entityBpdIssuerbusinesspartnerFk'},
                    GuarantorTypeFk: {key: 'entityGuarantorType'},
                    RhythmFk: {key: 'entityRhythm'},
                    GuaranteeTypeFk: {key: 'entityGuaranteeTypeFk'},
                    CurrencyFk: {key: 'currency'},
                    Issuer: {key: 'entityIssuer'},
                    RequiredDate: {key: 'entityRequiredDate'},
                    ExpirationDate: {key: 'entityExpirationDate'},
                    DischargedDate: {key: 'entityDischargedDate'},
                    ValidatedDate: {key: 'entityValidatedDate'},
                    Date: {key: 'entityDate'},
                    Validfrom: {key: 'entityValidfrom'},
                    Validto: {key: 'entityValidto'},

                    GuaranteeStartDate: {key: 'entityGuaranteeStartDate'},
                    GuaranteeEndDate: {key: 'entityGuaranteeEndDate'},
                    GuarantorActive: {key: 'entityGuarantorActive'},
                    AmountRemaining: {key: 'entityAmountRemaining'},
                    AmountCalledOff: {key: 'entityAmountCalledOff'},

                    CreditLine: {key: 'entityCreditLine'},
                    GuaranteeFee: {key: 'entityGuaranteeFee'},
                    GuaranteeFeeMinimum: {key: 'entityGuaranteeFeeMinimum'},
                    GuaranteePercent: {key: 'entityGuaranteePercent'},
                    AmountMaximum: {key: 'entityAmountMaximum'},
                    AmountMaximumText: {key: 'entityAmountMaximumText'},
                    GuaranteeType1: {key: 'entityGuaranteeType', params: {'p_0': '1'}},
                    GuaranteeType2: {key: 'entityGuaranteeType', params: {'p_0': '2'}},
                    GuaranteeType3: {key: 'entityGuaranteeType', params: {'p_0': '3'}},
                    GuaranteeType4: {key: 'entityGuaranteeType', params: {'p_0': '4'}},
                    GuaranteeType5: {key: 'entityGuaranteeType', params: {'p_0': '5'}},
                }),
                ...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {

                    CompanyFk: {key: 'entityCompany'},
                    UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
                    UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
                    UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
                    UserDefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
                    UserDefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
                    CommentText: {key: 'entityCommentText'},
                })
            }
        };
    }
}
