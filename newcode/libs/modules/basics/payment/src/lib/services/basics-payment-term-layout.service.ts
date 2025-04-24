/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPaymentTermEntity } from '../model/entities/payment-term-entity.interface';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

/**
 * payment term layout service
 */
@Injectable({
	providedIn: 'root',
})
export class PaymentTermLayoutService {
	public async generateConfig(): Promise<ILayoutConfiguration<IPaymentTermEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: [
						'Code',
						'DescriptionInfo',
						'NetDays',
						'DiscountDays',
						'DiscountPercent',
						'DayOfMonth',
						'PrintDescriptionInfo',
						'PrintTextDescriptionInfo',
						'Sorting',
						'IsDefault',
						'Codefinance',
						'IsDateInvoiced',
						'IsLive',
						'CalculationTypeFk',
						'Month',
						'IsDefaultCreditor',
						'IsDefaultDebtor',
					],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					DescriptionInfo: { key: 'descriptionInfo', text: 'Descriptions' },
					Sorting: { key: 'entitySorting', text: 'Sorting' },
					IsDefault: { key: 'entityIsDefault', text: 'Is Default' },
				}),
				...prefixAllTranslationKeys('basics.payment.', {
					NetDays: { key: 'netDays', text: 'Country' },
					DiscountDays: { key: 'DiscountDays', text: 'Discount Days' },
					DiscountPercent: { key: 'DiscountPercent', text: 'DiscountPercent' },
					DayOfMonth: { key: 'DayOfMonth', text: 'Day Of Month' },
					PrintDescriptionInfo: { key: 'PrintDescriptionInfo', text: 'Print Description Info' },
					PrintTextDescriptionInfo: { key: 'PrintTextDescriptionInfo', text: 'Print Text Description Info' },
					Codefinance: { key: 'codefinance', text: 'Code (Finance)' },
					IsDateInvoiced: { key: 'entityIsDateInvoiced', text: 'Is Date Invoiced' },
					IsLive: { key: 'entityIsLive', text: 'Active' },
					CalculationTypeFk: { key: 'CalculationType', text: 'Calculation Type' },
					Month: { key: 'entityMonth', text: 'Month' },
					IsDefaultCreditor: { key: 'isDefaultCreditor', text: 'Is Default Creditor' },
					IsDefaultDebtor: { key: 'isDefaultDebtor', text: 'Is Default Debtor' },
				}),
			},
			overloads: {
				IsLive: {
					readonly: true,
				},
				CalculationTypeFk: BasicsSharedLookupOverloadProvider.provideCalculationTypeLookupOverload(true),
			},
		};
	}
}
