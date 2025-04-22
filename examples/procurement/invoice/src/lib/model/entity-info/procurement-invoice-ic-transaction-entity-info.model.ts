/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ProcurementInvoiceIcTransactionDataService } from '../../services/procurement-invoice-ic-transaction-data.service';
import { IInvTransactionIcEntity } from '../entities';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * Procurement Invoice Ic Transaction Entity.
 */
export const PROCUREMENT_INVOICE_IC_TRANSACTION_ENTITY_INFO: EntityInfo = EntityInfo.create<IInvTransactionIcEntity>({
	grid: {
		title: { key: 'procurement.invoice.title.IcTransaction' },
	},
	form: {
		title: { key: 'procurement.invoice.title.IcTransactionDetail' },
		containerUuid: '8a028635b85a49b4a4e9e915496f0b58',
	},
	dataService: (ctx) => ctx.injector.get(ProcurementInvoiceIcTransactionDataService),
	dtoSchemeId: { moduleSubModule: 'Procurement.Invoice', typeName: 'InvTransactionIcDto' },
	permissionUuid: 'c84d5a3ae18942f9a1ac5a7aa9124c43',
	layoutConfiguration: {
		groups: [
			{
				gid: 'invoiceIcTransaction',
				title: {
					text: 'IC Transaction',
					key: 'procurement.invoice.group.ictransaction',
				},
				attributes: [
					'InvTransactionFk',
					'BasCompanyCreditorFk',
					'BasCompanyDebtorFk',
					'BilHeaderFk',
					'BilItemFk',
					'PostingDate',
					'Amount',
					'Quantity',
					'BasUomFk',
					'ControllingUnitFk',
					'ControllingUnitIcFk',
					'TaxCodeFk',
					'PrcStructureFk',
					'IsSurcharge',
				],
			},
		],
		labels: {
			...prefixAllTranslationKeys('procurement.invoice.icTransaction.', {
				InvTransactionFk: { key: 'invTransactionfk', text: 'Invoice Transaction Id' },
				IsSurcharge: { key: 'isSurcharge', text: 'Is Surcharge' },
				BilHeaderFk: { key: 'bilHeader', text: 'Bill Header' },
				BilItemFk: { key: 'bilItem', text: 'Bill Item' },
			}),
			...prefixAllTranslationKeys('cloud.common.', {
				TaxCodeFk: { key: 'entityTaxCode', text: 'Tax Code' },
				ControllingUnitFk: { key: 'entityControllingUnitCode', text: 'Controlling Unit Code' },
				BasCompanyCreditorFk: { key: 'creditorCompany', text: 'Creditor Company' },
				BasCompanyDebtorFk: { key: 'debtorCompany', text: 'Debtor Company' },
				BasUomFk: { key: 'entityUoM', text: 'UoM' },
				PrcStructureFk: { key: 'entityStructureCode', text: 'Structure Code' },
			}),
			...prefixAllTranslationKeys('procurement.invoice.transaction.', {
				PostingDate: { key: 'postingDate', text: 'Posting Date' },
				Amount: { key: 'amount', text: 'Amount' },
				Quantity: { key: 'quantity', text: 'Quantity' },
				ControllingUnitIcFk: { key: 'controllingUnitIc', text: 'Clearing Controlling Unit' },
			}),
		},
		overloads: {
			PostingDate: { readonly: true },
			Amount: { readonly: true },
			Quantity: { readonly: true },
			IsSurcharge: { readonly: true },
			InvTransactionFk: { readonly: true },
			BilItemFk: { readonly: true },
			TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListReadonlyLookupOverload(), 
			BasCompanyCreditorFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload('CompanyName'),
			BasCompanyDebtorFk: BasicsSharedLookupOverloadProvider.provideCompanyReadOnlyLookupOverload('CompanyName'),
			PrcStructureFk: {
				...BasicsSharedLookupOverloadProvider.providerBasicsProcurementStructureLookupOverload(true),
				...{
					additionalFields: [
						{
							id: 'taxDescription',
							displayMember: 'DescriptionInfo.Translated',
							label: {
								key: 'cloud.common.entityStructureDescription',
								text: 'Structure Description',
							},
							column: true,
							singleRow: true,
						},
					],
				},
			},
			//TODO navigator
			ControllingUnitFk: BasicsSharedLookupOverloadProvider.provideControllingUnitLookupOverload(true, 'cloud.common.entityControllingUnitDesc', true), 
			//TODO navigator
			ControllingUnitIcFk: BasicsSharedLookupOverloadProvider.provideControllingUnitLookupOverload(true, 'basics.company.entityClearingControllingUnitDesc', true), 
			BasUomFk: BasicsSharedLookupOverloadProvider.provideUoMReadonlyLookupOverload(), 
			BilHeaderFk: { readonly: true }, //TODO: Loolup depend on sales module
		},
	},
});