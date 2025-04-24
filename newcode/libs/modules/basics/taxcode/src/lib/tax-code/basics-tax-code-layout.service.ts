/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IMdcTaxCodeEntity } from '@libs/basics/interfaces';

/**
 * Tax Code layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsTaxCodeLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMdcTaxCodeEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['Id', 'Code', 'DescriptionInfo', 'VatPercent', 'UserDefined1', 'UserDefined2', 'UserDefined3', 'IsLive', 'CodeFinance', 'VatPercentDominant'],
				},
			],
			labels: {
				Id: {
					text: 'Id',
					key: 'cloud.common.entityId',
				},
				Code: {
					text: 'Code',
					key: 'cloud.common.entityCode',
				},
				VatPercent: {
					text: 'VAT Percent',
					key: 'cloud.common.entityVatPercent',
				},
				UserDefined1: {
					text: 'User-Defined 1',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '1' },
				},
				UserDefined2: {
					text: 'User-Defined 2',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '2' },
				},
				UserDefined3: {
					text: 'User-Defined 3',
					key: 'cloud.common.entityUserDefined',
					params: { p_0: '3' },
				},
				IsLive: {
					text: 'Active',
					key: 'cloud.common.entityIsLive',
				},
				CodeFinance: {
					text: 'Code Finance',
					key: 'basics.taxcode.entityCodeFinance',
				},
				VatPercentDominant: {
					text: 'VAT Percent Dominant',
					key: 'basics.taxcode.vatpercentdominant',
				},
				DescriptionInfo: {
					text: 'Description',
					key: 'cloud.common.entityDescription',
				},
			},
			overloads: {
				Id: {
					readonly: true,
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
			},
		};
	}
}
