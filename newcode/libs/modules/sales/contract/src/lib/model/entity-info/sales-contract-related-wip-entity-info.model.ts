import { EntityInfo } from '@libs/ui/business-base';
import {
	BasicsSharedBillingSchemaLookupService, BasicsSharedCompanyUrlTypeLookupService,
	BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLanguageLookupService,
	BasicsSharedProcurementConfigurationHeaderLookupService,
	BasicsSharedRubricCategoryLookupService, BasicsSharedWorkInProgressStatusLookupService
	//IBasicsSharedCompanyUrlTypeLookupService, IBasicsSharedWorkInProgressStatusLookupService
} from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { IWipHeaderEntity } from '../entities/wip-header-entity.interface';
import { SalesContractRelatedWipBehavior } from '../../behaviors/sales-contract-related-wip-behavior.service';
import { SalesContractRelatedWipDataService } from '../../services/sales-contract-related-wip-data.service';

export const SALES_CONTRACT_RELATED_WIP_ENTITY_INFO: EntityInfo = EntityInfo.create<IWipHeaderEntity> ({
	grid: {
		title: {key: 'sales.contract.relatedWips'},
		behavior: ctx => ctx.injector.get(SalesContractRelatedWipBehavior),
	},
	dataService: ctx => ctx.injector.get(SalesContractRelatedWipDataService),
	dtoSchemeId: {moduleSubModule: 'Sales.Wip', typeName: 'WipHeaderDto'},
	permissionUuid: 'e439572b3a4b4bf68315b02e4cba3d32',
	layoutConfiguration: {
		groups: [
			{ gid: 'Basic Data', attributes: ['RubricCategoryFk','ConfigurationFk','CompanyFk','CompanyResponsibleFk','BillingSchemaFk','ProjectFk','LanguageFk','WipStatusFk','Code','DescriptionInfo','CurrencyFk','ExchangeRate',
					'ClerkFk','IsBilled','IsNotAccrual','AmountNet','AmountNetOc','IsCanceled','ObjUnitFk','ControllingUnitFk','PrcStructureFk','DateEffective','BasSalesTaxMethodFk','FactorDJC',
					'BusinesspartnerFk','CustomerFk','ContactFk','TaxCodeFk','VatGroupFk','PerformedFrom','PerformedTo','Remark','CommentText',
					'UserDefined1','UserDefined2','UserDefined3','UserDefined4','UserDefined5',
					'UserDefinedDate01','UserDefinedDate02','UserDefinedDate03','UserDefinedDate04','UserDefinedDate05']
			},
		],
		overloads: {
			RubricCategoryFk: {
				label: {text: 'Category', key: 'Category'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedRubricCategoryLookupService,
					showClearButton: false,
					showDescription: false,
					descriptionMember: 'Description'
				})
			},
			ConfigurationFk: {
				label: {text: 'Configuration', key: 'Configuration'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationHeaderLookupService,
					showClearButton: false,
					showDescription: false,
					descriptionMember: 'Description'
				})
			},
			CompanyFk: {
				label: {text: 'Profit Center', key: 'Profit Center'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCompanyUrlTypeLookupService, //IBasicsSharedCompanyUrlTypeLookupService,
					showClearButton: false,
					showDescription: false,
					descriptionMember: 'Description'
				})
			},
			BillingSchemaFk: {
				label: {text: 'BillingSchema', key: 'BillingSchema'},
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedBillingSchemaLookupService,
					showClearButton: true,
					showDescription: true,
					descriptionMember: 'Description'
				})
			},
			ProjectFk: {
				label: {text: 'Project', key: 'Project'},
				type: FieldType.Lookup,
				visible: true,
				lookupOptions:  createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showDescription: true,
					descriptionMember: 'ProjectNo',
				})
			},
			//LanguageFk: BasicsSharedCustomizeLookupOverloadProvider.provideLanguageLookupOverload(false),
			LanguageFk: {
				label: {text: 'Language', key: 'Language'},
				type: FieldType.Lookup,
				visible: true,
				lookupOptions:  createLookup({
					dataServiceToken: BasicsSharedLanguageLookupService,
					showDescription: true,
					descriptionMember: 'Language',
				})
			},
			WipStatusFk: {
				label: {text: 'Wip Status', key: 'Wip Status'},
				type: FieldType.Lookup,
				visible: true,
				lookupOptions:  createLookup({
					dataServiceToken: BasicsSharedWorkInProgressStatusLookupService, //IBasicsSharedWorkInProgressStatusLookupService,
					showDescription: true,
					descriptionMember: 'WipStatus',
				})
			},
			Code: { label: { text: 'Code', key: 'Code' }, visible: true },
			DescriptionInfo: { label: { text: 'Description', key: 'Description' }, visible: true },
			CurrencyFk: BasicsSharedCustomizeLookupOverloadProvider.provideCurrencyRateTypeReadonlyLookupOverload(),
			ExchangeRate: { label: { text: 'ExchangeRate', key: 'ExchangeRate' }, visible: true },
			ClerkFk: BasicsSharedCustomizeLookupOverloadProvider.provideClerkRoleLookupOverload(false),
			IsBilled: { label: { text: 'IsBilled', key: 'IsBilled' }, visible: true },
			IsNotAccrual: { label: { text: 'IsNotAccrual', key: 'IsNotAccrual' }, visible: true },
			AmountNet: { label: { text: 'NetAmount', key: 'NetAmount' }, visible: true },
			AmountNetOc: { label: { text: 'AmountNetOc', key: 'AmountNetOc' }, visible: true },
			IsCanceled: { label: { text: 'IsCanceled', key: 'IsCanceled' }, visible: true },
			ObjUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideObjectUnitTypeReadonlyLookupOverload(),
			ControllingUnitFk: BasicsSharedCustomizeLookupOverloadProvider.provideControllingUnitAssignmentReadonlyLookupOverload(),
			PrcStructureFk: BasicsSharedCustomizeLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
			DateEffective: { label: { text: 'DateEffective', key: 'DateEffective' }, visible: true },
			BasSalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxMethodLookupOverload(false),
			FactorDJC: { label: { text: 'FactorDJC', key: 'FactorDJC' }, visible: true },
			BusinesspartnerFk: BasicsSharedCustomizeLookupOverloadProvider.provideRfqBusinessPartnerStatusLookupOverload(false),
			CustomerFk: BasicsSharedCustomizeLookupOverloadProvider.provideCustomerAbcLookupOverload(false),
			ContactFk: BasicsSharedCustomizeLookupOverloadProvider.provideContactRoleLookupOverload(false),
			TaxCodeFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxMethodLookupOverload(false),
			VatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(false),
			PerformedFrom: { label: { text: 'PerformedFrom', key: 'PerformedFrom' }, visible: true },
			PerformedTo: { label: { text: 'PerformedTo', key: 'PerformedTo' }, visible: true },
			Remark: { label: { text: 'Remark', key: 'Remark' }, visible: true },
			CommentText: { label: { text: 'Comment', key: 'Comment' }, visible: true },
			UserDefined1: { label: { text: 'UserDefined1', key: 'UserDefined1' }, visible: true },
			UserDefined2: { label: { text: 'UserDefined2', key: 'UserDefined2' }, visible: true },
			UserDefined3: { label: { text: 'UserDefined3', key: 'UserDefined3' }, visible: true },
			UserDefined4: { label: { text: 'UserDefined4', key: 'UserDefined4' }, visible: true },
			UserDefined5: { label: { text: 'UserDefined5', key: 'UserDefined5' }, visible: true },
			UserDefinedDate01: { label: { text: 'UserDefinedDate01', key: 'UserDefinedDate01' }, visible: true },
			UserDefinedDate02: { label: { text: 'UserDefinedDate02', key: 'UserDefinedDate02' }, visible: true },
			UserDefinedDate03: { label: { text: 'UserDefinedDate03', key: 'UserDefinedDate03' }, visible: true },
			UserDefinedDate04: { label: { text: 'UserDefinedDate04', key: 'UserDefinedDate04' }, visible: true },
			UserDefinedDate05: { label: { text: 'UserDefinedDate05', key: 'UserDefinedDate05' }, visible: true },
		},
		labels: {
			...prefixAllTranslationKeys('sales.contract.', {
				TypeFk: {key: 'entityTypeFk'},
				RubricCategoryFk: {key: 'entityRubricCategoryFk'},
				ProjectFk: {key: 'entityProjectFk'},
				LanguageFk: {key: 'entityLanguageFk'},
				BilStatusFk: {key: 'entityBilStatusFk'},
				BillDate: {key: 'entityBillDate'},
				DatePosted: {key: 'entityDatePosted'},
				BillNo: {key: 'entityBillNo'},
				ConsecutiveBillNo: {key: 'entityConsecutiveBillNo'},
				VoucherTypeFk: {key: 'entityVoucherTypeFk'},
				InvoiceTypeFk: {key: 'entityInvoiceTypeFk'},
				CurrencyFk: {key: 'entityCurrencyFk'},
				ExchangeRate: {key: 'entityExchangeRate'},
				BankTypeFk: {key: 'entityBankTypeFk'},
				BankFk: {key: 'entityBankFk'},
				ClerkFk: {key: 'entityClerkFk'},
				ContractTypeFk: {key: 'entityContractTypeFk'},
				AmountNet: {key: 'entityAmountNet'},
				AmountGross: {key: 'entityAmountGross'},
				AmountNetOc: {key: 'entityAmountNetOc'},
				AmountGrossOc: {key: 'entityAmountGrossOc'},
				IsCanceled: {key: 'entityIsCanceled'},
				CancellationNo: {key: 'entityCancellationNo'},
				CancellationReason: {key: 'entityCancellationReason'},
				BookingText: {key: 'entityBookingText'},
				ObjUnitFk: {key: 'entityObjUnitFk'},
				ControllingUnitFk: {key: 'entityControllingUnitFk'},
				PrcStructureFk: {key: 'entityPrcStructureFk'},
				DateEffective: {key: 'entityDateEffective'},
				BasSalesTaxMethodFk: {key: 'entityBasSalesTaxMethodFk'},
				IsNotAccrual: {key: 'entityIsNotAccrual'},
				BusinesspartnerFk: {key: 'entityBusinesspartnerFk'},
				CustomerFk: {key: 'entityCustomerFk'},
				ContactFk: {key: 'entityContactFk'},
				BusinesspartnerBilltoFk: {key: 'entityBusinesspartnerBilltoFk'},
				CustomerBilltoFk: {key: 'entityCustomerBilltoFk'},
				ContactBilltoFk: {key: 'entityContactBilltoFk'},
				DateDiscount: {key: 'entityDateDiscount'},
				DateNetpayable: {key: 'entityDateNetpayable'},
				PaymentTermFk: {key: 'entityPaymentTermFk'},
				TaxCodeFk: {key: 'entityTaxCodeFk'},
				VatGroupFk: {key: 'entityVatGroupFk'},
				PerformedFrom: {key: 'entityPerformedFrom'},
				PerformedTo: {key: 'entityPerformedTo'},
				PrjChangeFk: {key: 'entityPrjChangeFk'},
				Remark: {key: 'entityRemark'},
				CommentText: {key: 'entityCommentText'},
				UserDefined1: {key: 'entityUserDefined1'},
				UserDefined2: {key: 'entityUserDefined2'},
				UserDefined3: {key: 'entityUserDefined3'},
				UserDefined4: {key: 'entityUserDefined4'},
				UserDefined5: {key: 'entityUserDefined5'},
				UserDefinedDate01: {key: 'entityUserDefinedDate01'},
				UserDefinedDate02: {key: 'entityUserDefinedDate02'},
				UserDefinedDate03: {key: 'entityUserDefinedDate03'},
				UserDefinedDate04: {key: 'entityUserDefinedDate04'},
				UserDefinedDate05: {key: 'entityUserDefinedDate05'},
				CompanyFk: {key: 'entityCompanyFk'},
				CompanyResponsibleFk: {key: 'entityCompanyResponsibleFk'},
				WipStatusFk: {key: 'entityWipStatusFk'}
			}),
		},
	}
});