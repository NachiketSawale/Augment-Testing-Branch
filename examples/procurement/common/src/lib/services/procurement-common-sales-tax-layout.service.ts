/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IProcurementCommonSalesTaxEntity } from '../model/entities/procurement-common-sales-tax-entity.interface';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';

@Injectable({
	providedIn: 'root',
})
export class ProcurementCommonSalesTaxLayoutService {
	public async generateConfig<T extends IProcurementCommonSalesTaxEntity>(): Promise<ILayoutConfiguration<T>> {
		return <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Amount',
						'AmountOc',
						'AmountNet',
						'AmountNetOc',
						'AmountTax',
						'AmountTaxOc',
						'TaxPercentCalculation',
						'MdcSalesTaxCodes',
						'Code',
						'Description'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('procurement.common.', {
					AmountNet: {key: 'paymentAmountNet', text: 'Net Amount'},
					AmountNetOc: {key: 'paymentAmountNetOc', text: 'AmountNet Oc'},
					AmountTax: {key: 'paymentAmountTax', text: 'Amount Tax'},
					AmountTaxOc: {key: 'paymentAmountTaxOc', text: 'Amount Tax Oc'},
					MdcSalesTaxCodes: {key: 'TaxCodes', text: 'Tax Codes'},
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {key: 'entityCode', text: 'Code'},
					Description: {key: 'entityDescription', text: 'Description'},
					Amount: {key: 'entityAmount', text: 'Amount'},
					AmountOc: {key: 'entityAmountOc', text: 'Amount Oc'},
					TaxPercentCalculation: {key: 'entityTaxPercent', text: 'Tax Percent'},
				})
			},
			overloads: {
				Code: {readonly: true},
				Description: {readonly: true},
				Amount: {readonly: true},
				AmountOc: {readonly: true},
				AmountNet: {readonly: true},
				AmountNetOc: {readonly: true},
				AmountTax: {readonly: true},
				AmountTaxOc: {readonly: true},
				TaxPercentCalculation: {readonly: true},
				MdcSalesTaxCodes: BasicsSharedLookupOverloadProvider.provideSalesTaxCodeLookupOverload(true),
			}
		};
	}
}