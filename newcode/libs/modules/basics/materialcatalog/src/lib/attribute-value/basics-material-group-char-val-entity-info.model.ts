/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialGroupCharValDataService } from './basics-material-group-char-val-data.service';
import { BasicsMaterialGroupCharValLayoutService } from './basics-material-group-char-val-layout.service';
import { BasicsMaterialGroupCharValidationService } from './basics-material-group-char-val-validation.service';
import { IMaterialGroupCharvalEntity } from '../model/entities/material-group-charval-entity.interface';

export const BASICS_MATERIAL_GROUP_CHAR_VAL_ENTITY_INFO = EntityInfo.create<IMaterialGroupCharvalEntity>({
	grid: {
		title: { text: 'Attribute Values', key: 'basics.materialcatalog.HeadTitle.groupCharval' },
	},
	form: {
		containerUuid: '3717efa7cdd7416bbfd44b33fb89c7b2',
		title: { text: 'Attribute Value Detail', key: 'basics.materialcatalog.HeadTitle.groupCharvalDetail' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialGroupCharValDataService),
	validationService: (context) => context.injector.get(BasicsMaterialGroupCharValidationService),
	dtoSchemeId: { moduleSubModule: 'Basics.MaterialCatalog', typeName: 'MaterialGroupCharvalDto' },
	permissionUuid: 'aabff409dd4241a689b9f5bdc3c2b83a',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialGroupCharValLayoutService).generateLayout();
	},
});
