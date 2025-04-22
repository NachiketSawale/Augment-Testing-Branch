/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, ILayoutConfiguration, ILookupFieldOverload } from '@libs/ui/common';
import {
	BasicsSharedAddressDialogComponent,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider, BasicsSharedTelephoneDialogComponent, createFormDialogLookupProvider,
} from '@libs/basics/shared';
import { MODULE_INFO_BUSINESSPARTNER } from '@libs/businesspartner/common';
import { LazyInjectable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN, BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN, IBusinessPartnerEntity } from '@libs/businesspartner/interfaces';
import { BusinesspartnerMainLegalFormLookupFilterService } from '../filters/legal-form-lookup-filter.service';
import {
	BusinesspartnerMainRubricCategoryLookupFilterService
} from '../../services/filters/rubric-category-lookup-filter.service';
import { BusinesspartnerMainMatchCodeTextComponent } from '../../components/match-code-text/match-code-text.component';

@LazyInjectable({
	token: BUSINESS_PARTNER_LAYOUT_SERVICE_TOKEN,
	useAngularInjection: true
})
/**
 * Businesspartner layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BusinesspartnerLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);	

	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IBusinessPartnerEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'default-group',
					attributes: ['Id', 'BusinessPartnerName1', 'BusinessPartnerName2', 'ClerkFk', 'ClerkDescriptionFk', 'IsLive', 'Code',
						'BusinessPartnerStatusFk', 'MatchCode', 'TitleFk', 'BusinessPartnerStatus2Fk', 'BusinessPartnerName3',
						'BusinessPartnerName4', 'TradeName', 'CompanyFk', 'CompanyNameFk', 'CustomerAbcFk', 'CustomerSectorFk', 'CustomerStatusFk',
						'CustomerGroupFk', 'Avaid', 'CreditstandingFk', 'HasFrameworkAgreement', 'RemarkMarketing', 'Remark1',
						'Remark2', 'PrcIncotermFk', 'PrcIncotermDescFk', 'RubricCategoryFk', 'IsFrameWork', 'ActiveFrameworkContract']
				},
				{
					gid: 'communication',
					attributes: ['Internet', 'Email', 'SubsidiaryDescriptor.AddressDto', 'SubsidiaryDescriptor.AddressDto.Street',
						'SubsidiaryDescriptor.AddressDto.City', 'SubsidiaryDescriptor.AddressDto.ZipCode', 'SubsidiaryDescriptor.AddressDto.CountryISO2', 'SubsidiaryDescriptor.AddressDto.CountryDescription',
						'SubsidiaryDescriptor.TelephoneNumber1Dto', 'SubsidiaryDescriptor.TelephoneNumber2Dto', 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto', 'SubsidiaryDescriptor.TelephoneNumberMobileDto',
						'LanguageFk', 'CommunicationChannelFk']
				},
				{
					gid: 'externalIdentities',
					attributes: ['CrefoNo', 'BedirektNo', 'DunsNo', 'VatNo', 'TaxNo', 'TaxOfficeCode', 'VatNoEu', 'VatCountryFk', 'BiIdnr']
				},
				{
					gid: 'other',
					attributes: ['TradeRegisterNo', 'TradeRegister', 'CustomerBranchFk', 'CustomerBranchDescFk', 'TradeRegisterDate', 'CraftCooperative',
						'CraftCooperativeType', 'CraftCooperativeDate', 'IsNationwide', 'LegalFormFk', 'AvgEvaluationA', 'CountEvaluationA',
						'AvgEvaluationB', 'CountEvaluationB', 'AvgEvaluationC', 'CountEvaluationC']
				},
				{
					gid: 'userDefined',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5', 'RefValue1', 'RefValue2']
				}
			],
			overloads: {
				Id: { readonly: true },
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'Description'),
				BusinessPartnerStatusFk: {
					...bpRelatedLookupProvider.getBusinessPartnerStatusLookupOverload(),
					readonly: true,
				},
				BusinessPartnerStatus2Fk: {
					...bpRelatedLookupProvider.getBusinessPartnerStatus2LookupOverload(),
					readonly: true,
				},
				MatchCode: {
					type: FieldType.CustomComponent,
					componentType: BusinesspartnerMainMatchCodeTextComponent
				},
				RubricCategoryFk: BasicsSharedLookupOverloadProvider.providerBasicsRubricCategoryByRubricAndCompanyLookupOverload(true, true, 'cloud.common.entityRubricCategoryDescription', BusinesspartnerMainRubricCategoryLookupFilterService),
				RefValue1: {readonly: true},
				RefValue2: {readonly: true},
				IsLive: {readonly: true},
				TradeName: {maxLength: 60},
				TitleFk: BasicsSharedCustomizeLookupOverloadProvider.provideTitleLookupOverload(true),
				CompanyFk: BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false, 'cloud.common.entityCompanyName'),
				CustomerAbcFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
				CustomerSectorFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerSectorLookupOverload(true),
				CustomerStatusFk: bpRelatedLookupProvider.getCustomerStatusLookupOverload({ showClearButton: true }),
				CustomerGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerGroupLookupOverload(true),
				CustomerBranchFk: bpRelatedLookupProvider.getBusinessPartnerCustomerBranchLookupOverload({ showClearButton: true, additionalFields: [{ displayMember: 'Description' }] }) as ILookupFieldOverload<IBusinessPartnerEntity>,
				CreditstandingFk: {
					type: FieldType.Lookup,
					lookupOptions: (bpRelatedLookupProvider.getBusinessPartnerCreditStandingLookupOverload({showClearButton: true}) as ILookupFieldOverload<IBusinessPartnerEntity>).lookupOptions,
					grouping: undefined // todo chi: how to remove grouping of the column?
				},
				LegalFormFk: bpRelatedLookupProvider.getBusinessPartnerLegalFormLookupOverload({ showClearButton: true, customClientSideFilterToken: BusinesspartnerMainLegalFormLookupFilterService }),
				Internet: {
					// type: FieldType.Url // TODO chi: not available
					// bulkSupport: false // TODO chi: not support
				},
				DunsNo: {
					// todo chi: duns no input is not available
				},
				// todo chi: question: similar with enableCache? or not to provide this value mean to enable cache?
				VatCountryFk: BasicsSharedLookupOverloadProvider.provideCountryLookupOverload(false, false),
				Email: {
					// todo chi: basics-common-email-input is not available
				},
				PrcIncotermFk: BasicsSharedLookupOverloadProvider.providePrcIncotermLookupOverload(true, 'DescriptionInfo.Translated'),
				IsFrameWork: {readonly: true},
				ActiveFrameworkContract: { readonly: true },
				LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
				CommunicationChannelFk: BasicsSharedCustomizeLookupOverloadProvider.provideCommunicationChannelLookupOverload(true),
				AvgEvaluationA: {
					// todo chi: formatter
				},
				AvgEvaluationB: {
					// todo chi: formatter
				},
				AvgEvaluationC: {
					// todo chi: formatter
				}
				// todo chi: additional columns / rows are not available
			},
			labels: {
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.', {
					MatchCode: {key: 'matchCode'},
					BusinessPartnerName1: {key: 'name1'},
					BusinessPartnerName2: {key: 'name2'},
					BusinessPartnerName3: {key: 'name3'},
					BusinessPartnerName4: {key: 'name4'},
					IsLive: {key: 'bpIsLive'},
					TitleFk: {key: 'title'},
					BusinessPartnerStatus2Fk: {key: 'entityStatus2'},
					TradeName: {key: 'tradeName'},
					CustomerGroupFk: {key: 'customerGroup'},
					RefValue1: {key: 'referenceValue1'},
					RefValue2: {key: 'referenceValue2'},
					Internet: {key: 'internet'},
					Email: {key: 'email'},
					CrefoNo: {key: 'creFoNo'},
					BedirektNo: {key: 'beDirectNo'},
					DunsNo: {key: 'dunsNo'},
					VatNo: {key: 'vatNo'},
					TaxNo: {key: 'taxNo'},
					TaxOfficeCode: {key: 'taxOfficeCode'},
					VatNoEu: {key: 'vatNoEu'},
					VatCountryFk: {key: 'vatCountryFk'},
					TradeRegisterNo: {key: 'tradeRegisterNo'},
					TradeRegister: {key: 'tradeRegister'},
					CustomerBranchFk: {key: 'customerBranchCode'},
					TradeRegisterDate: {key: 'tradeRegisterDate'},
					CraftCooperative: {key: 'craftCooperative'},
					CraftCooperativeType: {key: 'craftCooperativeType'},
					CraftCooperativeDate: {key: 'craftCooperativeDate'},
					IsNationwide: {key: 'isNationwide'},
					LegalFormFk: {key: 'legalForm'},
					Avaid: {key: 'Avaid'},
					AvgEvaluationA: {key: 'avgEvaluationA'},
					CountEvaluationA: {key: 'countEvaluationA'},
					AvgEvaluationB: {key: 'avgEvaluationB'},
					CountEvaluationB: {key: 'countEvaluationB'},
					AvgEvaluationC: {key: 'avgEvaluationC'},
					CountEvaluationC: {key: 'countEvaluationC'},
					CreditstandingFk: {key: 'CreditstandingFk'},
					HasFrameworkAgreement: {key: 'HasFrameworkAgreement'},
					RemarkMarketing: {key: 'marketingContainerTitle'},
					Remark1: {key: 'remark1Field'},
					Remark2: {key: 'remark2Field'},
					IsFrameWork: {key: 'isframework'},
					ActiveFrameworkContract: {key: 'activeframeworkcontract'},
					BiIdnr: {key: 'biIdnr'},
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.', {
					Id: {key: 'entityId'},
					BusinessPartnerStatusFk: {key: 'entityState'},
					ClerkFk: {key: 'entityResponsible'},
					RubricCategoryFk: {key: 'RubricCategoryFk'},
					Code: {key: 'code'},
					CompanyFk: {key: 'entityCompany'},
					UserDefined1: {key: 'entityUserDefined', params: {p_0: '1'}},
					UserDefined2: {key: 'entityUserDefined', params: {p_0: '2'}},
					UserDefined3: {key: 'entityUserDefined', params: {p_0: '3'}},
					UserDefined4: {key: 'entityUserDefined', params: {p_0: '4'}},
					UserDefined5: {key: 'entityUserDefined', params: {p_0: '5'}},
					PrcIncotermFk: {key: 'entityIncoterms'},
				}),
				...prefixAllTranslationKeys(MODULE_INFO_BUSINESSPARTNER.basicsCustomizeModuleName + '.', {
					CustomerAbcFk: {key: 'customerabc'},
					CustomerSectorFk: {key: 'customersector'},
					CustomerStatusFk: {key: 'customerstate'},
					LanguageFk: {key: 'language'},
					CommunicationChannelFk: {key: 'communicationchannel'}
				}),
			},
			transientFields: [
				{ // todo chi: how to exclude it from detail, and  displayMenber: 'Description'
					id: 'ClerkDescriptionFk',
					// grid: { // todo chi: it seems, property 'model' is missing make the ui throws error
					// 	type: FieldType.Lookup,
					// 	lookupOptions: createLookup<IBusinessPartnerEntity, IBasicsClerkEntity>({
					// 		dataServiceToken: BasicsSharedClerkLookupService,
					// 		displayMember: 'Description'
					// 	}),
					// 	label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityResponsibleName'},
					// 	readonly: true,
					// }
					model: 'ClerkDescriptionFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: (BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(false) as ILookupFieldOverload<IBusinessPartnerEntity>).lookupOptions, 
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityResponsibleName'},
				},
				{ // todo chi: how to exclude it from detail. and displayMember: 'CompanyName'
					id: 'CompanyNameFk',
					model: 'CompanyNameFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: (BasicsSharedLookupOverloadProvider.provideCompanyLookupOverload(false) as ILookupFieldOverload<IBusinessPartnerEntity>).lookupOptions,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCompanyName'},
				},
				{ // todo chi: how to exclude it from detail
					id: 'CustomerBranchDescFk',
					model: 'CustomerBranchDescFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: (bpRelatedLookupProvider.getBusinessPartnerCustomerBranchLookupOverload({displayMember: 'Description'}) as ILookupFieldOverload<IBusinessPartnerEntity>).lookupOptions,				
					label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.customerBranch'},
				},
				{ // todo chi: how to exclude it from detail
					id: 'PrcIncotermDescFk',
					model: 'PrcIncotermDescFk',
					type: FieldType.Lookup,
					readonly: true,
					lookupOptions: (BasicsSharedLookupOverloadProvider.provideIncotermsLookupOverload(false) as ILookupFieldOverload<IBusinessPartnerEntity>).lookupOptions,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityIncotermCodeDescription'},
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto',
					model: 'SubsidiaryDescriptor.AddressDto',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedAddressDialogComponent,
					providers: createFormDialogLookupProvider({
						foreignKey: 'AddressFk',
						showClearButton: true,
						createOptions: {
							titleField: 'cloud.common.entityDeliveryAddress'
						}
					}),
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityAddress'},
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto.Street',
					model: 'SubsidiaryDescriptor.AddressDto.Street',
					type: FieldType.Description,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityStreet'},
					readonly: true
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto.City',
					model: 'SubsidiaryDescriptor.AddressDto.City',
					type: FieldType.Description,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCity'},
					readonly: true
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto.ZipCode',
					model: 'SubsidiaryDescriptor.AddressDto.ZipCode',
					type: FieldType.Description,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityZipCode'},
					readonly: true
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto.CountryISO2',
					model: 'SubsidiaryDescriptor.AddressDto.CountryISO2',
					type: FieldType.Description,
					label: {key: MODULE_INFO_BUSINESSPARTNER.cloudCommonModuleName + '.entityCountry'},
					readonly: true
				},
				{
					id: 'SubsidiaryDescriptor.AddressDto.CountryDescription',
					model: 'SubsidiaryDescriptor.AddressDto.CountryDescription',
					type: FieldType.Description,
					label: {key: MODULE_INFO_BUSINESSPARTNER.basicsCommonModuleName + '.entityCountryDescription'},
					readonly: true
				},
				{
					id: 'SubsidiaryDescriptor.TelephoneNumber1Dto',
					model: 'SubsidiaryDescriptor.TelephoneNumber1Dto',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						foreignKey: 'TelephoneNumberFk',
						showClearButton: true,
						createOptions: {
							titleField: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber'
						}
					}),
					label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber'},
				},
				{
					id: 'SubsidiaryDescriptor.TelephoneNumber2Dto',
					model: 'SubsidiaryDescriptor.TelephoneNumber2Dto',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						foreignKey: 'TelephoneNumber2Fk',
						showClearButton: true,
						createOptions: {
							titleField: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber2'
						}
					}),
					label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneNumber2'},
				},
				{
					id: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto',
					model: 'SubsidiaryDescriptor.TelephoneNumberTelefaxDto',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						foreignKey: 'TelephoneNumberTelefaxFk',
						showClearButton: true,
						createOptions: {
							titleField: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneFax'
						}
					}),
					label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.telephoneFax'},
				},
				{
					id: 'SubsidiaryDescriptor.TelephoneNumberMobileDto',
					model: 'SubsidiaryDescriptor.TelephoneNumberMobileDto',
					type: FieldType.CustomComponent,
					componentType: BasicsSharedTelephoneDialogComponent,
					providers: createFormDialogLookupProvider({
						foreignKey: 'TelephoneNumberMobileFk',
						showClearButton: true,
						createOptions: {
							titleField: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.mobileNumber'
						}
					}),
					label: {key: MODULE_INFO_BUSINESSPARTNER.businesspartnerMainModuleName + '.mobileNumber'},
				},
			],
		};
	}
}
