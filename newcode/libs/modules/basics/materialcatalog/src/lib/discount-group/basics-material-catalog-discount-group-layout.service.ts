/*
 * Copyright(c) RIB Software GmbH
 */

import { inject, Injectable } from '@angular/core';
import { createLookup, FieldType, ILayoutConfiguration, UiCommonLookupDataFactoryService } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IMaterialDiscountGroupEntity } from '../model/entities/material-discount-group-entity.interface';

@Injectable({
	providedIn: 'root',
})
export class BasicsMaterialCatalogDiscountGroupLayoutService {
	private lookupFactory = inject(UiCommonLookupDataFactoryService);

	public generateLayout(): ILayoutConfiguration<IMaterialDiscountGroupEntity> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['Code', 'DescriptionInfo', 'DiscountType', 'Discount'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Code: {
						key: 'entityCode',
						text: 'Code',
					},
					DescriptionInfo: {
						key: 'entityDescription',
						text: 'Description',
					},
				}),
				...prefixAllTranslationKeys('basics.materialcatalog.', {
					DiscountType: {
						key: 'DiscountType',
						text: 'Discount Type',
					},
					Discount: {
						key: 'Discount',
						text: 'Discount',
					},
				}),
			},
			overloads: {
				Code: {
					// todo
					// 'mandatory': true
				},
				DiscountType: {
					type: FieldType.Lookup,
					lookupOptions: createLookup({
						dataService: this.lookupFactory.fromSimpleItemClass(
							[
								{
									id: 1,
									desc: {
										text: 'Annual Turnover',
										key: 'basics.materialcatalog.lookup.annualTurnover',
									},
								},
								{
									id: 2,
									desc: {
										text: 'Cash Back',
										key: 'basics.materialcatalog.lookup.cashBack',
									},
								},
							],
							{
								uuid: '',
								valueMember: 'id',
								displayMember: 'desc',
								translateDisplayMember: true,
							},
						),
					}),
				},
				Discount: {
					// todo
					// 'mandatory': true
				},
			},
		};
	}
}
