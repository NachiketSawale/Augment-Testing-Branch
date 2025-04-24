/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { IBasicsStockTotalEntity } from '../model/basics-stock-total-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedProcurementStructureLookupService } from '../../lookup-services/procurement-structure-lookup.service';

/**
 * Basics Material Stock Total layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsStockTotalLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IBasicsStockTotalEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'TotalQuantity',
						'TotalValue',
						'TotalProvision',
						'ExpenseConsumed',
						'Expenses',
						'LastTransactionDays',
						'QuantityOnOrder',
						'QuantityTotal',
						'PendingQuantity',
						'TotalQuantityByPending',
						'PrcStructureFk',
						'Modelname',
						'BrandDescription',
						'Quantity',
						'Total',
						'ProvisionTotal',
						'ProvisionPercent',
						'ProvisionPeruom',
						'Islotmanagement',
						'MinQuantity',
						'MaxQuantity',
						'Uom',
						'QuantityReceipt',
						'QuantityConsumed',
						'TotalReceipt',
						'TotalConsumed',
						'QuantityReserved',
						'QuantityAvailable',
						'ProvisionReceipt',
						'ProvisionConsumed',
						'ExpenseTotal',
						'ProductFk',
						'StockCode',
						'StockDescription',
						'Currency',
						'CompanyCode',
						'CompanyName',
						'ProjectNo',
						'ProjectName'
					]
				}
				// TODO reconciliation group
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Currency': {
						'key': 'cloud.common.entityCurrency',
						'text': 'Currency'
					},
					'CompanyCode': {
						'key': 'cloud.common.entityCompanyCode',
						'text': 'Company Code'
					},
					'CompanyName': {
						'key': 'cloud.common.entityCompanyName',
						'text': 'Company Name'
					},
					'ProjectNo': {
						'key': 'cloud.common.entityProject',
						'text': 'Project No.'
					},
					'ProjectName': {
						'key': 'cloud.common.entityProjectName',
						'text': 'Project Name'
					}
				}),
				...prefixAllTranslationKeys('project.stock.', {
					'TotalQuantity': {
						'key': 'stocktotal.TotalQuantity',
						'text': 'Total Quantity(Difference)'
					},
					'TotalValue': {
						'key': 'stocktotal.TotalValue',
						'text': 'Total Value(Difference)'
					},
					'TotalProvision': {
						'key': 'stocktotal.TotalProvision',
						'text': 'Total Provision(Difference)'
					},
					'ExpenseConsumed': {
						'key': 'stocktotal.ExpenseConsumed',
						'text': 'Expense(Consumed)'
					},
					'Expenses': {
						'key': 'stocktotal.Expenses',
						'text': 'Expenses(Difference)'
					},
					'LastTransactionDays': {
						'key': 'stocktotal.LastTransactionDays',
						'text': 'Last Transaction(Days)'
					},
					'QuantityOnOrder': {
						'key': 'stocktotal.QuantityOnOrder',
						'text': 'Quantity On Order'
					},
					'QuantityTotal': {
						'key': 'stocktotal.QuantityTotal',
						'text': 'Quantity Total'
					},
					'PendingQuantity': {
						'key': 'stocktotal.PendingQuantity',
						'text': 'Pending Quantity'
					},
					'TotalQuantityByPending': {
						'key': 'stocktotal.TotalQuantityByPending',
						'text': 'Total Quantity(Pending)'
					},
					'PrcStructureFk': {
						'key': 'stocktotal.PrcStructure',
						'text': 'Structure'
					},
					'Modelname': {
						'key': 'stocktotal.Modelname',
						'text': 'Modelname'
					},
					'BrandDescription': {
						'key': 'stocktotal.Brand',
						'text': 'Brand'
					},
					'Quantity': {
						'key': 'stocktotal.Quantity',
						'text': 'Quantity'
					},
					'Total': {
						'key': 'stocktotal.Total',
						'text': 'Total'
					},
					'ProvisionTotal': {
						'key': 'stocktotal.ProvisionTotal',
						'text': 'Provision Total'
					},
					'ProvisionPercent': {
						'key': 'stocktotal.ProvisionPercent',
						'text': 'Provision Percent'
					},
					'ProvisionPeruom': {
						'key': 'stocktotal.ProvisionPeruom',
						'text': 'Provision Per Uom'
					},
					'Islotmanagement': {
						'key': 'stocktotal.IslotManagement',
						'text': 'Is Lot Management'
					},
					'MinQuantity': {
						'key': 'stocktotal.MinQuantity',
						'text': 'Min Quantity'
					},
					'MaxQuantity': {
						'key': 'stocktotal.MaxQuantity',
						'text': 'Max Quantity'
					},
					'Uom': {
						'key': 'stocktotal.BasUomFk',
						'text': 'Uom'
					},
					'QuantityReceipt': {
						'key': 'stocktotal.QuantityReceipt',
						'text': 'Total Quantity(Receipt)'
					},
					'QuantityConsumed': {
						'key': 'stocktotal.QuantityConsumed',
						'text': 'Total Quantity(Consumed)'
					},
					'TotalReceipt': {
						'key': 'stocktotal.TotalReceipt',
						'text': 'Total Value(Receipt)'
					},
					'TotalConsumed': {
						'key': 'stocktotal.TotalConsumed',
						'text': 'Total Value(Consumed)'
					},
					'QuantityReserved': {
						'key': 'stocktotal.QuantityReserved',
						'text': 'Quantity Reserved'
					},
					'QuantityAvailable': {
						'key': 'stocktotal.QuantityAvailable',
						'text': 'Quantity Available'
					},
					'ProvisionReceipt': {
						'key': 'stocktotal.ProvisionReceipt',
						'text': 'Total Provision(Receipt)'
					},
					'ProvisionConsumed': {
						'key': 'stocktotal.ProvisionConsumed',
						'text': 'Total Provision(Consumed)'
					},
					'ExpenseTotal': {
						'key': 'stocktotal.ExpenseTotal',
						'text': 'Expense(Receipt)'
					},
					'ProductFk': {
						'key': 'stocktotal.Product',
						'text': 'Product'
					},
					'StockCode': {
						'key': 'stocktotal.StockCode',
						'text': 'Stock Code'
					},
					'StockDescription': {
						'key': 'stocktotal.StockDescription',
						'text': 'Stock Description'
					},
					'AmountNet': {
						'key': 'header.expenses'
					}
				})
			},
			overloads: {
				'TotalQuantity': {
					'readonly': true
				},
				'TotalValue': {
					'readonly': true
				},
				'TotalProvision': {
					'readonly': true
				},
				'ExpenseConsumed': {
					'readonly': true
				},
				'Expenses': {
					'readonly': true
				},
				'LastTransactionDays': {
					'readonly': true
				},
				'QuantityOnOrder': {
					'readonly': true
				},
				'QuantityTotal': {
					'readonly': true
				},
				'PendingQuantity': {
					'readonly': true
				},
				'TotalQuantityByPending': {
					'readonly': true
				},
				'PrcStructureFk': {
					'readonly': true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementStructureLookupService,
						showClearButton: true
					})
				},
				'Modelname': {
					'readonly': true
				},
				'BrandDescription': {
					'readonly': true
				},
				'Quantity': {
					'readonly': true
				},
				'Total': {
					'readonly': true
				},
				'ProvisionTotal': {
					'readonly': true
				},
				'ProvisionPercent': {
					'readonly': true
				},
				'ProvisionPeruom': {
					'readonly': true
				},
				'Islotmanagement': {
					'readonly': true
				},
				'MinQuantity': {
					'readonly': true
				},
				'MaxQuantity': {
					'readonly': true
				},
				'Uom': {
					'readonly': true
				},
				'QuantityReceipt': {
					'readonly': true
				},
				'QuantityConsumed': {
					'readonly': true
				},
				'TotalReceipt': {
					'readonly': true
				},
				'TotalConsumed': {
					'readonly': true
				},
				'QuantityReserved': {
					'readonly': true
				},
				'QuantityAvailable': {
					'readonly': true
				},
				'ProvisionReceipt': {
					'readonly': true
				},
				'ProvisionConsumed': {
					'readonly': true
				},
				'ExpenseTotal': {
					'readonly': true
				},
				'ProductFk': {
					'readonly': true
				},
				'StockCode': {
					'readonly': true
				},
				'StockDescription': {
					'readonly': true
				},
				'Currency': {
					'readonly': true
				},
				'CompanyCode': {
					'readonly': true
				},
				'CompanyName': {
					'readonly': true
				},
				'ProjectNo': {
					'readonly': true
				},
				'ProjectName': {
					'readonly': true
				}
			}
		};
	}
}