/*
 * Copyright(c) RIB Software GmbH
 */

import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, ItemType } from '@libs/ui/common';
import { IStockTotalVEntity } from '../../model';
import { BasicsSharedProcurementStructureLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';

/**
 * procurement stock total layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockTotalLayoutService {
	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IStockTotalVEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'CatalogCode',
						'CatalogDescription',
						'PrcStructureFk',
						'MaterialCode',
						'Description1',
						'Description2',
						'Specification',
						'Quantity',
						'Uom',
						'Total',
						'ProvisionTotal',
						'ProvisionPercent',
						'ProvisionPeruom',
						'Islotmanagement',
						'MinQuantity',
						'MaxQuantity',
						'QuantityReceipt',
						'QuantityConsumed',
						'TotalQuantity',
						'TotalReceipt',
						'TotalConsumed',
						'TotalValue',
						'ProvisionReceipt',
						'ProvisionConsumed',
						'TotalProvision',
						'ExpenseTotal',
						'ExpenseConsumed',
						'Expenses',
						'QuantityReserved',
						'QuantityAvailable',
						'LastTransactionDays',
						'QuantityOnOrder',
						'QuantityTotal',
						'PendingQuantity',
						'TotalQuantityByPending',
						'Modelname',
						'BrandDescription',
						'ProductFk',
						'StockCode',
						'StockDescription',
						'OrderProposalStatuses',
					],
				},
				{
					gid: 'reconciliation',
					attributes: [], //todo: pel, https://rib-40.atlassian.net/browse/DEV-22253
				},
			],
			overloads: {
				CatalogCode: {
					readonly: true,
				},
				CatalogDescription: {
					readonly: true,
				},
				PrcStructureFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true,
					}),
					width: 150,
					additionalFields: [
						{
							displayMember: 'DescriptionInfo.Translated',
							label: 'cloud.common.entityStructureDescription',
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				MaterialCode: {
					readonly: true,
				},
				Description1: {
					readonly: true,
				},
				Description2: {
					readonly: true,
				},
				Quantity: {
					readonly: true,
				},
				Uom: {
					readonly: true,
				},
				Total: {
					type: FieldType.Money,
					readonly: true,
				},
				ProvisionTotal: {
					type: FieldType.Money,
					readonly: true,
				},
				ProvisionPercent: {
					type: FieldType.Money,
					readonly: true,
				},
				ProvisionPeruom: {
					type: FieldType.Money,
					readonly: true,
				},
				Islotmanagement: {
					readonly: true,
				},
				MinQuantity: {
					readonly: true,
				},
				MaxQuantity: {
					readonly: true,
				},
				QuantityReceipt: {
					readonly: true,
					form: {
						visible: false,
					},
				},
				QuantityConsumed: {
					readonly: true,
					form: {
						visible: false,
					},
				},
				TotalQuantity: {
					readonly: true,
					form: {
						visible: false,
					},
				},
				TotalReceipt: {
					type: FieldType.Money,
					readonly: true,
				},
				TotalConsumed: {
					type: FieldType.Money,
					readonly: true,
				},
				TotalValue: {
					type: FieldType.Money,
					readonly: true,
				},
				ProvisionReceipt: {
					type: FieldType.Money,
					readonly: true,
				},
				ProvisionConsumed: {
					type: FieldType.Money,
					readonly: true,
				},
				TotalProvision: {
					type: FieldType.Money,
					readonly: true,
				},
				ExpenseTotal: {
					type: FieldType.Money,
					readonly: true,
				},
				ExpenseConsumed: {
					type: FieldType.Money,
					readonly: true,
				},
				Expenses: {
					type: FieldType.Money,
					readonly: true,
				},
				QuantityReserved: {
					type: FieldType.Quantity,
					readonly: true,
				},
				QuantityAvailable: {
					type: FieldType.Quantity,
					readonly: true,
				},
				LastTransactionDays: {
					readonly: true,
				},
				QuantityOnOrder: {
					readonly: true,
				},
				QuantityTotal: {
					readonly: true,
				},
				Specification: {
					readonly: true,
				},
				PendingQuantity: {
					readonly: true,
				},
				TotalQuantityByPending: {
					readonly: true,
				},
				Modelname: {
					readonly: true,
				},
				BrandDescription: {
					readonly: true,
				},
				ProductFk: {
					readonly: true,
					//todo: wait productionplanning finished: productionplanning-common-product-lookup-new
				},
				StockCode: {
					readonly: true,
				},
				StockDescription: {
					readonly: true,
				},
			},
			transientFields: [
				{
					id: 'OrderProposalStatuses',
					model: 'OrderProposalStatuses',
					type: FieldType.Action,
					actions: [
						{
							id: 'actionButton',
							type: ItemType.Check,
							iconClass: 'control-icons ico-config-test',
							fn: () => {
								console.log('action button 1 click');
							},
							caption: { key: 'basics.customize.checkConfig' },
							isDisplayed: true,
						},
					],
					readonly: false,
					pinned: true,
				},
			],

			labels: {
				...prefixAllTranslationKeys('procurement.stock.', {
					PrcStructureFk: { key: 'stocktotal.PrcStructure', text: 'Structure' },
					CatalogCode: { key: 'stocktotal.materialcatalog', text: 'Material Catalog' },
					CatalogDescription: { key: 'stocktotal.materialcatalogdescription', text: 'Material Catalog description' },
					MaterialCode: { key: 'stocktotal.MdcMaterialFk', text: 'Material Code' },
					Description1: { key: 'stocktotal.MdcMaterialdescription1', text: 'Material Description1' },
					Description2: { key: 'stocktotal.MdcMaterialFurtherdescription', text: 'Material Description2' },
					Quantity: { key: 'stocktotal.Quantity', text: 'Quantity' },
					Uom: { key: 'stocktotal.BasUomFk', text: 'Uom' },
					Total: { key: 'stocktotal.Total', text: 'Total' },
					ProvisionTotal: { key: 'stocktotal.ProvisionTotal', text: 'Provision Total' },
					ProvisionPercent: { key: 'stocktotal.ProvisionPercent', text: 'Provision Percent' },
					ProvisionPeruom: { key: 'stocktotal.ProvisionPeruom', text: 'Provision Per Uom' },
					Islotmanagement: { key: 'stocktotal.IslotManagement', text: 'Is Lot Management' },
					MinQuantity: { key: 'stocktotal.MinQuantity', text: 'Min Quantity' },
					MaxQuantity: { key: 'stocktotal.MaxQuantity', text: 'Max Quantity' },
					reconciliation: { key: 'group.reconciliation', text: 'Reconciliation' },
					QuantityReceipt: { key: 'stocktotal.QuantityReceipt', text: 'Total Quantity(Receipt)' },
					QuantityConsumed: { key: 'stocktotal.QuantityConsumed', text: 'Total Quantity(Consumed)' },
					TotalQuantity: { key: 'stocktotal.TotalQuantity', text: 'Total Quantity(Difference)' },
					TotalReceipt: { key: 'stocktotal.TotalReceipt', text: 'Total Value(Receipt)' },
					TotalConsumed: { key: 'stocktotal.TotalConsumed', text: 'Total Value(Consumed)' },
					TotalValue: { key: 'stocktotal.TotalValue', text: 'Total Value(Difference)' },
					ProvisionReceipt: { key: 'stocktotal.ProvisionReceipt', text: 'Total Provision(Receipt)' },
					ProvisionConsumed: { key: 'stocktotal.ProvisionConsumed', text: 'Total Provision(Consumed)' },
					TotalProvision: { key: 'stocktotal.TotalProvision', text: 'Total Provision(Difference)' },
					ExpenseTotal: { key: 'stocktotal.ExpenseTotal', text: 'Expense(Receipt)' },
					ExpenseConsumed: { key: 'stocktotal.ExpenseConsumed', text: 'Expense(Consumed)' },
					Expenses: { key: 'stocktotal.Expenses', text: 'Expenses(Difference)' },
					QuantityReserved: { key: 'stocktotal.QuantityReserved', text: 'Quantity Reserved' },
					QuantityAvailable: { key: 'stocktotal.QuantityAvailable', text: 'Quantity Available' },
					OrderProposalStatuses: { key: 'stocktotal.OrderProposalStatuses', text: 'Order Proposal' },
					LastTransactionDays: { key: 'stocktotal.LastTransactionDays', text: 'Last Transaction(Days)' },
					QuantityOnOrder: { key: 'stocktotal.QuantityOnOrder', text: 'Quantity On Order' },
					QuantityTotal: { key: 'stocktotal.QuantityTotal', text: 'Quantity Total' },
					PendingQuantity: { key: 'stocktotal.PendingQuantity', text: 'Pending Quantity' },
					TotalQuantityByPending: { key: 'stocktotal.TotalQuantityByPending', text: 'Total Quantity(Pending)' },
					Modelname: { key: 'stocktotal.Modelname', text: 'Modelname' },
					BrandDescription: { key: 'stocktotal.Brand', text: 'Brand' },
					ProductFk: { key: 'stocktotal.ProductDescription', text: 'Product' },
					StockCode: { key: 'stocktotal.StockCode', text: 'StockCode' },
					StockDescription: { key: 'stocktotal.StockDescription', text: 'StockDescription' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Specification: { key: 'EntitySpec', text: 'EntitySpec' },
				}),
			},
		};
	}
}
