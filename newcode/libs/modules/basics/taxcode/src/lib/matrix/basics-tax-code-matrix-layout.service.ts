/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IMdcTaxCodeMatrixEntity } from '@libs/basics/interfaces';

/**
 * Basics Tax Code Matrix layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeMatrixLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMdcTaxCodeMatrixEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Id', 'Code', 'VatPercent', 'DescriptionInfo', 'TaxCategory', 'BpdVatgroupFk', 'BasVatcalculationtypeFk', 'BasVatclauseFk', 'UserDefined1', 'UserDefined2', 'UserDefined3'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Id: { key: 'entityId', text: 'Id' },
					UserDefined1: {
						key: 'entityUserDefined',
						text: 'User Defined 1',
						params: { p_0: '1' },
					},
					UserDefined2: {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { p_0: '2' },
					},
					UserDefined3: {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { p_0: '3' },
					},
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
					VatPercent: {
						key: 'entityVatPercent',
						text: 'Vat Percent',
					},
				}),
				...prefixAllTranslationKeys('basics.taxcode.', {
					BpdVatgroupFk: {
						key: 'entityVatGroup',
						text: 'Vat Group',
					},
					TaxCategory: {
						key: 'entityMdcTaxCategory',
						text: 'Tax Category',
					},
					BasVatcalculationtypeFk: {
						key: 'entityBasVatcalculationtype',
						text: 'VAT Calculation Type',
					},
					BasVatclauseFk: {
						key: 'entityBasVatclause',
						text: 'VAT Clause',
					},
				}),
			},
			overloads: {
				Id: { readonly: true },
				TaxCategory: {
					maxLength: 252,
				},
				UserDefined1: {
					maxLength: 252,
				},
				UserDefined2: {
					maxLength: 252,
				},
				UserDefined3: {
					maxLength: 252,
				},
				BpdVatgroupFk: BasicsSharedCustomizeLookupOverloadProvider.provideVATGroupLookupOverload(false),
				BasVatcalculationtypeFk: BasicsSharedCustomizeLookupOverloadProvider.provideVatCalculationTypeLookupOverload(false),
				BasVatclauseFk: BasicsSharedCustomizeLookupOverloadProvider.provideVatClauseLookupOverload(true)
			}
		};
	}
}
