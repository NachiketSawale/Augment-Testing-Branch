/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { BasicsCharacteristicSectionLayoutService } from '../../services/layouts/basics-characteristic-section-layout.service';
import { BasicsCharacteristicSectionBehavior } from '../../behaviors/basics-characteristic-section-behavior.service';
import { BasicsCharacteristicSectionDataService } from '../../services/basics-characteristic-section-data.service';
import { ICharacteristicSectionEntity } from '../entities/characteristic-section-entity.interface';

export const BASICS_CHARACTERISTIC_SECTION_ENTITY_INFO = EntityInfo.create<ICharacteristicSectionEntity>({
	grid: {
		title: { text: 'Characteristic Sections', key: 'basics.characteristic.title.characteristicSections' },
		behavior: ctx => ctx.injector.get(BasicsCharacteristicSectionBehavior),
	},
	form: {
		containerUuid: '0d48f09cf87a496ca0a1766819dd62e7',
		title: { text: 'Characteristic Sections Detail', key: 'basics.characteristic.title.characteristicSectionDetail' },
	},
	dataService: ctx => ctx.injector.get(BasicsCharacteristicSectionDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicSectionDto' },
	permissionUuid: '49cb8879815b4be88c8d6ede1eb52ad0',
	layoutConfiguration: context => {
		return context.injector.get(BasicsCharacteristicSectionLayoutService).generateLayout();
	}
});