/*
 * Copyright(c) RIB Software GmbH
 */
import { ILayoutConfiguration } from '@libs/ui/common';
import { inject, Injectable } from '@angular/core';
import { PlatformLazyInjectorService, prefixAllTranslationKeys } from '@libs/platform/common';
import { IEstLineItem2MdlObjectEntity } from '@libs/estimate/interfaces';
import { MODEL_LOOKUP_PROVIDER_TOKEN } from '@libs/model/interfaces';

@Injectable({
	providedIn: 'root',
})
export class ConstructionSystemMainLineItem2MdlObjectLayoutService {
	private readonly lazyInjector = inject(PlatformLazyInjectorService);

	public async generateLayout(): Promise<ILayoutConfiguration<IEstLineItem2MdlObjectEntity>> {
		const modelLookupProvider = await this.lazyInjector.inject(MODEL_LOOKUP_PROVIDER_TOKEN);

		return {
			groups: [
				{
					gid: 'baseGroup',
					title: {
						key: 'cloud.common.entityProperties',
						text: 'Basic Data',
					},
					attributes: ['MdlModelFk', 'MdlObjectFk', 'Quantity', 'QuantityDetail', 'QuantityTarget', 'QuantityTargetDetail', 'WqQuantityTarget', 'QuantityTotal', 'LocationCode', 'LocationDesc', 'Date', 'Remark'],
				},
			],
			labels: {
				...prefixAllTranslationKeys('cloud.common.', {
					Quantity: { key: 'entityQuantity', text: 'Quantity' },
					Remark: { key: 'remark', text: 'Remark' },
				}),
				...prefixAllTranslationKeys('model.main.', {
					LocationCode: { key: 'locationCode', text: 'Location Code' },
					LocationDesc: { key: 'locationDesc', text: 'Location Description' },
				}),
				...prefixAllTranslationKeys('estimate.main.', {
					MdlModelFk: { key: 'entityModel', text: 'Model' },
					MdlObjectFk: { key: 'entityObject', text: 'Object' },
					QuantityDetail: { key: 'quantityDetail', text: 'Quantity Detail' },
					QuantityTarget: { key: 'aqQuantityTarget', text: 'AQ Quantity Item' },
					QuantityTargetDetail: { key: 'aqQuantityTargetDetail', text: 'AQ Quantity Target Detail' },
					WqQuantityTarget: { key: 'wqQuantityTarget', text: 'Wq Quantity Item' },
					QuantityTotal: { key: 'quantityTotal', text: 'QuantityTotal' },
					Date: { key: 'date', text: 'Date' },
				}),
			},
			overloads: {
				MdlModelFk: modelLookupProvider.generateModelLookup(), //todo: filter by projectId
				MdlObjectFk: {
					//todo: waiting model object lookup
				},
				QuantityTotal: {
					readonly: true,
				},
				LocationCode: {
					readonly: true,
				},
				LocationDesc: {
					readonly: true,
				},
			},
		};
	}
}
