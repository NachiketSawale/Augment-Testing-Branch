/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsShareControllingUnitLookupService, BasicsSharedMaterialLookupService, BasicsSharedPrcStockTransactionTypeLookupService, BasicsSharedUomLookupService, IMaterialSearchEntity } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IStockTransactionEntity } from '../../model/entities/stock-transaction-entity.interface';
import {
	IInvoiceHeaderLookUpEntity,
	IPesHeaderLookUpEntity,
	IPrcStockTransactionEntity,
	PrcStockTransactionLookupService,
	ProcurementShareInvoiceLookupService,
	ProcurementSharePesLookupService,
	ProjectStockLookupService
} from '@libs/procurement/shared';
import { IBasicsCustomizePrcStockTransactionTypeEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { ProjectSharedLookupOverloadProvider } from '@libs/project/shared';
import { IPrcInventoryHeaderEntity, ProcurementInventoryHeaderLookupService } from '@libs/procurement/inventory';

/**
 * procurement stock transaction layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTransactionLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IStockTransactionEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'Id',
						'PrcStocktransactiontypeFk',
						'MdcMaterialFk',
						'PrjStockFk',
						'PrjStocklocationFk',
						'Lotno',
						'TransactionDate',
						'DocumentDate',
						'Quantity',
						'BasUomFk',
						'Total',
						'ProvisionPercent',
						'ProvisionTotal',
						'MdcControllingunitFk',
						'PrcStocktransactionFk',
						'PesHeaderFk',
						'InvHeaderFk',
						'CommentText',
						'DispatchRecordFk',
						'DispatchHeaderFk',
						'PpsProductFk',
						'PrcInventoryHeaderFk',
						'InventoryDate',
						'ExpirationDate'
					],
				},
				{
					gid: 'UserDefinedFields',
					attributes: [
						'Userdefined1',
						'Userdefined2',
						'Userdefined3',
						'Userdefined4',
						'Userdefined5'
					],
				},
			],
			overloads: {
				PrcStocktransactiontypeFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IBasicsCustomizePrcStockTransactionTypeEntity>({
						dataServiceToken: BasicsSharedPrcStockTransactionTypeLookupService,
						serverSideFilter: {
							key: 'prc-stock-transaction-transactiontype-filter',
							execute: (context) => {
								return 'IsAllowedManual=' + true + ' and Sorting<>0 and IsLive=' + true;
							},
						},
					}),
				},
				MdcMaterialFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IMaterialSearchEntity>({
						dataServiceToken: BasicsSharedMaterialLookupService,
						showClearButton: true
					}),
					readonly: true,
				},
				PrjStockFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IProjectStockLookupEntity>({
						dataServiceToken: ProjectStockLookupService,
					}),
					readonly: true,
				},
				PrjStocklocationFk: ProjectSharedLookupOverloadProvider.provideProjectStockLocationLookupOverload(true),
				BasUomFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedUomLookupService
					})
				},
				MdcControllingunitFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareControllingUnitLookupService,
						showClearButton: true,
						showDescription: true,
					},)
				},
				PrcStocktransactionFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IPrcStockTransactionEntity>({
						dataServiceToken: PrcStockTransactionLookupService,
						showClearButton: true,
						serverSideFilter: {
							key: 'prc-transactions-transaction-filter',
							execute: (context) => {
								const transaction = context.entity!;
								return { PrjStockFk: transaction.PrjStockFk, MdcMaterialFk: transaction.MdcMaterialFk , ProductFk: transaction.PpsProductFk};
							},
						},
					}),
				},
				PesHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IPesHeaderLookUpEntity>({
						dataServiceToken: ProcurementSharePesLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: 'procurement.invoice.header.pesHeaderDes',
							column: true
						},
					],
				},
				InvHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IInvoiceHeaderLookUpEntity>({
						dataServiceToken: ProcurementShareInvoiceLookupService
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: 'procurement.stock.transaction.invoiceDescription',
							column: true
						},
					],
				},
				Lotno:{
					width: 100
				},
				Total: {
					type: FieldType.Money
				},
				ProvisionTotal: {
					type: FieldType.Money
				},
				ProvisionPercent: {
					type: FieldType.Money
				},
				//dispatchheaderfk{
				//todo: wait logic dispatch module ready
				// }

				//dispatchrecordfk{
				//todo: wait logic dispatch module ready
				// }

				// PpsProductFk: {
				// 	//todo: wait productionplanning finished: productionplanning-common-product-lookup-new
				// },

				PrcInventoryHeaderFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockTransactionEntity, IPrcInventoryHeaderEntity>({
						dataServiceToken: ProcurementInventoryHeaderLookupService,
						clientSideFilter: {
							execute: (item) => {
								return true;
							},
						},
					}),
				},
				Id:{
					readonly: true,
				},
				InventoryDate:{
					readonly: true,
				}
			},

			labels: {
				...prefixAllTranslationKeys('procurement.stock.', {
					PrcStocktransactiontypeFk: { key: 'transaction.PrcStocktransactiontypeFk', text: 'Transaction Type' },
					MdcMaterialFk: { key: 'transaction.MdcMaterialFk', text: 'Material Code' },
					PrjStockFk: { key: 'transaction.PrjStockFk', text: 'Stock Code' },
					PrjStocklocationFk: { key: 'transaction.PrjStocklocationFk', text: 'Stock Location' },
					Lotno: { key: 'transaction.Lotno', text: 'Lot No.' },
					TransactionDate: { key: 'transaction.TransactionDate', text: 'Transaction Date' },
					DocumentDate: { key: 'transaction.DocumentDate', text: 'Document Date' },
					Quantity: { key: 'transaction.Quantity', text: 'Quantity' },
					BasUomFk: { key: 'transaction.BasUomFk', text: 'Uom' },
					Total: { key: 'transaction.Total', text: 'Total Value' },
					ProvisionPercent: { key: 'transaction.ProvisionPercent', text: 'Provision Percent' },
					ProvisionTotal: { key: 'transaction.ProvisionTotal', text: 'Provision Total Value' },
					MdcControllingunitFk: { key: 'transaction.MdcControllingunitFk', text: 'Controllingunit Code' },
					PrcStocktransactionFk: { key: 'transaction.PrcStocktransactionFk', text: 'Transaction' },
					PesHeaderFk: { key: 'transaction.PesItemFk', text: 'Pes' },
					InvHeaderFk: { key: 'transaction.Inv2contractFk', text: 'Invoice' },
					CommentText: { key: 'transaction.entityCommentText', text: 'Comment' },
					DispatchRecordFk: { key: 'transaction.DispatchRecordFk', text: 'Dispatching Record' },
					DispatchHeaderFk: { key: 'transaction.DispatchHeaderFk', text: 'Dispatching Header' },
					PpsProductFk: { key: 'transaction.PpsProductFk', text: 'PPS Product' },
					PrcInventoryHeaderFk: { key: 'transaction.PrcInventoryFk', text: 'Inventory' },
					InventoryDate: { key: 'transaction.InventoryDate', text: 'Inventory Date' },
					ExpirationDate: { key: 'transaction.ExpirationDate', text: 'Expiration Date' },
					Userdefined1: { key: 'transaction.entityUserDefinedField1', text: 'User Defined 1' },
					Userdefined2: { key: 'transaction.entityUserDefinedField2', text: 'User Defined 2' },
					Userdefined3: { key: 'transaction.entityUserDefinedField3', text: 'User Defined 3' },
					Userdefined4: { key: 'transaction.entityUserDefinedField4', text: 'User Defined 4' },
					Userdefined5: { key: 'transaction.entityUserDefinedField5', text: 'User Defined 5' },
					UserDefinedFields: { key: 'transaction.entityUserDefined', text: 'UserDefined' },
				}),
				...prefixAllTranslationKeys('procurement.invoice.', {
					Specification: { key: 'EntitySpec', text: 'EntitySpec' },
				}),
			},
		};
	}
}
