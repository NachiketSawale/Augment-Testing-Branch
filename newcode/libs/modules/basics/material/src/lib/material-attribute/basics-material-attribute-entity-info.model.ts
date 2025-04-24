/*
 * Copyright(c) RIB Software GmbH
 */
import { EntityInfo } from '@libs/ui/business-base';
import { BasicsMaterialAttributeDataService } from './basics-material-attribute-data.service';
import { BasicsMaterialAttributeLayoutService } from './basics-material-attribute-layout.service';
import { IMaterialCharacteristicEntity } from '@libs/basics/shared';

export const BASICS_MATERIAL_ATTRIBUTE_ENTITY_INFO = EntityInfo.create<IMaterialCharacteristicEntity>({
	grid: {
		title: { text: 'Attributes', key: 'basics.material.characteristic.title' },
	},
	form: {
		containerUuid: '8306AA461B94460EA4BE03F6B1CE44A9',
		title: { text: 'Attribute Detail', key: 'basics.material.characteristic.detailTitle' },
	},
	dataService: (ctx) => ctx.injector.get(BasicsMaterialAttributeDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Material', typeName: 'MaterialCharacteristicDto' },
	permissionUuid: '127DCD97F72546CC90B8FB5583883F4B',
	layoutConfiguration: (context) => {
		return context.injector.get(BasicsMaterialAttributeLayoutService).generateConfig();
	},
});
