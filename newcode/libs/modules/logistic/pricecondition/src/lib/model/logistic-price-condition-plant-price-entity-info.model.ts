/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionPlantPriceDataService } from '../services/logistic-price-condition-plant-price-data.service';
import { ILogisticPlantPriceEntity } from '@libs/logistic/interfaces';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN } from '@libs/resource/interfaces';
import { ILayoutConfiguration } from '@libs/ui/common';


export const LOGISTIC_PRICE_CONDITION_PLANT_PRICE_ENTITY_INFO: EntityInfo = EntityInfo.create<ILogisticPlantPriceEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listPlantPriceTitle'},

	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailPlantPriceTitle'},
		containerUuid: 'dc76760660e9466da30b5a7116fc2f52',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionPlantPriceDataService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'LogisticPlantPriceDto'},
	permissionUuid: '2934c2d1160447bc860cc5c3897e4d9f',
	layoutConfiguration: async (ctx) => {
		const resourceEquipmentLookupProvider = await ctx.lazyInjector.inject(RESOURCE_EQUIPMENT_LOOKUP_PROVIDER_TOKEN);
		return <ILayoutConfiguration<ILogisticPlantPriceEntity>>{
			groups: [
				{
					gid: 'baseGroup',
					attributes: ['PlantFk', 'WorkOperationTypeFk', 'CommentText', 'IsManual', 'PricePortion1', 'PricePortion2', 'PricePortion3', 'PricePortion4', 'PricePortion5',
						'PricePortion6', 'ValidFrom', 'ValidTo', 'UomFk'],
				}
			],
			overloads: {
				WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(false),
				UomFk: BasicsSharedLookupOverloadProvider.provideUoMLookupOverload(true),
				PlantFk: resourceEquipmentLookupProvider.providePlantLookupOverload(),
			},
			labels: {
				...prefixAllTranslationKeys('logistic.pricecondition.', {
					PricePortion1: {key: 'pricePortion1'},
					PricePortion2: {key: 'pricePortion2'},
					PricePortion3: {key: 'pricePortion3'},
					PricePortion4: {key: 'pricePortion4'},
					PricePortion5: {key: 'pricePortion5'},
					PricePortion6: {key: 'pricePortion6'},
					WorkOperationTypeFk: {key: 'entityWorkOperationTypeFk'},
					PlantFk: {key: 'entityPlant'}
				}),
				...prefixAllTranslationKeys('cloud.common.', {
					CommentText: {key: 'entityCommentText'},
					ValidFrom: {key: 'entityValidFrom'},
					ValidTo: {key: 'entityValidTo'},
					UomFk: {key: 'entityUoM'},
				}),
				...prefixAllTranslationKeys('basics.customize.', {
					IsManual: {key: 'isManual'},
				})
			}
		};
	},
});