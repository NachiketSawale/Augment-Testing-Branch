/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { IMdcSalesTaxCodeEntity } from '@libs/basics/interfaces';
import { FieldType, ILayoutConfiguration } from '@libs/ui/common';

/**
 * Sales Tax Code layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSalesTaxCodeLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IMdcSalesTaxCodeEntity>> {

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
						'Code',
						'TaxPercent',
						'Reference',
						'UserDefined1',
						'UserDefined2',
						'UserDefined3',
						'IsLive',
						'DescriptionInfo',
						'CalculationOrder'
					]
				}
			],
			overloads: {
				Id: { label: { text: 'Id', key: 'cloud.common.entityId' }, visible: true },
				Code: { label: { text: 'Code', key: 'cloud.common.entityCode' }, visible: true },
				TaxPercent: { label: { text: 'Tax Percent', key: 'basics.salestaxcode.taxPercent' }, visible: true },
				Reference: { label: { text: 'Tax Percent', key: 'basics.salestaxcode.reference' }, visible: true },
				UserDefined1: {
					label: {
						text: 'User Defined 1',
						key: 'cloud.common.entityUserDefined',
						params: { 'p_0': '1' }
					}, visible: true, type: FieldType.Description
				},
				UserDefined2: {
					label: {
						text: 'User Defined 2',
						key: 'cloud.common.entityUserDefined',
						params: { 'p_0': '2' }
					}, visible: true, type: FieldType.Description
				},
				UserDefined3: {
					label: {
						text: 'User Defined 3',
						key: 'cloud.common.entityUserDefined',
						params: { 'p_0': '3' }
					}, visible: true, type: FieldType.Description
				},
				IsLive: { label: { text: 'Code', key: 'cloud.common.entityIsLive' }, visible: true },
				CalculationOrder: {
					label: { text: 'Calculation Order', key: 'basics.salestaxcode.calculationOrder' },
					visible: true
				},
				DescriptionInfo: {
					label: { text: 'Description', key: 'cloud.common.entityDescription' },
					visible: true
				}
			}
		};
	}
}