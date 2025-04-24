/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { IInitializationContext, LazyInjectable, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedClerkLookupService,
	BasicsSharedCountryLookupService,
	BasicsSharedLookupOverloadProvider,
} from '@libs/basics/shared';
import { BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN } from '@libs/basics/interfaces';
import { IProjectEntity, IProjectMainLayoutService, PROJECT_MAIN_LAYOUT_SERVICE_TOKEN } from '@libs/project/interfaces';
@LazyInjectable({
	token: PROJECT_MAIN_LAYOUT_SERVICE_TOKEN,
	useAngularInjection: true
})
@Injectable({
	providedIn: 'root',
})
export class ProjectMainLayoutService implements IProjectMainLayoutService {

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IProjectEntity>>{
		const basicsCurrencyLookupProvider = await context.lazyInjector.inject(BASICS_CURRENCY_LOOKUP_PROVIDER_TOKEN);
		return{
			// Comment out lookup domain type. Fields can be added back when lookup is ready
			groups: [{
				gid: 'baseGroup',
				attributes: ['StatusFk','TypeFk','ProjectModeFk','ProjectIndex','RubricCategoryFk','ProjectNo',
					'ProjectLongNo','ProjectName','ProjectName2','Matchcode','ProjectDescription','CurrencyFk',
					'ClerkFk','ClerkAddress','ClerkEmail','ClerkMobileNumber','ClerkTelephoneNumber','CompanyResponsibleFk',
					'StartDate','EndDate','ProjectGroupFk','BusinessUnitFk','Remark','DateEffective','PrjCategoryFk',
					'PrjClassificationFk', 'PrjKindFk', /*'QuantityControlFk', 'ProjectOriginFk',*/
				]},{
				gid: 'customerGroup',
				attributes:['BusinessPartnerFk','SubsidiaryFk','CustomerFk','CustomerGroupFk','ContactFk','RealEstateFk',]
			},{
				gid: 'projectAddressGroup',
				attributes:['CountryFk', 'AddressFk', 'RegionFk', 'TelephoneNumberFk', 'TelephoneTelefaxFk',
					'TelephoneMobilFk', 'Email']
			},{
				gid: 'contractGroup',
				attributes:['ContractTypeFk', 'ContractNo', 'PaymentTermPaFk','PaymentTermFiFk', 'BillingSchemaFk','WICFk',
					'CallOffNo', 'CallOffDate','CallOffRemark', 'LanguageContractFk']
			},{
				gid: 'submissionGroup',
				attributes:['PublicationDate','DateReceipt','ClosingLocation','ClosingDatetime','PlannedAwardDate','TenderDate', 'TenderRemark','ValidityPeriod',
					'ValidityDate']
			},{
				gid: 'warrantyGroup',
				attributes:['HandoverDate', 'WarrentyStart', 'WarrentyEnd','WarrentyRemark']
			},{
				gid: 'settingGroup',
				attributes:['IsTemplate','CalendarFk', 'ControllingUnitTemplateFk','ControltemplateFk','AssetMasterFk','PrjContentTypeFk',
					'IsAdministration','IsInterCompany',/*'RubricCategoryControllingUnitFk','RubricCatLocationFk','RubricCategorySalesFk',*/'CatalogConfigTypeFk', 'IsCompletePerformance']
			},{
				gid: 'userDefTextGroup',
				attributes:['Userdefined1', 'Userdefined2', 'Userdefined3','Userdefined4', 'Userdefined5']
			}],
			overloads: {
				CatalogConfigTypeFk: BasicsSharedLookupOverloadProvider.provideProjectCatalogConfigurationTypeLookupOverload(true),
				StatusFk: BasicsSharedLookupOverloadProvider.provideProjectStatusReadonlyLookupOverload(),
				TypeFk: BasicsSharedLookupOverloadProvider.provideProjectTypeReadonlyLookupOverload(),
				ProjectModeFk: BasicsSharedLookupOverloadProvider.provideProjectModeLookupOverload(true),
				RubricCategoryFk: BasicsSharedLookupOverloadProvider.provideRubricCategoryLookupOverload(true),
				CurrencyFk: basicsCurrencyLookupProvider.provideCurrencyLookupOverload({showClearButton:false}),
				//ProjectOriginFk:{},
				//QuantityControlFk:{},
				ClerkFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
						showDescription: true,
						descriptionMember: 'Description',
						serverSideFilter:{
							key: 'basics-clerk-by-company-filter',
							execute() {
								return 'ClerkFk';
							}
						}
					})
				},
				//CompanyResponsibleFk:{},
				ProjectGroupFk:ProjectSharedLookupOverloadProvider.provideProjectGroupReadonlyLookupOverload(),
				BusinessUnitFk: BasicsSharedLookupOverloadProvider.provideBusinessUnitLookupOverload(true),
				//BusinessPartnerFk:{},
				//CustomerFk:{},
				CustomerGroupFk:BasicsSharedLookupOverloadProvider.provideCustomerGroupLookupOverload(true),
				//ContactFk:{},
				RealEstateFk: BasicsSharedLookupOverloadProvider.provideRealestateTypeLookupOverload(true),
				//SubsidiaryFk: {},
				CountryFk:{
					type: FieldType.Lookup,
					lookupOptions:  createLookup( {
						dataServiceToken: BasicsSharedCountryLookupService
					})},
				//AddressFk:{},
				RegionFk: BasicsSharedLookupOverloadProvider.provideProjectRegionLookupOverload(true),
				ContractTypeFk: BasicsSharedLookupOverloadProvider.provideProjectContractTypeLookupOverload(true),
				//PaymentTermPaFk:{},
				//PaymentTermFiFk:{},
				//BillingSchemaFk: {},
				WICFk: BasicsSharedLookupOverloadProvider.provideWICTypeLookupOverload(true),
				LanguageContractFk: BasicsSharedLookupOverloadProvider.provideLanguageLookupOverload(true),
				//CalendarFk: {},
				//ProjectNo: {},
				//ProjectLongNo: {},
				ControllingUnitTemplateFk: BasicsSharedLookupOverloadProvider.providePrjControllingUnitTemplateLookupOverload(true),
				//ControltemplateFk: {},
				//AssetMasterFk: {},
				//TelephoneNumberFk: {},
				//TelephoneTelefaxFk: {},
				//TelephoneMobilFk: {},
				PrjContentTypeFk: BasicsSharedLookupOverloadProvider.provideProjectContentTypeLookupOverload(true),
				//RubricCatLocationFk: {},
				//RubricCategorySalesFk: {},
				//RubricCategoryControllingUnitFk: {},
				PrjCategoryFk: BasicsSharedLookupOverloadProvider.provideProjectCategoryLookupOverload(true),
				PrjClassificationFk: BasicsSharedLookupOverloadProvider.provideProjectClassificationLookupOverload(true),
				PrjKindFk: BasicsSharedLookupOverloadProvider.provideProjectKindLookupOverload(true),
				//Email: {},

				ProjectIndex: {readonly: true},
				IsAdministration: {readonly: true},
				ClerkAddress: {readonly: true},
				ClerkEmail: {readonly: true},
				ClerkMobileNumber: {readonly: true},
				ClerkTelephoneNumber: {readonly: true},
				IsTemplate: {readonly: true},
			},
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					ProjectName: { key: 'entityName' },
					StatusFk: {key: 'entityStatus'},
					TypeFk: { key: 'entityType' },
					ProjectIndex: { key: 'entityIndex' },
					ProjectDescription: { key: 'entityDescription' },
					CurrencyFk: { key: 'entityCurrency' },
					StartDate: { key: 'entityStartDate' },
					EndDate: { key: 'entityEndDate' },
					Remark: { key: 'entityRemark' },
					CountryFk: { key: 'entityCountry' },
					TelephoneNumberFk: { key: 'TelephoneDialogPhoneNumber' },
					TelephoneTelefaxFk: { key: 'fax' },
					TelephoneMobilFk: { key: 'mobile' },
					Email: { key: 'email' },
					CalendarFk: { key: 'entityCalCalendarFk' },
				}),
				...prefixAllTranslationKeys('project.main.', {
					ProjectNo: { key: 'projectNo' },
					ProjectName2: { key: 'name2' },
					RubricCategoryFk: { key: 'entityRubric' },
					ProjectLongNo: { key: 'projectLongNo' },
					Matchcode: { key: 'entityMatchCode' },
					ProjectGroupFk: { key: 'entityProjectGroup' },
					BusinessUnitFk: { key: 'entityBusinessUnit' },
					PrjCategoryFk: { key: 'prjCategory' },
					PrjClassificationFk: { key: 'prjClassification' },
					PrjKindFk: { key: 'prjKind' },
					ProjectOriginFk: { key: 'originalProject' },
					BusinessPartnerFk: { key: 'entityBusinessPartner' },
					CustomerFk: { key: 'entityCustomer' },
					CustomerGroupFk: { key: 'entityCustomerGroup' },
					ContactFk: { key: 'entityContact' },
					RealEstateFk: { key: 'entityRealEstate' },
					RegionFk: { key: 'entityRegion' },
					ContractTypeFk: { key: 'entityContractTypeFk' },
					ContractNo: { key: 'entityContractNo' },
					PaymentTermPaFk: { key: 'entityPaymentTermPa' },
					PaymentTermFiFk: { key: 'entityPaymentTermFi' },
					BillingSchemaFk: { key: 'entityBillingSchema' },
					WICFk: { key: 'entityWIC' },
					CallOffNo: { key: 'entityCallOffNo' },
					CallOffDate: { key: 'entityCallOffDate' },
					CallOffRemark: { key: 'entityCallOffRemark' },
					PublicationDate: { key: 'entityPublicationDate' },
					ClosingDatetime: { key: 'entityClosingDate' },
					ClosingLocation: { key: 'entityClosingLocation' },
					PlannedAwardDate: { key: 'entityPlannedAward' },
					TenderDate: { key: 'entityTenderDate' },
					TenderRemark: { key: 'entityTenderRemark' },
					ValidityDate: { key: 'entityValidityDate' },
					ValidityPeriod: { key: 'entityValidityPeriod' },
					HandoverDate: { key: 'entityHandoverDate' },
					WarrentyStart: { key: 'entityWarStartDate' },
					WarrentyEnd: { key: 'entityWarEndDate' },
					IsTemplate: { key: 'isTemplate' },
					ControllingUnitTemplateFk: { key: 'controllingUnitTemplate' },
					ControltemplateFk: { key: 'controllingTemplate' },
					PrjContentTypeFk: { key: 'prjContentTypeFk' },
					IsAdministration: { key: 'isAdministration' },
					RubricCatLocationFk: { key: 'entityRubricLocation' },
					RubricCategorySalesFk: { key: 'entityRubricSales' },
					IsCompletePerformance: { key: 'isCompletePerformance' },
					SubsidiaryFk: { key: 'entitySubsidiary' },
					CompanyResponsibleFk: { key: 'entityProfitCenter' },
					DateReceipt: { key: 'entityTenderReceipt' },
					WarrentyRemark: { key: 'entityWarrentyRemark' },
					IsInterCompany: { key: 'isInterCompany' },
					CatalogConfigTypeFk: { key: 'costGroupConfiguration' },
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					ProjectModeFk: { key: 'projectmode' },
					QuantityControlFk: { key: 'projectquantitycontrol' },
					LanguageContractFk: { key: 'language' },
				}),
				...prefixAllTranslationKeys('basics.common.', {
					DateEffective: { key: 'dateEffective' },
					AddressFk: { key: 'entityAddress' },
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					AssetMasterFk: { key: 'mdcAssetMasterFk' },
				})
			}
		};
	}
}