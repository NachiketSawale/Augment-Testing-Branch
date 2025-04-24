/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsCompanyLookupService, BasicsSharedClerkLookupService, BasicsSharedCompanyContextService, BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { ICompanyEntity, IProjectStockLookupEntity } from '@libs/basics/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IStockHeaderVEntity } from '../../model';
import { ProjectSharedProjectLookupProviderService } from '@libs/project/shared';
import { ProcurementProjectStockLookupService } from '@libs/procurement/common';

/**
 * procurement stock header layout service
 */
@Injectable({
	providedIn: 'root',
})
export class ProcurementStockHeaderLayoutService {
	private readonly projectLookupProvider = inject(ProjectSharedProjectLookupProviderService);
	private readonly companyContextService = inject(BasicsSharedCompanyContextService);

	/**
	 * Generate layout config
	 */
	public generateLayout(): ILayoutConfiguration<IStockHeaderVEntity> {
		return {
			groups: [
				{
					gid: 'baseGroup',
					attributes: [
						'IsChecked',
						'ProjectFk',
						'PrjStockFk',
						'StockValuationRuleFk',
						'StockAccountingTypeFk',
						'StockTypeFk',
						'CurrencyFk',
						'ClerkFk',
						'Total',
						'ProvisionTotal',
						'TotalReceipt',
						'TotalConsumed',
						'TotalValue',
						'ProvisionReceipt',
						'ProvisionConsumed',
						'TotalProvision',
						'ExpenseTotal',
						'ExpenseConsumed',
						'Expenses',
						'CompanyFk',
					],
				},
				{
					gid: 'reconciliation',
					attributes: [],//todo: pel, https://rib-40.atlassian.net/browse/DEV-22253
				},
			],
			overloads: {
				PrjStockFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockHeaderVEntity, IProjectStockLookupEntity>({
						dataServiceToken: ProcurementProjectStockLookupService,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'procurement.stock.header.PrjStockDescription',
							},
							column: true,
							singleRow: true,
						},
					],
					readonly: true,
				},
				ProjectFk: {
					...this.projectLookupProvider.generateProjectLookup<IStockHeaderVEntity>({
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
							singleRow: true,
						},
						{
							displayMember: 'ProjectIndex',
							label: {
								key: 'procurement.stock.header.ProjectIndex',
							},
							column: true,
						},
					],
					readonly: true,
				},

				StockValuationRuleFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockValuationRuleReadonlyLookupOverload(),
				StockAccountingTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockAccountingTypeReadonlyLookupOverload(),
				StockTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideProjectStockTypeReadonlyLookupOverload(),
				CurrencyFk: BasicsSharedLookupOverloadProvider.provideCurrencyReadonlyLookupOverload(),
				CompanyFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup<IStockHeaderVEntity, ICompanyEntity>({
						dataServiceToken: BasicsCompanyLookupService,
						showDescription: true,
						descriptionMember: 'CompanyName',
					}),
				},
				ClerkFk: {
					readonly: true,
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedClerkLookupService,
						showClearButton: true,
					}),
					additionalFields: [
						{
							displayMember: 'Description',
							label: {
								key: 'procurement.stock.header.ClerkDescription',
							},
							column: true,
							singleRow: true,
						},
					],
				},
				Total: {
					readonly: true,
					type: FieldType.Money,
				},
				ProvisionTotal: {
					readonly: true,
					type: FieldType.Money,
				},
				TotalReceipt: {
					readonly: true,
					type: FieldType.Money,
				},
				TotalConsumed: {
					readonly: true,
					type: FieldType.Money,
				},
				TotalValue: {
					readonly: true,
					type: FieldType.Money,
				},
				ProvisionReceipt: {
					readonly: true,
					type: FieldType.Money,
				},
				ProvisionConsumed: {
					readonly: true,
					type: FieldType.Money,
				},
				TotalProvision: {
					readonly: true,
					type: FieldType.Money,
				},
				ExpenseTotal: {
					readonly: true,
					type: FieldType.Money,
				},
				ExpenseConsumed: {
					readonly: true,
					type: FieldType.Money,
				},
				Expenses: {
					readonly: true,
					type: FieldType.Money,
				},
			},
			transientFields: [
				{
					id: 'IsChecked',
					readonly: false,
					model: 'IsChecked',
					type: FieldType.Boolean,
					pinned: true,
					headerChkbox: true
				},

			],
			labels: {
				...prefixAllTranslationKeys('procurement.stock' + '.', {
					moduleName: { key: 'moduleName', text: 'Stock' },
					PrjStockFk: { key: 'header.PrjStockFk', text: 'Stock Code' },
					StockValuationRuleFk: { key: 'header.PrjStockvaluationruleFk', text: 'Stock Valuation Rule' },
					StockAccountingTypeFk: { key: 'header.PrjStockaccountingtypeFk', text: 'Stock Accounting Type' },
					StockTypeFk: { key: 'header.PrjStocktypeFk', text: 'Stock Type' },
					CurrencyFk: { key: 'header.BasCurrencyFk', text: 'Currency' },
					ClerkFk: { key: 'header.BasClerkFk', text: 'Clerk' },
					Total: { key: 'header.total', text: 'Total' },
					ProvisionTotal: { key: 'stocktotal.ProvisionTotal', text: 'Provision Total' },
					reconciliation: { key: 'group.reconciliation', text: 'Reconciliation' },
					TotalReceipt: { key: 'stocktotal.TotalReceipt', text: 'Total Value(Receipt)' },
					TotalConsumed: { key: 'stocktotal.TotalConsumed', text: 'Total Value(Consumed)' },
					TotalValue: { key: 'stocktotal.TotalValue', text: 'Total Value(Difference)' },
					ProvisionReceipt: { key: 'stocktotal.ProvisionReceipt', text: 'Total Provision(Receipt)' },
					ProvisionConsumed: { key: 'stocktotal.ProvisionConsumed', text: 'Total Provision(Consumed)' },
					TotalProvision: { key: 'stocktotal.TotalProvision', text: 'Total Provision(Difference)' },
					ExpenseTotal: { key: 'stocktotal.ExpenseTotal', text: 'Expense(Receipt)' },
					ExpenseConsumed: { key: 'stocktotal.ExpenseConsumed', text: 'Expense(Consumed)' },
					Expenses: { key: 'stocktotal.Expenses', text: 'Expenses(Difference)' },
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					ProjectFk: { key: 'entityProjectNo', text: 'Project No.' },
					CompanyFk: { key: 'entityCompany', text: 'Company' },
				}),
				...prefixAllTranslationKeys('basics.material.', {
					IsChecked: {
						key: 'record.filter',
						text: 'filter',
					},
				}),
			},
		};
	}
}
