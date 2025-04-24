/*
 * Copyright(c) RIB Software GmbH
 */
import { Injectable } from '@angular/core';
import { ILayoutConfiguration } from '@libs/ui/common';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { IPriceConditionHeaderParamEntity } from '@libs/basics/interfaces';
import { BasicsSharedLookupOverloadProvider } from '../../lookup-helper/basics-shared-lookup-overload-provider.class';

/**
 * price condition param layout service
 */
@Injectable({
	providedIn: 'root',
})
export class BasicsSharedPriceConditionParamLayoutService<T extends IPriceConditionHeaderParamEntity> {
	public async generateLayout(): Promise<ILayoutConfiguration<T>> {
		const layout = <ILayoutConfiguration<T>>{
			groups: [
				{
					gid: 'basicData',
					title: {
						text: 'Basic Data',
						key: 'cloud.common.entityProperties',
					},
					attributes: ['PriceConditionTypeFk', 'Value', 'Code', 'Formula', 'CommentText'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					PriceConditionTypeFk: {
						text: 'Type',
						key: 'priceType',
					},
					CommentText: {
						text: 'Comment Text',
						key: 'entityCommentText',
					},
					Value: {
						text: 'Value',
						key: 'priceValue',
					},
					Code: {
						text: 'Code',
						key: 'entityCode',
					},
					Formula: {
						text: 'Formula',
						key: 'priceFormula',
					},
				}),
			},
			overloads: {
				PriceConditionTypeFk: BasicsSharedLookupOverloadProvider.providePriceConditionTypeLookupOverload(false),
			},
		};
		return layout;
	}
}
