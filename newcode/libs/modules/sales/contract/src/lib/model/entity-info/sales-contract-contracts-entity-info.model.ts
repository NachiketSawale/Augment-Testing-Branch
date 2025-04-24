/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCompanyLookupService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider, BasicsSharedProcurementConfigurationLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { SalesContractContractsBehavior } from '../../behaviors/sales-contract-contracts-behavior.service';
import { SalesContractContractsDataService } from '../../services/sales-contract-contracts-data.service';
import { SalesContractCustomizeLookupOverloadProvider } from '../../lookup-helper/sales-contract-lookup-overload-provider.class';
import { IOrdHeaderEntity } from '@libs/sales/interfaces';

export const SALES_CONTRACT_CONTRACTS_ENTITY_INFO: EntityInfo = EntityInfo.create<IOrdHeaderEntity>({
	grid: {
		title: {key: 'sales.contract.containerTitleContracts'},
		behavior: ctx => ctx.injector.get(SalesContractContractsBehavior),
	},
	form: {
		title: {key: 'sales.contract.containerTitleContractsForm'},
		containerUuid: 'ac528547872e450584f6e1dd43922c64',
	},
	dataService: ctx => ctx.injector.get(SalesContractContractsDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Contract', typeName: 'OrdHeaderDto'},
	permissionUuid: '34d0a7ece4f34f2091f7ba6c622ff04d',
	layoutConfiguration: {
		groups: [
			{gid: 'Basic Data', attributes: ['Code', 'TypeFk', 'ConfigurationFk', 'RubricCategoryFk', 'OrdStatusFk', 'CompanyResponsibleFk', 'ProjectFk', 'LanguageFk',
					'BankFk', 'CurrencyFk', 'ClerkFk', 'ExchangeRate', 'AmountNet', 'AmountGross', 'AmountNetOc', 'AmountGrossOc', 'OrdConditionFk', 'ProjectnoCustomer',
					'BidHeaderFk', 'OrdHeaderFk', 'EstHeaderFk', 'ObjUnitFk', 'ControllingUnitFk', 'PrcStructureFk', 'DateEffective', 'BasSalesTaxMethodFk', 'IsNotAccrualPrr',
					'IsCanceled','IsFramework', 'FrameworkContractFk', 'IsFreeItemsAllowed', 'BoqWicCatFk', 'BoqWicCatBoqFk']},

			{gid: 'Customer Data', attributes: ['BusinesspartnerFk', 'CustomerFk', 'SubsidiaryFk', 'ContactFk', 'IsDiverseDebitorsAllowed', 'BusinesspartnerBilltoFk',
					'SubsidiaryBilltoFk', 'CustomerBilltoFk', 'ContactBilltoFk']},

			{gid: 'Payment Data', attributes: ['PaymentTermFiFk', 'PaymentTermPaFk', 'PaymentTermAdFk', 'TaxCodeFk']},

			{gid: 'Dates', attributes: ['OrderDate', 'PlannedStart', 'PlannedEnd']},

			{gid: 'General Settings for WIPs', attributes: ['WipTypeFk' ,'RevisionApplicable', 'WipFirst', 'WipDuration', 'IsDays', 'WipCurrent', 'WipFrom',
					'WipUntil', 'IsWarrenty', 'WarrantyAmount', 'OrdWarrentyTypeFk']},

			{gid: 'Delivery Requirements', attributes: ['PrcIncotermFk', 'AddressFk']},

			{gid: 'Other', attributes: ['PrjChangeFk', 'Remark', 'CommentText']},

			{gid: 'User Defined Text', attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5']},

			{gid: 'User Defined Dates', attributes: ['UserDefinedDate01', 'UserDefinedDate02', 'UserDefinedDate03', 'UserDefinedDate04', 'UserDefinedDate05']},
		],
		overloads: {
			TypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderTypeLookupOverload(false),
			CompanyResponsibleFk: {	readonly: true, type: FieldType.Lookup, lookupOptions: createLookup({
					dataServiceToken: BasicsCompanyLookupService,
					showDescription: true,
					descriptionMember: 'CompanyName',
				}),
			},
			ConfigurationFk: { readonly: true, type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
				}),
			},
			ProjectFk: ProjectSharedLookupOverloadProvider.provideProjectLookupOverload(true),
			CurrencyFk: BasicsSharedCustomizeLookupOverloadProvider.provideCurrencyRateTypeLookupOverload(true),
			OrdConditionFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderConditionLookupOverload(true),
			ClerkFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true),
			ObjUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideObjectUnitTypeReadonlyLookupOverload(),
			ControllingUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideControllingUnitAssignmentLookupOverload(true),
			PrcStructureFk:BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
			BasSalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesAdvanceTypeLookupOverload(true),
			BoqWicCatFk: BasicsSharedCustomizeLookupOverloadProvider.provideBoqCatalogLookupOverload(true),
			EstHeaderFk: {label: {text: 'Estimate', key: 'Estimate'}, visible: true},
			BidHeaderFk: {label: {text: 'Bid', key: 'Bid'}, visible: true},
			Code: {label: {text: 'Code', key: 'Code'}, visible: true},
			CommentText: {label: {text: 'CommentText', key: 'CommentText'}, visible: true},
			IsFramework: {readonly: true},
			IsFreeItemsAllowed: {readonly: true},
			RubricCategoryFk: BasicsSharedCustomizeLookupOverloadProvider.provideRubricLookupOverload(false),
			OrdStatusFk: SalesContractCustomizeLookupOverloadProvider.provideOrdStatusLookupOverload(false, true),
			LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(true),
			BankFk: BasicsSharedCustomizeLookupOverloadProvider.provideBankTypeLookupOverload(true),
			BusinesspartnerFk: BasicsSharedCustomizeLookupOverloadProvider.provideBusinessUnitLookupOverload(false),
			SubsidiaryFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerBranchLookupOverload(true),
			CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
			ContactFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactAbcLookupOverload(true),
			BusinesspartnerBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideBusinessUnitLookupOverload(false),
			SubsidiaryBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerBranchLookupOverload(true),
			CustomerBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(true),
			ContactBilltoFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactAbcLookupOverload(true),
			TaxCodeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxGroupLookupOverload(true),
			WipTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideWorkInProgressTypeLookupOverload(true),
			OrdWarrentyTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideOrderWarrentyTypeLookupOverload(true),
			PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
			PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
			PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermListLookupOverload(true),
			PrcIncotermFk: BasicsSharedCustomizeLookupOverloadProvider.provideIncoTermLookupOverload(true),
			AddressFk: BasicsSharedCustomizeLookupOverloadProvider.provideAddressFormatLookupOverload(true)
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				TypeFk: {key: 'entityTypeFk'},
				CompanyResponsibleFk: {key: 'entityCompanyFk'},
				ProjectFk: {key: 'entityProjectFk'},
				CurrencyFk: {key: 'entityCurrencyFk'},
				ExchangeRate: {key: 'entityExchangeRate' },
				ClerkFk: {key: 'entityClerkFk'},
				ConfigurationFk: {key: 'entityConfigurationFk'},
				AmountNet: {key: 'entityAmountNet'},
				AmountGross: {key: 'entityAmountGross'},
				AmountNetOc: {key: 'entityAmountNetOc'},
				AmountGrossOc: {key: 'entityAmountGrossOc'},
				OrdStatusFk: {key: 'entityOrdStatus'},
				LanguageFk: {key: 'entityLanguage'},
				BankFk: {key: 'entityBank'},
				CustomerFk: {key: 'entityCustomer'},
				TaxCodeFk: {key: 'entityTaxCode'},
				RubricCategoryFk: {key: 'entityRubricCategory'},
				ContactFk: {key: 'entityContactFk'},
				IsDiverseDebitorsAllowed: {key: 'entityIsDiverseDebitorsAllowed'},
				BusinesspartnerBilltoFk: {key: 'entityBusinesspartnerBilltoFk'},
				SubsidiaryBilltoFk: {key: 'entitySubsidiaryBilltoFk'},
				CustomerBilltoFk: {key: 'entityCustomerBilltoFk'},
				ContactBilltoFk: {key: 'entityContactBilltoFk'},
				WipTypeFk: {key: 'entityWipTypeFk'},
				RevisionApplicable: {key: 'entityRevisionApplicable'},
				WipFirst: {key: 'entityWipFirst'},
				WipDuration: {key: 'entityWipDuration'},
				IsDays: {key: 'entityIsDays'},
				WipCurrent: {key: 'entityWipCurrent'},
				WipFrom: {key: 'entityWipFrom'},
				WipUntil: {key: 'entityWipUntil'},
				IsWarrenty: {key: 'entityIsWarrenty'},
				WarrantyAmount: {key: 'entityWarrantyAmount'},
				OrdWarrentyTypeFk: {key: 'entityOrdWarrentyType'},
				OrdConditionFk: {key: 'entityOrdCondition'},
				ProjectnoCustomer: {key: 'entityProjNoCustomer'},
				OrdHeaderFk: {key: 'entityOrdHeaderFk'},
				ObjUnitFk: {key: 'entityObjUnitFk'},
				ControllingUnitFk: {key: 'entityControllingUnit'},
				PrcStructureFk: {key: 'entityPrcStructureFk'},
				DateEffective: {key: 'entityDateEffective'},
				BasSalesTaxMethodFk: {key: 'entityBasSalesTaxMethodFk'},
				IsNotAccrualPrr: {key: 'entityIsNotAccrual'},
				IsCanceled: {key: 'entityIsCanceled'},
				FrameworkContractFk: {key: 'entityFrameworkContractFk'},
				IsFreeItemsAllowed: {key: 'entityIsNewItems'},
				BoqWicCatFk: {key: 'entityBoqWicCatFk'},
				BoqWicCatBoqFk: {key: 'entityBoqWicCatBoqFk'},
				OrderDate: {key: 'entityOrderDate'},
				PlannedStart: {key: 'entityPlannedStart'},
				PlannedEnd: {key: 'entityPlannedEnd'},
				PrjChangeFk: {key: 'entityChangeOrder'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				BusinesspartnerFk: {key: 'entityBusinessPartner'},
				CustomerFk: {key: 'entityCustomer'},
				SubsidiaryFk: {key: 'entitySubsidiary'},
				PaymentTermFiFk: {key: 'entityPaymentTermFI'},
				PaymentTermPaFk: {key: 'entityPaymentTermPA'},
				PaymentTermAdFk: {key: 'entityPaymentTermAD'},
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
				PrcIncotermFk: {key: 'entityIncoterms'},
				AddressFk: {key: 'entityDeliveryAddress'}
			}),
			...prefixAllTranslationKeys('basics.customize.', {
				IsFramework: {key: 'isFramework'}
			})
		},
	}
});