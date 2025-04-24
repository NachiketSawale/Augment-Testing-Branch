/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable, StaticProvider } from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILookupContext } from '@libs/ui/common';
import { IConHeaderEntity } from '../model/entities';
import {
	ProcurementInternalModule,
	ProcurementSharedLookupOverloadProvider,
} from '@libs/procurement/shared';
import { IInitializationContext, PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import {
	BasicsSharedBpBankStatusLookupService,
	BasicsSharedLookupOverloadProvider,
	BasicsSharedProcurementConfigurationLookupService,
	IBillingSchemaEntity, Rubric
} from '@libs/basics/shared';
import { IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { ProcurementContractHeaderDataService } from './procurement-contract-header-data.service';
import { firstValueFrom } from 'rxjs';
import { BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN, BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN } from '@libs/businesspartner/shared';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { IControllingUnitLookupEntity } from '@libs/controlling/interfaces';
import { BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN } from '@libs/businesspartner/interfaces';
import { isNil } from 'lodash';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { IProjectEntity } from '@libs/project/interfaces';
import { ProcurementConHeaderPurchaseOrdersLookupService } from '../lookups/con-header-purchase-orders-lookup.service';

/**
 * The layout service for contract entity container
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementContractHeaderLayoutService {
	private readonly dataService: ProcurementContractHeaderDataService = inject(ProcurementContractHeaderDataService);
	private readonly configLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly controllingUnitLookupProvider = inject(ControllingSharedControllingUnitLookupProviderService);
	private readonly lazyInjector = inject(PlatformLazyInjectorService);
	private readonly bpBankStatusLookupService = inject(BasicsSharedBpBankStatusLookupService);
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);

	public async generateLayout(context: IInitializationContext): Promise<ILayoutConfiguration<IConHeaderEntity>> {
		const controllingUnitOverload = await this.getControllingUnitLookupOverLoad(context);
		const bpRelatedLookupProvider = await this.lazyInjector.inject(BUSINESSPARTNER_RELATED_LOOKUP_PROVIDER_TOKEN);
		const getBusinessPartnerLookupOverload = (viewProviders?: StaticProvider[]): FieldOverloadSpec<IConHeaderEntity> => {
			return bpRelatedLookupProvider.getBusinessPartnerLookupOverload({
				serverFilterKey: 'procurement-contract-businesspartner-businesspartner-filter',
				filterIsLive: true,
				viewProviders: [
					...(viewProviders || []),
					{
						provide: BUSINESSPARTNER_LOOKUP_INITIAL_VALUE_TOKEN,
						useValue: {
							execute: (entity: IConHeaderEntity) => {
								return {
									structureFk: entity?.PrcHeaderEntity?.StructureFk,
									addressFk: entity?.AddressFk, //if (_.isUndefined(entity.AddressFk)) isSubModule = true other modules
									projectFk: entity?.ProjectFk,
									companyFk: entity?.CompanyFk,
									moduleName: ProcurementInternalModule.Contract,
								};
							},
						},
					},
				],
			});
		};
		const getSubsidiaryLookupOverload = (bpGetter: (entity: IConHeaderEntity) => number | undefined | null, supplierGetter: (entity: IConHeaderEntity) => number | undefined | null): FieldOverloadSpec<IConHeaderEntity> => {
			return bpRelatedLookupProvider.getSubsidiaryLookupOverload({
				serverFilterKey: 'businesspartner-main-subsidiary-common-filter',
				restrictToBusinessPartners: bpGetter,
				restrictToSuppliers: supplierGetter,
			});
		};
		const getSupplierLookupOverload = (
			bpGetter: (entity: IConHeaderEntity) => number | undefined | null,
			subsidiaryGetter: (entity: IConHeaderEntity) => number | undefined | null,
			useAdditionalFields?: boolean,
		): FieldOverloadSpec<IConHeaderEntity> => {
			return bpRelatedLookupProvider.getSupplierLookupOverload({
				serverFilterKey: 'businesspartner-main-supplier-common-filter',
				restrictToBusinessPartners: bpGetter,
				restrictToSubsidiaries: subsidiaryGetter,
				...(useAdditionalFields !== undefined ? { useAdditionalFields: useAdditionalFields } : {}),
			});
		};
		const getContactLookupOverload = (bpGetter: (entity: IConHeaderEntity) => number | undefined | null, subsidiaryGetter: (entity: IConHeaderEntity) => number | undefined | null): FieldOverloadSpec<IConHeaderEntity> => {
			return bpRelatedLookupProvider.getContactLookupOverload({
				serverFilterKey: 'prc-con-contact-filter',
				restrictToBusinessPartners: bpGetter,
				restrictToSubsidiaries: subsidiaryGetter,
			});
		};

		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'Id',
						'PurchaseOrders',
						'Code',
						'Description',
						'ConStatusFk',
						'ProjectFk',
						'ProjectStatusFk',
						'PackageFk',
						'ReqHeaderFk',
						'TaxCodeFk',
						'BpdVatGroupFk',
						'ClerkPrcFk',
						'ClerkReqFk',
						'BasCurrencyFk',
						'ExchangeRate',
						'ProjectChangeFk',
						'ContractHeaderFk',
						'MaterialCatalogFk',
						'PaymentTermFiFk',
						'PaymentTermPaFk',
						'PaymentTermAdFk',
						'DateOrdered',
						'DateReported',
						'DateCanceled',
						'DateDelivery',
						'DateCallofffrom',
						'DateCalloffto',
						'ConTypeFk',
						'AwardmethodFk',
						'ContracttypeFk',
						'ControllingUnitFk',
						'BillingSchemaFk',
						'BillingSchemaFinal',
						'BillingSchemaFinalOC',
						'ConfirmationCode',
						'ConfirmationDate',
						'ExternalCode',
						'TotalLeadTime',
						'PrcCopyModeFk',
						'DateEffective',
						'ProvingPeriod',
						'ProvingDealdline',
						'ApprovalPeriod',
						'ApprovalDealdline',
						'IsFreeItemsAllowed',
						'MdcPriceListFk',
						'BankFk',
						'ExecutionStart',
						'ExecutionEnd',
						'OrdHeaderFk',
						'OverallDiscount',
						'OverallDiscountOc',
						'OverallDiscountPercent',
						'SalesTaxMethodFk',
						'ValidFrom',
						'ValidTo',
						'BoqWicCatFk',
						'BoqWicCatBoqFk',
						'IsFramework',
						'IsNotAccrualPrr',
						'BaselinePath',
						'FrameworkConHeaderFk',
					],
					additionalAttributes: ['PrcHeaderEntity.ConfigurationFk', 'PrcHeaderEntity.StructureFk', 'PrcHeaderEntity.StrategyFk'],
				},
				{
					gid: 'HeaderGroupDesiredSupplier',
					title: {
						key: 'procurement.contract.HeaderGroupDesiredSupplier',
						text: 'Contractor',
					},
					attributes: ['BusinessPartnerFk', 'SubsidiaryFk', 'SupplierFk', 'ContactFk', 'BusinessPartner2Fk', 'Subsidiary2Fk', 'Supplier2Fk', 'Contact2Fk', 'BusinessPartnerAgentFk'],
				},
				{
					gid: 'HeaderGroupOther',
					title: {
						key: 'procurement.contract.HeaderGroupOther',
						text: 'Delivery Requirements',
					},
					attributes: ['AddressEntity', 'IncotermFk', 'CompanyInvoiceFk', 'CodeQuotation'],
				},
				{
					gid: 'HeaderGroupInformation',
					title: {
						key: 'procurement.contract.HeaderGroupInformation',
						text: 'User-Defined Fields',
					},
					attributes: ['Remark', 'Userdefined1', 'Userdefined2', 'Userdefined3', 'Userdefined4', 'Userdefined5'],
				},
				{
					gid: 'HeaderGroupPenality',
					title: {
						key: 'procurement.contract.HeaderGroupPenality',
						text: 'Penality',
					},
					attributes: ['DatePenalty', 'PenaltyPercentPerDay', 'PenaltyPercentMax', 'PenaltyComment'],
				},
				{
					gid: 'AccountAssignment',
					title: {
						key: 'procurement.common.accountAssign.AccountAssignment',
						text: 'Account Assignment',
					},
					attributes: ['BasAccassignBusinessFk', 'BasAccassignControlFk', 'BasAccassignAccountFk', 'BasAccassignConTypeFk'],
				},
				{
					gid: 'TotalValue',
					title: {
						key: 'procurement.contract.total.totalValue',
						text: 'Total',
					},
					attributes: ['Net', 'Vat', 'Gross', 'NetOc', 'VatOc', 'GrossOc'],
				},
				{
					gid: 'ChangeOrderValue',
					title: {
						key: 'procurement.contract.total.changeOrder',
						text: 'Change Order',
					},
					attributes: ['ChangeOrderNet', 'ChangeOrderVat', 'ChangeOrderGross', 'ChangeOrderNetOc', 'ChangeOrderVatOc', 'ChangeOrderGrossOc'],
				},
				{
					gid: 'CallOffValue',
					title: {
						key: 'procurement.contract.total.callOff',
						text: 'Call Off',
					},
					attributes: ['CallOffNet', 'CallOffVat', 'CallOffGross', 'CallOffNetOc', 'CallOffVatOc', 'CallOffGrossOc'],
				},
				{
					gid: 'GrandValue',
					title: {
						key: 'procurement.contract.total.grand',
						text: 'Grand Total',
					},
					attributes: ['GrandNet', 'GrandVat', 'GrandGross', 'GrandNetOc', 'GrandVatOc', 'GrandGrossOc'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.customize.', {
					ConStatusFk: {
						text: 'Status',
						key: 'constatus',
					},
				}),
				...prefixAllTranslationKeys('basics.common.', {
					DateEffective: {
						text: 'Date Effective',
						key: 'dateEffective',
					},
					'PrcHeaderEntity.StructureFk': {
						key: 'entityPrcStructureFk',
						text: 'Procurement structure',
					},
				}),
				...prefixAllTranslationKeys('basics.procurementconfiguration.', {
					ProvingPeriod: {
						text: 'Proving Period',
						key: 'entityProvingPeriod',
					},
					ProvingDealdline: {
						text: 'Proving Deadline',
						key: 'entityProvingDealdline',
					},
					ApprovalPeriod: {
						text: 'Approval Period',
						key: 'entityApprovalPeriod',
					},
					ApprovalDealdline: {
						text: 'Approval Deadline',
						key: 'entityApprovalDealdline',
					},
					IsFreeItemsAllowed: {
						text: 'Is Free Items Allowed',
						key: 'entityIsFreeItemsAllowed',
					},
				}),
				...prefixAllTranslationKeys('procurement.common.', {
					ProjectStatusFk: {
						text: 'Project Status',
						key: 'projectStatus',
					},
					BpdVatGroupFk: {
						text: 'Vat Group',
						key: 'entityVatGroup',
					},
					TotalLeadTime: {
						key: 'totalLeadTime',
						text: 'Total Lead Time',
					},
					DateOrdered: {
						key: 'transaction.dateOrdered',
						text: 'Date Ordered',
					},
					DateReported: {
						key: 'transaction.dateReported',
						text: 'Date Reported',
					},
					DateDelivery: {
						key: 'entityDateDelivered',
						text: 'Date Delivered',
					},
					ContactFk: {
						key: 'ConHeaderContact',
						text: 'Contact',
					},
					CompanyInvoiceFk: {
						key: 'transaction.conHeaderCompanyInvoicedCode',
						text: 'Invoiced Company Code',
					},
					BasAccassignBusinessFk: {
						key: 'accountAssign.BusinessArea',
						text: 'Business Area',
					},
					BasAccassignControlFk: {
						key: 'accountAssign.ControllingArea',
						text: 'Controlling Area',
					},
					BasAccassignAccountFk: {
						key: 'accountAssign.AccountingArea',
						text: 'Accounting Area',
					},
					BasAccassignConTypeFk: {
						key: 'accountAssign.ContractType',
						text: 'Account Contract Type',
					},
					OverallDiscount: {
						key: 'entityOverallDiscount',
						text: 'Overall Discount',
					},
					OverallDiscountOc: {
						key: 'entityOverallDiscountOc',
						text: 'Overall Discount (OC)',
					},
					OverallDiscountPercent: {
						key: 'entityOverallDiscountPercent',
						text: 'Overall Discount Percent',
					},
					SalesTaxMethodFk: {
						key: 'entitySalesTaxMethodFk',
						text: 'Sales Tax Method',
					},
					ValidFrom: {
						key: 'entityValidFrom',
						text: 'Valid From',
					},
					ValidTo: {
						key: 'entityValidTo',
						text: 'Valid To',
					},
					BoqWicCatFk: {
						key: 'entityFwBoqWicCatFk',
						text: 'Framework WIC Group',
					},
					BoqWicCatBoqFk: {
						key: 'entityFwBoqWicCatBoqFk',
						text: 'Framework WIC BoQ',
					},
					BillingSchemaFinal: {
						key: 'billingSchemaFinal',
						text: 'Billing Schema Final',
					},
					BillingSchemaFinalOC: {
						key: 'billingSchemaFinalOc',
						text: 'Billing Schema Final OC',
					},
					'PrcHeaderEntity.ConfigurationFk': {
						key: 'prcConfigurationDescription',
						text: 'Configuration',
					},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Id: { text: 'Id', key: 'entityId' },
					Code: {
						text: 'Code',
						key: 'entityCode',
					},
					Description: {
						text: 'Description',
						key: 'entityDescription',
					},
					ProjectFk: {
						text: 'Project',
						key: 'entityProjectNo',
					},
					ControllingUnitFk: {
						text: 'Controlling Unit',
						key: 'entityControllingUnit',
					},
					PackageFk: {
						text: 'Package Code',
						key: 'entityPackageCode',
					},
					TaxCodeFk: {
						text: 'Tax Code',
						key: 'entityTaxCode',
					},
					BasCurrencyFk: {
						text: 'Currency',
						key: 'entityCurrency',
					},
					ExchangeRate: {
						text: 'Exchange Rate',
						key: 'entityRate',
					},
					PaymentTermFiFk: {
						key: 'entityPaymentTermFI',
						text: 'Payment Term (FI)',
					},
					PaymentTermPaFk: {
						key: 'entityPaymentTermPA',
						text: 'Payment Term (PA)',
					},
					ConTypeFk: {
						key: 'entityType',
						text: 'Type',
					},
					AwardmethodFk: {
						key: 'entityAwardMethod',
						text: 'Award Method',
					},
					BusinessPartnerFk: {
						key: 'entityBusinessPartner',
						text: 'Business Partner',
					},
					SubsidiaryFk: {
						key: 'entitySubsidiary',
						text: 'Branch',
					},
					SupplierFk: {
						key: 'entitySupplierCode',
						text: 'Branch',
					},
					BusinessPartner2Fk: {
						key: 'entityBusinessPartner2',
						text: 'Business Partner2',
					},
					Subsidiary2Fk: {
						key: 'entitySubsidiary2',
						text: 'Branch 2',
					},
					Supplier2Fk: {
						key: 'entitySupplier2Code',
						text: 'Supplier 2 Code',
					},
					IncotermFk: {
						key: 'entityIncoterms',
						text: 'Incoterms',
					},
					BusinessPartnerAgentFk: {
						key: 'entityBusinessPartnerAgent',
						text: 'Business Partner Agent',
					},
					Remark: {
						key: 'entityRemark',
						text: 'Remarks',
					},
					Userdefined1: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '1' },
					},
					Userdefined2: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '2' },
					},
					Userdefined3: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '3' },
					},
					Userdefined4: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '4' },
					},
					Userdefined5: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '5' },
					},
					BillingSchemaFk: {
						key: 'entityBillingSchema',
						text: 'Billing Schema',
					},
					PaymentTermAdFk: {
						key: 'entityPaymentTermAD',
						text: 'Payment Term (AD)',
					},
					MdcPriceListFk: {
						key: 'entityMarketPrice',
						text: 'Market Price',
					},
					BankFk: {
						key: 'entityBankName',
						text: 'Bank',
					},
					AddressEntity: {
						key: 'entityDeliveryAddress',
						text: 'Delivery Address',
					},
					'PrcHeaderEntity.StrategyFk': {
						key: 'EntityStrategy',
						text: 'Strategy',
					},
				}),
				...prefixAllTranslationKeys('procurement.contract.', {
					PurchaseOrders: {
						key: 'purchaseOrders.entityPurchaseOrders',
						text: 'Purchase Orders',
					},
					ClerkPrcFk: {
						key: 'ConHeaderProcurementOwner',
						text: 'Responsible',
					},
					ClerkReqFk: {
						key: 'ConHeaderRequisitionOwner',
						text: 'Requisition Owner',
					},
					ReqHeaderFk: {
						key: 'entityReqHeader',
						text: 'Requisition',
					},
					ProjectChangeFk: {
						key: 'entityChangeOrder',
						text: 'Change Order',
					},
					ContractHeaderFk: {
						key: 'ConHeaderBasisContract',
						text: 'Basis Contract',
					},
					MaterialCatalogFk: {
						key: 'conFrameworkMaterialCatalog',
						text: 'Framework Material Catalog',
					},
					FrameworkConHeaderFk: {
						key: 'frameworkConHeaderFk',
						text: 'Framework Contract',
					},
					Net: {
						key: 'total.net',
						text: 'Net',
					},
					Vat: {
						key: 'total.vat',
						text: 'Net',
					},
					Gross: {
						key: 'total.gross',
						text: 'Gross',
					},
					NetOc: {
						key: 'total.netOc',
						text: 'NetOc',
					},
					VatOc: {
						key: 'total.vatOc',
						text: 'VatOc',
					},
					GrossOc: {
						key: 'total.grossOc',
						text: 'GrossOc',
					},
					ChangeOrderNet: {
						key: 'total.changeOrderNet',
						text: 'Chg. Order Net',
					},
					ChangeOrderVat: {
						key: 'total.changeOrderVat',
						text: 'Chg. Order Vat',
					},
					ChangeOrderGross: {
						key: 'total.changeOrderGross',
						text: 'Chg. Order Gross',
					},
					ChangeOrderNetOc: {
						key: 'total.changeOrderNetOc',
						text: 'Chg. Order NetOc',
					},
					ChangeOrderVatOc: {
						key: 'total.changeOrderVatOc',
						text: 'Chg. Order VatOc',
					},
					ChangeOrderGrossOc: {
						key: 'total.changeOrderGrossOc',
						text: 'Chg. Order GrossOc',
					},
					CallOffNet: {
						key: 'total.callOffNet',
						text: 'Call Off Net',
					},
					CallOffVat: {
						key: 'total.callOffVat',
						text: 'Call Off Vat',
					},
					CallOffGross: {
						key: 'total.callOffGross',
						text: 'Call Off Gross',
					},
					CallOffNetOc: {
						key: 'total.callOffNetOc',
						text: 'Call Off NetOc',
					},
					CallOffVatOc: {
						key: 'total.callOffVatOc',
						text: 'Call Off VatOc',
					},
					CallOffGrossOc: {
						key: 'total.callOffGrossOc',
						text: 'Call Off GrossOc',
					},
					GrandNet: {
						key: 'total.grandNet',
						text: 'Grand Net',
					},
					GrandVat: {
						key: 'total.grandVat',
						text: 'Grand Vat',
					},
					GrandGross: {
						key: 'total.grandGross',
						text: 'Grand Gross',
					},
					GrandGrossOc: {
						key: 'total.grandGrossOc',
						text: 'Grand GrossOc',
					},
					GrandNetOc: {
						key: 'total.grandNetOc',
						text: 'Grand NetOc',
					},
					GrandVatOc: {
						key: 'total.grandVatOc',
						text: 'Grand VatOc',
					},
					DateCanceled: {
						key: 'ConHeaderDateCancelled',
						text: 'Cancelled',
					},
					DateCallofffrom: {
						key: 'ConHeaderDateCallOffFrom',
						text: 'Call Off From',
					},
					DateCalloffto: {
						key: 'ConHeaderDateCallOffTo',
						text: 'Call Off To',
					},
					ContracttypeFk: {
						key: 'ConHeaderContractType',
						text: 'Contract Type',
					},
					Contact2Fk: {
						key: 'ConHeaderContact2',
						text: 'Contact2',
					},
					CodeQuotation: {
						key: 'ConHeaderCodeQuotation',
						text: 'Quotation Code',
					},
					ConfirmationCode: {
						key: 'confirmationCode',
						text: 'Confirmation Code',
					},
					ConfirmationDate: {
						key: 'confirmationDate',
						text: 'Confirmation Date',
					},
					ExternalCode: {
						key: 'externalCode',
						text: 'External Code',
					},
					PrcCopyModeFk: {
						key: 'entityPrcCopyModeFk',
						text: 'Copy Mode',
					},
					DatePenalty: {
						key: 'entityDatePenalty',
						text: 'Date Penalty',
					},
					PenaltyPercentPerDay: {
						key: 'entityPenaltyPercentPerDay',
						text: 'Penalty Percent Per Day',
					},
					PenaltyPercentMax: {
						key: 'entityPenaltyPercentMax',
						text: 'Penalty Percent Max',
					},
					PenaltyComment: {
						key: 'entityPenaltyComment',
						text: 'Penalty Comment',
					},
					ExecutionStart: {
						key: 'entityExecutionStart',
						text: 'Execution Start',
					},
					ExecutionEnd: {
						key: 'entityExecutionEnd',
						text: 'Execution End',
					},
					OrdHeaderFk: {
						key: 'entityOrdHeaderFk',
						text: 'Sales Contract',
					},
					IsFramework: {
						key: 'conEntityIsFramework',
						text: 'Is Framework',
					},
					IsNotAccrualPrr: {
						key: 'IsNotAccrualPrr',
						text: 'Is not accrual',
					},
				}),
				...prefixAllTranslationKeys('procurement.package.', {
					BaselinePath: {
						key: 'baselinePath',
						text: 'Baseline Path',
					},
				}),
			},
			overloads: {
				Id: {
					readonly: true,
				},
				//TODO: not support composite input in form, waiting for the ticket https://rib-40.atlassian.net/browse/DEV-27727
				/*Code: {
					form: {
						type: FieldType.Composite,
						composite: [
							{ id: 'code', model: 'code', type: FieldType.Code },
							{ id: 'description', model: 'Description', type: FieldType.Description },
						],
					},
				},*/
				CodeQuotation: {
					readonly: true,
				},
				BillingSchemaFinal: {
					readonly: true,
				},
				BillingSchemaFinalOC: {
					readonly: true,
				},
				ConStatusFk: BasicsSharedLookupOverloadProvider.provideConStatusReadonlyLookupOverload(),
				PurchaseOrders: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: ProcurementConHeaderPurchaseOrdersLookupService,
					}),
				},
				ProjectFk: {
					...this.projectLookupProvider.generateProjectLookup({
						lookupOptions: {
							displayMember: 'ProjectNo',
							showClearButton: true,
							serverSideFilter: {
								key: '',
								execute(context: ILookupContext<IProjectEntity, IConHeaderEntity>) {
									return {
										PackageFk: context.entity?.PackageFk,
									};
								},
							},
						},
					}),
					additionalFields: [
						{
							displayMember: 'ProjectName',
							label: {
								key: 'basics.common.projectName',
							},
							column: true,
							row: false,
							singleRow: true,
						},
					],
				},
				ProjectStatusFk: BasicsSharedLookupOverloadProvider.provideProjectStatusReadonlyLookupOverload(),
				PackageFk: ProcurementSharedLookupOverloadProvider.providePackageLookupOverload(true, 'cloud.common.entityPackageDescription', {
					key: '',
					execute(context: ILookupContext<IProcurementPackageLookupEntity, IConHeaderEntity>) {
						return {
							ProjectFk: context.entity?.ProjectFk,
							BasCompanyFk: context.entity?.CompanyFk,
						};
					},
				}, true),
				ReqHeaderFk: ProcurementSharedLookupOverloadProvider.provideRequisitionReadOnlyLookupOverload('procurement.contract.entityReqHeaderDescription'),
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false),
				BpdVatGroupFk: BasicsSharedLookupOverloadProvider.provideVATGroupLookupOverload(true),
				ClerkPrcFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderProcurementOwnerName'),
				ClerkReqFk: BasicsSharedLookupOverloadProvider.providerBasicsClerkLookupOverload(true, 'procurement.contract.ConHeaderRequisitionOwnerName'),
				BasCurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyLookupOverload(false),
				ContractHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'procurement.contract.ConHeaderBasisContractDescription'),
				// ProjectChangeFk: { // todo pel: do it later, wait project change module ready
				// 	type: FieldType.Lookup,
				// 	lookupOptions: createLookup({
				// 		dataServiceToken: // todo pel: common lookup is not available
				// 	})
				// },
				MaterialCatalogFk: BasicsSharedLookupOverloadProvider.provideMaterialCatalogLookupOverload(true, 'procurement.contract.conFrameworkMaterialCatalogDescription'),
				PaymentTermFiFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermFiDescription'),
				PaymentTermPaFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermPaDescription'),
				PaymentTermAdFk: BasicsSharedLookupOverloadProvider.providePaymentTermLookupOverload(true, 'cloud.common.entityPaymentTermAdDescription'),
				ConTypeFk: BasicsSharedLookupOverloadProvider.provideConTypeLookupOverload(false),
				AwardmethodFk: BasicsSharedLookupOverloadProvider.provideAwardMethodLookupOverload(false),
				ContracttypeFk: BasicsSharedLookupOverloadProvider.provideProcurementContractTypeLookupOverload(false),
				ControllingUnitFk: controllingUnitOverload,
				BillingSchemaFk: BasicsSharedLookupOverloadProvider.provideBillingSchemaLookupOverload(true, {
					key: 'prc.con.controllingunit.by.prj.filterkey',
					execute: (context: ILookupContext<IBillingSchemaEntity, IConHeaderEntity>) => {
						if (!context.entity || !context.entity.Id) {
							return '1=2';
						}
						return context.entity?.ConfigurationFk
							? firstValueFrom(
									this.configLookupService.getItemByKey({
										id: context.entity.ConfigurationFk,
									}),
								).then((item) => {
									return `PrcConfigHeaderFk= + ${item ? item.PrcConfigHeaderFk : -1}`;
								})
							: '';
					},
				}),
				PrcCopyModeFk: BasicsSharedLookupOverloadProvider.provideProcurementContractCopyModeLookupOverload(false),
				MdcPriceListFk: BasicsSharedLookupOverloadProvider.providePriceListLookupOverload(true),
				BankFk: bpRelatedLookupProvider.getBankLookupOverload({
					showClearButton: true,
					displayMember: 'IbanNameOrBicAccountName',
					customServerSideFilter: {
						key: 'prc-con-bank-filter',
						execute: async (context) => {
							let filterStr = 'IsLive = true';
							const statusFilter = (await firstValueFrom(this.bpBankStatusLookupService.getList())).filter((status) => status.Sorting !== 0 && status.IsDisabled === false);

							if (statusFilter && statusFilter.length > 0) {
								const bankStatusFilter = statusFilter.map((item) => `BpdBankStatusFk = ${item.Id}`).join(' or ');
								filterStr += ` And (${bankStatusFilter})`;
							}

							if (isNil(context.entity)) {
								filterStr += ' And BusinessPartnerFk = -1 ';
							} else {
								filterStr += ` And BusinessPartnerFk = ${context.entity.BusinessPartnerFk}`;
							}

							return filterStr;
						},
					},
				}),
				// OrdHeaderFk: { // todo pel: wait sales contract lookup ready
				// 	type: FieldType.Lookup,
				// 	lookupOptions: createLookup({
				// 		dataServiceToken:
				// 	})
				// },
				SalesTaxMethodFk: BasicsSharedLookupOverloadProvider.provideSalesTaxMethodLookupOverload(true),
				BoqWicCatFk: {
					// todo pel: need BoqWicGroupLookupService export
					// type: FieldType.Lookup,
					// lookupOptions: createLookup({
					// 	dataServiceToken: BoqWicGroupLookupService,
					// 	displayMember: 'Code'
					// })
				},
				BoqWicCatBoqFk: {
					// todo pel: lookup service is not available
				},
				FrameworkConHeaderFk: ProcurementSharedLookupOverloadProvider.provideContractLookupOverload(true, 'code'),
				AddressEntity: BasicsSharedLookupOverloadProvider.providerAddressDialogComponentOverload(true),
				IncotermFk: BasicsSharedLookupOverloadProvider.provideIncoTermLookupOverload(true),
				CompanyInvoiceFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload('procurement.contract.ConHeaderCompanyInvoicedCodeDescription'),
				BusinessPartnerFk: getBusinessPartnerLookupOverload([
					{
						provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
						useValue: {
							showContacts: true,
							approvalBPRequired: true,
						},
					},
				]),
				SubsidiaryFk: getSubsidiaryLookupOverload(
					(e) => e.BusinessPartnerFk,
					(e) => e.SupplierFk,
				),
				SupplierFk: getSupplierLookupOverload(
					(e) => e.BusinessPartnerFk,
					(e) => e.SubsidiaryFk,
				),
				ContactFk: getContactLookupOverload(
					(e) => e.BusinessPartnerFk,
					(e) => e.SubsidiaryFk ?? undefined,
				),
				BusinessPartner2Fk: getBusinessPartnerLookupOverload([
					{
						provide: BUSINESSPARTNER_LOOKUP_OPTIONS_TOKEN,
						useValue: {
							showContacts: true,
						},
					},
				]),
				Subsidiary2Fk: getSubsidiaryLookupOverload(
					(e) => e.BusinessPartner2Fk,
					(e) => e.Supplier2Fk,
				),
				Supplier2Fk: getSupplierLookupOverload(
					(e) => e.BusinessPartner2Fk,
					(e) => e.Subsidiary2Fk,
					false,
				),
				Contact2Fk: getContactLookupOverload(
					(e) => e.BusinessPartner2Fk,
					(e) => e.Subsidiary2Fk,
				),
				BusinessPartnerAgentFk: getBusinessPartnerLookupOverload(),
				BasAccassignBusinessFk: BasicsSharedLookupOverloadProvider.provideAccountAssignmentBusinessLookupOverload(true),
				BasAccassignControlFk: BasicsSharedLookupOverloadProvider.provideAccountAssignmentControlLookupOverload(true),
				BasAccassignAccountFk: BasicsSharedLookupOverloadProvider.provideAccountAssignmentAccountLookupOverload(true),
				BasAccassignConTypeFk: BasicsSharedLookupOverloadProvider.provideAccountAssignmentContractTypeLookupOverload(true),
				ExchangeRate: ProcurementSharedLookupOverloadProvider.provideExchangeRateLookupOverload(),
			},
			additionalOverloads: {
				'PrcHeaderEntity.ConfigurationFk': BasicsSharedLookupOverloadProvider.provideProcurementConfigurationLookupOverload({
					key: 'prc-con-configuration-filter',
					execute: (context) => {
						return 'RubricFk = ' + Rubric.Contract;
					},
				}),
				'PrcHeaderEntity.StructureFk': BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				'PrcHeaderEntity.StrategyFk': BasicsSharedLookupOverloadProvider.provideStrategyLookupOverload(true),
			},
		};
	}

	private async getControllingUnitLookupOverLoad(context: IInitializationContext) {
		const cuLookupOverload = await this.controllingUnitLookupProvider.generateControllingUnitLookup<IConHeaderEntity>(context, {
			checkIsAccountingElement: true,
			projectGetter: (e) => e.ProjectFk,
			controllingUnitGetter: (e) => e.ControllingUnitFk,
			lookupOptions: {
				showClearButton: true,
				serverSideFilter: {
					key: 'prc.con.controllingunit.by.prj.filterkey',
					execute: (context: ILookupContext<IControllingUnitLookupEntity, IConHeaderEntity>) => {
						return {
							ByStructure: true,
							ExtraFilter: true,
							PrjProjectFk: context.entity?.ProjectFk,
							CompanyFk: this.dataService.loginCompanyEntity.Id,
						};
					},
				},
			},
		});

		cuLookupOverload.additionalFields = [
			{
				displayMember: 'DescriptionInfo.Translated',
				label: {
					key: 'cloud.common.entityControllingUnitDesc',
				},
				column: true,
				row: false,
				singleRow: true,
			},
			{
				displayMember: 'EstimateCost',
				label: {
					key: 'procurement.contract.entityCuEstimateCost',
				},
				column: true,
				row: true,
				singleRow: false,
				//TODO: lookup framework will provide a common formatter
				/*lookupOptions: createLookup<IConHeaderEntity, IControllingUnitLookupEntity>({
					formatter: {
						format: (value, context) => {
							return value.EstimateCost !== null ? value.EstimateCost.toFixed(2) : '';
						},
					},
				}),*/
			},
			{
				displayMember: 'Budget',
				label: {
					key: 'procurement.contract.entityCuBudget',
				},
				column: true,
				row: true,
				singleRow: false,
				//TODO: lookup framework will provide a common formatter
				/*lookupOptions: createLookup<IConHeaderEntity, IControllingUnitLookupEntity>({
					formatter: {
						format: (value, context) => {
							return value.Budget !== null ? value.Budget.toFixed(2) : '';
						},
					},
				}),*/
			},
		];

		return cuLookupOverload;
	}
}
