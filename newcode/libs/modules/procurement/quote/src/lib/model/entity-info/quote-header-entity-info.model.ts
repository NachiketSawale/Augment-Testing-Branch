/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IQuoteHeaderEntity } from '../entities/quote-header-entity.interface';
import { ProcurementQuoteHeaderDataService } from '../../services/quote-header-data.service';
import { ProcurementQuoteHeaderValidationService } from '../../services/validations/quote-header-validation.service';
import { ProcurementQuoteHeaderBehavior } from '../../behaviors/quote-header-behavior.service';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { createLookup, FieldType } from '@libs/ui/common';
import {
	BasicsSharedClerkLookupService,
	BasicsSharedCurrencyLookupService,
	BasicsSharedPaymentTermLookupService,
	BasicsSharedPrcIncotermLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedQuoteStatusLookupService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
	BasicsSharedProjectStatusLookupService,
	BasicsSharedSalesTaxMethodLookupService,
	BasicsSharedVATGroupLookupService,
	BasicsSharedQuotationStatusLookupService,
	BasicsSharedCompanyContextService
} from '@libs/basics/shared';
import { ProjectSharedLookupService } from '@libs/project/shared';
import { BusinessPartnerLookupService, BusinesspartnerSharedEvaluationSchemaLookupService, BusinesspartnerSharedSubsidiaryLookupService, BusinesspartnerSharedSupplierLookupService } from '@libs/businesspartner/shared';
import {
	PrcAwardMethodLookupService,
	PrcContractTypeLookupService,
	ProcurementSharedExchangeRateInputLookupService,
	ProcurementSharedQuoteTypeLookupService,
	ProcurementShareQuoteLookupService,
	ProcurementShareRfqLookupService
} from '@libs/procurement/shared';
import { ProcurementQuoteProjectFilterService } from '../../services/filters/quote-project-filter.service';
import { ProcurementQuoteCurrencyConversionFilterService } from '../../services/filters/quote-currency-conversion-filter.service';
import { ProcurementQuoteSubsidiaryFilterService } from '../../services/filters/quote-subsidiary-filter.service';
import { ProcurementQuoteSupplierFilterService } from '../../services/filters/quote-supplier-filter.service';
import { ProcurementQuoteRfQFilterService } from '../../services/filters/quote-rfq-filter.service';
import { ProcurementQuoteQuoteFilterService } from '../../services/filters/quote-quote-filter.service';
import { ProcurementQuoteBillingSchemaFilterService } from '../../services/filters/quote-billing-schema-filter.service';

export const QUOTE_HEADER_ENTITY_INFO: EntityInfo = EntityInfo.create<IQuoteHeaderEntity>({
	grid: {
		title: {
			key: 'procurement.quote.quoteContainerGridTitle'
		},
		behavior: ctx => ctx.injector.get(ProcurementQuoteHeaderBehavior)
	},
	form: {
		title: {
			key: 'procurement.quote.quoteContainerFormTitle'
		},
		containerUuid: '9f2060ba9a5b4a338263186e77a5ccfb',
	},
	dtoSchemeId: {
		moduleSubModule: 'Procurement.Quote',
		typeName: 'QuoteHeaderDto'
	},
	permissionUuid: '338048ac80f748b3817ed1faea7c8aa5',
	dataService: ctx => ctx.injector.get(ProcurementQuoteHeaderDataService),
	validationService: ctx => ctx.injector.get(ProcurementQuoteHeaderValidationService),
	prepareEntityContainer: async ctx => {
		await Promise.all([
			ctx.injector.get(BasicsSharedCompanyContextService).prepareLoginCompany(),
			ctx.injector.get(BasicsSharedQuotationStatusLookupService).getListAsync()
		]);
	},
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				title: {
					key: 'cloud.common.entityProperties',
					text: 'Basic Data'
				},
				attributes: [
					'Id',
					'TotalLeadTime',
					'EvaluationSchemaFk',
					'ProjectStatusFk',
					'PrcStructureCode',
					'PrcStructureDescription',
					'ExtendedDate',
					'PrcContractTypeFk',
					'PrcAwardMethodFk',
					'StatusFk',
					'ProjectFk',
					'ClerkPrcFk',
					'ClerkReqFk',
					'CurrencyFk',
					'ExchangeRate',
					'PaymentTermFiFk',
					'PaymentTermPaFk',
					'Code',
					'DateQuoted',
					'DateReceived',
					'TypeFk',
					'RfqHeaderFk',
					'QtnHeaderFk',
					'QuoteVersion',
					'DatePricefixing',
					'IsValidated',
					'IsExcluded',
					'IsShortlisted',
					'BillingSchemaFk',
					'PaymentTermAdFk',
					'DateEffective',
					'BpdVatGroupFk',
					'OverallDiscount',
					'OverallDiscountOc',
					'OverallDiscountPercent',
					'DateDelivery',
					'SalesTaxMethodFk',
					'ExternalCode',
					'UserDefinedDate01',
					'PrcConfigurationFk',
					'BillingSchemaFinal',
					'BillingSchemaFinalOC',
					'DateAwardDeadline',
				]
			},
			{
				gid: 'supplierGroup',
				title: {
					key: 'procurement.quote.headerFormGroupSupplier',
					text: 'Bidder'
				},
				attributes: [
					'BusinessPartnerFk',
					'SubsidiaryFk',
					'SupplierFk'
				]
			},
			{
				gid: 'deliveryGroup',
				title: {
					key: 'procurement.quote.headerFormGroupDeliveryRequirements',
					text: 'Delivery Requirements'
				},
				attributes: [
					'IncotermFk',
					'Remark'
				]
			},
			{
				gid: 'packageGroup',
				title: {
					key: 'procurement.rfq.packageGroup',
					text: 'Package Group'
				},
				attributes: [
					'PackageNumber',
					'PackageDescription',
					'AssetMasterCode',
					'AssetMasterDescription',
					'PackageDeliveryAddress',
					'PackageTextInfo'
				]
			},
			{
				gid: 'userDefTextGroup',
				title: {
					key: 'cloud.common.UserdefTexts',
					text: 'User-Defined Texts'
				},
				attributes: [
					'UserDefined1',
					'UserDefined2',
					'UserDefined3',
					'UserDefined4',
					'UserDefined5'
				]
			},
			{
				gid: 'TotalGroup',
				title: {
					key: 'procurement.quote.totalGroup',
					text: 'Total'
				},
				attributes: [
					'ValueNet',
					'ValueNetOc',
					'ValueTax',
					'ValueTaxOc',
					'Gross',
					'GrossOc',
					'ValueNetFinal'
				]
			},
			{
				gid: 'itemGroup',
				title: {
					key: 'procurement.quote.itemsGridTitle',
					text: 'Items'
				},
				attributes: [
					'Co2ProjectTotal',
					'Co2SourceTotal'
				]
			},
			{
				gid: 'SubmissionRequirement',
				title: {
					key: 'procurement.common.submissionRequirement',
					text: 'Submission Requirements'
				},
				attributes: [
					'DeadlineDate',
					'DeadlineTime'
				]
			}
			// TODO-DRIZZLE: Characteristic dynamic columns to be migrate.
		],
		labels: {
			...prefixAllTranslationKeys('procurement.common.', {
				TotalLeadTime: {key: 'totalLeadTime', text: 'Total Lead Time'},
				ProjectStatusFk: {key: 'projectStatus', text: 'Project Status'},
				PackageTextInfo: {key: 'entityPackageTextInfo', text: 'Package Text Info'},
				ValueNet: {key: 'reqTotalValueNet', text: 'Net Value'},
				ValueNetOc: {key: 'reqTotalValueNetOc', text: 'Net Value (OC)'},
				ValueTax: {key: 'reqTotalValueTax', text: 'VAT'},
				ValueTaxOc: {key: 'reqTotalValueTaxOc', text: 'VAT (OC)'},
				Gross: {key: 'reqTotalGross', text: 'Gross'},
				GrossOc: {key: 'reqTotalGrossOC', text: 'Gross (OC)'},
				Co2ProjectTotal: {key: 'entityCo2ProjectTotal', text: 'CO2/kg (Project Total)'},
				Co2SourceTotal: {key: 'entityCo2SourceTotal', text: 'CO2/kg (Source Total)'},
				BpdVatGroupFk: {key: 'entityVatGroup', text: 'Vat Group'},
				OverallDiscount: {key: 'entityOverallDiscount', text: 'Overall Discount'},
				OverallDiscountOc: {key: 'entityOverallDiscountOc', text: 'Overall Discount (OC)'},
				OverallDiscountPercent: {key: 'entityOverallDiscountPercent', text: 'Overall Discount Percent'},
				DateDelivery: {key: 'accountAssign.DateDelivery', text: 'Delivery Date'},
				SalesTaxMethodFk: {key: 'entitySalesTaxMethodFk', text: 'Sales Tax Method'},
				BillingSchemaFinal: {key: 'billingSchemaFinal', text: 'Billing Schema Final'},
				BillingSchemaFinalOC: {key: 'billingSchemaFinalOc', text: 'Billing Schema Final OC'}
			}),
			...prefixAllTranslationKeys('businesspartner.main.', {
				EvaluationSchemaFk: {key: 'entityEvaluationSchemaFk', text: 'Evaluation Schema'}
			}),
			...prefixAllTranslationKeys('procurement.rfq.', {
				PackageNumber: {
					key: 'packageNumber',
					text: 'Package Number'
				},
				AssetMasterCode: {key: 'assetMasterCode', text: 'Asset Master Code'},
				PackageDeliveryAddress: {key: 'packageDeliveryAddress', text: 'Package Delivery Address'},
				ExtendedDate: {key: 'entityExtendedDate', text: 'Extended Date'},
				PrcContractTypeFk: {key: 'headerPrcContractType', text: 'Contract Type'},
				PrcConfigurationFk: {key: 'headerConfiguration', text: 'Configuration'}
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				PackageDescription: {key: 'entityPackageDescription', text: 'Package Description'},
				PrcStructureCode: {key: 'entityStructureCode', text: 'Structure Code'},
				PrcStructureDescription: {key: 'entityStructureDescription', text: 'Structure Description'},
				PrcAwardMethodFk: {key: 'entityAwardMethod', text: 'Award Method'},
				Id: {key: 'entityId', text: 'Id'},
				StatusFk: {key: 'entityState', text: 'Status'},
				ClerkPrcFk: {key: 'entityResponsible', text: 'Responsible'},
				ClerkReqFk: {key: 'entityRequisitionOwner', text: 'Requisition Owner'},
				ExchangeRate: {key: 'entityRate', text: 'Rate'},
				PaymentTermFiFk: {key: 'entityPaymentTermFI', text: 'Payment Term (FI)'},
				PaymentTermPaFk: {key: 'entityPaymentTermPA', text: 'Payment Term (PA)'},
				Code: {key: 'entityReference', text: 'Reference'},
				DateReceived: {key: 'entityReceived', text: 'Date Received'},
				TypeFk: {key: 'entityType', text: 'Type'},
				SubsidiaryFk: {key: 'entitySubsidiary', text: 'Branch'},
				SupplierFk: {key: 'entitySupplierCode', text: 'Supplier No.'},
				IncotermFk: {key: 'entityIncoterms', text: 'Incoterms'},
				Remark: {key: 'entityRemark', text: 'Remarks'},
				UserDefined1: {key: 'entityUserDefText', text: 'Text 1', params: {p_0: 1}},
				UserDefined2: {key: 'entityUserDefText', text: 'Text 2', params: {p_0: 2}},
				UserDefined3: {key: 'entityUserDefText', text: 'Text 3', params: {p_0: 3}},
				UserDefined4: {key: 'entityUserDefText', text: 'Text 4', params: {p_0: 4}},
				UserDefined5: {key: 'entityUserDefText', text: 'Text 5', params: {p_0: 5}},
				BillingSchemaFk: {key: 'entityBillingSchema', text: 'Billing Schema'},
				PaymentTermAdFk: {key: 'entityPaymentTermAD', text: 'Payment Term (AD)'},
				DeadlineDate: { key: 'entityDeadline' },
				DeadlineTime: { key: 'entityTime' },
			}),
			...prefixAllTranslationKeys('procurement.package.', {
				AssetMasterDescription: {key: 'entityAssetMasterDescription', text: 'Asset Master Description'},
				DateAwardDeadline: {key: 'dateAwardDeadline' },
			}),
			...prefixAllTranslationKeys('procurement.quote.', {
				ValueNetFinal: {
					key: 'netFinal',
					text: 'Net Final'
				},
				DateQuoted: {key: 'headerDateQuoted', text: 'Quote'},
				RfqHeaderFk: {key: 'headerRfqHeaderCode', text: 'RfQ Header'},
				QtnHeaderFk: {key: 'headerQuoteHeaderCode', text: 'Basis Quote'},
				QuoteVersion: {key: 'headerVersion', text: 'Version'},
				DatePricefixing: {key: 'headerDataPricefixing', text: 'Date Price Fixing'},
				IsValidated: {key: 'headerValidated', text: 'Validated'},
				IsExcluded: {key: 'headerExcluded', text: 'Excluded'},
				IsShortlisted: {key: 'headerShortlisted', text: 'Shortlisted'},
				ExternalCode: {key: 'headerExternalCode', text: 'External Code'},
				UserDefinedDate01: {key: 'entityUserDefinedDate', text: 'User Defined Date 1', params: {p_0: 1}}
			}),
			...prefixAllTranslationKeys('businesspartner.certificate.', {
				ProjectFk: {key: 'project', text: 'Project No.'},
				CurrencyFk: {key: 'currency', text: 'Currency'},
				BusinessPartnerFk: {key: 'businessPartner', text: 'Business Partner'}
			}),
			...prefixAllTranslationKeys('basics.common.', {
				DateEffective: {key: 'dateEffective', text: 'Date Effective'}
			})
		},
		overloads: {
			Id: {
				readonly: true
			},
			TotalLeadTime: {
				readonly: true
			},
			EvaluationSchemaFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedEvaluationSchemaLookupService
				}),
				readonly: true
			},
			ProjectStatusFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProjectStatusLookupService,
					displayMember: 'DescriptionInfo.Translated'
				}),
				readonly: true
			},
			PackageNumber: {
				readonly: true
			},
			PackageDescription: {
				readonly: true
			},
			AssetMasterCode: {
				readonly: true
			},
			AssetMasterDescription: {
				readonly: true
			},
			PackageDeliveryAddress: {
				readonly: true
			},
			PackageTextInfo: {
				readonly: true
			},
			PrcStructureCode: {
				readonly: true
			},
			PrcStructureDescription: {
				readonly: true
			},
			ExtendedDate: {
				readonly: true
			},
			PrcContractTypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: PrcContractTypeLookupService
				}),
				readonly: true
			},
			PrcAwardMethodFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: PrcAwardMethodLookupService
				}),
				readonly: true
			},
			Co2ProjectTotal: {
				readonly: true
			},
			Co2SourceTotal: {
				readonly: true
			},
			StatusFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedQuoteStatusLookupService
				})
			},
			ProjectFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProjectSharedLookupService,
					showClearButton: true,
					serverSideFilterToken: ProcurementQuoteProjectFilterService
				})
			},
			ClerkPrcFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true
				}),
				// formatter: 'This field has custom formatter, please implemented it or added TODO to do it latter'
			},
			ClerkReqFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedClerkLookupService,
					showClearButton: true
				}),
				// formatter: 'This field has custom formatter, please implemented it or added TODO to do it latter'
			},
			CurrencyFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedCurrencyLookupService,
					serverSideFilterToken: ProcurementQuoteCurrencyConversionFilterService
				})
			},
			PaymentTermFiFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true
				})
			},
			PaymentTermPaFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true
				})
			},
			TypeFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedQuoteTypeLookupService
				})
			},
			BusinessPartnerFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinessPartnerLookupService,
					displayMember: 'BusinessPartnerName1'
				})
			},
			SubsidiaryFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSubsidiaryLookupService,
					showClearButton: true,
					displayMember: 'AddressLine',
					serverSideFilterToken: ProcurementQuoteSubsidiaryFilterService
				})
			},
			SupplierFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BusinesspartnerSharedSupplierLookupService,
					showClearButton: true,
					serverSideFilterToken: ProcurementQuoteSupplierFilterService
				})
			},
			IncotermFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPrcIncotermLookupService,
					showClearButton: true
				})
			},
			RfqHeaderFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareRfqLookupService,
					serverSideFilterToken: ProcurementQuoteRfQFilterService
				})
			},
			QtnHeaderFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementShareQuoteLookupService,
					showClearButton: true,
					serverSideFilterToken: ProcurementQuoteQuoteFilterService
				})
			},
			BillingSchemaFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsShareProcurementConfigurationToBillingSchemaLookupService,
					showClearButton: true,
					serverSideFilterToken: ProcurementQuoteBillingSchemaFilterService
				})
			},
			PaymentTermAdFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedPaymentTermLookupService,
					showClearButton: true
				})
			},
			BpdVatGroupFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedVATGroupLookupService,
					showClearButton: true,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
			SalesTaxMethodFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedSalesTaxMethodLookupService,
					displayMember: 'DescriptionInfo.Translated'
				})
			},
			PrcConfigurationFk: {
				type: FieldType.Lookup,
				lookupOptions: createLookup({
					dataServiceToken: BasicsSharedProcurementConfigurationLookupService
				}),
				readonly: true
			},
			ExchangeRate: {
				type: FieldType.LookupInputSelect,
				lookupOptions: createLookup({
					dataServiceToken: ProcurementSharedExchangeRateInputLookupService
				})
			}
			// BillingSchemaFinal: {
			// 	readonly: true
			// },
			// BillingSchemaFinalOC: {
			// 	readonly: true
			// }
		},
		transientFields: [{
			id: 'BillingSchemaFinal',
			type: FieldType.Money,
			model: 'BillingSchemaFinal',
			readonly: true
		}, {
			id: 'BillingSchemaFinalOC',
			type: FieldType.Money,
			model: 'BillingSchemaFinalOC',
			readonly: true
		}]
	}
});