/*
 * $Id$
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { LogisticPriceConditionItemDataService } from '../services/logistic-price-condition-item-data.service';
import { IPriceConditionItemEntity } from '@libs/logistic/interfaces';
import { BasicsSharedLookupOverloadProvider } from '@libs/basics/shared';
import { prefixAllTranslationKeys } from '@libs/platform/common';
import { ResourceSharedLookupOverloadProvider } from '@libs/resource/shared';
import { LogisticPriceConditionItemValidationService } from '../services/logistic-price-condition-item-validation.service';

export const LOGISTIC_PRICE_CONDITION_ITEM_ENTITY_INFO: EntityInfo = EntityInfo.create<IPriceConditionItemEntity>({
	grid: {
		title: {key: 'logistic.pricecondition' + '.listPriceConditionItemTitle'},
	},
	form: {
		title: {key: 'logistic.pricecondition' + '.detailPriceConditionItemTitle'},
		containerUuid: '96e91752e0ca46f59eb4b332fb6573b4',
	},
	dataService: ctx => ctx.injector.get(LogisticPriceConditionItemDataService),
	validationService: (ctx) => ctx.injector.get(LogisticPriceConditionItemValidationService),
	dtoSchemeId: {moduleSubModule: 'Logistic.PriceCondition', typeName: 'PriceConditionItemDto'},
	permissionUuid: 'bc0c1a5bc4dc420d98bd85a0eeac59f4',
	layoutConfiguration: {
		groups: [
			{
				gid: 'baseGroup',
				attributes: ['DescriptionInfo','CommentText','WorkOperationTypeFk', 'PricingGroupFk', 'Percentage01', 'Percentage02',
					'Percentage03', 'Percentage04', 'Percentage05', 'Percentage06','ValidFrom','ValidTo'],
			}
		],
		overloads: {
			WorkOperationTypeFk: ResourceSharedLookupOverloadProvider.provideWorkOperationTypeLookupOverload(true),
			PricingGroupFk: BasicsSharedLookupOverloadProvider.provideEquipmentPricingGroupLookupOverload(true),
		},
		labels:{
			...prefixAllTranslationKeys('logistic.pricecondition.', {
				Percentage01: {key: 'percentage01'},
				Percentage02: {key: 'percentage02'},
				Percentage03: {key: 'percentage03'},
				Percentage04: {key: 'percentage04'},
				Percentage05: {key: 'percentage05'},
				Percentage06: {key: 'percentage06'},
				WorkOperationTypeFk: { key: 'entityWorkOperationTypeFk' },
				PricingGroupFk: { key: 'entityPricingGroupFk' },
			}),

			...prefixAllTranslationKeys('cloud.common.', {
				CommentText:{key:'entityCommentText',text:'Comment Text'},
				ValidFrom:{key:'entityValidFrom',text:'Valid From'},
				ValidTo:{key:'entityValidTo',text:'Valid To'},
				DescriptionInfo: {key: 'entityDescription'},
			})
		}
	},
});