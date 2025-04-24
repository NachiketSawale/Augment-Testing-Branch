/*
 * Copyright(c) RIB Software GmbH
 */

import { EntityInfo } from '@libs/ui/business-base';
import { IBasicsCharacteristicAutomaticAssignmentEntity } from '../entities/basics-characteristic-automatic-assignment-entity.interface';
import { BasicsCharacteristicAutomaticAssignmentLayoutService } from '../../services/layouts/basics-characteristic-automatic-assignment-layout.service';
import { BasicsCharacteristicAutomaticAssignmentBehavior } from '../../behaviors/basics-characteristic-automatic-assignment-behavior.service';
import { BasicsCharacteristicAutomaticAssignmentDataService } from '../../services/basics-characteristic-automatic-assignment-data.service';

export const BASICS_CHARACTERISTIC_AUTOMATIC_ASSIGNMENT_ENTITY_INFO = EntityInfo.create<IBasicsCharacteristicAutomaticAssignmentEntity>({
	grid: {
		title: { text: 'Automatic Assignment', key: 'basics.characteristic.title.automaticAssignment' },
		behavior: ctx => ctx.injector.get(BasicsCharacteristicAutomaticAssignmentBehavior),
	},
	dataService: ctx => ctx.injector.get(BasicsCharacteristicAutomaticAssignmentDataService),
	dtoSchemeId: { moduleSubModule: 'Basics.Characteristic', typeName: 'CharacteristicSectionDto' },
	permissionUuid: '26cc2d8afd3b433daa2532b9d7f59a29',
	layoutConfiguration: context => {
		return context.injector.get(BasicsCharacteristicAutomaticAssignmentLayoutService).generateLayout();
	}
});