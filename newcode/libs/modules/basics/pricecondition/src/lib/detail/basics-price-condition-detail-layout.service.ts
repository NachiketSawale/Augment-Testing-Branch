/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration, ILookupFieldOverload } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { BasicsSharedCustomizeLookupOverloadProvider } from '@libs/basics/shared';
import { IPriceConditionDetailEntity } from '../model/entities/price-condition-detail-entity.interface';

/**
 * Basics Price Condition Detail layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsPriceConditionDetailLayoutService {
	/**
	 * Generate layout config
	 */
	public async generateLayout(): Promise<ILayoutConfiguration<IPriceConditionDetailEntity>> {
		const priceConditionTypeOverload = BasicsSharedCustomizeLookupOverloadProvider.providePriceConditionTypeLookupOverload(true) as ILookupFieldOverload<IPriceConditionDetailEntity>;
		priceConditionTypeOverload.additionalFields = [{
			displayMember: 'DescriptionInfo.Translated',
			label: {
				key: 'cloud.common.entityDescription',
			},
			column: true,
			row: false,
			singleRow: true,
		}];

		return {
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['PriceConditionTypeFk', 'Value', 'IsActivated'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('basics.pricecondition.', {
					PriceConditionTypeFk: {
						key: 'entityPriceCondition',
						text: 'Price Condition Type',
					},
					Value: {key: 'entityValue', text: 'Value'},
					IsActivated: {key: 'entityIsActivated', text: 'Is Activated'},
				}),
			},
			overloads: {
				PriceConditionTypeFk: priceConditionTypeOverload
			},
		};
	}
}
