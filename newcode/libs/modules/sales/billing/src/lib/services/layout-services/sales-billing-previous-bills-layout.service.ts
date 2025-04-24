/*
 * Copyright(c) RIB Software GmbH
 */
import { inject, Injectable} from '@angular/core';
import { createLookup, FieldOverloadSpec, FieldType, ILayoutConfiguration, ILayoutGroup} from '@libs/ui/common';
import {
	BasicsSharedCustomizeLookupOverloadProvider, BasicsSharedLookupOverloadProvider,
	BasicsSharedPaymentTermLookupService,
	BasicsSharedProcurementConfigurationLookupService,
	BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
	BasicsShareProcurementConfigurationToBillingSchemaLookupService,
} from '@libs/basics/shared';
import { IBilHeaderEntity } from '@libs/sales/interfaces';
import { SalesCommonLabels } from '@libs/sales/common';
import { SalesBillingLabels } from '../../model/sales-billing-labels.class';
import { firstValueFrom } from 'rxjs';
import { IProcurementConfigurationToBillingSchemaLookupEntity } from '@libs/basics/interfaces';

/**
 * Sales Billing Chained Invoices (Previous Bills) Layout Service
 */
@Injectable({
	providedIn: 'root',
})
export class SalesBillingPreviousBillsLayoutService {
	private readonly prcConfigurationLookup = inject(BasicsSharedProcurementConfigurationLookupService);

	public async generateConfig(): Promise<ILayoutConfiguration<IBilHeaderEntity>> {
		const layoutConfig = <ILayoutConfiguration<IBilHeaderEntity>>{
			groups: [
				{
					gid: 'basicData',
					attributes: ['FinalGroup', 'RubricCategoryFk', 'BilStatusFk', 'BillDate', 'BillNo', 'InvoiceTypeFk', 'DescriptionInfo', 'IsCanceled', 'CancellationNo', 'CancellationReason', 'CancellationDate', 'BookingText'],
				},
				{
					gid: 'paymentData',
					attributes: ['PaymentTermFk', 'TaxCodeFk', 'AmountTotal', 'DiscountAmountTotal', 'BillingSchemaFk'],
				},
				{
					gid: 'datesData',
					attributes: ['PerformedFrom', 'PerformedTo'],
				},
				{
					gid: 'otherData',
					attributes: ['Remark', 'CommentText'],
				},
				{
					gid: 'userDefText',
					attributes: ['UserDefined1', 'UserDefined2', 'UserDefined3', 'UserDefined4', 'UserDefined5'],
				},
			],
			labels: {
				...SalesCommonLabels.getSalesCommonLabels(),
				...SalesBillingLabels.getSalesBillingLabels()
			},
			overloads: {
				BilStatusFk: BasicsSharedCustomizeLookupOverloadProvider.provideBillStatusReadonlyLookupOverload(),
				BillDate: {
					readonly: true,
				},
				BillNo: {
					searchable: true,
					readonly: true,
				},
				AmountTotal: {
					readonly: true,
				},
				DiscountAmountTotal: {
					readonly: true,
				},
				InvoiceTypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideInvoiceTypeReadonlyLookupOverload(),
				PaymentTermFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedPaymentTermLookupService,
					}),
				},
				TaxCodeFk: BasicsSharedLookupOverloadProvider.provideTaxCodeListLookupOverload(false),
				BillingSchemaFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup<IBilHeaderEntity, IProcurementConfigurationToBillingSchemaLookupEntity>({
						dataServiceToken: BasicsShareProcurementConfigurationToBillingSchemaLookupService,
						showClearButton: true, serverSideFilter: {
							key: 'sales-common-billing-schema-filter',
							execute: async (context) => {
								const prcConfigEntity = await firstValueFrom(
									this.prcConfigurationLookup.getItemByKey({
										id: context.entity!.ConfigurationFk as number,
									}),
								);
								return 'PrcConfigHeaderFk=' + prcConfigEntity.PrcConfigHeaderFk;
							},
						},
					})
				},
				RubricCategoryFk: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataServiceToken: BasicsSharedRubricCategoryByRubricAndCompanyLookupService,
						showClearButton: false,
					}),
				}
			},
		};
		this.addReadOnlyToOverloads(layoutConfig);
		return layoutConfig;
	}
	
	private addReadOnlyToOverloads<T extends IBilHeaderEntity>(layoutConfig: ILayoutConfiguration<T>): void {
        if (!layoutConfig.overloads) {
            layoutConfig.overloads = {} as { [key in keyof Partial<T>]: FieldOverloadSpec<T> };
        }
        const overloads = layoutConfig.overloads as { [key in keyof Partial<T>]: FieldOverloadSpec<T> };
        (layoutConfig.groups as ILayoutGroup<T>[]).forEach(group => {
            group.attributes.forEach(attribute => {
                if (!overloads[attribute as keyof T]) {
                    overloads[attribute as keyof T] = { readonly: true } as FieldOverloadSpec<T>;
                } else {
                    overloads[attribute as keyof T] = { ...overloads[attribute as keyof T], readonly: true } as FieldOverloadSpec<T>;
                }
            });
        });
    }
}
