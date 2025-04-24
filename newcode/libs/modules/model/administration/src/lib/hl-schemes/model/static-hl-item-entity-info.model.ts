/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { ILayoutConfiguration } from '@libs/ui/common';
import { IHighlightingItemEntity } from './entities/highlighting-item-entity.interface';
import {
	ModelAdministrationStaticHlItemDataService
} from '../services/static-hl-item-data.service';
import {
	HL_ITEM_ENTITY_INFO_COMMON,
	HL_ITEM_ENTITY_LABELS,
	HL_ITEM_ENTITY_OVERLOADS
} from './hl-item-entity-info-common.model';
import {
	FilterStateInfoContainerComponent
} from '../components/filter-state-info-container/filter-state-info-container.component';

export const STATIC_HL_ITEM_ENTITY_INFO = EntityInfo.create<IHighlightingItemEntity>({
	...HL_ITEM_ENTITY_INFO_COMMON,
	permissionUuid: '325a35cc5b0c4c2184d3f5eb72c58f5a',
	grid: {
		title: { key: 'model.administration.staticHlItemListTitle' }
	},
	form: {
		containerUuid: '61f6e953a2a046e89df4b252e7b4b988',
		title: { key: 'model.administration.staticHlItemDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationStaticHlItemDataService),
	layoutConfiguration: async ctx => {
		return <ILayoutConfiguration<IHighlightingItemEntity>>{
			excludedAttributes: ['Id', 'HighlightingSchemeFk', 'DescriptionInfo'],
			overloads: {
				...HL_ITEM_ENTITY_OVERLOADS,
				// TODO: FilterStateFk lookup from Customizing
				FilterStateFk: {
					readonly: true
				},
				// TODO: ObjectVisibilityFk lookup from Customizing
			},
			labels: HL_ITEM_ENTITY_LABELS
		};
	},
	additionalEntityContainers: [{
		uuid: '70272edc6016496587b8ea84b20cf441',
		permission: '325a35cc5b0c4c2184d3f5eb72c58f5a',
		title: 'model.administration.filterStateInfoTitle',
		containerType: FilterStateInfoContainerComponent
	}]
});
