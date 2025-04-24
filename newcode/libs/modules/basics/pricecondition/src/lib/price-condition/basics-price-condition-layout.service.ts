/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IPriceConditionEntity } from '../model/entities/price-condition-entity.interface';

/**
 * Sales Tax Code layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IPriceConditionEntity>> {
		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['DescriptionInfo', 'Sorting', 'IsDefault', 'FormulaText', 'RemarkInfo'],
				},
			],
			overloads: {
				Sorting: { label: { text: 'Sorting', key: 'cloud.common.entitySorting' }, visible: true },
				IsDefault: {
					label: { text: 'Is Default', key: 'cloud.common.entityIsDefault' },
					visible: true,
				},
				RemarkInfo: { label: { text: 'Remark', key: 'cloud.common.entityRemark' }, visible: true },
				FormulaText: {
					label: { text: 'Formula Text', key: 'basics.pricecondition.formulaText' },
					visible: true,
				},
				DescriptionInfo: {
					label: { text: 'Description', key: 'cloud.common.entityDescription' },
					visible: true,
				},
			},
		};
	}
}
