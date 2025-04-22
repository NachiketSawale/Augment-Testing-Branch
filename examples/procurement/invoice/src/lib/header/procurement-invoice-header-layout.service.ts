/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { FieldType, IAdditionalLookupField, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IInvHeaderEntity } from '../model';
import { IInitializationContext, ITranslatable, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedBpBankStatusLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	Rubric, BasicsSharedLookupOverloadProvider,
	BasicsSharedCustomizeLookupOverloadProvider,
} from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { ProcurementCommonCompanyContextService } from '@libs/procurement/common';
import { ProcurementShareContractLookupService, ProcurementSharedLookupOverloadProvider } from '@libs/procurement/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';
import { BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN } from '@libs/businesspartner/shared';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceHeaderLayoutService {
	private readonly prcConfigurationLookup = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);
	private readonly companyContextService = inject(ProcurementCommonCompanyContextService);
	private readonly bpBankStatusLookupService = inject(BasicsSharedBpBankStatusLookupService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly contractLookupService = inject(ProcurementShareContractLookupService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IInvHeaderEntity>> {
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['DocumentNo', 'Id', 'InvStatusFk', 'PrcConfigurationFk', 'Code', 'Description', 'InvTypeFk', 'BillingSchemaFk', 'ProgressId', 'CompanyDeferalTypeFk', 'DateDeferalStart', 'BankFk', 'SalesTaxMethodFk', 'RejectionRemark'],
				},
				{
					gid: 'businessPartner',
					title: {
						key: 'cloud.common.entityBusinessPartner',
						text: 'Business Partner',
					},
					attributes: [
						'BusinessPartnerFk',
						'SubsidiaryFk',
						'SupplierFk',
						'DateInvoiced',
						'Reference',
						'DateReceived',
						'DatePosted',
						'DateDelivered',
						'DateDeliveredFrom',
						'ReferenceStructured',
						'BpdBankTypeFk',
						'ContactFk',
						'BusinessPostingGroupFk',
					],
				},
				{
					gid: 'amount',
					title: {
						key: 'procurement.invoice.group.amount',
						text: 'Amount',
					},
					attributes: ['FromBillingSchemaFinalTotal', 'FromBillingSchemaFinalTotalOc', 'AmountNet', 'AmountNetOc', 'AmountGross', 'AmountGrossOc', 'ExchangeRate', 'CurrencyFk', 'TaxCodeFk', 'BpdVatGroupFk'],
				},
				{
					gid: 'workflow',
					title: {
						key: 'procurement.invoice.group.workflow',
						text: 'Workflow',
					},
					attributes: ['InvGroupFk', 'ClerkPrcFk', 'ClerkWfeFk', 'ClerkReqFk'],
				},
				{
					gid: 'allocation',
					title: {
						key: 'procurement.invoice.group.allocation',
						text: 'Allocation',
					},
					attributes: [
						'ProjectStatusFk',
						'ProjectFk',
						'PrcPackageFk',
						'PrcStructureFk',
						'ReconcilationHint',
						'ConHeaderFk',
						'ContractTotalCo',
						'ContractTotalInvoice',
						'ContractTotalGrossCo',
						'ContractTotalInvoiceGross',
						'orderDateStatus',
						'PesHeaderFk',
						'ControllingUnitFk',
						'UserDefinedMoney01',
						'UserDefinedMoney02',
						'UserDefinedMoney03',
						'UserDefinedMoney04',
						'UserDefinedMoney05',
						'UserDefinedDate01',
						'UserDefinedDate02',
						'UserDefinedDate03',
						'TotalPerformedNet',
						'TotalPerformedGross',
						'CallOffMainContractFk',
						'PrcPackageFk',
					],
				},
				{
					gid: 'paymentTerms',
					title: {
						key: 'procurement.invoice.group.paymentTerms',
						text: 'Payment Terms',
					},
					attributes: [
						'FromPaymentTotalPayment',
						'FromPaymentTotalPaymentDiscount',
						'PaymentTermFk',
						'DateDiscount',
						'AmountDiscountBasis',
						'AmountDiscountBasisOc',
						'AmountDiscount',
						'AmountDiscountOc',
						'PercentDiscount',
						'DateNetPayable',
						'PaymentHint',
						'BasPaymentMethodFk',
					],
				},
				{
					gid: 'reconciliation',
					title: {
						key: 'procurement.invoice.group.reconciliation',
						text: 'Reconciliation',
					},
					attributes: ['AmountNet', 'AmountNet', 'AmountNetPes', 'AmountNetContract', 'AmountNetOther', 'FromBillingSchemaNet', 'AmountNetReject', 'AmountNetBalance'],
				},
				{
					gid: 'reconciliationOc',
					title: {
						key: 'procurement.invoice.group.reconciliationOc',
						text: 'Reconciliation(OC)',
					},
					attributes: ['AmountNetOc', 'AmountNetOc', 'AmountNetPesOc', 'AmountNetContractOc', 'AmountNetOtherOc', 'FromBillingSchemaNetOc', 'AmountNetRejectOc', 'AmountNetBalanceOc'],
				},
				{
					gid: 'other',
					title: {
						key: 'procurement.invoice.group.other',
						text: 'Other',
					},
					attributes: ['Remark', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
				{
					gid: 'AccountAssignment',
					title: {
						key: 'procurement.common.accassign.AccountAssignment',
						text: 'Account Assignment',
					},
					attributes: ['BasAccassignBusinessFk', 'BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('procurement.invoice.', {
					FromBillingSchemaFinalTotal: {
						key: 'header.fromBillingSchemaFinalTotal',
						text: 'Final Total',
					},
					FromBillingSchemaFinalTotalOc: {
						key: 'header.fromBillingSchemaFinalTotalOc',
						text: 'Final Total OC',
					},
					FromPaymentTotalPayment: {
						key: 'header.fromPaymentTotalPayment',
						text: 'Total Payment',
					},
					FromPaymentTotalPaymentDiscount: {
						key: 'header.fromPaymentTotalPaymentDiscount',
						text: 'Total Payment Discount',
					},
					DocumentNo: {
						key: 'entityDocumentNo',
						text: 'Document No.',
					},
					InvStatusFk: {
						key: 'header.invStatusFk',
						text: 'Status',
					},
					PrcConfigurationFk: {
						key: 'header.configuration',
						text: 'Configuration',
					},
					Code: {
						key: 'header.code',
						text: 'Entry No.',
					},
					Description: {
						key: 'header.description',
						text: 'Narrative',
					},
					BusinessPartnerFk: {
						key: 'header.entityBusinessPartner',
						text: 'Business Partner',
					},
					ClerkWfeFk: {
						key: 'header.currentResponsible',
						text: 'Current Responsible',
					},
					ClerkReqFk: {
						key: 'header.requisitionOwner',
						text: 'Requisition Owner',
					},
					AmountNet: {
						key: 'header.amountNet',
						text: 'Amount(Net)',
					},
					AmountNetOc: {
						key: 'header.amountNetOC',
						text: 'Amount(Net OC)',
					},
					AmountGross: {
						key: 'header.amountGross',
						text: 'Amount(Gross)',
					},
					AmountGrossOc: {
						key: 'header.amountGrossOC',
						text: 'Amount(Gross OC)',
					},
					DateInvoiced: {
						key: 'header.dateInvoiced',
						text: 'Date',
					},
					Reference: {
						key: 'header.reference',
						text: 'Invoice No.',
					},
					DateReceived: {
						key: 'header.dateReceived',
						text: 'Received',
					},
					DatePosted: {
						key: 'header.datePosted',
						text: 'Posting Date',
					},
					ReconcilationHint: {
						key: 'header.reconcilationHint',
						text: 'Hint',
					},
					ConHeaderFk: {
						key: 'header.contract',
						text: 'Contract',
					},
					ContractTotalCo: {
						key: 'header.contractTotalOc',
						text: 'Contract Total/Co',
					},
					ContractTotalInvoice: {
						key: 'header.contractTotalInvoicePercent',
						text: 'Contract Total/Invoiced/%',
					},
					ContractTotalGrossCo: {
						key: 'header.contractTotalGrossOc',
						text: 'Contract Gross/Co Gross',
					},
					ContractTotalInvoiceGross: {
						key: 'header.contractTotalInvoiceGrossPercent',
						text: 'Contract Gross/Invoiced Gross/%',
					},
					orderDateStatus: {
						key: 'header.orderDateStatus',
						text: 'Contract from/Status',
					},
					PesHeaderFk: {
						key: 'header.pes',
						text: 'PES',
					},
					PaymentTermFk: {
						key: 'header.paymentTerm',
						text: 'Payment Term',
					},
					DateDiscount: {
						key: 'header.discountDate',
						text: 'Discount Date',
					},
					AmountDiscountBasis: {
						key: 'header.discountBasis',
						text: 'Discount Basis',
					},
					AmountDiscountBasisOc: {
						key: 'header.discountBasisOc',
						text: 'Discount Basis(OC)',
					},
					AmountDiscount: {
						key: 'header.discountAmount',
						text: 'Discount Amount',
					},
					AmountDiscountOc: {
						key: 'header.discountAmountOc',
						text: 'Discount Amount(OC)',
					},
					PercentDiscount: {
						key: 'header.percentDiscount',
						text: 'Percent Discount',
					},
					DateNetPayable: {
						key: 'header.netPayable',
						text: 'Net Payable',
					},
					DateDelivered: {
						key: 'header.dateDelivered',
						text: 'Date Delivered',
					},
					DateDeliveredFrom: {
						key: 'header.dateDeliveredFrom',
						text: 'Date Delivered From',
					},
					ProgressId: {
						key: 'header.progressid',
						text: 'Progress Invoice',
					},
					CompanyDeferalTypeFk: {
						key: 'header.deferraltype',
						text: 'Deferral Type',
					},
					PaymentHint: {
						key: 'header.paymentHint',
						text: 'Payment Hint',
					},
					TotalPerformedNet: {
						key: 'header.totalPerformedNet',
						text: 'Total Performed Net',
					},
					TotalPerformedGross: {
						key: 'header.totalPerformedGross',
						text: 'Total Performed Gross',
					},
					DateDeferalStart: {
						key: 'header.dateDeferralStart',
						text: 'Date Deferral Start',
					},
					ReferenceStructured: {
						key: 'header.referenceStructured',
						text: 'Reference Structured',
					},
					BasPaymentMethodFk: {
						key: 'header.paymentMethodEntity',
						text: 'Payment Method',
					},
					BpdBankTypeFk: {
						key: 'header.bankType',
						text: 'Bank Type',
					},
					RejectionRemark: {
						key: 'accassign.RejectionRemark',
						text: 'Rejection Remark',
					},
					AmountNetPes: {
						key: 'header.fromPES',
					},
					AmountNetContract: {
						key: 'header.fromContract',
					},
					AmountNetOther: {
						key: 'header.fromOther',
					},
					FromBillingSchemaNet: {
						key: 'header.fromBillingSchema',
					},
					AmountNetReject: {
						key: 'header.rejections',
					},
					AmountNetBalance: {
						key: 'header.balance',
					},
					AmountNetPesOc: {
						key: 'header.fromPES',
					},
					AmountNetContractOc: {
						key: 'header.fromContract',
					},
					AmountNetOtherOc: {
						key: 'header.fromOther',
					},
					FromBillingSchemaNetOc: {
						key: 'header.fromBillingSchema',
					},
					AmountNetRejectOc: {
						key: 'header.rejections',
					},
					AmountNetBalanceOc: {
						key: 'header.balance',
					},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					ProjectStatusFk: {
						key: 'projectStatus',
						text: 'Project Status',
					},
					BpdVatGroupFk: {
						key: 'entityVatGroup',
						text: 'Vat Group',
					},
					BasAccassignBusinessFk: {
						key: 'accassign.BusinessArea',
						text: 'Business Area',
					},
					BasAccassignControlFk: {
						key: 'accassign.ControllingArea',
						text: 'Controlling Area',
					},
					BasAccassignAccountFk: {
						key: 'accassign.AccountingArea',
						text: 'Accounting Area',
					},
					BasAccassignConTypeFk: {
						key: 'accassign.ContractType',
						text: 'Account Contract Type',
					},
					SalesTaxMethodFk: {
						key: 'entitySalesTaxMethodFk',
						text: 'Sales Tax Method',
					},
					CallOffMainContractFk: {
						key: 'callOffMainContract',
						text: 'Call Offs Main Contract',
					},
					PrcPackageFk: {
						key: 'entityPackageTextInfo',
						text: 'Package Text Info',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Id: {
						key: 'entityId',
						text: 'Id',
					},
					ProjectFk: {
						key: 'entityProjectNo',
						text: 'Project No.',
					},
					SubsidiaryFk: {
						key: 'entitySubsidiary',
						text: 'Branch',
					},
					SupplierFk: {
						key: 'entitySupplier',
						text: 'Supplier',
					},
					InvTypeFk: {
						key: 'entityType',
						text: 'Type',
					},
					InvGroupFk: {
						key: 'entityGroup',
						text: 'Group',
					},
					ClerkPrcFk: {
						key: 'entityResponsible',
						text: 'Responsible',
					},
					ExchangeRate: {
						key: 'entityRate',
						text: 'Rate',
					},
					CurrencyFk: {
						key: 'entityCurrency',
						text: 'Currency',
					},
					PrcPackageFk: {
						key: 'entityPackage',
						text: 'Package',
					},
					PrcStructureFk: {
						key: 'entityStructureCode',
						text: 'Structure Code',
					},
					ControllingUnitFk: {
						key: 'entityControllingUnitCode',
						text: 'Controlling Unit Code',
					},
					Remark: {
						key: 'entityRemark',
						text: 'Remarks',
					},
					TaxCodeFk: {
						key: 'entityTaxCode',
						text: 'Tax Code',
					},
					Userdefined1: {
						key: 'entityUserDefined',
						text: 'User-Defined 1',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefined',
						text: 'User-Defined 4',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefined',
						text: 'User-Defined 5',
						params: { p_0: '5' },
					},
					BillingSchemaFk: {
						key: 'entityBillingSchema',
						text: 'Billing Schema',
					},
					UserDefinedMoney01: {
						key: 'entityUserDefinedMoney',
						text: 'User Defined Money 1',
						params: { p_0: '1' },
					},
					UserDefinedMoney02: {
						key: 'entityUserDefinedMoney',
						text: 'User Defined Money 2',
						params: { p_0: '2' },
					},
					UserDefinedMoney03: {
						key: 'entityUserDefinedMoney',
						text: 'User Defined Money 3',
						params: { p_0: '3' },
					},
					UserDefinedMoney04: {
						key: 'entityUserDefinedMoney',
						text: 'User Defined Money 4',
						params: { p_0: '4' },
					},
					UserDefinedMoney05: {
						key: 'entityUserDefinedMoney',
						text: 'User Defined Money 5',
						params: { p_0: '5' },
					},
					UserDefinedDate01: {
						key: 'entityUserDefinedDate',
						text: 'User Defined Date 1',
						params: { p_0: '1' },
					},
					UserDefinedDate02: {
						key: 'entityUserDefinedDate',
						text: 'User Defined Date 2',
						params: { p_0: '2' },
					},
					UserDefinedDate03: {
						key: 'entityUserDefinedDate',
						text: 'User Defined Date 3',
						params: { p_0: '3' },
					},
					BankFk: {
						key: 'entityBankName',
						text: 'Bank',
					},
					AmountNet: {
						key: 'entityAmount',
					},
					AmountNetOc: {
						key: 'entityAmount',
					},
				}),
				...prefixAllTranslationKeys('procurement.contract.', {
					ContactFk: {
						key: 'ConHeaderContact',
						text: 'Contact',
					},
				}),
				...prefixAllTranslationKeys('businesspartner.main.', {
					BusinessPostingGroupFk: {
						key: 'businessPostingGroup',
						text: 'Business Posting Group',
					},
				}),
			},
			overloads: {
				FromBillingSchemaFinalTotal: {
					readonly: true,
				},
				FromBillingSchemaFinalTotalOc: {
					readonly: true,
				},
				FromPaymentTotalPayment: {
					readonly: true,
				},
				FromPaymentTotalPaymentDiscount: {
					readonly: true,
				},
				DocumentNo: {
					readonly: true,
				},
				ProjectStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStatusLookupOverload(false),
				Id: {
					readonly: true,
				},
				InvStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceStatusLookupOverload(false),
				BpdBankTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideBankTypeReadonlyLookupOverload(),
				PrcPackageFk: {
					...ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'cloud.common.entityPackageDescriptio', {
						key: 'prc-invoice-package-filter',
						execute: (context) => {
							return {
								ProjectFk: this.getProjectFk(context.entity!),
							};
						},
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'cloud.common.entityPackageDescription',
								},
								column: true,
								singleRow: true,
							},
							{
								displayMember: 'TextInfo',
								label: {
									key: 'procurement.common.entityPackageTextInfo',
								},
								column: true,
								row: true,
							},
						],
					},
				},
				ReferenceStructured: {
					// todo - https://rib-40.atlassian.net/browse/DEV-20061
				},
				CompanyDeferalTypeFk: ProcurementSharedLookupOverloadProvider.provideProcurementCompanyDeferalTypeLookupOverload(false, {
					key: 'deferal-type-filter',
					execute: (context) => {
						return {
							IsLive: true,
							BasCompanyFk: context.entity!.CompanyFk,
						};
					},
				}),
				PrcConfigurationFk: BasicsSharedLookupOverloadProvider.provideProcurementConfigurationLookupOverload({
					key: 'prc-invoice-configuration-filter',
					execute: (context) => {
						return 'RubricFk = ' + Rubric.Invoices;
					},
				}),
				InvTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceTypeLookupOverload(false), 
				// TODO: Need to add this filter once lookup is updated
				// {
				// 	key: 'prc-invoice-invType-filter',
				// 	execute: (context) => {
				// 		return 'Sorting > 0 And RubricCategoryFk=' + context.entity!.RubricCategoryFk;
				// 	},
				// }
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.providePrcBillingSchemaLookupOverload(false, {
					key: 'prc-invoice-billing-schema-filter',
					execute: async (context) => {
						const prcConfigEntity = await firstValueFrom(
							this.prcConfigurationLookup.getItemByKey({
								id: context.entity!.PrcConfigurationFk,
							}),
						);

						return 'PrcConfigHeaderFk=' + prcConfigEntity.PrcConfigHeaderFk;
					},
				}),
				BusinessPartnerFk: bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
					showClearButton: true,
					customServerSideFilter: {
						key: 'prc-invoice-business-partner-filter',
						execute: async (context) => {
							const businessPartnerIds = [];
							if (context?.entity?.ConHeaderFk) {
								const conHeader = await firstValueFrom(this.contractLookupService.getItemByKey({ id: context.entity.ConHeaderFk }));
								const businessPartnerFk = conHeader?.BusinessPartnerFk;
								const businessPartner2Fk = conHeader?.BusinessPartner2Fk;
								businessPartnerFk && businessPartnerIds.push(businessPartnerFk);
								businessPartner2Fk && businessPartnerIds.push(businessPartner2Fk);
							}
							return {
								Ids: businessPartnerIds,
							};
						},
					},
					viewProviders: [
						{
							provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
							useValue: {
								showBranch: true,
							},
						},
					],
					additionalFields: [createAdditionalField('businessPartnerStatus', 'BpdStatusFk', { text: 'Business Partner Status', key: 'procurement.invoice.header.businessPartnerStatus' })],
				}),
				ContactFk: bpRelatedLookupProvider.getContactLookupOverload({
					showClearButton: true,
					displayMember: 'FullName',
					serverFilterKey: 'prc-con-contact-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSubsidiaries: (entity) => entity.SubsidiaryFk,
				}),
				SubsidiaryFk: bpRelatedLookupProvider.getSubsidiaryLookupOverload({
					showClearButton: true,
					displayMember: 'AddressLine',
					serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSuppliers: (entity) => entity.SupplierFk,
				}),
				SupplierFk: bpRelatedLookupProvider.getSupplierLookupOverload({
					showClearButton: true,
					serverFilterKey: 'businesspartner-main-supplier-common-filter',
					restrictToBusinessPartners: (entity) => entity.BusinessPartnerFk,
					restrictToSubsidiaries: (entity) => entity.SubsidiaryFk,
					additionalFields: [
						createAdditionalField('SupplierDescription', 'Description', { text: 'Supplier Description', key: 'cloud.common.entitySupplierDescription' }),
						createAdditionalField('SupplierStatus', 'SupplierStatusFk', { text: 'Supplier Status', key: 'businesspartner.main.supplierStatus' }),
					],
				}),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideBasCurrencyLookupOverload(false, {
					key: 'bas-currency-conversion-filter',
					execute: (context) => {
						return { companyFk: context.entity!.CompanyFk };
					},
				}),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false),
				InvGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceGroupLookupOverload(true),
				ClerkPrcFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderProcurementOwnerName'),
				ClerkReqFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderRequisitionOwnerName'),
				ClerkWfeFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.invoice.header.curResponsibleDes'),
				ProjectFk: {
					...this.projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							serverSideFilter: {
								key: 'prc-invoice-header-project-filter',
								execute: (context) => {
									return {
										IsLive: true,
										CompanyFk: this.companyContextService.loginCompanyEntity.Id,
									};
								},
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								key: 'cloud.common.entityProjectName',
							},
							column: true,
						},
					],
				},
				PrcStructureFk: BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				PesHeaderFk: {
					...ProcurementSharedLookupOverloadProvider.providePesHeaderLookupOverload(true, {
						key: 'prc-invoice-pes-header-filter',
						execute: (context) => {
							const entity = context.entity!;

							return {
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsInvoiced: false,
								StatusIsAccepted: true,
								ConHeaderFk: entity.ConHeaderFk,
								BusinessPartnerFk: entity.BusinessPartnerFk,
								ProjectFk: entity.ProjectFk,
								PrcPackageFk: entity.PrcPackageFk,
								ControllingUnitFk: entity.ControllingUnitFk,
								PrcStructureFk: entity.PrcStructureFk,
								CompanyFk: entity.CompanyFk,
								IncludeCalloffContracts: true,
							};
						},
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'procurement.invoice.header.pesHeaderDes',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				ConHeaderFk: {
					...ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'procurement.contract.ConHeaderBasisContractDescription', false, {
						key: 'prc-invoice-con-header-filter',
						execute: (context) => {
							const entity = context.entity!;

							const result: {
								StatusIsInvoiced: boolean;
								StatusIsCanceled: boolean;
								StatusIsVirtual: boolean;
								StatusIsOrdered: boolean;
								IsFramework: boolean;
								PesHeaderFk?: number;
								BusinessPartnerFk?: number;
								ProjectFk?: number;
								PrcPackageFk?: number;
								ControllingUnit?: number;
								PrcStructureFk?: number;
								ExcludeCalloffContracts?: boolean;
							} = {
								StatusIsInvoiced: false,
								StatusIsCanceled: false,
								StatusIsVirtual: false,
								StatusIsOrdered: true,
								IsFramework: false,
							};

							if (entity.PesHeaderFk) {
								result.PesHeaderFk = entity.PesHeaderFk;
							} else {
								if (entity.BusinessPartnerFk) {
									result.BusinessPartnerFk = entity.BusinessPartnerFk;
								}
								if (entity.ProjectFk) {
									result.ProjectFk = entity.ProjectFk;
								}
								if (entity.PrcPackageFk) {
									result.PrcPackageFk = entity.PrcPackageFk;
								}
								if (entity.ControllingUnitFk) {
									result.ControllingUnit = entity.ControllingUnitFk;
								}
								if (entity.PrcStructureFk) {
									result.PrcStructureFk = entity.PrcStructureFk;
								}
							}
							return result;
						},
					}),
					...{
						additionalFields: [
							{
								displayMember: 'Description',
								label: {
									key: 'procurement.invoice.header.conHeaderDes',
								},
								column: true,
								singleRow: true,
							},
						],
					},
				},
				ControllingUnitFk: await ProcurementSharedLookupOverloadProvider.provideProcurementControllingUnitLookupOverload(context, {
					projectGetter: (e) => e.ProjectFk,
					controllingUnitGetter: (e) => e.ControllingUnitFk,
					lookupOptions: {
						serverSideFilter: {
							key: 'prc.con.controllingunit.by.prj.filterkey',
							execute: (context: ILookupContext<IControllingUnitLookupEntity, IInvHeaderEntity>) => {
								return {
									ByStructure: true,
									ExtraFilter: true,
									PrjProjectFk: context.entity?.ProjectFk,
									CompanyFk: this.companyContextService.loginCompanyEntity.Id,
								};
							},
						},
					},
				}),
				PaymentTermFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'procurement.invoice.header.paymentTermDes'),
				PaymentHint: {
					// todo - https://rib-40.atlassian.net/browse/DEV-20096
				},
				ExchangeRate: ProcurementSharedLookupOverloadProvider.provideExchangeRateLookupOverload(),
				BpdVatGroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(true),
				BasPaymentMethodFk: BasicsSharedCustomizeLookupOverloadProvider.providePaymentMethodLookupOverload(true),
				BusinessPostingGroupFk: bpRelatedLookupProvider.getBusinessPartnerPostingGroupLookupOverload({
					readonly: true,
					customServerSideFilter: {
						key: 'business-partner-main-businesspostinggroup-filter',
						execute: (context) => {
							return {
								BpdSubledgerContextFk: this.companyContextService.loginCompanyEntity.SubledgerContextFk,
							};
						},
					},
				}),
				BankFk: bpRelatedLookupProvider.getBankLookupOverload({
					customServerSideFilter: {
						key: 'prc-invoice-bank-filter',
						execute: async (context) => {
							let filterString = 'IsLive = true ';

							const entity = context.entity!;
							const statusFilter = await firstValueFrom(this.bpBankStatusLookupService.getList());

							if (statusFilter.length > 0) {
								let bankStatusFilter = '';
								statusFilter
									.filter((item) => item.Sorting !== 0 && !item.IsDisabled)
									.forEach((item) => {
										if (bankStatusFilter !== '') {
											bankStatusFilter = bankStatusFilter + ' or ';
										}
										bankStatusFilter = bankStatusFilter + ' BpdBankStatusFk = ' + item.Id;
									});
								if (bankStatusFilter !== '') {
									filterString = filterString + ' And (' + bankStatusFilter + ')';
								}
							}

							if (!entity.BusinessPartnerFk) {
								filterString = filterString + ' And BusinessPartnerFk = -1 ';
							} else {
								filterString = filterString + ' And BusinessPartnerFk = ' + entity.BusinessPartnerFk;
							}

							return filterString;
						},
					},
				}),
				BasAccassignBusinessFk: BasicsSharedCustomizeLookupOverloadProvider.provideAccountAssignmentBusinessLookupOverload(false),
				BasAccassignControlFk: BasicsSharedCustomizeLookupOverloadProvider.provideAccountAssignmentControlLookupOverload(true),
				BasAccassignAccountFk: BasicsSharedCustomizeLookupOverloadProvider.provideAccountAssignmentAccountLookupOverload(true),
				BasAccassignConTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideAccountAssignmentContractTypeLookupOverload(true),
				SalesTaxMethodFk: BasicsSharedCustomizeLookupOverloadProvider.provideSalesTaxMethodLookupOverload(true),
				CallOffMainContractFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(false, '', true),
				ContractTotalCo: {
					form: {
						// todo - https://rib-40.atlassian.net/browse/DEV-20158
					},
				},
				ContractTotalInvoice: {
					form: {
						// todo - https://rib-40.atlassian.net/browse/DEV-20158
					},
				},
				// todo - https://rib-40.atlassian.net/browse/DEV-20158
			},
			transientFields: [
				{
					id: 'contractTotal',
					type: FieldType.Money,
					readonly: true,
					model: 'ContractTotal',
					label: { key: 'procurement.invoice.header.contractTotal' },
					width: 180,
				},
				{
					id: 'contractChangeOrder',
					type: FieldType.Money,
					readonly: true,
					model: 'ContractChangeOrder',
					label: { key: 'procurement.invoice.header.contractChangeOrder' },
					width: 180,
				},
				{
					id: 'contractTotalInvoice',
					type: FieldType.Money,
					readonly: true,
					model: 'Invoiced',
					label: { key: 'procurement.invoice.header.ContractTotalInvoice' },
					width: 180,
				},
				{
					id: 'contractInvoicePercent',
					type: FieldType.Money,
					readonly: true,
					model: 'Percent',
					label: { key: 'procurement.invoice.header.ContractTotalPercent' },
					width: 180,
				},
				{
					id: 'contractTotalGross',
					type: FieldType.Money,
					readonly: true,
					model: 'ContractTotalGross',
					label: { key: 'procurement.invoice.header.contractTotalGross' },
					width: 180,
				},
				{
					id: 'contractChangeOrderGross',
					type: FieldType.Money,
					readonly: true,
					model: 'ContractChangeOrderGross',
					label: { key: 'procurement.invoice.header.contractChangeOrder' },
					width: 180,
				},
				{
					id: 'InvoicedGross',
					type: FieldType.Money,
					readonly: true,
					model: 'InvoicedGross',
					label: { key: 'procurement.invoice.header.invoicedGross' },
					width: 180,
				},
				{
					id: 'contractInvoiceGrossPercent',
					type: FieldType.Money,
					readonly: true,
					model: 'GrossPercent',
					label: { key: 'procurement.invoice.header.contractTotalGrossPercent' },
					width: 180,
				},
				{
					id: 'contractOrderDate',
					type: FieldType.Money,
					readonly: true,
					model: 'ContractOrderDate',
					label: { key: 'procurement.invoice.header.contractOrderDate' },
					width: 180,
				},
				{
					id: 'amountNetPes',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetPes',
					label: { key: 'procurement.invoice.header.amountNetPES' },
					width: 180,
				},
				{
					id: 'amountVatPes',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatPes',
					label: { key: 'procurement.invoice.header.amountVatPES' },
					width: 180,
				},
				{
					id: 'amountGrossPes',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossPes',
					label: { key: 'procurement.invoice.header.amountGrossPES' },
					width: 180,
				},
				{
					id: 'amountNetPesOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetPesOc',
					label: { key: 'procurement.invoice.header.amountNetPESOc' },
					width: 180,
				},
				{
					id: 'amountVatPesOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatPesOc',
					label: { key: 'procurement.invoice.header.amountVatPESOc' },
					width: 180,
				},
				{
					id: 'amountGrossPesOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossPesOc',
					label: { key: 'procurement.invoice.header.amountGrossPESOc' },
					width: 180,
				},
				{
					id: 'amountNetContract',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetContract',
					label: { key: 'procurement.invoice.header.amountNetContract' },
					width: 180,
				},
				{
					id: 'amountVatContract',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatContract',
					label: { key: 'procurement.invoice.header.amountVatContract' },
					width: 180,
				},
				{
					id: 'amountGrossContract',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossContract',
					label: { key: 'procurement.invoice.header.amountGrossContract' },
					width: 180,
				},
				{
					id: 'amountNetContractOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetContractOc',
					label: { key: 'procurement.invoice.header.amountNetContractOc' },
					width: 180,
				},
				{
					id: 'amountVatContractOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatContractOc',
					label: { key: 'procurement.invoice.header.amountVatContractOc' },
					width: 180,
				},
				{
					id: 'amountGrossContractOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossContractOc',
					label: { key: 'procurement.invoice.header.amountGrossContractOc' },
					width: 180,
				},
				{
					id: 'amountNetOther',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetOther',
					label: { key: 'procurement.invoice.header.amountNetOther' },
					width: 180,
				},
				{
					id: 'amountVatOther',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatOther',
					label: { key: 'procurement.invoice.header.amountVatOther' },
					width: 180,
				},
				{
					id: 'amountGrossOther',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossOther',
					label: { key: 'procurement.invoice.header.amountGrossOther' },
					width: 180,
				},
				{
					id: 'amountNetOtherOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetOtherOc',
					label: { key: 'procurement.invoice.header.amountNetOtherOc' },
					width: 180,
				},
				{
					id: 'amountVatOtherOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatOtherOc',
					label: { key: 'procurement.invoice.header.amountVatOtherOc' },
					width: 180,
				},
				{
					id: 'amountGrossOtherOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossOtherOc',
					label: { key: 'procurement.invoice.header.amountGrossOtherOc' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaNet',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaNet',
					label: { key: 'procurement.invoice.header.fromBillingSchemaNet' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaVat',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaVat',
					label: { key: 'procurement.invoice.header.fromBillingSchemaVat' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaGross',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaGross',
					label: { key: 'procurement.invoice.header.fromBillingSchemaGross' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaNetOc',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaNetOc',
					label: { key: 'procurement.invoice.header.fromBillingSchemaNetOc' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaVatOc',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaVatOc',
					label: { key: 'procurement.invoice.header.fromBillingSchemaVatOc' },
					width: 180,
				},
				{
					id: 'fromBillingSchemaGrossOc',
					type: FieldType.Money,
					readonly: true,
					model: 'FromBillingSchemaGrossOc',
					label: { key: 'procurement.invoice.header.fromBillingSchemaGrossOc' },
					width: 180,
				},
				{
					id: 'amountNetReject',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetReject',
					label: { key: 'procurement.invoice.header.amountNetReject' },
					width: 180,
				},
				{
					id: 'amountVatReject',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatReject',
					label: { key: 'procurement.invoice.header.amountVatReject' },
					width: 180,
				},
				{
					id: 'amountGrossReject',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossReject',
					label: { key: 'procurement.invoice.header.amountGrossReject' },
					width: 180,
				},
				{
					id: 'amountNetRejectOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetRejectOc',
					label: { key: 'procurement.invoice.header.amountNetRejectOc' },
					width: 180,
				},
				{
					id: 'amountVatRejectOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatRejectOc',
					label: { key: 'procurement.invoice.header.amountVatRejectOc' },
					width: 180,
				},
				{
					id: 'amountGrossRejectOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossRejectOc',
					label: { key: 'procurement.invoice.header.amountGrossRejectOc' },
					width: 180,
				},
				{
					id: 'amountNetBalance',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetBalance',
					label: { key: 'procurement.invoice.header.amountNetBalance' },
					width: 180,
				},
				{
					id: 'amountVatBalance',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatBalance',
					label: { key: 'procurement.invoice.header.amountVatBalance' },
					width: 180,
				},
				{
					id: 'amountGrossBalance',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossBalance',
					label: { key: 'procurement.invoice.header.amountGrossBalance' },
					width: 180,
				},
				{
					id: 'amountNetBalanceOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountNetBalanceOc',
					label: { key: 'procurement.invoice.header.amountNetBalanceOc' },
					width: 180,
				},
				{
					id: 'amountVatBalanceOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountVatBalanceOc',
					label: { key: 'procurement.invoice.header.amountVatBalanceOc' },
					width: 180,
				},
				{
					id: 'amountGrossBalanceOc',
					type: FieldType.Money,
					readonly: true,
					model: 'AmountGrossBalanceOc',
					label: { key: 'procurement.invoice.header.amountGrossBalanceOc' },
					width: 180,
				},
				{
					id: 'BusinessPartnerStatus',
					type: FieldType.Money,
					readonly: true,
					model: 'BusinessPartnerFk',
					label: { key: 'procurement.invoice.header.businessPartnerStatus' },
					width: 125,
				},
				{
					id: 'CallOffMainContractFk',
					type: FieldType.Money,
					readonly: true,
					model: 'CallOffMainContractFk',
					label: { key: 'procurement.common.callOffMainContract' },
					width: 150,
				},
				{
					id: 'CallOffMainContractDes',
					type: FieldType.Money,
					readonly: true,
					model: 'CallOffMainContractDes',
					label: { key: 'procurement.common.callOffMainContractDes' },
					width: 150,
				},
			],
		};
	}

	private getProjectFk(entity: IInvHeaderEntity) {
		// todo - or from pinned project
		return entity.ProjectFk;
	}
}

const createAdditionalField = function (id: string, displayMember: string, label: ITranslatable): IAdditionalLookupField {
	return {
		id: id,
		displayMember: displayMember,
		label: label,
		column: true,
		singleRow: true,
	};
};

