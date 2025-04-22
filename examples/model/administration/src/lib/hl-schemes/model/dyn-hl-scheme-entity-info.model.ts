/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IHighlightingSchemeEntity } from './entities/highlighting-scheme-entity.interface';
import { HL_SCHEME_ENTITY_INFO_COMMON } from './hl-scheme-entity-info-common.model';
import { ModelAdministrationDynHlSchemeDataService } from '../services/dyn-hl-scheme-data.service';

export const DYNAMIC_HL_SCHEME_ENTITY_INFO = EntityInfo.create<IHighlightingSchemeEntity>({
	...HL_SCHEME_ENTITY_INFO_COMMON,
	permissionUuid: 'f7f839f32f4a47d8ab550a998421b17f',
	grid: {
		title: { key: 'model.administration.dynHlSchemeListTitle' }
	},
	form: {
		containerUuid: '227e5eab5efe472086262160515c91bb',
		title: { key: 'model.administration.dynHlSchemeDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationDynHlSchemeDataService)
});
