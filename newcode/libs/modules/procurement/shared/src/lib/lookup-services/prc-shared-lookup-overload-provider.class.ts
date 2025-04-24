/*
 * Copyright(c) RIB Software GmbH
 */

import { runInInjectionContext } from '@angular/core';
import { ConcreteFieldOverload, createLookup, FieldType, ILookupFieldOverload, ILookupServerSideFilter, ITypedAdditionalLookupField } from '@libs/ui/common';
import {
	BasicsSharedCompanyContextService,
	BasicsSharedCompanyDeferaltypeLookupService,
	BasicsSharedEquipmentFixedAssetLookupService,
	BasicsSharedSalesTaxGroupLookupService,
	BasicsSharedTaxCodeLookupService,
	createAdditionalLookupDescriptionField,
} from '@libs/basics/shared';
import { IInitializationContext } from '@libs/platform/common';
import { ControllingSharedControllingUnitLookupProviderService } from '@libs/controlling/shared';
import { IControllingUnitLookupOptions } from '@libs/controlling/interfaces';
import { IBasicsCustomizeEquipmentFixedAssetEntity, ICompanyDeferaltypeLookupEntity, IProcurementPackageLookupEntity } from '@libs/basics/interfaces';
import { ProcurementPackageLookupService } from './package-lookup.service';
import { IContractLookupEntity, ProcurementShareContractLookupService } from './contract-lookup.service';
import { IReqHeaderLookUpEntity, ProcurementShareReqLookupService } from './req-lookup.service';
import { IPesHeaderLookUpEntity, ProcurementSharePesLookupService } from './pes-lookup.service';
import { ProcurementSharedPrcItemMergedLookupService } from './common/prc-item-merged-lookup.service';
import { IPrcItemMergedLookupEntity, IPrcStockTransactionEntity, IPrcStockTransactionTypeEntity } from '../model/entities';
import { IInvoiceHeaderLookUpEntity, ProcurementShareInvoiceLookupService } from './invoice-lookup.service';
import { ProcurementInvoiceRejectionLookupService } from './invoice-rejection-lookup.service';
import { IProjectChangeEntity, ProcurementShareProjectChangeLookupService } from './project-change-lookup.service';
import { ProcurementSharedExchangeRateInputLookupService } from './common/exchange-rate-input-lookup.service';
import { PrcStockTransactionLookupService } from './stock/prc-stock-transaction-lookup.service';
import { PrcStockTransactionTypeLookupService } from './stock/prc-stock-transaction-type-lookup.service';

export class ProcurementSharedLookupOverloadProvider {
	public static provideProcurementSalesTaxGroupLookupOverload<T extends object>(showClearBtn: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedSalesTaxGroupLookupService,
				displayMember: 'DescriptionInfo.Translated',
				showClearButton: showClearBtn,
				clientSideFilter: {
					execute: (item, context) => {
						const loginCompany = context.injector.get(BasicsSharedCompanyContextService).loginCompanyEntity;
						return loginCompany.LedgerContextFk === item.LedgerContextFk && item.IsLive;
					},
				},
			}),
		};
	}

	public static async provideProcurementControllingUnitLookupOverload<T extends object>(context: IInitializationContext, options?: IControllingUnitLookupOptions<T>): Promise<ILookupFieldOverload<T>> {
		const defaultOptions: IControllingUnitLookupOptions<T> = {
			checkIsAccountingElement: true,
			lookupOptions: {
				showClearButton: true,
				showDescription: true,
				descriptionMember: 'DescriptionInfo.Translated',
			},
		};

		const mergedOptions = options ? { ...defaultOptions, ...options } : defaultOptions;
		return runInInjectionContext(context.injector, async () => {
			const controllingUnitOverload = await context.injector.get(ControllingSharedControllingUnitLookupProviderService).generateControllingUnitLookup<T>(context, mergedOptions);
			controllingUnitOverload.additionalFields = [
				{
					id: 'controllingUnitDescription',
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'cloud.common.entityControllingUnitDesc',
					},
					column: true,
					singleRow: true,
				},
			];
			return controllingUnitOverload;
		});
	}

	public static provideProcurementCompanyDeferalTypeLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter: ILookupServerSideFilter<ICompanyDeferaltypeLookupEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedCompanyDeferaltypeLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	public static provideProcurementFixedAssetLookupOverload<T extends object>(showClearBtn: boolean, isAssetManagementGetter: (e: T) => boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedEquipmentFixedAssetLookupService,
				showClearButton: showClearBtn,
				showDescription: true,
				displayMember: 'Asset',
				descriptionMember: 'Description',
				clientSideFilter: {
					execute: (item, context) => {
						const loginCompany = context.injector.get(BasicsSharedCompanyContextService).loginCompanyEntity;
						return loginCompany.EquipmentContextFk === item.EquipmentContextFk && isAssetManagementGetter(context.entity);
					},
				},
			}),
		};
	}

	public static providePackageLookupOverload<T extends object>(
		showClearBtn: boolean,
		descriptionColumnKey: string,
		serverSideFilter: ILookupServerSideFilter<IProcurementPackageLookupEntity, T>,
		showTextInfo: boolean = false,
	): ConcreteFieldOverload<T> {
		const additionalFields: ITypedAdditionalLookupField<T>[] = [
			{
				displayMember: 'Description',
				label: {
					key: descriptionColumnKey,
				},
				column: {
					sortable: true,
					width: 150,
				},
				singleRow: true,
			},
		];

		if (showTextInfo) {
			additionalFields.push({
				displayMember: 'TextInfo',
				label: {
					key: 'procurement.common.entityPackageTextInfo',
				},
				column: true,
				row: true,
			});
		}

		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementPackageLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: additionalFields,
		};
	}

	public static providePackageReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementPackageLookupService,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: 'cloud.common.entityPackageDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
				{
					displayMember: 'TextInfo',
					label: {
						key: 'procurement.common.entityPackageTextInfo',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideRequisitionReadOnlyLookupOverload<T extends object>(descriptionColumnKey: string, readonly?: boolean): ConcreteFieldOverload<T> {
		return {
			readonly: readonly ?? false,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareReqLookupService,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey,
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideRequisitionLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey: string, serverSideFilter?: ILookupServerSideFilter<IReqHeaderLookUpEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareReqLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey,
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	public static provideContractLookupOverload<T extends object>(showClearBtn: boolean, descriptionColumnKey?: string, readonly?: boolean, serverSideFilter?: ILookupServerSideFilter<IContractLookupEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareContractLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey,
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	// Common lookup for Tax code
	public static provideTaxCodeLookupOverload<T extends object>(showClearBtn: boolean, descriptionMember?: string, readonly?: boolean): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readonly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedTaxCodeLookupService,
				showDescription: true,
				descriptionMember,
				showClearButton: showClearBtn,
			}),
			additionalFields: [
				{
					id: 'taxDescription',
					displayMember: 'DescriptionInfo.Translated',
					label: {
						key: 'cloud.common.entityTaxCodeDescription',
						text: 'Tax Code Description',
					},
					column: true,
					singleRow: true,
				},
			],
		};
	}

	// Common lookup for PES header
	public static providePesHeaderLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPesHeaderLookUpEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup<T, IPesHeaderLookUpEntity>({
				dataServiceToken: ProcurementSharePesLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
				readonly: true,
			}),
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
		};
	}

	// Common lookup Procurement Item
	public static providePrcItemFkLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPrcItemMergedLookupEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementSharedPrcItemMergedLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	// Common lookup for Procurement Stock transaction type
	public static providePrcStockTransactionTypeFkLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPrcStockTransactionTypeEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PrcStockTransactionTypeLookupService,
				showClearButton: showClearBtn,
				serverSideFilter,
			}),
		};
	}

	public static providePesHeaderReadonlyLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: true,
			lookupOptions: createLookup<T, IPesHeaderLookUpEntity>({
				dataServiceToken: ProcurementSharePesLookupService,
			}),
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
		};
	}

	// Common lookup for Shared exchange rate input
	public static provideExchangeRateLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.LookupInputSelect,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementSharedExchangeRateInputLookupService,
			}),
		};
	}

	// Common lookup for Procurement shared Project change
	public static providePrjChangeFkLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IProjectChangeEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareProjectChangeLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [createAdditionalLookupDescriptionField('procurement.common.projectChange', 'Description')],
		};
	}

	// Common lookup for Procurement Stock transaction
	public static providePrcStockTransactionFkLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPrcStockTransactionEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PrcStockTransactionLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	// Common lookup for Procurement Fixed assets
	public static provideFixedAssetServerLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IBasicsCustomizeEquipmentFixedAssetEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: BasicsSharedEquipmentFixedAssetLookupService,
				showClearButton: showClearBtn,
				serverSideFilter: serverSideFilter,
			}),
		};
	}

	// Common lookup for Inventory Header chained
	public static provideInventoryHeaderChainedLookupOverload<T extends object>(readOnly?: boolean, serverSideFilter?: ILookupServerSideFilter<IInvoiceHeaderLookUpEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			readonly: readOnly ?? false,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareInvoiceLookupService,
				serverSideFilter,
			}),
		};
	}

	// Common lookup for Invoice Rejection
	public static provideInvoiceRejectionLookupOverload<T extends object>(): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementInvoiceRejectionLookupService,
				clientSideFilter: {
					execute: (item) => {
						return true;
					},
				},
			}),
		};
	}

	/*
	 * Contract readonly lookup provider.
	 */
	public static provideContractReadonlyLookupOverload<T extends object>(descriptionColumnKey?: string, serverSideFilter?: ILookupServerSideFilter<IContractLookupEntity, T>): ConcreteFieldOverload<T> {
		return {
			readonly: true,
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: ProcurementShareContractLookupService,
				showClearButton: false,
				serverSideFilter: serverSideFilter,
			}),
			additionalFields: [
				{
					displayMember: 'Description',
					label: {
						key: descriptionColumnKey ?? 'basics.materialcatalog.entityContractDescription',
					},
					column: {
						sortable: true,
						width: 150,
					},
					singleRow: true,
				},
			],
		};
	}

	// Common lookup for Procurement Stock Transaction
	public static providePrcStockTransactionLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPrcStockTransactionEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PrcStockTransactionLookupService,
				showClearButton: showClearBtn,
				serverSideFilter,
			}),
		};
	}

	// Common lookup for Procurement Stock Transaction type
	public static providePrcStockTransactionTypeLookupOverload<T extends object>(showClearBtn: boolean, serverSideFilter?: ILookupServerSideFilter<IPrcStockTransactionTypeEntity, T>): ConcreteFieldOverload<T> {
		return {
			type: FieldType.Lookup,
			lookupOptions: createLookup({
				dataServiceToken: PrcStockTransactionTypeLookupService,
				showClearButton: showClearBtn,
				serverSideFilter,
			}),
		};
	}
}