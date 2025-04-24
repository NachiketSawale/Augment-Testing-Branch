/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration } from '@libs/ui/common';
import { BasicsSharedSalesTaxCodeGroupLookupService } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMdcSalesTaxMatrixEntity } from '../model/entities/interface/mdc-sales-tax-matrix-entity.interface';

/**
 * Basics Sales Tax Code Matrix layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSalesTaxCodeMatrixLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMdcSalesTaxMatrixEntity>> {

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties'
					},
					attributes: [
						'Id',
						'SalesTaxGroupFk',
						'TaxPercent',
						'Reference',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'IsLive'
					]
				}
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					'Id': { 'key': 'entityId', 'text': 'Id' },
					'UserDefined1': {
						'key': 'entityUserDefined',
						'text': 'User Defined 1',
						params: { 'p_0': '1' }
					},
					'UserDefined2': {
						key: 'entityUserDefined',
						text: 'User-Defined 2',
						params: { 'p_0': '2' }
					},
					'UserDefined3': {
						key: 'entityUserDefined',
						text: 'User-Defined 3',
						params: { 'p_0': '3' }
					},
					'IsLive': {
						key: 'IsLive',
						text: 'entityIsLive',
					},
					'DescriptionInfo': {
						key: 'entityDescription',
						text: 'Description',
					}
				}),
				...prefixAllTranslationKeys('basics.salestaxcode.', {
					'SalesTaxGroupFk': {
						'key': 'salesTaxGroup',
						'text': 'Sales Tax Group'
					},
					'TaxPercent': {
						'key': 'taxPercent',
						'text': 'Tax Percent'
					},
					'Reference': {
						'key': 'reference',
						'text': 'Reference'
					}
				})
			},
			overloads: {
				Id: { readonly: true },
				SalesTaxGroupFk: {
					grid: {// TODO get value error
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedSalesTaxCodeGroupLookupService,
							showClearButton: true
						}),
						width: 150
					},
					form: {
						type: FieldType.Lookup,
						lookupOptions: createLookup({
							dataServiceToken: BasicsSharedSalesTaxCodeGroupLookupService,
							showDescription: true,
							descriptionMember: 'DescriptionInfo.Translated'
						})
					}
				}
			}
		};
	}
}