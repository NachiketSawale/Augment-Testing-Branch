/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, ILookupFieldOverload } from '@libs/ui/common';
import { BasicsSharedAddressDialogComponent, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedTelephoneDialogComponent, createFormDialogLookupProvider } from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, ISubsidiaryEntity } from '@libs/businesspartner/interfaces';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * Subsidiary layout service
 */
@Injectable({
    providedIn: 'root',
})
export class SubsidiaryLayoutService {
    private readonly lazyInjector = inject(PlatformLazyInjectorService);
    /**
     * Generate layout config
     */
    public async generateLayout(): Promise<ILayoutConfiguration<ISubsidiaryEntity>> {
        const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
        return {
            groups: [
                {gid: 'default-group', attributes: ['IsMainAddress', 'Description', 'SubsidiaryStatusFk', 'BedirektNo', 'TaxNo', 'VatNo', 'TradeRegister', 'TradeRegisterNo', 'TradeRegisterDate', 'Innno', 'Remark']},
                {gid: 'addresses', attributes: ['AddressTypeFk', 'AddressDto', 'TelephoneNumber1Dto', 'TelephoneNumber2Dto', 'TelephoneNumberTelefaxDto', 'TelephoneNumberMobileDto', 'Email']},
                {gid: 'userDefined', attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']}],
            overloads: {
                BedirektNo: {label: {text: 'Bedirekt No.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.beDirectNo'}, visible: true},
                TaxNo: {label: {text: 'Tax No.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.taxNo'}, visible: true},
                VatNo: {label: {text: 'Vat No.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.vatNo'}, visible: true},
                TradeRegister: {label: {text: 'Trade Register', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.tradeRegister'}, visible: true},
                TradeRegisterNo: {label: {text: 'Trade Register No.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.tradeRegisterNo'}, visible: true},
                TradeRegisterDate: {label: {text: 'Trade Register Date', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.tradeRegisterDate'}, visible: true},
                Innno: {label: {text: 'INN No.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.InnNo'}, visible: true},
                Remark: {label: {text: 'Remark', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityRemark'}, visible: true},
                AddressTypeFk : BasicsSharedCustomizeLookupOverloadProvider.provideAddressTypeLookupOverload(false),
                AddressDto: {
                    label: {text: 'Street', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityAddress'}, visible: true, type: FieldType.CustomComponent,
                    componentType: BasicsSharedAddressDialogComponent,
                    providers: createFormDialogLookupProvider({
                        showSearchButton: true,
                        showPopupButton: true
                    }),
                },
                TelephoneNumber1Dto: {
                    label: {text: 'Telephone', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber'}, visible: true,
                    type: FieldType.CustomComponent,
                    componentType: BasicsSharedTelephoneDialogComponent,
                    providers: createFormDialogLookupProvider({
                        showSearchButton: true,
                        showPopupButton: true
                    }),
                },
                TelephoneNumber2Dto: {
                    label: {text: 'Other Tel.', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber2'}, visible: true,
                    type: FieldType.CustomComponent,
                    componentType: BasicsSharedTelephoneDialogComponent,
                    providers: createFormDialogLookupProvider({
                        showSearchButton: true,
                        showPopupButton: true
                    }),
                },
                TelephoneNumberTelefaxDto: {
                    label: {text: 'Telefax', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneFax'}, visible: true,
                    type: FieldType.CustomComponent,
                    componentType: BasicsSharedTelephoneDialogComponent,
                    providers: createFormDialogLookupProvider({
                        showSearchButton: true,
                        showPopupButton: true
                    }),
                },
                TelephoneNumberMobileDto: {
                    label: {text: 'Mobile', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.mobileNumber'}, visible: true,
                    type: FieldType.CustomComponent,
                    componentType: BasicsSharedTelephoneDialogComponent,
                    providers: createFormDialogLookupProvider({
                        showSearchButton: true,
                        showPopupButton: true
                    }),
                },
                Email: {
                    label: {text: 'E-mail', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.email'}, visible: true
                },
                UserDefined1: {label: {text: 'User Defined 1', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityUserDefined', params: {'p_0': '1'}}, visible: true},
                UserDefined2: {label: {text: 'User Defined 2', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityUserDefined', params: {'p_0': '2'}}, visible: true},
                UserDefined3: {label: {text: 'User Defined 3', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityUserDefined', params: {'p_0': '3'}}, visible: true},
                UserDefined4: {label: {text: 'User Defined 4', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityUserDefined', params: {'p_0': '4'}}, visible: true},
                UserDefined5: {label: {text: 'User Defined 5', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityUserDefined', params: {'p_0': '5'}}, visible: true},
                Description: {label: {text: 'Description', key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityDescription'}, visible: true},
                IsMainAddress: {label: {text: 'Is Main Address', key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.isMainAddress'}, visible: true},
                SubsidiaryStatusFk: {
                    label: {
                        text: 'Subsidiary Status',
                        key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.subsidiaryStatus'
                    },
                    visible: true,
                    readonly: true,
                    type: FieldType.Lookup,
                    lookupOptions: (bpRelatedLookupProvider.getSubsidiaryStatusLookupOverload() as ILookupFieldOverload<ISubsidiaryEntity>).lookupOptions, 
                },
            },
            labels: {
                ...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
                    AddressTypeFk: { key: 'addressType' },
                })
            }
        };
    }
}
