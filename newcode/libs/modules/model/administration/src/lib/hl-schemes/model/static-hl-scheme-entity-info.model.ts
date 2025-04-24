/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IHighlightingSchemeEntity } from './entities/highlighting-scheme-entity.interface';
import { ModelAdministrationStaticHlSchemeDataService } from '../services/static-hl-scheme-data.service';
import { HL_SCHEME_ENTITY_INFO_COMMON } from './hl-scheme-entity-info-common.model';

export const STATIC_HL_SCHEME_ENTITY_INFO = EntityInfo.create<IHighlightingSchemeEntity>({
	...HL_SCHEME_ENTITY_INFO_COMMON,
	permissionUuid: 'a77d13ea33784bbcb9f21e9ed7fb3ff2',
	grid: {
		title: { key: 'model.administration.staticHlSchemeListTitle' }
	},
	form: {
		containerUuid: '1aa62e964ad34df6a9eb71484a0188fb',
		title: { key: 'model.administration.staticHlSchemeDetailTitle' }
	},
	dataService: ctx => ctx.injector.get(ModelAdministrationStaticHlSchemeDataService)
});
