/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialGroupCharDataService } from './basics-material-group-char-data.service';
import { BasicsMaterialGroupCharLayoutService } from './basics-material-group-char-layout.service';
import { BasicsMaterialGroupCharValidationService } from './basics-material-group-char-validation.service';
import { IMaterialGroupCharEntity } from '../model/entities/material-group-char-entity.interface';

export const BASICS_MATERIAL_GROUP_CHAR_ENTITY_INFO = EntityInfo.create<IMaterialGroupCharEntity>({
	grid: {
		title: { text: 'Attributes', key: 'basics.materialcatalog.HeadTitle.groupChar' },
	},
	form: {
		containerUuid: 'd933be681f6a43d19c81e83dd628dc7b',
		title: { text: 'Attribute Detail', key: 'basics.materialcatalog.HeadTitle.groupCharDetail' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialGroupCharDataService),
	validationService: (context) => context.injector.get(BasicsMaterialGroupCharValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialGroupCharDto' },
	permissionUuid: '90f037f0e67a46be90eb130ecb0b4fc6',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialGroupCharLayoutService).generateLayout();
	},
});
