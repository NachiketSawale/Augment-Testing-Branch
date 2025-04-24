/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import {
	BasicsCompanyLookupService,
	BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider,
	BasicsSharedProcurementConfigurationLookupService, BasicsSharedVATGroupLookupService
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import {createLookup, FieldType, ILayoutConfiguration} from '@libs/ui/common';
import { SalesContractCustomizeLookupOverloadProvider} from '@libs/sales/contract';
import {BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService} from '@libs/businesspartner/shared';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';


@Injectable({
	providedIn: 'root',
})

export class SalesWipRelatedContractLayoutService {
	public generateLayout(): ILayoutConfiguration<IOrdHeaderEntity> {
		return {
			groups: [
				{gid: 'Basic Data', attributes: ['Code','RubricCategoryFk','ConfigurationFk', 'CompanyResponsibleFk', 'OrdStatusFk', 'ProjectFk',
						'LanguageFk','BusinesspartnerFk', 'CustomerFk', 'TaxCodeFk', 'IsFramework', 'IsFreeItemsAllowed','ClerkFk', 'CurrencyFk', 'DateEffective',
						'PaymentTermFiFk', 'PaymentTermPaFk', 'PaymentTermAdFk', 'VatGroupFk']},
			],
			overloads: {
				Code: {label: {text: 'Code', key: 'Code'}, visible: true},
				ProjectFk: {label: {text: 'Project', key: 'Project'}, visible: true},
				IsFramework: {label: {text: 'IsFramework', key: 'IsFramework'},readonly: true},
				IsFreeItemsAllowed: {label: {text: 'IsFreeItemsAllowed', key: 'IsFreeItemsAllowed'},readonly: true},
				ConfigurationFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					}),
				},
				CompanyResponsibleFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName',
					}),
				},
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricLookupOverload(false),
				OrdStatusFk: SalesContractCustomizeLookupOverloadProvider.provideOrdStatusLookupOverload(false, true),
				LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				BusinesspartnerFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinessPartnerLookupService,
						displayMember: 'BusinessPartnerName1',
						showClearButton: true
					})
				},
				CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
				SubsidiaryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService
					})
				},
				TaxCodeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxGroupLookupOverload(true),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				VatGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({dataServiceToken: BasicsSharedVATGroupLookupService})
				},
			},
			labels: {
				...prefixAllTranslationKeys('sales.contract.', {
					OrdStatusFk: {key: 'entityOrdStatus'},
					LanguageFk: {key: 'entityLanguage'},
					BankFk: {key: 'entityBank'},
					BusinesspartnerFk: {key: 'entityBusinessPartner'},
					CustomerFk: {key: 'entityCustomer'},
					TaxCodeFk: {key: 'entityTaxCode'},
					RubricCategoryFk: {key: 'entityRubricCategory'}
				}),
			},
		};
	}
}