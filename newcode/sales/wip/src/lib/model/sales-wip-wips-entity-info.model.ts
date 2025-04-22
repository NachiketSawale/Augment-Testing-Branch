/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { SalesWipWipsDataService } from '../services/sales-wip-wips-data.service';
import { IWipHeaderEntity } from './entities/wip-header-entity.interface';
import {
	BasicsCompanyLookupService,
	BasicsShareControllingUnitLookupService,
	BasicsSharedCustomizeLookupOverloadProvider,
	BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService, BasicsSharedVATGroupLookupService
} from '@libs/basics/shared';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BusinessPartnerLookupService, BusinesspartnerSharedSubsidiaryLookupService } from '@libs/businesspartner/shared';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ISalesSharedLookupOptions, SALES_SHARED_LOOKUP_PROVIDER_TOKEN } from '@libs/sales/interfaces';


export const SALES_WIP_WIPS_ENTITY_INFO: EntityInfo = EntityInfo.create<IWipHeaderEntity>({
	grid: {
		title: {key: 'sales.wip.containerTitleWips'}
	},
	form: {
		title: {key: 'sales.wip.containerTitleWipsForm'},
		containerUuid: 'd7bfa7174fc14ab49acef0c6f6b6678b',
	},
	dataService: ctx => ctx.injector.get(SalesWipWipsDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'WipHeaderDto'},
	permissionUuid: '689E0886DE554AF89AADD7E7C3B46F25',
	layoutConfiguration: async ctx => {
		const salesSharedLookupProvider = await ctx.lazyInjector.inject(SALES_SHARED_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<IWipHeaderEntity>>{
			groups: [
				{
					gid: 'Basic Data', attributes: ['AmountGross', 'AmountGrossOc', 'AmountNet', 'AmountNetOc', 'ProjectFk', 'ConfigurationFk', 'CompanyResponsibleFk', 'OrdHeaderFk', 'WipStatusFk', 'RubricCategoryFk', 'Code', 'ExchangeRate', 'BasSalesTaxMethodFk', 'BillingSchemaFk',
						'ClerkFk', 'CurrencyFk', 'DateEffective', 'IsBilled', 'IsNotAccrual', 'ControllingUnitFk', 'OrdHeaderFk', 'PrcStructureFk',
						'LanguageFk', 'FactorDJC']
				},
				{gid: 'Customer Data', attributes: ['DocumentDate', 'BusinesspartnerFk', 'CustomerFk', 'SubsidiaryFk']},
				{gid: 'Payment Data', attributes: ['PaymentTermFiFk', 'PaymentTermPaFk', 'PaymentTermAdFk', 'TaxCodeFk', 'VatGroupFk']},
				{gid: 'Dates', attributes: ['PerformedFrom', 'PerformedTo']},
				{gid: 'Other', attributes: ['Remark', 'CommentText']},
				{gid: 'User Defined Text', attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']},
				{gid: 'User Defined Dates', attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']},
			],
			overloads: {
				ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(true),
				ConfigurationFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
					}),
				},
				OrdHeaderFk: salesSharedLookupProvider.provideOrdHeaderLookupOverload(new class implements ISalesSharedLookupOptions {
					public readOnly: boolean = true;
					public showClearBtn: boolean = false;
				}),

				CompanyResponsibleFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName',
					}),
				},
				WipStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideWorkInProgressStatusReadonlyLookupOverload(),
				RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricCategoryReadonlyLookupOverload(),
				BasSalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesAdvanceTypeLookupOverload(true),
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true),
				ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(true),
				LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideUserInterfaceLanguageLookupOverload(true),
				ControllingUnitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService
					})
				},
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				// Customer Data
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
				// payment data
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(true),
				VatGroupFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({dataServiceToken: BasicsSharedVATGroupLookupService})
				},
				// Other Data
				Remark: {type: FieldType.Description},
				CommentText: {type: FieldType.Description},
			},
			labels: {
				...prefixAllTranslationKeys('sales.wip.', {
					WipStatusFk: {key: 'entityWipStatusFk'},
					DateEffective: {key: 'entityDateEffective'},
					IsBilled: {key: 'entityIsBilled'},
					IsNotAccrual: {key: 'entityIsNotAccrual'},
					DocumentDate: {key: 'entityDocumentDate'},
					PerformedFrom: {key: 'performedFrom'},
					PerformedTo: {key: 'performedTo'},
					FactorDJC: {key: 'entityFactorDJC'},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					VatGroupFk: {key: 'entityVatGroup'},
					BasSalesTaxMethodFk: {key: 'entitySalesTaxMethodFk'},
					AmountNet: {key: 'paymentAmountNet'},
					AmountNetOc: {key: 'paymentAmountNetOc'},
					AmountGross: {key: 'paymentAmountGross'},
					AmountGrossOc: {key: 'paymentAmountGrossOc'},
					CompanyResponsibleFk: {key: 'entityCompany'},
				}),
				...prefixAllTranslationKeys('basics.company.', {
					PrcStructureFk: {key: 'entityStructure'}
				}),
				...prefixAllTranslationKeys('productionplanning.common.', {
					OrdHeaderFk: {key: 'ordHeaderFk'}
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					ConfigurationFk: {key: 'entityConfiguration'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					RubricCategoryFk: {key: 'entityBasRubricCategoryFk', text: 'Rubric Category'},
					BusinesspartnerFk: {key: 'entityBusinessPartner'},
					CustomerFk: {key: 'entityCustomer'},
					SubsidiaryFk: {key: 'entitySubsidiary'},
					ProjectFk: {key: 'entityProject'},
					Code: {key: 'entityCode'},
					ExchangeRate: {key: 'entityRate'},
					BillingSchemaFk: {key: 'entityBillingSchema'},
					ClerkFk: {key: 'entityClerk'},
					CurrencyFk: {key: 'entityCurrency'},
					LanguageFk: {key: 'CheckLogonDlg_Language'},
					CompanyResponsibleFk: {key: 'entityCompany'},
					ControllingUnitFk: {key: 'entityControllingUnit'},
					DescriptionInfo: {key: 'descriptionInfo'},
					PaymentTermFiFk: {key: 'entityPaymentTermFI'},
					PaymentTermPaFk: {key: 'entityPaymentTermPA'},
					PaymentTermAdFk: {key: 'entityPaymentTermAD'},
					TaxCodeFk: {key: 'entityTaxCode'},
					Remark: {key: 'DocumentBackup_Remark'},
					CommentText: {key: 'TelephoneDialogCommentText'},
					UserDefined1: {key: 'entityUserDefinedText1'},
					UserDefined2: {key: 'entityUserDefinedText2'},
					UserDefined3: {key: 'entityUserDefinedText3'},
					UserDefined4: {key: 'entityUserDefinedText4'},
					UserDefined5: {key: 'entityUserDefinedText5'},
					UserDefinedDate01: {key: 'entityUserDefinedDate1'},
					UserDefinedDate02: {key: 'entityUserDefinedDate2'},
					UserDefinedDate03: {key: 'entityUserDefinedDate3'},
					UserDefinedDate04: {key: 'entityUserDefinedDate4'},
					UserDefinedDate05: {key: 'entityUserDefinedDate5'},
				})
			},
		};
	}
});