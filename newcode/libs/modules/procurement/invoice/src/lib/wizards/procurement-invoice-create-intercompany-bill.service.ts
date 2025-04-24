/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { ColumnDef, createLookup, FieldType } from '@libs/ui/common';
import { IInterCompanyGridItem, IInterCompanyServiceOptions, ProcurementSharedCreateIntercompanyService } from '@libs/procurement/shared';
import { BasicsSharedProcurementConfigurationLookupService, BasicsShareProcurementConfigurationToBillingSchemaLookupService, Rubric } from '@libs/basics/shared';
import { firstValueFrom } from 'rxjs';

@Injectable({
	providedIn: 'root',
})
export class ProcurementInvoiceCreateInterCompanyBillWizardService extends ProcurementSharedCreateIntercompanyService {
	private readonly prcConfigurationLookupService = inject(BasicsSharedProcurementConfigurationLookupService);
	private readonly translateSource = 'procurement.invoice.wizard.createInterCompanyBill.';

	public constructor() {
		const options: IInterCompanyServiceOptions = {
			contextUrlSuffix: 'sales/billing/intercompany/',
			gridId: '5332107C7C8749EFB2554B7FF3CC67D2',
		};
		super(options);
		this.options.extendColumns = this.getExtendColumns();
		this.options.translateSource = this.translateSource;
	}

	private getExtendColumns(): ColumnDef<IInterCompanyGridItem>[] {
		{
			return [
				{
					id: 'configuration',
					model: 'ConfigurationId',
					type: FieldType.Lookup,
					label: {key: this.translateSource + 'configuration'},
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedProcurementConfigurationLookupService,
						serverSideFilter: {
							key: 'configuration-filter-only-sales',
							execute: () => {
								return {
									RubricFk: Rubric.Bill,
									IsSales: true,
								};
							},
						},
					}),
					sortable: true,
					visible: true,
				},
				{
					id: 'billingschema',
					model: 'BillingSchemaId',
					type: FieldType.Lookup,
					label: {key: this.translateSource + 'billingSchema'},
					lookupOptions: createLookup({
						dataServiceToken: BasicsShareProcurementConfigurationToBillingSchemaLookupService<IInterCompanyGridItem>,
						serverSideFilter: {
							key: 'billingSchema-filter',
							execute: async (context) => {
								if (context.entity?.ConfigurationId) {
									const config = await firstValueFrom(this.prcConfigurationLookupService.getItemByKey({id: context.entity?.ConfigurationId}));
									if (config) {
										return 'IsChained=false AND PrcConfigHeaderFk=' + config.PrcConfigHeaderFk;
									}
								}
								return 'PrcConfigHeaderFk=-1';
							},
						},
					}),
					width: 120,
					sortable: true,
					visible: true,
				},
				{
					id: 'billedAmount',
					model: 'BilledAmount',
					type: FieldType.Money,
					label: {key: this.translateSource + 'billedAmount'},
					width: 110,
					sortable: true,
					visible: true,
					readonly: true,
				},
				{
					id: 'surchargeAmount',
					model: 'SurchargeAmount',
					type: FieldType.Money,
					label: {key: this.translateSource + 'surchargeAmount'},
					width: 102,
					sortable: true,
					visible: true,
					readonly: true,
				},
			];
		}
	}
}
