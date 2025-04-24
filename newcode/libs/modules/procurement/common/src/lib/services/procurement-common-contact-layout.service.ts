/*
 * Copyright(c) RIB Software GmbH
 */

import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { inject, Injectable, Injector, ProviderToken, runInInjectionContext } from '@angular/core';
import { CompleteIdentification, IEntityIdentification, prefixAllTranslationKeys } from '@libs/platform/common';
import { IPrcContactEntity } from '../model/entities/prc-contact-entity.interface';
import { BusinesspartnerSharedContactLookupService, BusinesspartnerSharedContactRoleLookupService, BusinessPartnerSharedLookupLayoutProvider } from '@libs/businesspartner/shared';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { ProcurementCommonContactDataService } from '../services/procurement-common-contact-data.service';

/**
 * Common procurement Contact layout service
 */
@Injectable({
    providedIn: 'root'
})
export class ProcurementCommonContactLayoutService {
    private readonly injector = inject(Injector);
	private readonly bpSharedLookupLayoutProvider = inject(BusinessPartnerSharedLookupLayoutProvider);

    public async generateLayout<T extends IPrcContactEntity, PT extends IEntityIdentification, PU extends CompleteIdentification<PT>>(config: {
        dataServiceToken: ProviderToken<ProcurementCommonContactDataService<T, PT, PU>>
    }): Promise<ILayoutConfiguration<T>> {

        const dataService = this.injector.get(config.dataServiceToken);
        return runInInjectionContext(this.injector, () => {
            const layout = <ILayoutConfiguration<T>>{
                groups: [
                    {
                        gid: 'baseGroup',
                        attributes: ['BpdContactFk', 'BpdContactRoleFk', 'CommentText', 'ContactRoleTypeFk']
                    }
                ],
                labels: {
                    ...prefixAllTranslationKeys('cloud.common.', {
                        BpdContactFk: {key: 'contactFamilyName'},
                        BpdContactRoleFk: {key: 'contactRole'},
                        CommentText: {key: 'entityComment'}
                    }),
                    ...prefixAllTranslationKeys('procurement.common.', {
                        ContactRoleTypeFk: {key: 'entityContactRoleTypeFk'}
                    })
                },
                overloads: {
                    BpdContactRoleFk: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BusinesspartnerSharedContactRoleLookupService
                        })
                    },
                    BpdContactFk: {
                        type: FieldType.Lookup,
                        lookupOptions: createLookup({
                            dataServiceToken: BusinesspartnerSharedContactLookupService,
                            showClearButton: true,
                            displayMember: 'FamilyName',
                            serverSideFilter: {
                                key: 'prc-req-contact-filter',
                                execute() {
                                    const parentItem = dataService.getSelectedParentEntity();
                                    return {
                                        BusinessPartnerFk: parentItem.BusinessPartnerFk,
                                        BusinessPartner2Fk: parentItem.BusinessPartner2Fk
                                    };
                                }
                            }
                        })
                    },
                    ContactRoleTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactRoleLookupOverload(false)
                },
            };

	        this.bpSharedLookupLayoutProvider.provideContactLookupFields(layout, {
		        gid: 'baseGroup',
		        lookupKeyGetter: e => e.BpdContactFk,
		        dataService: dataService
	        });

				return layout;
        });
    }
}