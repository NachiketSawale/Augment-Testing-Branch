/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';

import { CloudTranslationResourceBehavior } from '../behaviors/cloud-translation-resource-behavior.service';
import { CloudTranslationResourceDataService } from '../services/cloud-translation-resource-data.service';
import { CloudTranslationResourceLayoutService } from '../services/cloud-translation-resource-layout.service';

import { IResourceEntity } from './entities/resource-entity.interface';

/**
 * Configure the EntityInfo object
 */

export const CLOUD_TRANSLATION_RESOURCE_ENTITY_INFO: EntityInfo = EntityInfo.create<IResourceEntity>({
	grid: {
		title: { key: 'cloud.translation' + '.resourceListTitle' },
		behavior: (ctx) => {
			return ctx.injector.get(CloudTranslationResourceBehavior);
		},
	},
	form: {
		title: { key: 'cloud.translation' + '.resourceDetailTitle' },
		containerUuid: '3475cdad8acb4432a2bae7dbba8af912',
	},
	dataService: (ctx) => ctx.injector.get(CloudTranslationResourceDataService),
	dtoSchemeId: { moduleSubModule: 'Cloud.Translation', typeName: 'ResourceDto' },
	permissionUuid: '4d35ae8687dd4ed6aa5ce4b47befad0b',
	layoutConfiguration: (ctx) => {
		return ctx.injector.get(CloudTranslationResourceLayoutService).generateLayout();
	},
});
