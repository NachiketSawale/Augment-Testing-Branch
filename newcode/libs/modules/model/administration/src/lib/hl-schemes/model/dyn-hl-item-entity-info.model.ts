/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IHighlightingItemEntity } from './entities/highlighting-item-entity.interface';
import {
	HL_ITEM_ENTITY_INFO_COMMON,
	HL_ITEM_ENTITY_LABELS,
	HL_ITEM_ENTITY_OVERLOADS
} from './hl-item-entity-info-common.model';
import { ModelAdministrationDynHlItemDataService } from '../services/dyn-hl-item-data.service';

export const DYNAMIC_HL_ITEM_ENTITY_INFO = EntityInfo.create<IHighlightingItemEntity>({
	...HL_ITEM_ENTITY_INFO_COMMON,
	permissionUuid: 'ebd51626b3ff4f8689e1fed61bf6a49e',
	grid: {
		title: { key: 'model.administration.dynHlItemListTitle' }
	},
	form: {
		containerUuid: '18cc3cc979c24f7390607c9e45df177c',
		title: { key: 'model.administration.dynHlItemDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationDynHlItemDataService),
	layoutConfiguration: async ctx => {
		return <ILayoutConfiguration<IHighlightingItemEntity>>{
			excludedAttributes: ['Id', 'HighlightingSchemeFk', 'FilterStateFk'],
			overloads: {
				...HL_ITEM_ENTITY_OVERLOADS
				// TODO: ObjectVisibilityFk lookup from Customizing
			},
			labels: HL_ITEM_ENTITY_LABELS
		};
	}
});
